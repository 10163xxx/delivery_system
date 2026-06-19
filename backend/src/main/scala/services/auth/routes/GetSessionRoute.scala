package services.auth.routes

// Business note: route adapter for a typed API message; delegate business decisions to service actions instead of embedding them here.
import services.auth.api.*

import system.objects.given

import services.auth.utils.*
import cats.effect.IO
import services.auth.objects.AuthSession
import io.circe.syntax.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityEncoder.*
import system.api.*

val getSessionRoute: HttpRoutes[IO] = apiRoute(getSessionApi) { matchedReq =>
  readToken(matchedReq) match
    case Some(token) =>
      getSession(token).flatMap {
        case Some(session) => Ok(session.asJson)
        case None => unauthorized(RouteMessages.LoginExpired)
      }
    case None => unauthorized(RouteMessages.LoginRequired)
}
