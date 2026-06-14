package services.auth.api

import domain.shared.given

import services.auth.utils.*
import cats.effect.IO
import org.http4s.HttpRoutes
import system.api.*

val logoutApi: FixedMethodApi0[Unit] =
  jsonPostApi0[Unit, Unit](
    routeSegment("api"),
    routeSegment("auth"),
    routeSegment("logout"),
  )
