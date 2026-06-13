package system.api.planner

import domain.shared.given

import cats.effect.IO
import domain.shared.EchoRequest
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.circe.CirceEntityEncoder.*
import org.http4s.dsl.io.*
import org.typelevel.log4cats.slf4j.Slf4jLogger
import system.api.*
import system.app.planner.{echoPlannerName, runEchoPlanner}

private val echoPlannerRouteLogger = Slf4jLogger.getLogger[IO]

val echoPlannerRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if extractApi1(echoPlannerApi, req).exists(_._2 == echoPlannerName) =>
    val (matchedReq, plannerName) = extractApi1(echoPlannerApi, req).get
    for
      _ <- echoPlannerRouteLogger.info(s"EchoPlannerRoute received POST ${apiPath1(echoPlannerApi, plannerName).raw}")
      payload <- matchedReq.as[EchoRequest]
      result <- runEchoPlanner(payload)
      response <- Ok(result)
    yield response
}
