package services.admin.objects.apiTypes

// Business note: protocol DTO shared with the frontend; keep field names and value object types mirrored across stacks.
import services.admin.objects.*

import system.objects.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import system.objects.*

final case class ResolveTicketRequest(resolution: ResolutionText, note: NoteText)
object ResolveTicketRequest:
  given Encoder[ResolveTicketRequest] = deriveEncoder
  given Decoder[ResolveTicketRequest] = deriveDecoder
