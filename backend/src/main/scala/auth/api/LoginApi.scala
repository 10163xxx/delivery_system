package auth.api

import domain.shared.given

import auth.app.*
import cats.effect.IO
import domain.auth.{AuthSession, LoginRequest}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import shared.api.routing.*

val loginApi: FixedMethodApi0[AuthSession] =
  jsonPostApi0[LoginRequest, AuthSession](
    routeSegment("api"),
    routeSegment("auth"),
    routeSegment("login"),
  )
