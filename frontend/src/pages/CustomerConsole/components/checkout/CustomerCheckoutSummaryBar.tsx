import type { CheckoutPanelProps } from '@/pages/CustomerConsole/objects/CustomerCheckoutObjects'
import {
  CUSTOMER_CHECKOUT_COPY,
  getCheckoutPrimaryActionLabel,
} from '@/pages/CustomerConsole/components/checkout/CustomerCheckoutCopy'

export function CustomerCheckoutSummaryBar(props: CheckoutPanelProps) {
  const {
    availableCheckoutCoupons,
    cartSubtotal,
    customerRequiresDefaultAddressUpdate,
    deliveryFeeCents,
    deliveryAddressIsLocated,
    deliveryAddressIsLocating,
    formatPrice,
    openCheckout,
    payableTotalCents,
    selectedCustomer,
    selectedStore,
  } = props

  return (
    <div className="summary-bar">
      <div>
        <p>{CUSTOMER_CHECKOUT_COPY.payment.subtotalTitle}</p>
        <strong>{formatPrice(cartSubtotal)}</strong>
      </div>
      <div>
        <p>{CUSTOMER_CHECKOUT_COPY.payment.deliveryFeeTitle}</p>
        <strong>
          {cartSubtotal > 0 ? formatPrice(deliveryFeeCents) : CUSTOMER_CHECKOUT_COPY.payment.noneDisplay}
        </strong>
      </div>
      <div>
        <p>{CUSTOMER_CHECKOUT_COPY.payment.orderAmountTitle}</p>
        <strong>{formatPrice(payableTotalCents)}</strong>
      </div>
      <div>
        <p>{CUSTOMER_CHECKOUT_COPY.payment.walletBalanceTitle}</p>
        <strong>{formatPrice(selectedCustomer?.balanceCents ?? 0)}</strong>
      </div>
      <div>
        <p>{CUSTOMER_CHECKOUT_COPY.coupon.couponFieldTitle}</p>
        <strong>{availableCheckoutCoupons.length} 张</strong>
      </div>
      <button
        className="primary-button"
        disabled={!selectedStore}
        onClick={() => openCheckout()}
        type="button"
      >
        {getCheckoutPrimaryActionLabel(props)}
      </button>
      {customerRequiresDefaultAddressUpdate ? (
        <div className="banner error">{CUSTOMER_CHECKOUT_COPY.address.addressPlaceholderError}</div>
      ) : null}
      {deliveryAddressIsLocating ? (
        <div className="banner warning">{CUSTOMER_CHECKOUT_COPY.address.locatingAddress}</div>
      ) : null}
      {!deliveryAddressIsLocating && deliveryAddressIsLocated === false ? (
        <div className="banner error">{CUSTOMER_CHECKOUT_COPY.address.unlocatedAddress}</div>
      ) : null}
    </div>
  )
}
