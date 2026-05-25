package auth.api

import domain.shared.given

import auth.app.*
import cats.effect.IO
import domain.auth.{AuthSession, RegisterRequest}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import shared.api.routing.*

val registerApi: FixedMethodApi0[AuthSession] =
  jsonPostApi0[RegisterRequest, AuthSession](
    routeSegment("api"),
    routeSegment("auth"),
    routeSegment("register"),
  )
