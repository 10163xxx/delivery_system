package auth.route

import auth.api.*

import domain.shared.given

import auth.app.*
import cats.effect.IO
import domain.auth.AuthSession
import io.circe.syntax.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityEncoder.*
import shared.api.routing.*

val getSessionRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi0(getSessionApi, req) =>
    val Some(matchedReq) = extractApi0(getSessionApi, req)
    readToken(matchedReq) match
      case Some(token) =>
        getSession(token).flatMap {
          case Some(session) => Ok(session.asJson)
          case None => unauthorized(RouteMessages.LoginExpired)
        }
      case None => unauthorized(RouteMessages.LoginRequired)
}
