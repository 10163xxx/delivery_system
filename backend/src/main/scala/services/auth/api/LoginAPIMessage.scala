package services.auth.api

import domain.shared.given

import domain.auth.{AuthSession, LoginRequest}
import system.api.*

val loginApi: FixedMethodApi[NoPathParams, AuthSession] =
  jsonPostApi[LoginRequest, AuthSession](
    routeSegment("api"),
    routeSegment("auth"),
    routeSegment("login"),
  )
