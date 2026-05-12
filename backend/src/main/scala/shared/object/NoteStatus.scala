package domain.shared

import domain.shared.given

import io.circe.{Decoder, Encoder}

enum NoteStatus:
  case Draft
  case Published

private val noteStatusDraftValue = new DisplayText("draft")
private val noteStatusPublishedValue = new DisplayText("published")
val noteStatusDatabaseValues: List[DisplayText] = List(noteStatusDraftValue, noteStatusPublishedValue)

def noteStatusToDatabase(status: NoteStatus): DisplayText =
  status match
    case NoteStatus.Draft => noteStatusDraftValue
    case NoteStatus.Published => noteStatusPublishedValue

def noteStatusFromDatabase(value: DisplayText): Either[DisplayText, NoteStatus] =
  value.raw.trim.toLowerCase match
    case raw if raw == noteStatusDraftValue.raw => Right(NoteStatus.Draft)
    case raw if raw == noteStatusPublishedValue.raw => Right(NoteStatus.Published)
    case other => Left(new DisplayText(s"Unsupported NoteStatus value: $other"))

def noteStatusFromDatabaseUnsafe(value: DisplayText): NoteStatus =
  noteStatusFromDatabase(value).fold(message => throw new IllegalArgumentException(message.raw), identity)

object NoteStatus:
  val DatabaseValues: List[DisplayText] = noteStatusDatabaseValues
  given Encoder[NoteStatus] = Encoder.encodeString.contramap(status => noteStatusToDatabase(status).raw)
  given Decoder[NoteStatus] = Decoder.decodeString.emap(value => noteStatusFromDatabase(new DisplayText(value)).left.map(_.raw))
