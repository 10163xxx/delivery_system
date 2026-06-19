package system.app.planner.objects

// Business note: planner-owned demo object; keep frontend planner mirrors aligned when this shape crosses the planner API boundary.
import system.objects.given

import system.objects.*

import io.circe.{Decoder, Encoder}

enum NoteStatus:
  case Draft
  case Published

private val noteStatusDraftValue = text("draft")
private val noteStatusPublishedValue = text("published")
val noteStatusDatabaseValues: List[DisplayText] = List(noteStatusDraftValue, noteStatusPublishedValue)

def noteStatusToDatabase(status: NoteStatus): DisplayText =
  status match
    case NoteStatus.Draft => noteStatusDraftValue
    case NoteStatus.Published => noteStatusPublishedValue

def noteStatusFromDatabase(value: DisplayText): Either[DisplayText, NoteStatus] =
  value.raw.trim.toLowerCase match
    case raw if raw == noteStatusDraftValue.raw => Right(NoteStatus.Draft)
    case raw if raw == noteStatusPublishedValue.raw => Right(NoteStatus.Published)
    case other => Left(text(s"Unsupported NoteStatus value: $other"))

object NoteStatus:
  val DatabaseValues: List[DisplayText] = noteStatusDatabaseValues
  given Encoder[NoteStatus] = Encoder.encodeString.contramap(status => noteStatusToDatabase(status).raw)
  given Decoder[NoteStatus] = Decoder.decodeString.emap(value => noteStatusFromDatabase(text(value)).left.map(_.raw))
