package state

import cats.effect.IO
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import objects.*

import java.nio.file.Paths
import java.time.Instant
import java.util.UUID
import java.util.concurrent.atomic.AtomicReference

object AuthRepo:

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

  private val stateFile = Paths.get(sys.env.getOrElse("AUTH_STATE_FILE", "data/auth-state.json"))
  private val writeLock = new AnyRef
  private val stateRef = new AtomicReference[AuthState](loadState())

  def login(request: LoginRequest): IO[Either[String, AuthSessionResponse]] =
    updateState { state =>
      for
        username <- sanitizeRequiredText(request.username, 24, "用户名不能为空")
        password <- sanitizeRequiredText(request.password, 64, "密码不能为空")
        account <- state.accounts.find(_.username == username).toRight("账号不存在")
        _ <- Either.cond(account.password == password, (), "密码错误")
      yield
        val token = nextToken()
        val nextState = state.copy(sessions = state.sessions.updated(token, account.id))
        nextState -> toSessionResponse(account, token)
    }

  def register(
      request: RegisterRequest
  ): IO[Either[String, AuthSessionResponse]] =
    val validated = for
      username <- sanitizeUsername(request.username)
      password <- sanitizeRequiredText(request.password, 64, "密码不能为空")
      _ <- Either.cond(password.length >= 6, (), "密码至少需要 6 位")
      _ <- Either.cond(request.role != UserRole.admin, (), "管理员账号不能自助注册")
    yield (username, password)

    validated match
      case Left(message) => IO.pure(Left(message))
      case Right((username, password)) =>
        val displayName = username
        DeliveryStateRepo.registerUserProfile(request.role, displayName) match
          case Left(message) => IO.pure(Left(message))
          case Right(linkedProfileId) =>
            updateState { current =>
              for
                _ <- Either.cond(
                  !current.accounts.exists(_.username == username),
                  (),
                  "用户名已存在",
                )
              yield
                val account = AuthAccount(
                  id = nextId("usr"),
                  username = username,
                  password = password,
                  role = request.role,
                  displayName = displayName,
                  linkedProfileId = linkedProfileId,
                  createdAt = now(),
                )
                val token = nextToken()
                val nextState = current.copy(
                  accounts = account :: current.accounts,
                  sessions = current.sessions.updated(token, account.id),
                )
                nextState -> toSessionResponse(account, token)
            }

  def getSession(token: String): IO[Option[AuthSessionResponse]] =
    IO.pure {
      stateRef.get().sessions.get(token).flatMap(accountId =>
        stateRef.get().accounts.find(_.id == accountId).map(account => toSessionResponse(account, token))
      )
    }

  def logout(token: String): IO[Unit] =
    updateState[Unit] { current =>
      val nextState = current.copy(sessions = current.sessions - token)
      Right(nextState -> ())
    }.void

  private def toSessionResponse(account: AuthAccount, token: String): AuthSessionResponse =
    val displayName =
      if account.role == UserRole.customer then
        account.linkedProfileId.map(DeliveryStateRepo.customerAlias).getOrElse(account.displayName)
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

  private def sanitizeUsername(value: String): Either[String, String] =
    sanitizeRequiredText(value, 24, "用户名不能为空").flatMap { username =>
      Either.cond(
        username.matches("[A-Za-z0-9_]+"),
        username,
        "用户名只能包含字母、数字和下划线",
      )
    }

  private def sanitizeRequiredText(
      value: String,
      maxLength: Int,
      errorMessage: String,
  ): Either[String, String] =
    val sanitized = sanitizeText(value, maxLength)
    Either.cond(sanitized.nonEmpty, sanitized, errorMessage)

  private def sanitizeText(value: String, maxLength: Int): String =
    value
      .trim
      .filter(character => !Character.isISOControl(character) || character == '\n' || character == '\t')
      .replace('\n', ' ')
      .replace('\t', ' ')
      .split(' ')
      .filter(_.nonEmpty)
      .mkString(" ")
      .take(maxLength)

  private def nextId(prefix: String): String =
    s"$prefix-${UUID.randomUUID().toString.take(8)}"

  private def nextToken(): String =
    UUID.randomUUID().toString.replace("-", "")

  private def now(): String = Instant.now().toString

  private def loadState(): AuthState =
    JsonFileStore.loadOrCreate(stateFile, seedState())

  private def saveState(state: AuthState): Unit =
    JsonFileStore.write(stateFile, state)

  private def updateState[A](
      mutate: AuthState => Either[String, (AuthState, A)]
  ): IO[Either[String, A]] =
    IO.blocking {
      writeLock.synchronized {
        mutate(stateRef.get()).map { case (nextState, result) =>
          saveState(nextState)
          stateRef.set(nextState)
          result
        }
      }
    }

  private def seedState(): AuthState =
    AuthState(
      accounts = List(
        AuthAccount(
          id = "usr-admin-1",
          username = "admin",
          password = "admin123",
          role = UserRole.admin,
          displayName = "总控台管理员",
          linkedProfileId = Some("admin-1"),
          createdAt = now(),
        ),
        AuthAccount(
          id = "usr-cust-1",
          username = "cust_1",
          password = "cust123",
          role = UserRole.customer,
          displayName = DeliveryStateRepo.customerAlias("cust-1"),
          linkedProfileId = Some("cust-1"),
          createdAt = now(),
        ),
        AuthAccount(
          id = "usr-cust-2",
          username = "cust_2",
          password = "cust123",
          role = UserRole.customer,
          displayName = DeliveryStateRepo.customerAlias("cust-2"),
          linkedProfileId = Some("cust-2"),
          createdAt = now(),
        ),
        AuthAccount(
          id = "usr-rider-1",
          username = "rider_1",
          password = "rider123",
          role = UserRole.rider,
          displayName = "陈凯",
          linkedProfileId = Some("rider-1"),
          createdAt = now(),
        ),
        AuthAccount(
          id = "usr-rider-2",
          username = "rider_2",
          password = "rider123",
          role = UserRole.rider,
          displayName = "赵晨",
          linkedProfileId = Some("rider-2"),
          createdAt = now(),
        ),
        AuthAccount(
          id = "usr-merchant-1",
          username = "merchant_wang",
          password = "merchant123",
          role = UserRole.merchant,
          displayName = "王师傅",
          linkedProfileId = None,
          createdAt = now(),
        ),
        AuthAccount(
          id = "usr-merchant-2",
          username = "merchant_su",
          password = "merchant123",
          role = UserRole.merchant,
          displayName = "苏宁",
          linkedProfileId = None,
          createdAt = now(),
        ),
      ),
      sessions = Map.empty,
    )
