package shared.api.planner

import domain.shared.given

import cats.effect.IO
import cats.syntax.all.*
import domain.shared.{DisplayText, ErrorResponse, PlannerName}
import io.circe.Json
import io.circe.syntax.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.circe.CirceEntityEncoder.*
import org.typelevel.log4cats.slf4j.Slf4jLogger
import shared.api.routing.*

private val plannerRoutesLogger = Slf4jLogger.getLogger[IO]

private def executePlanner(plannerName: PlannerName, payload: Json): IO[Json] =
  planners
    .get(plannerName)
    .liftTo[IO](new IllegalArgumentException(s"Unknown planner: ${plannerName.raw}"))
    .flatMap(execute => execute(payload))

val plannerApi: FixedMethodApi1[PlannerName, Json] =
  jsonPostApi1[PlannerName, Json, Json](
    List(routeSegment("api")),
  )

val plannerRoutes: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi1(plannerApi, req) =>
    val Some((matchedReq, plannerName)) = extractApi1(plannerApi, req)
    (
      for
        _ <- plannerRoutesLogger.info(s"PlannerRoutes received POST ${apiPath1(plannerApi, plannerName).raw}")
        bodyJson <- matchedReq.as[Json]
        responseJson <- executePlanner(plannerName, bodyJson)
        response <- Ok(responseJson)
      yield response
    ).handleErrorWith { error =>
      for
        _ <- plannerRoutesLogger.error(error)(s"PlannerRoutes failed: ${error.getMessage}")
        response <- BadRequest(ErrorResponse(new DisplayText(error.getMessage)).asJson)
      yield response
    }
}
