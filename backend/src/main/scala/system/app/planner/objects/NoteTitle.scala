package system.app.planner.objects

// Business note: planner-owned demo object; keep frontend planner mirrors aligned when this shape crosses the planner API boundary.
import system.objects.given

import system.objects.*

import io.circe.{Decoder, Encoder}

final case class NoteTitle(value: DisplayText)

object NoteTitle:
  given Encoder[NoteTitle] = Encoder.encodeString.contramap(_.value.raw)
  given Decoder[NoteTitle] = Decoder.decodeString.map(value => NoteTitle(new DisplayText(value)))
