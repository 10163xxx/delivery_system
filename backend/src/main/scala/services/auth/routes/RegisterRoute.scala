package services.auth.routes

import services.auth.api.*

import domain.shared.given

import services.auth.utils.*
import cats.effect.IO
import domain.auth.{AuthSession, RegisterRequest}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import system.api.*

val registerRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi0(registerApi, req) =>
    val matchedReq = requireApi0(registerApi, req)
    matchedReq.as[RegisterRequest].flatMap { payload =>
      register(payload).flatMap(handleSessionResult)
    }
}
