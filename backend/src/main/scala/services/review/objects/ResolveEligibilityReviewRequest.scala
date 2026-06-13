package domain.review

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class ResolveEligibilityReviewRequest(approved: ApprovalFlag, resolutionNote: ResolutionText)
object ResolveEligibilityReviewRequest:
  given Encoder[ResolveEligibilityReviewRequest] = deriveEncoder
  given Decoder[ResolveEligibilityReviewRequest] = deriveDecoder
