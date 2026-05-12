package shared.api.planner

import domain.shared.given

import shared.api.planner.*
import shared.app.planner.{echoPlannerName, runEchoPlanner, runSaveDemoNotePlanner, saveDemoNotePlannerName}
import domain.shared.PlannerName

val planners: Map[PlannerName, PlannerHandler] =
  List(
    registerPlainPlanner(echoPlannerName, runEchoPlanner),
    registerConnectionPlanner(saveDemoNotePlannerName, runSaveDemoNotePlanner),
  ).toMap
