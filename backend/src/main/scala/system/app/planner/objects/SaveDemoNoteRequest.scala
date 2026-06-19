package system.app.planner.objects

// Business note: planner-owned demo object; keep frontend planner mirrors aligned when this shape crosses the planner API boundary.
import system.objects.given

import system.objects.*

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

final case class SaveDemoNoteRequest(
  title: NoteTitle,
  body: NoteBody,
  status: NoteStatus
)

object SaveDemoNoteRequest:
  given Encoder[SaveDemoNoteRequest] = deriveEncoder[SaveDemoNoteRequest]
  given Decoder[SaveDemoNoteRequest] = deriveDecoder[SaveDemoNoteRequest]
