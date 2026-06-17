package services.auth.api

import domain.shared.given

import system.api.*

val logoutApi: FixedMethodApi[NoPathParams, Unit] =
  jsonPostApi[Unit, Unit](
    routeSegment("api"),
    routeSegment("auth"),
    routeSegment("logout"),
  )
