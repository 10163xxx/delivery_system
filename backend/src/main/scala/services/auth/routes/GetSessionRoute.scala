package services.auth.routes

import services.auth.api.*

import domain.shared.given

import services.auth.utils.*
import cats.effect.IO
import domain.auth.AuthSession
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
