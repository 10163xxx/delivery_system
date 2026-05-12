import { deliveryApi } from '@/shared/api/SharedApi'
import {
  CURRENCY_CENTS_SCALE,
  buildMerchantProfilePayload,
  buildMerchantWithdrawPayload,
  buildPartialRefundResolutionPayload,
  DELIVERY_CONSOLE_MESSAGES,
  MAX_WITHDRAW_AMOUNT_YUAN,
  parseMerchantWithdrawAmount,
  validateMerchantProfileDraft,
} from '@/shared/delivery/DeliveryServices'
import type {
  MerchantActionParams as Params,
  MerchantProfileContext,
  MerchantSupportContext,
  MerchantWithdrawContext,
  RunAction,
} from '@/merchant/object/action/MerchantActionObjects'
import { createMerchantDraftActions } from '@/merchant/app/actions/MerchantDraftActions'

function removeKey<T>(record: Record<string, T>, key: string) {
  const next = { ...record }
  delete next[key]
  return next
}

function createMerchantSupportActions(support: MerchantSupportContext, runAction: RunAction) {
  const { partialRefundResolutionDrafts, setPartialRefundResolutionDrafts } = support

  async function resolvePartialRefundRequest(refundId: string, approved: boolean) {
    const payload = buildPartialRefundResolutionPayload(
      approved,
      partialRefundResolutionDrafts[refundId] ?? '',
    )
    const success = await runAction(() =>
      deliveryApi.order.resolvePartialRefundRequest(refundId, payload),
    )
    if (!success) return
    setPartialRefundResolutionDrafts((current: Record<string, string>) => removeKey(current, refundId))
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
    await runAction(() => deliveryApi.merchant.updateMerchantProfile(payload))
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
      return setMerchantWithdrawFieldError(DELIVERY_CONSOLE_MESSAGES.account.invalidWithdrawAmount)
    }
    if (amount > MAX_WITHDRAW_AMOUNT_YUAN) {
      return setMerchantWithdrawFieldError(DELIVERY_CONSOLE_MESSAGES.account.withdrawAmountTooLarge)
    }
    if (Math.round(amount * CURRENCY_CENTS_SCALE) > merchantProfile.availableToWithdrawCents) {
      return setMerchantWithdrawFieldError(
        DELIVERY_CONSOLE_MESSAGES.account.withdrawExceedsAvailableBalance,
      )
    }
    setMerchantWithdrawFieldError(null)
    const success = await runAction(() =>
      deliveryApi.merchant.withdrawMerchantIncome(buildMerchantWithdrawPayload(amount)),
    )
    if (!success) return
    setMerchantWithdrawAmount('')
  }

  return { withdrawMerchantIncome }
}

export function createMerchantActions(params: Params) {
  const { runAction, setError, draft, profile, withdraw, support } = params

  return {
    ...createMerchantDraftActions(draft, runAction, setError),
    ...createMerchantSupportActions(support, runAction),
    ...createMerchantProfileActions(profile, runAction),
    ...createMerchantWithdrawActions(withdraw, runAction),
  }
}
