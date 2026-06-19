package services.customer.api

// Business note: typed HTTP contract for this service operation; keep the matching frontend API client aligned by operation name.
import system.objects.given

import system.app.objects.DeliveryAppState
import io.circe.syntax.*
import system.api.*

val getStateApi: FixedMethodApi[NoPathParams, DeliveryAppState] =
  jsonGetApi[DeliveryAppState](
    routeSegment("api"),
    routeSegment("delivery"),
    routeSegment("state"),
  )
