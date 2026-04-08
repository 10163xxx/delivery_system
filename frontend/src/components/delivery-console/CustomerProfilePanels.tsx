import {
  CURRENCY_CENTS_SCALE,
  MEMBER_AUTO_DISPATCH_MINUTES,
  STANDARD_AUTO_DISPATCH_MINUTES,
} from '@/features/delivery-console'
import { Panel } from '@/components/delivery-console/LayoutPrimitives'

export function CustomerProfilePanels(props: any) {
  const {
    customerWorkspaceView,
    selectedCustomer,
    RECHARGE_PRESET_AMOUNTS,
    selectedRechargeAmount,
    selectRechargeAmount,
    customRechargeAmount,
    setCustomRechargeAmount,
    setSelectedRechargeAmount,
    rechargeAmountError,
    setError,
    rechargeAmountPreview,
    formatPrice,
    navigate,
    submitRechargeFromPage,
    addressFormErrors,
    addressDraft,
    setAddressDraft,
    setAddressFormErrors,
    addCustomerAddress,
    setDefaultCustomerAddress,
    removeCustomerAddress,
    openRechargePage,
  } = props

  if (customerWorkspaceView === 'recharge') {
    return (
      <Panel title="账户充值" description="选择快捷金额或输入自定义金额，充值成功后将返回顾客信息页。">
        {selectedCustomer ? (
          <section className="review-page-panel">
            <div className="summary-bar">
              <div>
                <p>当前余额</p>
                <strong>{formatPrice(selectedCustomer.balanceCents)}</strong>
              </div>
              <div>
                <p>快捷金额</p>
                <strong>{RECHARGE_PRESET_AMOUNTS.join(' / ')} 元</strong>
              </div>
            </div>
            <div className="action-row" style={{ marginTop: '20px', flexWrap: 'wrap' }}>
              {RECHARGE_PRESET_AMOUNTS.map((amount: number) => (
                <button key={amount} className={selectedRechargeAmount === amount ? 'primary-button' : 'secondary-button'} onClick={() => selectRechargeAmount(amount)} type="button">
                  {selectedRechargeAmount === amount ? '已选' : '选择'} {amount} 元
                </button>
              ))}
            </div>
            <div className="form-grid" style={{ marginTop: '20px' }}>
              <label className="full">
                <span>自定义金额</span>
                <input
                  className={rechargeAmountError ? 'field-error' : undefined}
                  inputMode="decimal"
                  placeholder="输入充值金额，例如 88.8"
                  value={customRechargeAmount}
                  onChange={(event) => {
                    setCustomRechargeAmount(event.target.value)
                    setSelectedRechargeAmount(null)
                    setError(null)
                  }}
                />
                {rechargeAmountError ? <span className="field-error-text">{rechargeAmountError}</span> : null}
              </label>
            </div>
            <p className="meta-line" style={{ marginTop: '16px' }}>
              本次将充值 <strong>{rechargeAmountPreview !== null ? formatPrice(Math.round(rechargeAmountPreview * CURRENCY_CENTS_SCALE)) : '--'}</strong>
              ，充值后余额预计为 <strong>{rechargeAmountPreview !== null ? formatPrice(selectedCustomer.balanceCents + Math.round(rechargeAmountPreview * CURRENCY_CENTS_SCALE)) : '--'}</strong>。
            </p>
            <div className="action-row" style={{ marginTop: '20px' }}>
              <button className="secondary-button" onClick={() => navigate('/customer/profile')} type="button">
                返回个人信息
              </button>
              <button className="primary-button" disabled={props.parsedRechargeAmount === null || rechargeAmountError !== null} onClick={() => void submitRechargeFromPage()} type="button">
                确认充值
              </button>
            </div>
          </section>
        ) : null}
      </Panel>
    )
  }

  if (customerWorkspaceView === 'coupons') {
    return (
      <Panel title="我的优惠券" description="在个人信息内查看可用优惠券与使用门槛。">
        {selectedCustomer ? (
          <>
            <div className="summary-bar">
              <div>
                <p>当前账号</p>
                <strong>{selectedCustomer.name}</strong>
              </div>
              <div>
                <p>优惠券数量</p>
                <strong>{selectedCustomer.coupons.length}</strong>
              </div>
              <div>
                <p>账户余额</p>
                <strong>{formatPrice(selectedCustomer.balanceCents)}</strong>
              </div>
              <button className="secondary-button" onClick={() => navigate('/customer/profile')} type="button">
                返回个人信息
              </button>
            </div>
            <div className="ticket-grid">
              {selectedCustomer.coupons.length === 0 ? (
                <div className="empty-card">当前没有可用优惠券。</div>
              ) : (
                selectedCustomer.coupons.map((coupon: any) => (
                  <article key={coupon.id} className="ticket-card">
                    <div className="ticket-header">
                      <div>
                        <p className="ticket-kind">优惠券</p>
                        <h3>{coupon.title}</h3>
                      </div>
                      <span className="badge success">{formatPrice(coupon.discountCents)}</span>
                    </div>
                    <p>{coupon.description}</p>
                    <p className="meta-line">满 {formatPrice(coupon.minimumSpendCents)} 可用 · 到期 {props.formatTime(coupon.expiresAt)}</p>
                  </article>
                ))
              )}
            </div>
          </>
        ) : null}
      </Panel>
    )
  }

  if (customerWorkspaceView === 'addresses') {
    return (
      <Panel title="地址管理" description="把常用地址维护独立出来，个人信息页只保留摘要。">
        {selectedCustomer ? (
          <>
            <div className="summary-bar">
              <div>
                <p>默认地址</p>
                <strong>{selectedCustomer.defaultAddress}</strong>
              </div>
              <div>
                <p>地址数量</p>
                <strong>{selectedCustomer.addresses.length}</strong>
              </div>
              <button className="secondary-button" onClick={() => navigate('/customer/profile')} type="button">
                返回个人信息
              </button>
            </div>
            <div className="form-grid">
              <label>
                <span>地址标签</span>
                <input
                  className={addressFormErrors.label ? 'field-error' : undefined}
                  value={addressDraft.label}
                  onChange={(event) => {
                    setAddressDraft((current: any) => ({ ...current, label: event.target.value }))
                    setAddressFormErrors((current: any) => ({ ...current, label: undefined }))
                  }}
                />
                {addressFormErrors.label ? <span className="field-error-text">{addressFormErrors.label}</span> : null}
              </label>
              <label className="full">
                <span>新增地址</span>
                <input
                  className={addressFormErrors.address ? 'field-error' : undefined}
                  value={addressDraft.address}
                  onChange={(event) => {
                    setAddressDraft((current: any) => ({ ...current, address: event.target.value }))
                    setAddressFormErrors((current: any) => ({ ...current, address: undefined }))
                  }}
                />
                {addressFormErrors.address ? <span className="field-error-text">{addressFormErrors.address}</span> : null}
              </label>
            </div>
            <div className="summary-bar">
              <button className="secondary-button" onClick={() => void addCustomerAddress()} type="button">
                添加地址
              </button>
            </div>
            <div className="ticket-grid">
              {selectedCustomer.addresses.map((address: any) => (
                <article key={`${address.label}-${address.address}`} className="ticket-card">
                  <div className="ticket-header">
                    <div>
                      <p className="ticket-kind">地址簿</p>
                      <h3>{address.label}</h3>
                    </div>
                    <span className="badge">{address.address === selectedCustomer.defaultAddress ? '默认' : '已保存'}</span>
                  </div>
                  <p>{address.address}</p>
                  <div className="action-row" style={{ marginTop: '16px' }}>
                    {address.address !== selectedCustomer.defaultAddress ? (
                      <button className="secondary-button" onClick={() => void setDefaultCustomerAddress(address.address)} type="button">
                        设为默认
                      </button>
                    ) : null}
                    <button className="secondary-button" disabled={address.address === selectedCustomer.defaultAddress} onClick={() => void removeCustomerAddress(address.address)} type="button">
                      删除地址
                    </button>
                  </div>
                  {address.address === selectedCustomer.defaultAddress ? <p className="meta-line" style={{ marginTop: '12px' }}>如需删除当前默认地址，请先把其他地址设为默认。</p> : null}
                </article>
              ))}
            </div>
          </>
        ) : null}
      </Panel>
    )
  }

  return (
    <Panel title="顾客信息" description="查看个人资料、会员状态、优惠券和地址簿。">
      {selectedCustomer ? (
        <>
          <div className="form-grid">
            <label>
              <span>匿名编号</span>
              <input value={selectedCustomer.name} disabled />
            </label>
            <label>
              <span>手机号</span>
              <input value={selectedCustomer.phone} disabled />
            </label>
          </div>
          <div className="summary-bar">
            <div>
              <p>账户余额</p>
              <strong>{formatPrice(selectedCustomer.balanceCents)}</strong>
            </div>
            <div>
              <p>会员等级</p>
              <strong>{selectedCustomer.membershipTier === 'Member' ? '会员' : '普通'}</strong>
            </div>
            <div>
              <p>近 30 天消费</p>
              <strong>{formatPrice(selectedCustomer.monthlySpendCents)}</strong>
            </div>
            <div>
              <p>自动派单时限</p>
              <strong>{selectedCustomer.membershipTier === 'Member' ? `${MEMBER_AUTO_DISPATCH_MINUTES} 分钟` : `${STANDARD_AUTO_DISPATCH_MINUTES} 分钟`}</strong>
            </div>
            <button className="secondary-button" onClick={() => openRechargePage()} type="button">
              充值
            </button>
            <button className="secondary-button" onClick={() => navigate('/customer/profile/coupons')} type="button">
              优惠券
            </button>
            <button className="secondary-button" onClick={() => navigate('/customer/profile/addresses')} type="button">
              地址管理
            </button>
          </div>
          <div className="summary-bar">
            <div>
              <p>地址数量</p>
              <strong>{selectedCustomer.addresses.length}</strong>
            </div>
            <div>
              <p>默认地址</p>
              <strong>{selectedCustomer.defaultAddress}</strong>
            </div>
            <button className="secondary-button" onClick={() => navigate('/customer/profile/addresses')} type="button">
              管理地址
            </button>
          </div>
        </>
      ) : null}
    </Panel>
  )
}
