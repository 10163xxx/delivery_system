package http.support

import cats.effect.IO
import app.auth.getSession
import io.circe.syntax.*
import domain.auth.AuthUser
import domain.merchant.ImageUploadResponse
import domain.shared.{DeliveryAppState, HttpHeaders, UserRole}
import org.http4s.Request
import org.http4s.Response
import org.http4s.Status
import org.http4s.circe.CirceEntityEncoder.*
import org.http4s.dsl.io.*

def handleStateResult(result: Either[String, DeliveryAppState]) =
  result match
    case Right(state) => Ok(state.asJson)
    case Left(message) => BadRequest(message)

def handleUploadResult(result: Either[String, ImageUploadResponse]) =
  result match
    case Right(response) => Ok(response.asJson)
    case Left(message) => BadRequest(message)

def withSession(req: Request[IO])(handle: AuthUser => IO[org.http4s.Response[IO]]) =
  readToken(req) match
    case Some(token) =>
      getSession(token).flatMap {
        case Some(session) => handle(session.user)
        case None => unauthorized("登录已失效")
      }
    case None => unauthorized("未登录")

def withRole(req: Request[IO], role: UserRole)(handle: AuthUser => IO[org.http4s.Response[IO]]) =
  withSession(req) { user =>
    if user.role == role then handle(user)
    else Forbidden(s"当前账号不是${role.toString}角色")
  }

def unauthorized(message: String): IO[Response[IO]] =
  IO.pure(Response[IO](status = Status.Unauthorized).withEntity(message))

def readToken(req: Request[IO]): Option[String] =
  req.headers.get(HttpHeaders.SessionToken).map(_.head.value)
