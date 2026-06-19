package system.app.planner.objects

// Business note: planner-owned demo object; keep frontend planner mirrors aligned when this shape crosses the planner API boundary.
import system.objects.given

import system.objects.*

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

import java.time.Instant
import scala.util.Try

final case class DemoNote(
  id: NoteId,
  title: NoteTitle,
  body: NoteBody,
  status: NoteStatus,
  createdAt: Instant
)

object DemoNote:
  given Encoder[Instant] = Encoder.encodeString.contramap(_.toString)
  given Decoder[Instant] = Decoder.decodeString.emap { value =>
    Try(Instant.parse(value)).toEither.left.map(_.getMessage)
  }

  given Encoder[DemoNote] = deriveEncoder[DemoNote]
  given Decoder[DemoNote] = deriveDecoder[DemoNote]
