package domain.shared

import domain.shared.given

import io.circe.{Decoder, Encoder}

import java.util.UUID
import scala.util.Try

final case class NoteId(value: UUID)

def randomNoteId(): NoteId = NoteId(UUID.randomUUID())

object NoteId:
  given Encoder[NoteId] = Encoder.encodeString.contramap(_.value.toString)

  given Decoder[NoteId] = Decoder.decodeString.emap { value =>
    Try(UUID.fromString(value)).toEither.left.map(_.getMessage).map(NoteId(_))
  }
