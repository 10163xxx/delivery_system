package system.api.planner

import domain.shared.given

import domain.shared.{DemoNote, PlannerName, SaveDemoNoteRequest}
import system.api.*

val saveDemoNotePlannerApi: FixedMethodApi[PathParam[PlannerName], DemoNote] =
  jsonPostApi[PlannerName, SaveDemoNoteRequest, DemoNote](
    List(routeSegment("api")),
  )
