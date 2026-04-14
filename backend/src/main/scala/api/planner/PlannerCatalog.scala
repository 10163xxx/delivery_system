package api.planner

import domain.shared.given

import app.planner.*
import domain.shared.PlannerName

val planners: Map[PlannerName, PlannerHandler] =
  List(
    registerPlainPlanner(echoPlannerName, runEchoPlanner),
    registerConnectionPlanner(saveDemoNotePlannerName, runSaveDemoNotePlanner),
  ).toMap
