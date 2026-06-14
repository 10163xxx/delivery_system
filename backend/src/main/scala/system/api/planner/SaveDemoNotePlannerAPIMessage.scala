package system.api.planner

import domain.shared.given

import domain.shared.{DemoNote, PlannerName, SaveDemoNoteRequest}
import system.api.*

val saveDemoNotePlannerApi: FixedMethodApi1[PlannerName, DemoNote] =
  jsonPostApi1[PlannerName, SaveDemoNoteRequest, DemoNote](
    List(routeSegment("api")),
  )
