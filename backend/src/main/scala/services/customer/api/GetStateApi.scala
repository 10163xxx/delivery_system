package services.customer.api

import domain.shared.given

import cats.effect.IO
import domain.shared.DeliveryAppState
import io.circe.syntax.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityEncoder.*
import system.api.*
import system.app.getStateForUser

val getStateApi: FixedMethodApi0[DeliveryAppState] =
  jsonGetApi0[DeliveryAppState](
    routeSegment("api"),
    routeSegment("delivery"),
    routeSegment("state"),
  )
