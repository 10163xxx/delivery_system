package auth.app

import domain.shared.given

import cats.effect.IO
import table.{
  createPersistedAuthAccountWithSession,
  createPersistedAuthSession,
  deletePersistedAuthSession,
  findPersistedAuthAccountBySessionToken,
  findPersistedAuthAccountByUsername,
  initializeAuthPersistenceData,
}
import domain.auth.*
import domain.shared.*
import shared.app.{customerAlias, registerUserProfile}

import java.time.Instant
import java.util.UUID

def initializeAuthPersistence: IO[Unit] =
  initializeAuthPersistenceData

def login(request: LoginRequest): IO[Either[ErrorMessage, AuthSession]] =
  val validated = for
    username <- sanitizeAuthRequiredText(
      request.username,
      AuthDefaults.UsernameMaxLength,
      ValidationMessages.Auth.UsernameRequired,
    )
    password <- sanitizeAuthRequiredText(
      request.password,
      AuthDefaults.PasswordMaxLength,
      ValidationMessages.Auth.PasswordRequired,
    )
  yield (username, password)

  validated match
    case Left(message) => IO.pure(Left(message))
    case Right((username, password)) =>
      findPersistedAuthAccountByUsername(username).flatMap {
        case None => IO.pure(Left(ValidationMessages.Auth.AccountNotFound))
        case Some(account) =>
          if !passwordMatches(password, account.passwordHash) then
            IO.pure(Left(ValidationMessages.Auth.PasswordIncorrect))
          else if account.role != request.role then
            IO.pure(Left(ValidationMessages.Auth.LoginRoleMismatch))
          else
            val token = nextAuthToken()
            createPersistedAuthSession(token, account.id, authNow()).as(Right(toSessionResponse(account, token)))
      }

def register(request: RegisterRequest): IO[Either[ErrorMessage, AuthSession]] =
  val validated = for
    username <- sanitizeAuthUsername(request.username)
    password <- sanitizeAuthRequiredText(
      request.password,
      AuthDefaults.PasswordMaxLength,
      ValidationMessages.Auth.PasswordRequired,
    )
    _ <- Either.cond(
      password.length >= AuthDefaults.PasswordMinLength,
      (),
      ValidationMessages.Auth.PasswordTooShort,
    )
    _ <- Either.cond(
      request.role != UserRole.admin,
      (),
      ValidationMessages.Auth.AdminSelfRegistrationForbidden,
    )
  yield (username, password)

  validated match
    case Left(message) => IO.pure(Left(message))
    case Right((username, password)) =>
      findPersistedAuthAccountByUsername(username).flatMap {
        case Some(_) => IO.pure(Left(ValidationMessages.Auth.UsernameAlreadyExists))
        case None =>
          val displayName = personName(username.raw)
          registerUserProfile(request.role, displayName) match
            case Left(registerError) => IO.pure(Left(registerError))
            case Right(profileId) =>
              createRegisteredSession(username, password, request.role, displayName, profileId)
      }

def getSession(token: SessionToken): IO[Option[AuthSession]] =
  findPersistedAuthAccountBySessionToken(token).map(_.map(account => toSessionResponse(account, token)))

def logout(token: SessionToken): IO[Unit] =
  deletePersistedAuthSession(token)

private def createRegisteredSession(
    username: Username,
    password: Password,
    role: UserRole,
    displayName: PersonName,
    linkedProfileId: Option[EntityId],
): IO[Either[ErrorMessage, AuthSession]] =
  val account = PersistedAuthAccount(
    id = nextAuthId(AuthDefaults.UserIdPrefix),
    username = username,
    passwordHash = hashPassword(password),
    role = role,
    displayName = displayName,
    linkedProfileId = linkedProfileId,
    createdAt = authNow(),
  )
  val token = nextAuthToken()

  for
    _ <- createPersistedAuthAccountWithSession(account, token, authNow())
  yield Right(toSessionResponse(account, token))

private def toSessionResponse(account: PersistedAuthAccount, token: SessionToken): AuthSession =
  val displayName =
    if account.role == UserRole.customer then
      account.linkedProfileId.map(profileId => customerAlias(new CustomerId(profileId.raw))).getOrElse(account.displayName)
    else account.displayName

  AuthSession(
    token = token,
    user = AuthAccount(
      id = account.id,
      username = account.username,
      role = account.role,
      displayName = displayName,
      linkedProfileId = account.linkedProfileId,
      createdAt = account.createdAt,
    ),
  )

private def sanitizeAuthUsername(value: Username): Either[ErrorMessage, Username] =
  sanitizeAuthRequiredText(
    value,
    AuthDefaults.UsernameMaxLength,
    ValidationMessages.Auth.UsernameRequired,
  ).flatMap { username =>
    Either.cond(
      username.raw.matches(AuthDefaults.UsernamePattern.raw),
      username,
      ValidationMessages.Auth.UsernamePatternInvalid,
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
  text(
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

private def authNow(): IsoDateTime =
  currentIsoDateTime()
