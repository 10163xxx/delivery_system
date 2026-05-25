package auth.route

import auth.api.*

import domain.shared.given

import auth.app.*
import cats.effect.IO
import org.http4s.HttpRoutes
import shared.api.routing.*

val logoutRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi0(logoutApi, req) =>
    val Some(matchedReq) = extractApi0(logoutApi, req)
    readToken(matchedReq) match
      case Some(token) => logout(token) *> Ok()
      case None => unauthorized(RouteMessages.LoginRequired)
}
