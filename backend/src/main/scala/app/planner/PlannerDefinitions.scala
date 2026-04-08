package app.planner

import cats.effect.IO
import io.circe.{Decoder, Encoder}

import java.sql.Connection

final case class PlainPlanner[Input, Output](
    name: String,
    run: Input => IO[Output],
)(using val inputDecoder: Decoder[Input], val outputEncoder: Encoder[Output])

final case class ConnectionPlanner[Input, Output](
    name: String,
    run: (Input, Connection) => IO[Output],
)(using val inputDecoder: Decoder[Input], val outputEncoder: Encoder[Output])

type RegisteredPlanner = PlainPlanner[?, ?] | ConnectionPlanner[?, ?]
