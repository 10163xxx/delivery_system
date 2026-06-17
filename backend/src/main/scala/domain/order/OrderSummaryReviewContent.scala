package domain.order

import domain.shared.*

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
