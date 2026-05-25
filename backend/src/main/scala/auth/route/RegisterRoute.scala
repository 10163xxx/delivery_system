package auth.route

import auth.api.*

import domain.shared.given

import auth.app.*
import cats.effect.IO
import domain.auth.{AuthSession, RegisterRequest}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import shared.api.routing.*

val registerRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi0(registerApi, req) =>
    val Some(matchedReq) = extractApi0(registerApi, req)
    matchedReq.as[RegisterRequest].flatMap { payload =>
      register(payload).flatMap(handleSessionResult)
    }
}
