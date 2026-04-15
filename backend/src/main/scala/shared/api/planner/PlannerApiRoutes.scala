package shared.api.planner

import domain.shared.given

import cats.effect.IO
import cats.syntax.all.*
import io.circe.Json
import io.circe.syntax.*
import domain.shared.{DisplayText, ErrorResponse, PlannerName}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.circe.CirceEntityEncoder.*
import org.http4s.dsl.io.*
import org.typelevel.log4cats.slf4j.Slf4jLogger

private val plannerRoutesLogger = Slf4jLogger.getLogger[IO]

private def executePlanner(plannerName: PlannerName, payload: Json): IO[Json] =
  planners
    .get(plannerName)
    .liftTo[IO](new IllegalArgumentException(s"Unknown planner: ${plannerName.raw}"))
    .flatMap(execute => execute(payload))

val plannerRoutes: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req @ POST -> Root / "api" / plannerName =>
    (
      for
        _ <- plannerRoutesLogger.info(s"PlannerRoutes received POST /api/$plannerName")
        bodyJson <- req.as[Json]
        responseJson <- executePlanner(new PlannerName(plannerName), bodyJson)
        response <- Ok(responseJson)
      yield response
    ).handleErrorWith { error =>
      for
        _ <- plannerRoutesLogger.error(error)(s"PlannerRoutes failed: ${error.getMessage}")
        response <- BadRequest(ErrorResponse(new DisplayText(error.getMessage)).asJson)
      yield response
    }
}
