package services.auth.routes

// Business note: route adapter for a typed API message; delegate business decisions to service actions instead of embedding them here.
import system.objects.given

import cats.effect.IO
import cats.syntax.semigroupk.*
import services.auth.objects.AuthSession
import system.objects.ErrorMessage
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
