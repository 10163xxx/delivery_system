import { rechargeCustomerBalance } from '@/system/api/SharedApi'
import { ROUTE_PATH, type DisplayText } from '@/objects/core/SharedObjects'
import { asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import { buildRechargePayload, parseRechargeAmount } from '@/pages/DeliveryConsole/functions/payloads/DeliveryPayloadCustomer'
import { DEFAULT_RECHARGE_PRESET_INDEX, MAX_RECHARGE_AMOUNT_YUAN, RECHARGE_PRESET_AMOUNTS } from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import { DELIVERY_CONSOLE_MESSAGES } from '@/pages/DeliveryConsole/functions/shared/DeliveryMessages'
import type { CustomerRechargeParams } from '@/pages/CustomerConsole/objects/CustomerActionObjects'

export function createCustomerRechargeActions(params: CustomerRechargeParams) {
  const {
    selectedCustomer,
    customRechargeAmount,
    selectedRechargeAmount,
    runAction,
    navigate,
    setCustomRechargeAmount,
    setSelectedRechargeAmount,
    setRechargeFieldError,
  } = params

  function selectRechargeAmount(amount: number) {
    setSelectedRechargeAmount(amount)
    setCustomRechargeAmount(asDomainText<DisplayText>(''))
    setRechargeFieldError(null)
  }

  async function submitRechargeFromPage() {
    if (!selectedCustomer) return
    const amount =
      parseRechargeAmount(customRechargeAmount) ??
      selectedRechargeAmount ??
      RECHARGE_PRESET_AMOUNTS[DEFAULT_RECHARGE_PRESET_INDEX]
    if (amount <= 0) {
      setRechargeFieldError(asDomainText<DisplayText>(DELIVERY_CONSOLE_MESSAGES.account.invalidRechargeAmount))
      return
    }
    if (amount > MAX_RECHARGE_AMOUNT_YUAN) {
      setRechargeFieldError(asDomainText<DisplayText>(DELIVERY_CONSOLE_MESSAGES.account.rechargeAmountTooLarge))
      return
    }
    const success = await runAction(() =>
      rechargeCustomerBalance(selectedCustomer.id, buildRechargePayload(amount)),
    )
    if (!success) return
    setRechargeFieldError(null)
    navigate(ROUTE_PATH.customerProfile)
  }

  return {
    selectRechargeAmount,
    submitRechargeFromPage,
  }
}
