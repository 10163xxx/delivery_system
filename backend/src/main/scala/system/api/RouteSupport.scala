package system.api

import system.objects.given

import cats.effect.IO
import services.auth.utils.getSession
import io.circe.syntax.*
import services.auth.objects.AuthAccount
import services.merchant.objects.apiTypes.ImageUploadResponse
import system.objects.{ErrorMessage, HttpHeaders}
import system.app.objects.{DeliveryAppState}
import services.auth.objects.{SessionToken, UserRole}
import org.http4s.Request
import org.http4s.Response
import org.http4s.Status
import org.http4s.circe.CirceEntityEncoder.*
import org.http4s.dsl.io.*

export org.http4s.dsl.io.*

def handleStateResult(result: Either[ErrorMessage, DeliveryAppState]) =
  result match
    case Right(state) => Ok(state.asJson)
    case Left(message) => BadRequest(message)

def handleUploadResult(result: Either[ErrorMessage, ImageUploadResponse]) =
  result match
    case Right(response) => Ok(response.asJson)
    case Left(message) => BadRequest(message)

def withSession(req: Request[IO])(handle: AuthAccount => IO[org.http4s.Response[IO]]) =
  readToken(req) match
    case Some(token) =>
      getSession(token).flatMap {
        case Some(session) => handle(session.user)
        case None => unauthorized(RouteMessages.LoginExpired)
      }
    case None => unauthorized(RouteMessages.LoginRequired)

def withRole(req: Request[IO], role: UserRole)(handle: AuthAccount => IO[org.http4s.Response[IO]]) =
  withSession(req) { user =>
    if user.role == role then handle(user)
    else Forbidden(roleMismatch(role))
  }

def unauthorized(message: ErrorMessage): IO[Response[IO]] =
  IO.pure(Response[IO](status = Status.Unauthorized).withEntity(message))

def readToken(req: Request[IO]): Option[SessionToken] =
  req.headers.get(HttpHeaders.SessionToken).map(header => new SessionToken(header.head.value))
