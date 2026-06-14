package system.api.planner

import domain.shared.given

import domain.shared.{EchoRequest, EchoResponse, PlannerName}
import system.api.*

val echoPlannerApi: FixedMethodApi1[PlannerName, EchoResponse] =
  jsonPostApi1[PlannerName, EchoRequest, EchoResponse](
    List(routeSegment("api")),
  )
