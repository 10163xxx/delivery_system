import type { CheckoutPanelProps } from '@/pages/customer/objects/CustomerPageObjects'
import type {
  AddressEntry,
  AddressText,
  Coupon,
  CouponId,
  DisplayText,
  IsoDateTime,
} from '@/objects/core/SharedObjects'
import { asDomainText } from '@/features/delivery/DeliveryShared'
import {
  canBalancePay,
  CUSTOMER_CHECKOUT_COPY,
  CUSTOMER_CHECKOUT_FIELDS,
  getCouponHint,
} from '@/pages/customer/checkout/CustomerCheckoutCopy'

export function CustomerCheckoutFormFields(props: CheckoutPanelProps) {
  const {
    availableCheckoutCoupons,
    deliveryAddress,
    deliveryAddressError,
    formatPrice,
    remark,
    scheduledDeliveryError,
    scheduledDeliveryTime,
    selectedCouponId,
    selectedCustomer,
    setDeliveryAddress,
    setDeliveryAddressError,
    setError,
    setRemark,
    setScheduledDeliveryError,
    setScheduledDeliveryTime,
    setScheduledDeliveryTouched,
    setSelectedCouponId,
    suggestedDeliveryTime,
    todayDeliveryCutoff,
  } = props

  return (
    <>
      <label className="full">
        <span>{CUSTOMER_CHECKOUT_COPY.address.deliveryAddressTitle}</span>
        <input
          className={deliveryAddressError ? 'field-error' : undefined}
          list={CUSTOMER_CHECKOUT_FIELDS.customerAddressOptionsId}
          value={deliveryAddress}
          onChange={(event) => {
            setDeliveryAddress(asDomainText<AddressText>(event.target.value))
            if (deliveryAddressError) setDeliveryAddressError(null)
          }}
        />
        {deliveryAddressError ? <span className="field-error-text">{deliveryAddressError}</span> : null}
        <datalist id={CUSTOMER_CHECKOUT_FIELDS.customerAddressOptionsId}>
          {selectedCustomer?.addresses.map((address: AddressEntry) => (
            <option key={`${address.label}-${address.address}`} value={address.address}>
              {address.label}
            </option>
          ))}
        </datalist>
      </label>
      <label className="full">
        <span>{CUSTOMER_CHECKOUT_COPY.schedule.deliveryTimeTitle}</span>
        <input
          className={scheduledDeliveryError ? 'field-error' : undefined}
          max={todayDeliveryCutoff}
          min={suggestedDeliveryTime}
          type="datetime-local"
          value={scheduledDeliveryTime}
          onChange={(event) => {
            setScheduledDeliveryTime(asDomainText<IsoDateTime>(event.target.value))
            setScheduledDeliveryTouched(true)
            if (scheduledDeliveryError) {
              setScheduledDeliveryError(null)
              setError(null)
            }
          }}
        />
        {scheduledDeliveryError ? (
          <span className="field-error-text">{scheduledDeliveryError}</span>
        ) : (
          <p className="meta-line">{CUSTOMER_CHECKOUT_COPY.schedule.scheduleHint}</p>
        )}
      </label>
      <label className="full">
        <span>{CUSTOMER_CHECKOUT_COPY.remark.orderRemarkTitle}</span>
        <input
          placeholder={CUSTOMER_CHECKOUT_COPY.remark.orderRemarkPlaceholder}
          value={remark}
          onChange={(event) => setRemark(asDomainText<DisplayText>(event.target.value))}
        />
      </label>
      <label className="full">
        <span>{CUSTOMER_CHECKOUT_COPY.coupon.couponFieldTitle}</span>
        <select
          value={selectedCouponId}
          onChange={(event) => setSelectedCouponId(event.target.value ? asDomainText<CouponId>(event.target.value) : '')}
        >
          <option value="">{CUSTOMER_CHECKOUT_COPY.coupon.removeCoupon}</option>
          {availableCheckoutCoupons.map((coupon: Coupon) => (
            <option key={coupon.id} value={coupon.id}>
              {coupon.title} · 满 {formatPrice(coupon.minimumSpendCents)} 可用 · 抵扣 {formatPrice(coupon.discountCents)}
            </option>
          ))}
        </select>
        <p className="meta-line">{getCouponHint(props)}</p>
      </label>
    </>
  )
}

export function CustomerCheckoutPriceSummary(props: CheckoutPanelProps) {
  const {
    cartSubtotal,
    couponDiscountCents,
    deliveryFeeCents,
    formatPrice,
    payableTotalCents,
    remainingBalanceAfterCheckout,
    selectedCustomer,
    selectedStore,
  } = props

  return (
    <div className="full summary-bar checkout-summary">
      <div><p>{CUSTOMER_CHECKOUT_COPY.payment.payStoreTitle}</p><strong>{selectedStore?.name}</strong></div>
      <div><p>{CUSTOMER_CHECKOUT_COPY.payment.subtotalTitle}</p><strong>{formatPrice(cartSubtotal)}</strong></div>
      <div><p>{CUSTOMER_CHECKOUT_COPY.payment.deliveryFeeTitle}</p><strong>{cartSubtotal > 0 ? formatPrice(deliveryFeeCents) : CUSTOMER_CHECKOUT_COPY.payment.noneDisplay}</strong></div>
      <div><p>{CUSTOMER_CHECKOUT_COPY.coupon.couponDiscountTitle}</p><strong>{couponDiscountCents > 0 ? `-${formatPrice(couponDiscountCents)}` : CUSTOMER_CHECKOUT_COPY.payment.noneDisplay}</strong></div>
      <div><p>{CUSTOMER_CHECKOUT_COPY.payment.orderAmountTitle}</p><strong>{formatPrice(payableTotalCents)}</strong></div>
      <div><p>{CUSTOMER_CHECKOUT_COPY.payment.walletBalanceTitle}</p><strong>{formatPrice(selectedCustomer?.balanceCents ?? 0)}</strong></div>
      <div><p>{CUSTOMER_CHECKOUT_COPY.payment.payAfterBalanceTitle}</p><strong>{remainingBalanceAfterCheckout !== null ? formatPrice(Math.max(remainingBalanceAfterCheckout, 0)) : CUSTOMER_CHECKOUT_COPY.payment.noneDisplay}</strong></div>
    </div>
  )
}

export function CustomerCheckoutPaymentSummary(props: CheckoutPanelProps) {
  const balanceEnough = Boolean(props.selectedCustomer && props.selectedCustomer.balanceCents >= props.payableTotalCents)

  return (
    <>
      <div className="full summary-bar checkout-summary">
        <div><p>{CUSTOMER_CHECKOUT_COPY.payment.paymentMethodTitle}</p><strong>{CUSTOMER_CHECKOUT_COPY.payment.balancePayMethod}</strong></div>
        <div><p>{CUSTOMER_CHECKOUT_COPY.payment.payStatusTitle}</p><strong>{balanceEnough ? CUSTOMER_CHECKOUT_COPY.payment.balanceStatusEnough : CUSTOMER_CHECKOUT_COPY.payment.balanceStatusInsufficient}</strong></div>
      </div>
      {!balanceEnough ? <div className="banner error">{CUSTOMER_CHECKOUT_COPY.payment.balanceInsufficient}</div> : null}
      {props.customerRequiresDefaultAddressUpdate ? <div className="banner error">{CUSTOMER_CHECKOUT_COPY.address.unavailableAddress}</div> : null}
      {props.deliveryAddressIsLocating ? <div className="banner warning">{CUSTOMER_CHECKOUT_COPY.address.locatingAddress}</div> : null}
      {!props.deliveryAddressIsLocating && props.deliveryAddressIsLocated === false ? <div className="banner error">{CUSTOMER_CHECKOUT_COPY.address.unlocatedAddress}</div> : null}
    </>
  )
}

export function CustomerCheckoutActionBar(props: CheckoutPanelProps) {
  return (
    <div className="checkout-actions">
      <button className="secondary-button" onClick={() => props.openRechargePage()} type="button">
        {CUSTOMER_CHECKOUT_COPY.payment.rechargeAction}
      </button>
      <button
        className="primary-button"
        disabled={!canBalancePay(props)}
        onClick={() => void props.submitOrder()}
        type="button"
      >
        {CUSTOMER_CHECKOUT_COPY.payment.balancePay}
      </button>
    </div>
  )
}
