package domain.review

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class ResolveReviewAppealRequest(approved: ApprovalFlag, resolutionNote: ResolutionText)
object ResolveReviewAppealRequest:
  given Encoder[ResolveReviewAppealRequest] = deriveEncoder
  given Decoder[ResolveReviewAppealRequest] = deriveDecoder
