package auth.route

import domain.shared.given

import cats.effect.IO
import cats.syntax.semigroupk.*
import domain.auth.AuthSession
import domain.shared.ErrorMessage
import io.circe.syntax.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityEncoder.*
import org.http4s.dsl.io.*

val authRoutes: HttpRoutes[IO] =
  loginRoute <+> registerRoute <+> getSessionRoute <+> logoutRoute

private def handleSessionResult(result: Either[ErrorMessage, AuthSession]) =
  result match
    case Right(session) => Ok(session.asJson)
    case Left(message) => BadRequest(message)
