package services.auth.routes

import services.auth.api.*

import domain.shared.given

import services.auth.utils.*
import cats.effect.IO
import org.http4s.HttpRoutes
import system.api.*

val logoutRoute: HttpRoutes[IO] = apiRoute(logoutApi) { matchedReq =>
  readToken(matchedReq) match
    case Some(token) => logout(token) *> Ok()
    case None => unauthorized(RouteMessages.LoginRequired)
}
