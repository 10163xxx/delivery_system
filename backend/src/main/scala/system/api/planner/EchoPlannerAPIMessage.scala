package system.api.planner

import system.objects.given

import system.api.*
import system.app.planner.objects.{EchoRequest, EchoResponse, PlannerName}

val echoPlannerApi: FixedMethodApi[PathParam[PlannerName], EchoResponse] =
  jsonPostApi[PlannerName, EchoRequest, EchoResponse](
    List(routeSegment("api")),
  )
