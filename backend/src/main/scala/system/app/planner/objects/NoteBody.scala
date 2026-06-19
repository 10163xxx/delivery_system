package system.app.planner.objects

// Business note: planner-owned demo object; keep frontend planner mirrors aligned when this shape crosses the planner API boundary.
import system.objects.given

import system.objects.*

import io.circe.{Decoder, Encoder}

final case class NoteBody(value: NoteText)

object NoteBody:
  given Encoder[NoteBody] = Encoder.encodeString.contramap(_.value.raw)
  given Decoder[NoteBody] = Decoder.decodeString.map(value => NoteBody(new NoteText(value)))
