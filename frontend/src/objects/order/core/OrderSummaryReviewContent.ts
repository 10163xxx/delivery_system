// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
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
