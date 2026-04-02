package routes

import cats.effect.IO
import io.circe.syntax.*
import objects.*
import org.http4s.HttpRoutes
import org.http4s.Request
import org.http4s.Response
import org.http4s.Status
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.circe.CirceEntityEncoder.*
import org.http4s.dsl.io.*
import org.typelevel.ci.CIString
import state.AuthRepo

object AuthRouter:

  val routes: HttpRoutes[IO] = HttpRoutes.of[IO] {
    case req @ POST -> Root / "api" / "auth" / "login" =>
      req.as[LoginRequest].flatMap { payload =>
        AuthRepo.login(payload).flatMap(handleSessionResult)
      }

    case req @ POST -> Root / "api" / "auth" / "register" =>
      req.as[RegisterRequest].flatMap { payload =>
        AuthRepo.register(payload).flatMap(handleSessionResult)
      }

    case req @ GET -> Root / "api" / "auth" / "session" =>
      readToken(req) match
        case Some(token) =>
          AuthRepo.getSession(token).flatMap {
            case Some(session) => Ok(session.asJson)
            case None => unauthorized("登录已失效")
          }
        case None => unauthorized("未登录")

    case req @ POST -> Root / "api" / "auth" / "logout" =>
      readToken(req) match
        case Some(token) => AuthRepo.logout(token) *> Ok()
        case None => unauthorized("未登录")
  }

  private def handleSessionResult(result: Either[String, AuthSessionResponse]) =
    result match
      case Right(session) => Ok(session.asJson)
      case Left(message) => BadRequest(message)

  private def unauthorized(message: String): IO[Response[IO]] =
    IO.pure(Response[IO](status = Status.Unauthorized).withEntity(message))

  private def readToken(req: Request[IO]): Option[String] =
    req.headers.get(CIString("x-session-token")).map(_.head.value)
