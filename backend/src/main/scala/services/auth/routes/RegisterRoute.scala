package services.auth.routes

// Business note: route adapter for a typed API message; delegate business decisions to service actions instead of embedding them here.
import services.auth.api.*

import system.objects.given

import services.auth.utils.*
import cats.effect.IO
import services.auth.objects.{AuthSession}
import services.auth.objects.apiTypes.{RegisterRequest}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import system.api.*

val registerRoute: HttpRoutes[IO] = apiRoute(registerApi) { matchedReq =>
  matchedReq.as[RegisterRequest].flatMap { payload =>
    register(payload).flatMap(handleSessionResult)
  }
}
