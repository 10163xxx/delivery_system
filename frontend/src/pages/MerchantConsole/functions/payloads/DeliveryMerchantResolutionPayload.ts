import type {
  CurrencyCents,
  ResolveAfterSalesRequest,
  ResolvePartialRefundRequest,
  ResolutionText,
} from '@/objects/core/SharedObjects'
import { AFTER_SALES_RESOLUTION_MODE } from '@/objects/core/SharedObjects'
import {
  AFTER_SALES_APPROVED_NOTE,
  AFTER_SALES_REJECTED_NOTE,
  CURRENCY_CENTS_SCALE,
  MAX_TICKET_NOTE_LENGTH,
  PARTIAL_REFUND_APPROVED_NOTE,
  PARTIAL_REFUND_REJECTED_NOTE,
} from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import { asDomainBoolean, asDomainNumber, normalizeTextInput } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import type { AfterSalesResolutionDraft } from '@/pages/DeliveryConsole/objects/DeliveryDraftObjects'
import { createInitialAfterSalesResolutionDraft } from '@/pages/DeliveryConsole/functions/drafts/DeliveryDrafts'
import { optionalDomainText } from '@/pages/DeliveryConsole/functions/payloads/DeliveryPayloadFields'

export function buildPartialRefundResolutionPayload(
  approved: boolean,
  resolutionNote: string,
): ResolvePartialRefundRequest {
  return {
    approved: asDomainBoolean(approved),
    resolutionNote:
      optionalDomainText<ResolutionText>(normalizeTextInput(resolutionNote, MAX_TICKET_NOTE_LENGTH)) ||
      (approved ? PARTIAL_REFUND_APPROVED_NOTE : PARTIAL_REFUND_REJECTED_NOTE),
  }
}

export function buildAfterSalesResolutionPayload(
  approved: boolean,
  draft?: AfterSalesResolutionDraft,
): ResolveAfterSalesRequest {
  const nextDraft = draft ?? createInitialAfterSalesResolutionDraft()
  const actualCompensationYuan = Number(nextDraft.actualCompensationYuan)
  const actualCompensationCents =
    Number.isFinite(actualCompensationYuan) && actualCompensationYuan > 0
      ? Math.round(actualCompensationYuan * CURRENCY_CENTS_SCALE)
      : undefined

  return {
    approved: asDomainBoolean(approved),
    resolutionNote:
      optionalDomainText<ResolutionText>(normalizeTextInput(nextDraft.resolutionNote, MAX_TICKET_NOTE_LENGTH)) ||
      (approved ? AFTER_SALES_APPROVED_NOTE : AFTER_SALES_REJECTED_NOTE),
    resolutionMode: approved
      ? nextDraft.resolutionMode
      : AFTER_SALES_RESOLUTION_MODE.manual,
    actualCompensationCents: actualCompensationCents == null
      ? undefined
      : asDomainNumber<CurrencyCents>(actualCompensationCents),
  }
}
