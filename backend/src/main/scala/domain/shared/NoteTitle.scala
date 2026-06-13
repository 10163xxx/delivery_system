package domain.shared

import domain.shared.given

import io.circe.{Decoder, Encoder}

final case class NoteTitle(value: DisplayText)

object NoteTitle:
  given Encoder[NoteTitle] = Encoder.encodeString.contramap(_.value.raw)
  given Decoder[NoteTitle] = Decoder.decodeString.map(value => NoteTitle(new DisplayText(value)))
