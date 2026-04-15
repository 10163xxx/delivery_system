package shared.app.planner

import domain.shared.given

import cats.effect.IO
import shared.database.withTransactionConnection
import io.circe.Json
import io.circe.syntax.*
import io.circe.{Decoder, Encoder}
import domain.shared.PlannerName

import java.sql.Connection

type PlannerHandler = Json => IO[Json]

private def decodePlannerInput[Input](
    plannerName: PlannerName,
    payload: Json
)(using decoder: Decoder[Input]): IO[Input] =
  IO.fromEither(
    payload.as[Input].left.map(error =>
      new IllegalArgumentException(s"Invalid JSON for ${plannerName.raw}: ${error.getMessage}")
    )
  )

def registerPlainPlanner[Input: Decoder, Output: Encoder](
    plannerName: PlannerName,
    execute: Input => IO[Output]
): (PlannerName, PlannerHandler) =
  plannerName -> { payload =>
    decodePlannerInput[Input](plannerName, payload).flatMap(input => execute(input).map(_.asJson))
  }

def registerConnectionPlanner[Input: Decoder, Output: Encoder](
    plannerName: PlannerName,
    execute: (Input, Connection) => IO[Output]
): (PlannerName, PlannerHandler) =
  plannerName -> { payload =>
    decodePlannerInput[Input](plannerName, payload).flatMap { input =>
      withTransactionConnection(connection => execute(input, connection).map(_.asJson))
    }
  }
