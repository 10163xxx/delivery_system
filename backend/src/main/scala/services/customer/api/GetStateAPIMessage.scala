package services.customer.api

import domain.shared.given

import domain.shared.DeliveryAppState
import io.circe.syntax.*
import system.api.*

val getStateApi: FixedMethodApi[NoPathParams, DeliveryAppState] =
  jsonGetApi[DeliveryAppState](
    routeSegment("api"),
    routeSegment("delivery"),
    routeSegment("state"),
  )
