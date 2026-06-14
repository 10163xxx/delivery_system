package services.auth.api

import domain.shared.given

import services.auth.utils.*
import cats.effect.IO
import domain.auth.AuthSession
import io.circe.syntax.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityEncoder.*
import system.api.*

val getSessionApi: FixedMethodApi0[AuthSession] =
  jsonGetApi0[AuthSession](
    routeSegment("api"),
    routeSegment("auth"),
    routeSegment("session"),
  )
