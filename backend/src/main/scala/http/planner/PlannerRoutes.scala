package http.planner

import app.planner.{ConnectionPlanner, PlainPlanner}
import cats.effect.IO
import cats.syntax.all.*
import database.DatabaseSession
import io.circe.Json
import io.circe.syntax.*
import domain.shared.ErrorResponse
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.circe.CirceEntityEncoder.*
import org.http4s.dsl.io.*
import org.typelevel.log4cats.slf4j.Slf4jLogger

private val plannerRoutesLogger = Slf4jLogger.getLogger[IO]

private def decodePlannerInput[Input](plannerName: String, payload: Json)(using decoder: io.circe.Decoder[Input]): IO[Input] =
  IO.fromEither(
    payload.as[Input].left.map(error =>
      new IllegalArgumentException(s"Invalid JSON for $plannerName: ${error.getMessage}")
    )
  )

private def executePlanner(plannerName: String, payload: Json): IO[Json] =
  planners
    .get(plannerName)
    .liftTo[IO](new IllegalArgumentException(s"Unknown planner: $plannerName"))
    .flatMap {
      case registered: PlainPlanner[input, output] =>
        for
          input <- decodePlannerInput(registered.name, payload)(using registered.inputDecoder)
          output <- registered.run(input)
        yield registered.outputEncoder(output)

      case registered: ConnectionPlanner[input, output] =>
        for
          input <- decodePlannerInput(registered.name, payload)(using registered.inputDecoder)
          output <- DatabaseSession.withTransactionConnection(connection =>
            registered.run(input, connection)
          )
        yield registered.outputEncoder(output)
    }

val plannerRoutes: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req @ POST -> Root / "api" / plannerName =>
    (
      for
        _ <- plannerRoutesLogger.info(s"PlannerRoutes received POST /api/$plannerName")
        bodyJson <- req.as[Json]
        responseJson <- executePlanner(plannerName, bodyJson)
        response <- Ok(responseJson)
      yield response
    ).handleErrorWith { error =>
      for
        _ <- plannerRoutesLogger.error(error)(s"PlannerRoutes failed: ${error.getMessage}")
        response <- BadRequest(ErrorResponse(error.getMessage).asJson)
      yield response
    }
}
