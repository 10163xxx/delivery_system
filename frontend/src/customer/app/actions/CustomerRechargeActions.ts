import { rechargeCustomerBalance as rechargeCustomerBalanceRequest } from '@/shared/api/SharedApi'
import { ROUTE_PATH } from '@/shared/object/SharedObjects'
import {
  buildRechargePayload,
  DEFAULT_RECHARGE_PRESET_INDEX,
  DELIVERY_CONSOLE_MESSAGES,
  MAX_RECHARGE_AMOUNT_YUAN,
  parseRechargeAmount,
  RECHARGE_PRESET_AMOUNTS,
} from '@/shared/delivery/DeliveryServices'
import type { CustomerActionParams } from '@/customer/app/actions/CustomerActionTypes'

type CustomerRechargeParams = Pick<
  CustomerActionParams,
  | 'selectedCustomer'
  | 'customRechargeAmount'
  | 'runAction'
  | 'navigate'
  | 'setCustomRechargeAmount'
  | 'setSelectedRechargeAmount'
  | 'setRechargeFieldError'
>

export function createCustomerRechargeActions(params: CustomerRechargeParams) {
  const {
    selectedCustomer,
    customRechargeAmount,
    runAction,
    navigate,
    setCustomRechargeAmount,
    setSelectedRechargeAmount,
    setRechargeFieldError,
  } = params

  function selectRechargeAmount(amount: number) {
    setSelectedRechargeAmount(amount)
    setCustomRechargeAmount('')
    setRechargeFieldError(null)
  }

  async function submitRechargeFromPage() {
    if (!selectedCustomer) return
    const amount = parseRechargeAmount(customRechargeAmount) ?? RECHARGE_PRESET_AMOUNTS[DEFAULT_RECHARGE_PRESET_INDEX]
    if (amount <= 0) {
      setRechargeFieldError(DELIVERY_CONSOLE_MESSAGES.invalidRechargeAmount)
      return
    }
    if (amount > MAX_RECHARGE_AMOUNT_YUAN) {
      setRechargeFieldError(DELIVERY_CONSOLE_MESSAGES.rechargeAmountTooLarge)
      return
    }
    const success = await runAction(() => rechargeCustomerBalanceRequest(selectedCustomer.id, buildRechargePayload(amount)))
    if (!success) return
    setRechargeFieldError(null)
    navigate(ROUTE_PATH.customerProfile)
  }

  return {
    selectRechargeAmount,
    submitRechargeFromPage,
  }
}
