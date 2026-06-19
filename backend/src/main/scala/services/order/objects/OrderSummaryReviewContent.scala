package services.order.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.*

final case class OrderSummaryReviewContent(
    reviewComment: Option[ReasonText],
    reviewExtraNote: Option[NoteText],
    storeReviewComment: Option[ReasonText],
    storeReviewExtraNote: Option[NoteText],
    storeMerchantReply: Option[NoteText],
    storeMerchantReplyAt: Option[IsoDateTime],
    riderReviewComment: Option[ReasonText],
    riderReviewExtraNote: Option[NoteText],
)
