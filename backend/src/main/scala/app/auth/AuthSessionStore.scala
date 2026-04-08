package app.auth

import app.delivery.{customerAlias, registerUserProfile}
import cats.effect.IO
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.auth.*
import domain.shared.{AuthDefaults, UserRole, ValidationMessages}
import infra.files.{loadOrCreateJsonFile, writeJsonFile}

import java.time.Instant
import java.util.UUID
import java.util.concurrent.atomic.AtomicReference

final case class AuthAccount(
    id: String,
    username: String,
    password: String,
    role: UserRole,
    displayName: String,
    linkedProfileId: Option[String],
    createdAt: String,
)

final case class AuthState(
    accounts: List[AuthAccount],
    sessions: Map[String, String],
)

object AuthAccount:
  given Encoder[AuthAccount] = deriveEncoder
  given Decoder[AuthAccount] = deriveDecoder

object AuthState:
  given Encoder[AuthState] = deriveEncoder
  given Decoder[AuthState] = deriveDecoder

private val authStateFile = sys.env
  .get(AuthDefaults.StateFileEnv)
  .map(java.nio.file.Paths.get(_))
  .getOrElse(AuthDefaults.StateFilePath)
private val authWriteLock = new AnyRef
private val authStateRef = new AtomicReference[AuthState](loadAuthState())

def login(request: LoginRequest): IO[Either[String, AuthSessionResponse]] =
  updateAuthState { state =>
    for
      username <- sanitizeAuthRequiredText(request.username, AuthDefaults.UsernameMaxLength, ValidationMessages.UsernameRequired)
      password <- sanitizeAuthRequiredText(request.password, AuthDefaults.PasswordMaxLength, ValidationMessages.PasswordRequired)
      account <- state.accounts.find(_.username == username).toRight(ValidationMessages.AccountNotFound)
      _ <- Either.cond(account.password == password, (), ValidationMessages.PasswordIncorrect)
    yield
      val token = nextAuthToken()
      val nextState = state.copy(sessions = state.sessions.updated(token, account.id))
      nextState -> toSessionResponse(account, token)
  }

def register(request: RegisterRequest): IO[Either[String, AuthSessionResponse]] =
  val validated = for
    username <- sanitizeAuthUsername(request.username)
    password <- sanitizeAuthRequiredText(request.password, AuthDefaults.PasswordMaxLength, ValidationMessages.PasswordRequired)
    _ <- Either.cond(password.length >= AuthDefaults.PasswordMinLength, (), ValidationMessages.PasswordTooShort)
    _ <- Either.cond(request.role != UserRole.admin, (), ValidationMessages.AdminSelfRegistrationForbidden)
  yield (username, password)

  validated match
    case Left(message) => IO.pure(Left(message))
    case Right((username, password)) =>
      val displayName = username
      registerUserProfile(request.role, displayName) match
        case Left(message) => IO.pure(Left(message))
        case Right(linkedProfileId) =>
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
                linkedProfileId = linkedProfileId,
                createdAt = authNow(),
              )
              val token = nextAuthToken()
              val nextState = current.copy(
                accounts = account :: current.accounts,
                sessions = current.sessions.updated(token, account.id),
              )
              nextState -> toSessionResponse(account, token)
          }

def getSession(token: String): IO[Option[AuthSessionResponse]] =
  IO.pure {
    authStateRef.get().sessions.get(token).flatMap(accountId =>
      authStateRef.get().accounts.find(_.id == accountId).map(account => toSessionResponse(account, token))
    )
  }

def logout(token: String): IO[Unit] =
  updateAuthState[Unit] { current =>
    val nextState = current.copy(sessions = current.sessions - token)
    Right(nextState -> ())
  }.void

private def toSessionResponse(account: AuthAccount, token: String): AuthSessionResponse =
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

private def sanitizeAuthUsername(value: String): Either[String, String] =
  sanitizeAuthRequiredText(value, AuthDefaults.UsernameMaxLength, ValidationMessages.UsernameRequired).flatMap { username =>
    Either.cond(
      username.matches(AuthDefaults.UsernamePattern),
      username,
      ValidationMessages.UsernamePatternInvalid,
    )
  }

private def sanitizeAuthRequiredText(
    value: String,
    maxLength: Int,
    errorMessage: String,
): Either[String, String] =
  val sanitized = sanitizeAuthText(value, maxLength)
  Either.cond(sanitized.nonEmpty, sanitized, errorMessage)

private def sanitizeAuthText(value: String, maxLength: Int): String =
  value
    .trim
    .filter(character => !Character.isISOControl(character) || character == '\n' || character == '\t')
    .replace('\n', ' ')
    .replace('\t', ' ')
    .split(' ')
    .filter(_.nonEmpty)
    .mkString(" ")
    .take(maxLength)

private def nextAuthId(prefix: String): String =
  s"$prefix-${UUID.randomUUID().toString.take(AuthDefaults.GeneratedIdSuffixLength)}"

private def nextAuthToken(): String =
  UUID.randomUUID().toString.replace("-", "")

private def authNow(): String = Instant.now().toString

private def loadAuthState(): AuthState =
  loadOrCreateJsonFile(authStateFile, seedAuthState())

private def saveAuthState(state: AuthState): Unit =
  writeJsonFile(authStateFile, state)

private def updateAuthState[A](
    mutate: AuthState => Either[String, (AuthState, A)]
): IO[Either[String, A]] =
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
        id = "usr-admin-1",
        username = "admin",
        password = "admin123",
        role = UserRole.admin,
        displayName = "总控台管理员",
        linkedProfileId = Some("admin-1"),
        createdAt = authNow(),
      ),
      AuthAccount(
        id = "usr-cust-1",
        username = "cust_1",
        password = "cust123",
        role = UserRole.customer,
        displayName = customerAlias("cust-1"),
        linkedProfileId = Some("cust-1"),
        createdAt = authNow(),
      ),
      AuthAccount(
        id = "usr-cust-2",
        username = "cust_2",
        password = "cust123",
        role = UserRole.customer,
        displayName = customerAlias("cust-2"),
        linkedProfileId = Some("cust-2"),
        createdAt = authNow(),
      ),
      AuthAccount(
        id = "usr-rider-1",
        username = "rider_1",
        password = "rider123",
        role = UserRole.rider,
        displayName = "陈凯",
        linkedProfileId = Some("rider-1"),
        createdAt = authNow(),
      ),
      AuthAccount(
        id = "usr-rider-2",
        username = "rider_2",
        password = "rider123",
        role = UserRole.rider,
        displayName = "赵晨",
        linkedProfileId = Some("rider-2"),
        createdAt = authNow(),
      ),
      AuthAccount(
        id = "usr-merchant-1",
        username = "merchant_wang",
        password = "merchant123",
        role = UserRole.merchant,
        displayName = "王师傅",
        linkedProfileId = None,
        createdAt = authNow(),
      ),
      AuthAccount(
        id = "usr-merchant-2",
        username = "merchant_su",
        password = "merchant123",
        role = UserRole.merchant,
        displayName = "苏宁",
        linkedProfileId = None,
        createdAt = authNow(),
      ),
    ),
    sessions = Map.empty,
  )
