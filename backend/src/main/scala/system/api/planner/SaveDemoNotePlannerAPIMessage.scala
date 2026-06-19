package system.api.planner

import system.objects.given

import system.api.*
import system.app.planner.objects.{DemoNote, PlannerName, SaveDemoNoteRequest}

val saveDemoNotePlannerApi: FixedMethodApi[PathParam[PlannerName], DemoNote] =
  jsonPostApi[PlannerName, SaveDemoNoteRequest, DemoNote](
    List(routeSegment("api")),
  )
