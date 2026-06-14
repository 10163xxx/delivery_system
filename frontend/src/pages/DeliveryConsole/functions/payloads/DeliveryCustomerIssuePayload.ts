import type {
  CurrencyCents,
  MenuItemId,
  NoteText,
  Quantity,
  RatingValue,
  ReasonText,
  ReviewOrderRequest,
  SubmitAfterSalesRequest,
  SubmitPartialRefundRequest,
} from '@/objects/core/SharedObjects'
import { AFTER_SALES_REQUEST_TYPE } from '@/objects/core/SharedObjects'
import { REVIEW_TARGET } from '@/pages/DeliveryConsole/objects/ReviewTargetObjects'
import {
  CURRENCY_CENTS_SCALE,
  MAX_REVIEW_COMMENT_LENGTH,
  MAX_REVIEW_EXTRA_NOTE_LENGTH,
  MIN_MENU_ITEM_QUANTITY,
} from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import { asDomainNumber, asDomainText, clampRating, normalizeTextInput } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import type {
  AfterSalesDraft,
  PartialRefundDraft,
  ReviewDraft,
} from '@/pages/DeliveryConsole/objects/DeliveryDraftObjects'
import {
  createInitialAfterSalesDraft,
  createInitialPartialRefundDraft,
  createInitialReviewDraft,
} from '@/pages/DeliveryConsole/functions/drafts/DeliveryDrafts'
import { optionalDomainText } from '@/pages/DeliveryConsole/functions/payloads/DeliveryPayloadFields'

export function buildPartialRefundPayload(
  menuItemId: string,
  draft?: PartialRefundDraft,
): SubmitPartialRefundRequest {
  const nextDraft = draft ?? createInitialPartialRefundDraft()
  return {
    menuItemId: asDomainText<MenuItemId>(menuItemId),
    quantity: asDomainNumber<Quantity>(Math.max(MIN_MENU_ITEM_QUANTITY, Math.round(nextDraft.quantity))),
    reason: asDomainText<ReasonText>(normalizeTextInput(nextDraft.reason, MAX_REVIEW_COMMENT_LENGTH)),
  }
}

export function buildAfterSalesPayload(draft?: AfterSalesDraft): SubmitAfterSalesRequest {
  const nextDraft = draft ?? createInitialAfterSalesDraft()
  const expectedCompensationYuan = Number(nextDraft.expectedCompensationYuan)
  const expectedCompensationCents =
    nextDraft.requestType === AFTER_SALES_REQUEST_TYPE.compensationRequest &&
    Number.isFinite(expectedCompensationYuan) &&
    expectedCompensationYuan > 0
      ? Math.round(expectedCompensationYuan * CURRENCY_CENTS_SCALE)
      : undefined

  return {
    requestType: nextDraft.requestType,
    reason: asDomainText<ReasonText>(normalizeTextInput(nextDraft.reason, MAX_REVIEW_COMMENT_LENGTH)),
    expectedCompensationCents: expectedCompensationCents == null
      ? undefined
      : asDomainNumber<CurrencyCents>(expectedCompensationCents),
  }
}

export function buildReviewPayload(
  target: typeof REVIEW_TARGET.store | typeof REVIEW_TARGET.rider,
  draft?: ReviewDraft,
): ReviewOrderRequest {
  const nextDraft = draft ?? createInitialReviewDraft()
  const comment = normalizeTextInput(nextDraft.comment, MAX_REVIEW_COMMENT_LENGTH)
  const extraNote = normalizeTextInput(nextDraft.extraNote, MAX_REVIEW_EXTRA_NOTE_LENGTH)
  const submission = {
    rating: asDomainNumber<RatingValue>(clampRating(nextDraft.rating)),
    comment: optionalDomainText<ReasonText>(comment),
    extraNote: optionalDomainText<NoteText>(extraNote),
  }

  return target === REVIEW_TARGET.store ? { storeReview: submission } : { riderReview: submission }
}
