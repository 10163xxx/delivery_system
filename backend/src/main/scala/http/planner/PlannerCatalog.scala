package http.planner

import app.planner.{ConnectionPlanner, PlainPlanner, RegisteredPlanner, echoPlanner, saveDemoNotePlanner}

val planners: Map[String, RegisteredPlanner] =
  List(
    echoPlanner,
    saveDemoNotePlanner,
  ).map {
    case planner: PlainPlanner[?, ?] => planner.name -> planner
    case planner: ConnectionPlanner[?, ?] => planner.name -> planner
  }.toMap
