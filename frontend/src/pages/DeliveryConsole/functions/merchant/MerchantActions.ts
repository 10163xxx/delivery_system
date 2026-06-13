import {
  resolvePartialRefundRequest as resolvePartialRefundRequestApi,
  updateMerchantProfile as updateMerchantProfileApi,
  withdrawMerchantIncome as withdrawMerchantIncomeApi,
} from '@/system/api/SharedApi'
import { CURRENCY_CENTS_SCALE, MAX_WITHDRAW_AMOUNT_YUAN } from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import { buildMerchantProfilePayload, buildMerchantWithdrawPayload, buildPartialRefundResolutionPayload, parseMerchantWithdrawAmount } from '@/pages/DeliveryConsole/functions/payloads/DeliveryPayloadMerchant'
import { DELIVERY_CONSOLE_MESSAGES } from '@/pages/DeliveryConsole/functions/shared/DeliveryMessages'
import { validateMerchantProfileDraft } from '@/pages/DeliveryConsole/functions/validation/DeliveryValidationMerchant'
import type {
  DisplayText,
  RefundRequestId,
} from '@/objects/core/SharedObjects'
import { asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import type {
  MerchantActionParams as Params,
  MerchantProfileContext,
  MerchantOrderIssueContext,
  MerchantWithdrawContext,
  RunAction,
} from '@/pages/MerchantConsole/objects/MerchantActionObjects'
import { createMerchantDraftActions } from '@/pages/DeliveryConsole/functions/merchant/draft/MerchantDraftActions'

function removeKey<K extends string, T>(record: Record<K, T>, key: K) {
  const next = { ...record }
  delete next[key]
  return next
}

function createMerchantOrderIssueActions(orderIssue: MerchantOrderIssueContext, runAction: RunAction) {
  const { partialRefundResolutionDrafts, setPartialRefundResolutionDrafts } = orderIssue

  async function resolvePartialRefundRequest(refundId: RefundRequestId, approved: boolean) {
    const payload = buildPartialRefundResolutionPayload(
      approved,
      partialRefundResolutionDrafts[refundId] ?? asDomainText<DisplayText>(''),
    )
    const success = await runAction(() => resolvePartialRefundRequestApi(refundId, payload))
    if (!success) return
    setPartialRefundResolutionDrafts((current: Record<RefundRequestId, DisplayText>) => removeKey(current, refundId))
  }

  return { resolvePartialRefundRequest }
}

function createMerchantProfileActions(profile: MerchantProfileContext, runAction: RunAction) {
  const { merchantProfileDraft, setMerchantProfileFormErrors } = profile

  async function saveMerchantProfile() {
    const payload = buildMerchantProfilePayload(merchantProfileDraft)
    const nextErrors = validateMerchantProfileDraft(merchantProfileDraft)
    setMerchantProfileFormErrors(nextErrors)
    if (nextErrors.contactPhone || nextErrors.bankName || nextErrors.accountNumber || nextErrors.accountHolder) return
    await runAction(() => updateMerchantProfileApi(payload))
  }

  return { saveMerchantProfile }
}

function createMerchantWithdrawActions(withdraw: MerchantWithdrawContext, runAction: RunAction) {
  const {
    merchantProfile,
    merchantWithdrawAmount,
    setMerchantWithdrawAmount,
    setMerchantWithdrawFieldError,
  } = withdraw

  async function withdrawMerchantIncome() {
    if (!merchantProfile) return
    const amount = parseMerchantWithdrawAmount(merchantWithdrawAmount)
    if (amount === null || amount <= 0) {
      return setMerchantWithdrawFieldError(asDomainText<DisplayText>(DELIVERY_CONSOLE_MESSAGES.account.invalidWithdrawAmount))
    }
    if (amount > MAX_WITHDRAW_AMOUNT_YUAN) {
      return setMerchantWithdrawFieldError(asDomainText<DisplayText>(DELIVERY_CONSOLE_MESSAGES.account.withdrawAmountTooLarge))
    }
    if (Math.round(amount * CURRENCY_CENTS_SCALE) > merchantProfile.availableToWithdrawCents) {
      return setMerchantWithdrawFieldError(
        asDomainText<DisplayText>(DELIVERY_CONSOLE_MESSAGES.account.withdrawExceedsAvailableBalance),
      )
    }
    setMerchantWithdrawFieldError(null)
    const success = await runAction(() =>
      withdrawMerchantIncomeApi(buildMerchantWithdrawPayload(amount)),
    )
    if (!success) return
    setMerchantWithdrawAmount(asDomainText<DisplayText>(''))
  }

  return { withdrawMerchantIncome }
}

export function createMerchantActions(params: Params) {
  const { runAction, setError, draft, profile, withdraw, orderIssue } = params

  return {
    ...createMerchantDraftActions(draft, runAction, setError),
    ...createMerchantOrderIssueActions(orderIssue, runAction),
    ...createMerchantProfileActions(profile, runAction),
    ...createMerchantWithdrawActions(withdraw, runAction),
  }
}
