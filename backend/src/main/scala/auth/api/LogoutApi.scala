package auth.api

import domain.shared.given

import auth.app.*
import cats.effect.IO
import org.http4s.HttpRoutes
import shared.api.routing.*

val logoutApi: FixedMethodApi0[Unit] =
  jsonPostApi0[Unit, Unit](
    routeSegment("api"),
    routeSegment("auth"),
    routeSegment("logout"),
  )
