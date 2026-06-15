import type { Dispatch, SetStateAction } from 'react'
import { rejectOrder } from '@/system/api/SharedApi'
import type {
  DisplayText,
  OrderId,
  ReasonText,
} from '@/objects/core/SharedObjects'
import { asDomainText, normalizeWhitespace } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import { DELIVERY_CONSOLE_MESSAGES } from '@/pages/DeliveryConsole/functions/shared/DeliveryMessages'
import { MAX_REJECT_ORDER_REASON_LENGTH } from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import type {
  MerchantConsoleStateArgs,
  OrderRejectDraftMap,
} from '@/pages/MerchantConsole/objects/MerchantConsoleObjects'
import { toDisplayText } from '@/pages/MerchantConsole/functions/merchantConsole/MerchantConsoleValueHelpers'

export function createOrderRejectActions({
  getOrderRejectDraft,
  runAction,
  setOrderRejectDrafts,
  setOrderRejectErrors,
}: Pick<MerchantConsoleStateArgs, 'runAction'> & {
  getOrderRejectDraft: (orderId: OrderId) => DisplayText
  setOrderRejectDrafts: Dispatch<SetStateAction<OrderRejectDraftMap>>
  setOrderRejectErrors: Dispatch<SetStateAction<OrderRejectDraftMap>>
}) {
  async function submitOrderReject(orderId: OrderId) {
    const reason = normalizeWhitespace(getOrderRejectDraft(orderId))
      .trim()
      .slice(0, MAX_REJECT_ORDER_REASON_LENGTH)
    if (!reason) {
      setOrderRejectErrors((current) => ({
        ...current,
        [orderId]: toDisplayText(DELIVERY_CONSOLE_MESSAGES.merchant.orderRejectReasonRequired),
      }))
      return
    }
    setOrderRejectErrors((current) => {
      const next = { ...current }
      delete next[orderId]
      return next
    })
    const success = await runAction(() => rejectOrder(orderId, { reason: asDomainText<ReasonText>(reason) }))
    if (!success) return
    setOrderRejectDrafts((current) => ({ ...current, [orderId]: toDisplayText('') }))
  }

  return { submitOrderReject }
}
