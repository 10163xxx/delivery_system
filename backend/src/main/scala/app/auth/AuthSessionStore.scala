package app.auth

import domain.shared.given

import app.delivery.{customerAlias, registerUserProfile}
import cats.effect.IO
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.auth.*
import domain.shared.*
import infra.files.{loadOrCreateJsonFile, writeJsonFile}

import java.time.Instant
import java.util.UUID
import java.util.concurrent.atomic.AtomicReference

final case class AuthAccount(
    id: AuthUserId,
    username: Username,
    password: Password,
    role: UserRole,
    displayName: PersonName,
    linkedProfileId: Option[EntityId],
    createdAt: IsoDateTime,
)

final case class AuthState(
    accounts: List[AuthAccount],
    sessions: Map[SessionToken, AuthUserId],
)

object AuthAccount:
  given Encoder[AuthAccount] = deriveEncoder
  given Decoder[AuthAccount] = deriveDecoder

object AuthState:
  given Encoder[AuthState] = deriveEncoder
  given Decoder[AuthState] = deriveDecoder

private val authStateFile = sys.env
  .get(AuthDefaults.StateFileEnv.raw)
  .map(java.nio.file.Paths.get(_))
  .getOrElse(AuthDefaults.StateFilePath)
private val authWriteLock = new AnyRef
private val authStateRef = new AtomicReference[AuthState](loadAuthState())

def login(request: LoginRequest): IO[Either[ErrorMessage, AuthSessionResponse]] =
  updateAuthState { state =>
    for
      username <- sanitizeAuthRequiredText(request.username, AuthDefaults.UsernameMaxLength, ValidationMessages.UsernameRequired)
      password <- sanitizeAuthRequiredText(request.password, AuthDefaults.PasswordMaxLength, ValidationMessages.PasswordRequired)
      account <- state.accounts.find(_.username == username).toRight(ValidationMessages.AccountNotFound)
      _ <- Either.cond(account.password == password, (), ValidationMessages.PasswordIncorrect)
      _ <- Either.cond(account.role == request.role, (), ValidationMessages.LoginRoleMismatch)
    yield
      val token = nextAuthToken()
      val nextState = state.copy(sessions = state.sessions.updated(token, account.id))
      nextState -> toSessionResponse(account, token)
  }

def register(request: RegisterRequest): IO[Either[ErrorMessage, AuthSessionResponse]] =
  val validated = for
    username <- sanitizeAuthUsername(request.username)
    password <- sanitizeAuthRequiredText(request.password, AuthDefaults.PasswordMaxLength, ValidationMessages.PasswordRequired)
    _ <- Either.cond(password.length >= AuthDefaults.PasswordMinLength, (), ValidationMessages.PasswordTooShort)
    _ <- Either.cond(request.role != UserRole.admin, (), ValidationMessages.AdminSelfRegistrationForbidden)
  yield (username, password)

  validated match
    case Left(message) => IO.pure(Left(message))
    case Right((username, password)) =>
      val displayName = new PersonName(username.raw)
      registerUserProfile(request.role, displayName) match
        case Left(registerError) => IO.pure(Left(registerError))
        case Right(profileId) =>
          updateAuthState { current =>
            for
              _ <- Either.cond(
                !current.accounts.exists(_.username == username),
                (),
                ValidationMessages.UsernameAlreadyExists,
              )
            yield
              val account = AuthAccount(
                id = nextAuthId(AuthDefaults.UserIdPrefix),
                username = username,
                password = password,
                role = request.role,
                displayName = displayName,
                linkedProfileId = profileId,
                createdAt = authNow(),
              )
              val token = nextAuthToken()
              val nextState = current.copy(
                accounts = account :: current.accounts,
                sessions = current.sessions.updated(token, account.id),
              )
              nextState -> toSessionResponse(account, token)
          }

def getSession(token: SessionToken): IO[Option[AuthSessionResponse]] =
  IO.pure {
    authStateRef.get().sessions.get(token).flatMap(accountId =>
      authStateRef.get().accounts.find(_.id == accountId).map(account => toSessionResponse(account, token))
    )
  }

def logout(token: SessionToken): IO[Unit] =
  updateAuthState[Unit] { current =>
    val nextState = current.copy(sessions = current.sessions - token)
    Right(nextState -> ())
  }.void

private def toSessionResponse(account: AuthAccount, token: SessionToken): AuthSessionResponse =
  val displayName =
    if account.role == UserRole.customer then
      account.linkedProfileId.map(customerAlias).getOrElse(account.displayName)
    else account.displayName
  AuthSessionResponse(
    token = token,
    user = AuthUser(
      id = account.id,
      username = account.username,
      role = account.role,
      displayName = displayName,
      linkedProfileId = account.linkedProfileId,
    ),
  )

private def sanitizeAuthUsername(value: Username): Either[ErrorMessage, Username] =
  sanitizeAuthRequiredText(value, AuthDefaults.UsernameMaxLength, ValidationMessages.UsernameRequired).flatMap { username =>
    Either.cond(
      username.raw.matches(AuthDefaults.UsernamePattern.raw),
      username,
      ValidationMessages.UsernamePatternInvalid,
    )
  }

private def sanitizeAuthRequiredText[T](
    value: T,
    maxLength: EntityCount,
    errorMessage: ErrorMessage,
)(using wrapped: WrappedTextType[T]): Either[ErrorMessage, T] =
  val sanitized = sanitizeAuthText(value, maxLength)
  Either.cond(sanitized.raw.nonEmpty, wrapText(sanitized.raw), errorMessage)

private def sanitizeAuthText[T](value: T, maxLength: EntityCount)(using wrapped: WrappedTextType[T]): DisplayText =
  new DisplayText(
    value.raw
    .trim
    .filter(character => !Character.isISOControl(character) || character == '\n' || character == '\t')
    .replace('\n', ' ')
    .replace('\t', ' ')
    .split(' ')
    .filter(_.nonEmpty)
    .mkString(" ")
    .take(maxLength)
  )

private def nextAuthId(prefix: DisplayText): AuthUserId =
  s"${prefix.raw}-${UUID.randomUUID().toString.take(AuthDefaults.GeneratedIdSuffixLength)}"

private def nextAuthToken(): SessionToken =
  UUID.randomUUID().toString.replace("-", "")

private def authNow(): IsoDateTime = new IsoDateTime(Instant.now().toString)

private def loadAuthState(): AuthState =
  loadOrCreateJsonFile(authStateFile, seedAuthState())

private def saveAuthState(state: AuthState): Unit =
  writeJsonFile(authStateFile, state)

private def updateAuthState[A](
    mutate: AuthState => Either[ErrorMessage, (AuthState, A)]
): IO[Either[ErrorMessage, A]] =
  IO.blocking {
    authWriteLock.synchronized {
      mutate(authStateRef.get()).map { case (nextState, result) =>
        saveAuthState(nextState)
        authStateRef.set(nextState)
        result
      }
    }
  }

private def seedAuthState(): AuthState =
  AuthState(
    accounts = List(
      AuthAccount(
        id = AdminDefaults.PrimaryAdminUserId,
        username = AdminDefaults.PrimaryAdminUsername,
        password = AdminDefaults.PrimaryAdminPassword,
        role = UserRole.admin,
        displayName = AdminDefaults.PrimaryAdminDisplayName,
        linkedProfileId = Some(AdminDefaults.PrimaryAdminId),
        createdAt = authNow(),
      ),
      AuthAccount(
        id = "usr-cust-1",
        username = new Username("cust_1"),
        password = new Password("cust123"),
        role = UserRole.customer,
        displayName = customerAlias("cust-1"),
        linkedProfileId = Some("cust-1"),
        createdAt = authNow(),
      ),
      AuthAccount(
        id = "usr-cust-2",
        username = new Username("cust_2"),
        password = new Password("cust123"),
        role = UserRole.customer,
        displayName = customerAlias("cust-2"),
        linkedProfileId = Some("cust-2"),
        createdAt = authNow(),
      ),
      AuthAccount(
        id = "usr-rider-1",
        username = new Username("rider_1"),
        password = new Password("rider123"),
        role = UserRole.rider,
        displayName = new PersonName("陈凯"),
        linkedProfileId = Some("rider-1"),
        createdAt = authNow(),
      ),
      AuthAccount(
        id = "usr-rider-2",
        username = new Username("rider_2"),
        password = new Password("rider123"),
        role = UserRole.rider,
        displayName = new PersonName("赵晨"),
        linkedProfileId = Some("rider-2"),
        createdAt = authNow(),
      ),
      AuthAccount(
        id = "usr-merchant-1",
        username = new Username("merchant_wang"),
        password = new Password("merchant123"),
        role = UserRole.merchant,
        displayName = new PersonName("王师傅"),
        linkedProfileId = None,
        createdAt = authNow(),
      ),
      AuthAccount(
        id = "usr-merchant-2",
        username = new Username("merchant_su"),
        password = new Password("merchant123"),
        role = UserRole.merchant,
        displayName = new PersonName("苏宁"),
        linkedProfileId = None,
        createdAt = authNow(),
      ),
    ),
    sessions = Map.empty,
  )
