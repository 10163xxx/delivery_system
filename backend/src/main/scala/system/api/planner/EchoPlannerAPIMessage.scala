package system.api.planner

import domain.shared.given

import domain.shared.{EchoRequest, EchoResponse, PlannerName}
import system.api.*

val echoPlannerApi: FixedMethodApi[PathParam[PlannerName], EchoResponse] =
  jsonPostApi[PlannerName, EchoRequest, EchoResponse](
    List(routeSegment("api")),
  )
