import type { MenuItem } from '@/shared/object/SharedObjects'
import {
  CURRENCY_CENTS_SCALE,
  DELIVERY_CONSOLE_MESSAGES,
  DELIVERY_FEE_CENTS,
  MAX_RECHARGE_AMOUNT_YUAN,
  MAX_WITHDRAW_AMOUNT_YUAN,
  parseMerchantWithdrawAmount,
  parseRechargeAmount,
} from '@/shared/delivery/DeliveryServices'
import { getDeliveryConsolePageViewDerived } from './DeliveryPageViewDerived'

type CheckoutSummaryArgs = {
  selectedStore: ReturnType<typeof getDeliveryConsolePageViewDerived>['selectedStore']
  selectedCustomer: ReturnType<typeof getDeliveryConsolePageViewDerived>['selectedCustomer']
  selectedStoreIsOpen: boolean
  quantities: Record<string, number>
  selectedCouponId: string
}

export function getCheckoutSummary(args: CheckoutSummaryArgs) {
  const {
    selectedStore,
    selectedCustomer,
    selectedStoreIsOpen,
    quantities,
    selectedCouponId,
  } = args
  const cartSubtotal = selectedStore
    ? selectedStore.menu.reduce(
        (sum: number, item: MenuItem) => sum + item.priceCents * (quantities[item.id] ?? 0),
        0,
      )
    : 0
  const cartTotal = cartSubtotal > 0 ? cartSubtotal + DELIVERY_FEE_CENTS : 0
  const availableCheckoutCoupons =
    selectedCustomer?.coupons.filter((coupon) => cartSubtotal >= coupon.minimumSpendCents) ?? []
  const selectedCoupon =
    availableCheckoutCoupons.find((coupon) => coupon.id === selectedCouponId) ?? null
  const couponDiscountCents =
    cartTotal > 0 && selectedCoupon ? Math.min(selectedCoupon.discountCents, cartTotal) : 0
  const payableTotalCents = Math.max(0, cartTotal - couponDiscountCents)
  const selectedStoreHasMenu = Boolean(
    selectedStore &&
      selectedStore.menu.some(
        (item: MenuItem) => item.remainingQuantity == null || item.remainingQuantity > 0,
      ),
  )

  return {
    cartSubtotal,
    cartTotal,
    availableCheckoutCoupons,
    selectedCoupon,
    couponDiscountCents,
    payableTotalCents,
    selectedStoreHasMenu,
    selectedStoreCanOrder: Boolean(selectedStore && selectedStoreHasMenu && selectedStoreIsOpen),
    remainingBalanceAfterCheckout:
      selectedCustomer && payableTotalCents > 0
        ? selectedCustomer.balanceCents - payableTotalCents
        : null,
  }
}

type PaymentFieldStateArgs = {
  customRechargeAmount: string
  selectedRechargeAmount: number | null
  rechargeFieldError: string | null
  merchantWithdrawAmount: string
  merchantWithdrawFieldError: string | null
  merchantProfile: ReturnType<typeof getDeliveryConsolePageViewDerived>['merchantProfile']
}

export function getPaymentFieldState(args: PaymentFieldStateArgs) {
  const {
    customRechargeAmount,
    selectedRechargeAmount,
    rechargeFieldError,
    merchantWithdrawAmount,
    merchantWithdrawFieldError,
    merchantProfile,
  } = args
  const parsedRechargeAmount = parseRechargeAmount(customRechargeAmount)
  const rechargeAmountError =
    parsedRechargeAmount !== null && parsedRechargeAmount > MAX_RECHARGE_AMOUNT_YUAN
      ? DELIVERY_CONSOLE_MESSAGES.rechargeAmountTooLarge
      : rechargeFieldError
  const parsedMerchantWithdrawAmount = parseMerchantWithdrawAmount(merchantWithdrawAmount)

  return {
    parsedRechargeAmount,
    rechargeAmountError,
    rechargeAmountPreview: parsedRechargeAmount ?? selectedRechargeAmount,
    merchantWithdrawError:
      parsedMerchantWithdrawAmount !== null &&
      parsedMerchantWithdrawAmount > MAX_WITHDRAW_AMOUNT_YUAN
        ? DELIVERY_CONSOLE_MESSAGES.withdrawAmountTooLarge
        : parsedMerchantWithdrawAmount !== null &&
            merchantProfile != null &&
            Math.round(parsedMerchantWithdrawAmount * CURRENCY_CENTS_SCALE) >
              merchantProfile.availableToWithdrawCents
          ? DELIVERY_CONSOLE_MESSAGES.withdrawExceedsAvailableBalance
          : merchantWithdrawFieldError,
  }
}
