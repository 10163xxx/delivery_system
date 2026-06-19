package services.auth.routes

// Business note: route adapter for a typed API message; delegate business decisions to service actions instead of embedding them here.
import services.auth.api.*

import system.objects.given

import services.auth.utils.*
import cats.effect.IO
import org.http4s.HttpRoutes
import system.api.*

val logoutRoute: HttpRoutes[IO] = apiRoute(logoutApi) { matchedReq =>
  readToken(matchedReq) match
    case Some(token) => logout(token) *> Ok()
    case None => unauthorized(RouteMessages.LoginRequired)
}
