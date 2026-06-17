package services.auth.api

import domain.shared.given

import domain.auth.{AuthSession, RegisterRequest}
import system.api.*

val registerApi: FixedMethodApi[NoPathParams, AuthSession] =
  jsonPostApi[RegisterRequest, AuthSession](
    routeSegment("api"),
    routeSegment("auth"),
    routeSegment("register"),
  )
