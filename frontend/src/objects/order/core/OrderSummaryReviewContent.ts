import type {
  DescriptionText,
  IsoDateTime,
  NoteText,
} from '@/objects/core/SharedObjects'

export type OrderSummaryReviewContent = {
  reviewComment?: DescriptionText
  reviewExtraNote?: NoteText
  storeReviewComment?: DescriptionText
  storeReviewExtraNote?: NoteText
  storeMerchantReply?: NoteText
  storeMerchantReplyAt?: IsoDateTime
  riderReviewComment?: DescriptionText
  riderReviewExtraNote?: NoteText
}
