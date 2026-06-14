package services.auth.api

import domain.shared.given

import services.auth.utils.*
import cats.effect.IO
import domain.auth.{AuthSession, LoginRequest}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import system.api.*

val loginApi: FixedMethodApi0[AuthSession] =
  jsonPostApi0[LoginRequest, AuthSession](
    routeSegment("api"),
    routeSegment("auth"),
    routeSegment("login"),
  )
