package auth.api

import domain.shared.given

import cats.effect.IO
import auth.app.*
import shared.api.support.{RouteMessages, readToken, unauthorized}
import io.circe.syntax.*
import domain.auth.*
import domain.shared.ErrorMessage
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.circe.CirceEntityEncoder.*
import org.http4s.dsl.io.*

val authRoutes: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req @ POST -> Root / "api" / "auth" / "login" =>
    req.as[LoginRequest].flatMap { payload =>
      login(payload).flatMap(handleSessionResult)
    }

  case req @ POST -> Root / "api" / "auth" / "register" =>
    req.as[RegisterRequest].flatMap { payload =>
      register(payload).flatMap(handleSessionResult)
    }

  case req @ GET -> Root / "api" / "auth" / "session" =>
    readToken(req) match
      case Some(token) =>
        getSession(token).flatMap {
          case Some(session) => Ok(session.asJson)
          case None => unauthorized(RouteMessages.LoginExpired)
        }
      case None => unauthorized(RouteMessages.LoginRequired)

  case req @ POST -> Root / "api" / "auth" / "logout" =>
    readToken(req) match
      case Some(token) => logout(token) *> Ok()
      case None => unauthorized(RouteMessages.LoginRequired)
}

private def handleSessionResult(result: Either[ErrorMessage, AuthSessionResponse]) =
  result match
    case Right(session) => Ok(session.asJson)
    case Left(message) => BadRequest(message)
