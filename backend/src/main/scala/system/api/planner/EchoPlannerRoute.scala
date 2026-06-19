package system.api.planner

import system.objects.given

import cats.effect.IO
import system.app.planner.objects.EchoRequest
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.circe.CirceEntityEncoder.*
import org.http4s.dsl.io.*
import org.typelevel.log4cats.slf4j.Slf4jLogger
import system.api.*
import system.app.planner.{echoPlannerName, runEchoPlanner}

private val echoPlannerRouteLogger = Slf4jLogger.getLogger[IO]

val echoPlannerRoute: HttpRoutes[IO] = apiRouteWhere(echoPlannerApi)(_._2 == echoPlannerName) {
  case (matchedReq, plannerName) =>
    for
      _ <- echoPlannerRouteLogger.info(s"EchoPlannerRoute received POST ${apiPath(echoPlannerApi, plannerName).raw}")
      payload <- matchedReq.as[EchoRequest]
      result <- runEchoPlanner(payload)
      response <- Ok(result)
    yield response
}
