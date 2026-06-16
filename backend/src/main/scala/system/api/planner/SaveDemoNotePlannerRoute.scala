package system.api.planner

import domain.shared.given

import cats.effect.IO
import domain.shared.SaveDemoNoteRequest
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.circe.CirceEntityEncoder.*
import org.http4s.dsl.io.*
import org.typelevel.log4cats.slf4j.Slf4jLogger
import system.api.*
import system.app.planner.{runSaveDemoNotePlanner, saveDemoNotePlannerName}
import system.withTransactionConnection

private val saveDemoNotePlannerRouteLogger = Slf4jLogger.getLogger[IO]

val saveDemoNotePlannerRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if extractApi1(saveDemoNotePlannerApi, req).exists(_._2 == saveDemoNotePlannerName) =>
    val (matchedReq, plannerName) = requireApi1(saveDemoNotePlannerApi, req)
    for
      _ <- saveDemoNotePlannerRouteLogger.info(
        s"SaveDemoNotePlannerRoute received POST ${apiPath1(saveDemoNotePlannerApi, plannerName).raw}"
      )
      payload <- matchedReq.as[SaveDemoNoteRequest]
      result <- withTransactionConnection(connection => runSaveDemoNotePlanner(payload, connection))
      response <- Ok(result)
    yield response
}
