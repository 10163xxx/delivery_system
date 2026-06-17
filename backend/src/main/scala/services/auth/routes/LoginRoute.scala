package services.auth.routes

import services.auth.api.*

import domain.shared.given

import services.auth.utils.*
import cats.effect.IO
import domain.auth.{AuthSession, LoginRequest}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import system.api.*

val loginRoute: HttpRoutes[IO] = apiRoute(loginApi) { matchedReq =>
  matchedReq.as[LoginRequest].flatMap { payload =>
    login(payload).flatMap(handleSessionResult)
  }
}
