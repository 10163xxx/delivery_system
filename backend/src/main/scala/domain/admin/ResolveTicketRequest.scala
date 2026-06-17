package domain.admin

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class ResolveTicketRequest(resolution: ResolutionText, note: NoteText)
object ResolveTicketRequest:
  given Encoder[ResolveTicketRequest] = deriveEncoder
  given Decoder[ResolveTicketRequest] = deriveDecoder
