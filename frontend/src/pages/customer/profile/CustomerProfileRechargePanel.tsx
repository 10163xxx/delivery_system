import type { CustomerRoleProps } from '@/shared/app/role-props'
import { Panel } from '@/shared/components/primitives/LayoutPrimitives'
import {
  CUSTOMER_PROFILE_COPY,
  CUSTOMER_PROFILE_RULES,
} from '@/pages/customer/profile/CustomerProfileCopy'

function ReturnToProfileButton({ navigate }: Pick<CustomerRoleProps, 'navigate'>) {
  return (
    <button className="secondary-button" onClick={() => navigate('/customer/profile')} type="button">
      返回个人信息
    </button>
  )
}

function RechargeBalancePreview({
  balanceCents,
  formatPrice,
  rechargeAmountPreview,
}: Pick<CustomerRoleProps, 'formatPrice' | 'rechargeAmountPreview'> & { balanceCents: number }) {
  const rechargeCents =
    rechargeAmountPreview !== null
      ? Math.round(rechargeAmountPreview * CUSTOMER_PROFILE_RULES.centsScale)
      : null

  return (
    <p className="meta-line" style={{ marginTop: CUSTOMER_PROFILE_COPY.rechargePreviewMarginTop }}>
      本次将充值{' '}
      <strong>
        {rechargeCents !== null ? formatPrice(rechargeCents) : CUSTOMER_PROFILE_COPY.noneDisplay}
      </strong>
      ，充值后余额预计为{' '}
      <strong>
        {rechargeCents !== null
          ? formatPrice(balanceCents + rechargeCents)
          : CUSTOMER_PROFILE_COPY.noneDisplay}
      </strong>
      。
    </p>
  )
}

export function CustomerProfileRechargePanel({ props }: { props: CustomerRoleProps }) {
  const {
    customRechargeAmount,
    formatPrice,
    navigate,
    parsedRechargeAmount,
    rechargeAmountError,
    selectedCustomer,
    selectedRechargeAmount,
    selectRechargeAmount,
    setCustomRechargeAmount,
    setError,
    setSelectedRechargeAmount,
    submitRechargeFromPage,
    RECHARGE_PRESET_AMOUNTS,
  } = props

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
          <div
            className="action-row"
            style={{ marginTop: CUSTOMER_PROFILE_COPY.sectionSpacing, flexWrap: 'wrap' }}
          >
            {RECHARGE_PRESET_AMOUNTS.map((amount: number) => (
              <button
                key={amount}
                className={selectedRechargeAmount === amount ? 'primary-button' : 'secondary-button'}
                onClick={() => selectRechargeAmount(amount)}
                type="button"
              >
                {selectedRechargeAmount === amount ? '已选' : '选择'} {amount} 元
              </button>
            ))}
          </div>
          <div className="form-grid" style={{ marginTop: CUSTOMER_PROFILE_COPY.sectionSpacing }}>
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
              {rechargeAmountError ? (
                <span className="field-error-text">{rechargeAmountError}</span>
              ) : null}
            </label>
          </div>
          <RechargeBalancePreview
            balanceCents={selectedCustomer.balanceCents}
            formatPrice={formatPrice}
            rechargeAmountPreview={props.rechargeAmountPreview}
          />
          <div className="action-row" style={{ marginTop: CUSTOMER_PROFILE_COPY.sectionSpacing }}>
            <ReturnToProfileButton navigate={navigate} />
            <button
              className="primary-button"
              disabled={parsedRechargeAmount === null || rechargeAmountError !== null}
              onClick={() => void submitRechargeFromPage()}
              type="button"
            >
              确认充值
            </button>
          </div>
        </section>
      ) : null}
    </Panel>
  )
}
