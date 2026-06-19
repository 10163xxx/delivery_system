package services.auth.routes

// Business note: route adapter for a typed API message; delegate business decisions to service actions instead of embedding them here.
import services.auth.api.*

import system.objects.given

import services.auth.utils.*
import cats.effect.IO
import services.auth.objects.{AuthSession}
import services.auth.objects.apiTypes.{LoginRequest}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import system.api.*

val loginRoute: HttpRoutes[IO] = apiRoute(loginApi) { matchedReq =>
  matchedReq.as[LoginRequest].flatMap { payload =>
    login(payload).flatMap(handleSessionResult)
  }
}
