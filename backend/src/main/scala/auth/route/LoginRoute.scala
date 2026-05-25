package auth.route

import auth.api.*

import domain.shared.given

import auth.app.*
import cats.effect.IO
import domain.auth.{AuthSession, LoginRequest}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import shared.api.routing.*

val loginRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi0(loginApi, req) =>
    val Some(matchedReq) = extractApi0(loginApi, req)
    matchedReq.as[LoginRequest].flatMap { payload =>
      login(payload).flatMap(handleSessionResult)
    }
}
