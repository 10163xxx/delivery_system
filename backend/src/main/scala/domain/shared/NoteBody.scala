package domain.shared

import domain.shared.given

import io.circe.{Decoder, Encoder}

final case class NoteBody(value: NoteText)

object NoteBody:
  given Encoder[NoteBody] = Encoder.encodeString.contramap(_.value.raw)
  given Decoder[NoteBody] = Decoder.decodeString.map(value => NoteBody(new NoteText(value)))
