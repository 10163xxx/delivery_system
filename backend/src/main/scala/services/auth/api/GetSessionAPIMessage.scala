package services.auth.api

import domain.shared.given

import domain.auth.AuthSession
import io.circe.syntax.*
import system.api.*

val getSessionApi: FixedMethodApi[NoPathParams, AuthSession] =
  jsonGetApi[AuthSession](
    routeSegment("api"),
    routeSegment("auth"),
    routeSegment("session"),
  )
