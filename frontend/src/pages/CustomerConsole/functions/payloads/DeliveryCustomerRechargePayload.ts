import type {
  CurrencyCents,
  RechargeBalanceRequest,
} from '@/objects/core/SharedObjects'
import { CURRENCY_CENTS_SCALE } from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import { asDomainNumber, parseCurrencyAmount } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'

export function buildRechargePayload(amountYuan: number): RechargeBalanceRequest {
  return { amountCents: asDomainNumber<CurrencyCents>(Math.round(amountYuan * CURRENCY_CENTS_SCALE)) }
}

export function parseRechargeAmount(value: string) {
  return parseCurrencyAmount(value)
}
