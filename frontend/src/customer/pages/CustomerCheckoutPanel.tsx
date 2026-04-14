import type { CustomerRoleProps } from '@/shared/app-build-role-props'
import { STORE_STATUS, type AddressEntry, type Coupon, type MenuItem } from '@/shared/object'
import { MIN_SCHEDULE_LEAD_MINUTES } from '@/shared/delivery'

export function CustomerCheckoutPanel(props: CustomerRoleProps) {
  const {
    selectedStore,
    selectedCustomer,
    quantities,
    updateQuantity,
    formatPrice,
    cartSubtotal,
    DELIVERY_FEE_CENTS,
    payableTotalCents,
    availableCheckoutCoupons,
    selectedStoreCanOrder,
    selectedStoreHasMenu,
    openCheckout,
    isCheckoutExpanded,
    setIsCheckoutExpanded,
    deliveryAddress,
    setDeliveryAddress,
    deliveryAddressError,
    setDeliveryAddressError,
    scheduledDeliveryTime,
    setScheduledDeliveryTime,
    scheduledDeliveryError,
    setScheduledDeliveryError,
    setScheduledDeliveryTouched,
    setError,
    todayDeliveryCutoff,
    suggestedDeliveryTime,
    remark,
    setRemark,
    selectedCouponId,
    setSelectedCouponId,
    selectedCoupon,
    couponDiscountCents,
    remainingBalanceAfterCheckout,
    openRechargePage,
    submitOrder,
    isStoreCurrentlyOpen,
  } = props

  if (!selectedStore) return null

  return (
    <>
      {selectedStore.menu.length > 0 ? (
        <div className="menu-grid">
          {selectedStore.menu.map((item: MenuItem) => (
            <article key={item.id} className="menu-card">
              <div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                {item.remainingQuantity != null ? (
                  <p className="meta-line">
                    {item.remainingQuantity > 0 ? `限量供应，剩余 ${item.remainingQuantity} 份` : '当前已售罄'}
                  </p>
                ) : null}
              </div>
              <div className="menu-footer">
                <strong>{formatPrice(item.priceCents)}</strong>
                <div className="stepper">
                  <button type="button" onClick={() => updateQuantity(item, (quantities[item.id] ?? 0) - 1)}>
                    -
                  </button>
                  <span>{quantities[item.id] ?? 0}</span>
                  <button
                    type="button"
                    disabled={item.remainingQuantity != null && (quantities[item.id] ?? 0) >= item.remainingQuantity}
                    onClick={() => updateQuantity(item, (quantities[item.id] ?? 0) + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      <div className="summary-bar">
        <div>
          <p>餐品金额</p>
          <strong>{formatPrice(cartSubtotal)}</strong>
        </div>
        <div>
          <p>配送费</p>
          <strong>{cartSubtotal > 0 ? formatPrice(DELIVERY_FEE_CENTS) : '--'}</strong>
        </div>
        <div>
          <p>订单金额</p>
          <strong>{formatPrice(payableTotalCents)}</strong>
        </div>
        <div>
          <p>账户余额</p>
          <strong>{formatPrice(selectedCustomer?.balanceCents ?? 0)}</strong>
        </div>
        <div>
          <p>可用优惠券</p>
          <strong>{availableCheckoutCoupons.length} 张</strong>
        </div>
        <button className="primary-button" disabled={!selectedStoreCanOrder} onClick={() => openCheckout()} type="button">
          {selectedStore.status === STORE_STATUS.revoked
            ? '当前不可下单'
            : !isStoreCurrentlyOpen(selectedStore)
              ? '非营业时间'
              : selectedStoreHasMenu
                ? '提交订单'
                : '暂无菜品可下单'}
        </button>
      </div>

      {isCheckoutExpanded ? (
        <section className="checkout-panel">
          <div className="checkout-panel-header">
            <div>
              <p className="ticket-kind">结算台</p>
              <h3>确认订单并完成余额支付</h3>
              <p className="meta-line">不离开当前页面，直接填写配送信息并确认支付。</p>
            </div>
            <button className="secondary-button" onClick={() => setIsCheckoutExpanded(false)} type="button">
              收起
            </button>
          </div>

          <div className="form-grid">
            <label className="full">
              <span>配送地址</span>
              <input
                className={deliveryAddressError ? 'field-error' : undefined}
                list="customer-address-options"
                value={deliveryAddress}
                onChange={(event) => {
                  setDeliveryAddress(event.target.value)
                  if (deliveryAddressError) {
                    setDeliveryAddressError(null)
                  }
                }}
              />
              {deliveryAddressError ? <span className="field-error-text">{deliveryAddressError}</span> : null}
              <datalist id="customer-address-options">
                {selectedCustomer?.addresses.map((address: AddressEntry) => (
                  <option key={`${address.label}-${address.address}`} value={address.address}>
                    {address.label}
                  </option>
                ))}
              </datalist>
            </label>
            <label className="full">
              <span>配送时间</span>
              <input
                className={scheduledDeliveryError ? 'field-error' : undefined}
                max={todayDeliveryCutoff}
                min={suggestedDeliveryTime}
                type="datetime-local"
                value={scheduledDeliveryTime}
                onChange={(event) => {
                  setScheduledDeliveryTime(event.target.value)
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
                <p className="meta-line">仅可预约今天内的配送时间，且不得早于下单后 {MIN_SCHEDULE_LEAD_MINUTES} 分钟。</p>
              )}
            </label>
            <label className="full">
              <span>订单备注</span>
              <input placeholder="比如少辣、放门口" value={remark} onChange={(event) => setRemark(event.target.value)} />
            </label>
            <label className="full">
              <span>优惠券</span>
              <select value={selectedCouponId} onChange={(event) => setSelectedCouponId(event.target.value)}>
                <option value="">不使用优惠券</option>
                {availableCheckoutCoupons.map((coupon: Coupon) => (
                  <option key={coupon.id} value={coupon.id}>
                    {coupon.title} · 满 {formatPrice(coupon.minimumSpendCents)} 可用 · 抵扣 {formatPrice(coupon.discountCents)}
                  </option>
                ))}
              </select>
              {selectedCoupon ? (
                <p className="meta-line">已选 {selectedCoupon.title}，本单可抵扣 {formatPrice(couponDiscountCents)}。</p>
              ) : availableCheckoutCoupons.length > 0 ? (
                <p className="meta-line">当前有可用优惠券，可在这里选择后抵扣。</p>
              ) : (
                <p className="meta-line">当前没有满足本单金额门槛的优惠券。</p>
              )}
            </label>
            <div className="full summary-bar checkout-summary">
              <div>
                <p>店铺</p>
                <strong>{selectedStore.name}</strong>
              </div>
              <div>
                <p>餐品金额</p>
                <strong>{formatPrice(cartSubtotal)}</strong>
              </div>
              <div>
                <p>配送费</p>
                <strong>{cartSubtotal > 0 ? formatPrice(DELIVERY_FEE_CENTS) : '--'}</strong>
              </div>
              <div>
                <p>优惠券抵扣</p>
                <strong>{couponDiscountCents > 0 ? `-${formatPrice(couponDiscountCents)}` : '--'}</strong>
              </div>
              <div>
                <p>实付金额</p>
                <strong>{formatPrice(payableTotalCents)}</strong>
              </div>
              <div>
                <p>账户余额</p>
                <strong>{formatPrice(selectedCustomer?.balanceCents ?? 0)}</strong>
              </div>
              <div>
                <p>支付后余额</p>
                <strong>{remainingBalanceAfterCheckout !== null ? formatPrice(Math.max(remainingBalanceAfterCheckout, 0)) : '--'}</strong>
              </div>
            </div>
            <div className="full summary-bar checkout-summary">
              <div>
                <p>付款方式</p>
                <strong>账户余额支付</strong>
              </div>
              <div>
                <p>支付状态</p>
                <strong>{selectedCustomer && selectedCustomer.balanceCents >= payableTotalCents ? '余额充足' : '余额不足'}</strong>
              </div>
            </div>
            {selectedCustomer && selectedCustomer.balanceCents < payableTotalCents ? (
              <div className="banner error">当前余额不足，先到“顾客信息”页充值后再提交订单。</div>
            ) : null}
            <div className="checkout-actions">
              <button className="secondary-button" onClick={() => openRechargePage()} type="button">
                去充值
              </button>
              <button
                className="primary-button"
                disabled={!selectedCustomer || !selectedStoreCanOrder || selectedCustomer.balanceCents < payableTotalCents}
                onClick={() => void submitOrder()}
                type="button"
              >
                余额支付并提交
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}
