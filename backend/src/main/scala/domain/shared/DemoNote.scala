package domain.shared

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

import java.time.Instant
import java.util.UUID
import scala.util.Try

final case class NoteId(value: UUID)

def randomNoteId(): NoteId = NoteId(UUID.randomUUID())

object NoteId:
  given Encoder[NoteId] = Encoder.encodeString.contramap(_.value.toString)

  given Decoder[NoteId] = Decoder.decodeString.emap { value =>
    Try(UUID.fromString(value)).toEither.left.map(_.getMessage).map(NoteId(_))
  }

final case class NoteTitle(value: DisplayText)

object NoteTitle:
  given Encoder[NoteTitle] = Encoder.encodeString.contramap(_.value.raw)
  given Decoder[NoteTitle] = Decoder.decodeString.map(value => NoteTitle(new DisplayText(value)))

final case class NoteBody(value: NoteText)

object NoteBody:
  given Encoder[NoteBody] = Encoder.encodeString.contramap(_.value.raw)
  given Decoder[NoteBody] = Decoder.decodeString.map(value => NoteBody(new NoteText(value)))

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
