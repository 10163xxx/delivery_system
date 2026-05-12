import type { MenuItem } from '@/shared/object/core/SharedObjects'
import {
  CURRENCY_CENTS_SCALE,
  DELIVERY_CONSOLE_MESSAGES,
  DELIVERY_FEE_CENTS,
  MAX_RECHARGE_AMOUNT_YUAN,
  MAX_WITHDRAW_AMOUNT_YUAN,
  parseMerchantWithdrawAmount,
  parseRechargeAmount,
} from '@/shared/delivery/DeliveryServices'
import type {
  CheckoutSummaryArgs,
  PaymentFieldStateArgs,
} from '@/shared/object/core/DeliveryPageViewCheckoutObjects'

export function getCheckoutSummary(args: CheckoutSummaryArgs) {
  const {
    selectedStore,
    selectedCustomer,
    selectedStoreIsOpen,
    customerRequiresDefaultAddressUpdate,
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
    selectedCustomer?.coupons.filter((coupon: NonNullable<typeof selectedCustomer>['coupons'][number]) => cartSubtotal >= coupon.minimumSpendCents) ?? []
  const selectedCoupon =
    availableCheckoutCoupons.find((coupon: NonNullable<typeof selectedCustomer>['coupons'][number]) => coupon.id === selectedCouponId) ?? null
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
    selectedStoreCanOrder: Boolean(
      selectedStore &&
        selectedStoreHasMenu &&
        selectedStoreIsOpen &&
        !customerRequiresDefaultAddressUpdate,
    ),
    remainingBalanceAfterCheckout:
      selectedCustomer && payableTotalCents > 0
        ? selectedCustomer.balanceCents - payableTotalCents
        : null,
  }
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
      ? DELIVERY_CONSOLE_MESSAGES.account.rechargeAmountTooLarge
      : rechargeFieldError
  const parsedMerchantWithdrawAmount = parseMerchantWithdrawAmount(merchantWithdrawAmount)

  return {
    parsedRechargeAmount,
    rechargeAmountError,
    rechargeAmountPreview: parsedRechargeAmount ?? selectedRechargeAmount,
    merchantWithdrawError:
      parsedMerchantWithdrawAmount !== null &&
      parsedMerchantWithdrawAmount > MAX_WITHDRAW_AMOUNT_YUAN
        ? DELIVERY_CONSOLE_MESSAGES.account.withdrawAmountTooLarge
        : parsedMerchantWithdrawAmount !== null &&
            merchantProfile != null &&
            Math.round(parsedMerchantWithdrawAmount * CURRENCY_CENTS_SCALE) >
              merchantProfile.availableToWithdrawCents
          ? DELIVERY_CONSOLE_MESSAGES.account.withdrawExceedsAvailableBalance
          : merchantWithdrawFieldError,
  }
}
