import type { CustomerRoleProps } from '@/pages/delivery/app/roleProps'
import { Panel } from '@/components/primitives/LayoutPrimitives'
import { ROUTE_PATH, type DisplayText } from '@/objects/core/SharedObjects'
import {
  CUSTOMER_PROFILE_COPY,
  CUSTOMER_PROFILE_RULES,
} from '@/pages/customer/profile/CustomerProfileCopy'
import { asDomainText } from '@/features/delivery/DeliveryShared'

function ReturnToProfileButton({ navigate }: Pick<CustomerRoleProps, 'navigate'>) {
  return (
    <button className="secondary-button" onClick={() => navigate(ROUTE_PATH.customerProfile)} type="button">
      {CUSTOMER_PROFILE_COPY.returnToProfileButton}
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
      {CUSTOMER_PROFILE_COPY.rechargeConfirmPreview}
      {' '}
      <strong>
        {rechargeCents !== null ? formatPrice(rechargeCents) : CUSTOMER_PROFILE_COPY.noneDisplay}
      </strong>
      {CUSTOMER_PROFILE_COPY.rechargeEstimatedBalanceSuffix}
      {' '}
      <strong>
        {rechargeCents !== null
          ? formatPrice(balanceCents + rechargeCents)
          : CUSTOMER_PROFILE_COPY.noneDisplay}
      </strong>
      {CUSTOMER_PROFILE_COPY.previewSentenceSuffix}
    </p>
  )
}

export function CustomerProfileRechargePanel({ props }: { props: CustomerRoleProps }) {
  const {
    customRechargeAmount,
    formatPrice,
    navigate,
    rechargeAmountError,
    rechargeAmountPreview,
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
    <Panel
      title={CUSTOMER_PROFILE_COPY.rechargeTitle}
      description={CUSTOMER_PROFILE_COPY.rechargeDescription}
    >
      {selectedCustomer ? (
        <section className="review-page-panel">
          <div className="summary-bar">
            <div>
              <p>{CUSTOMER_PROFILE_COPY.currentBalanceLabel}</p>
              <strong>{formatPrice(selectedCustomer.balanceCents)}</strong>
            </div>
            <div>
              <p>{CUSTOMER_PROFILE_COPY.quickAmountsLabel}</p>
              <strong>
                {RECHARGE_PRESET_AMOUNTS.join(' / ')}
                {CUSTOMER_PROFILE_COPY.rechargePresetAmountSuffix}
              </strong>
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
                {selectedRechargeAmount === amount
                  ? CUSTOMER_PROFILE_COPY.rechargeSelectSelectedPrefix
                  : CUSTOMER_PROFILE_COPY.rechargeSelectIdlePrefix}
                {' '}
                {amount}
                {CUSTOMER_PROFILE_COPY.rechargePresetAmountSuffix}
              </button>
            ))}
          </div>
          <div className="form-grid" style={{ marginTop: CUSTOMER_PROFILE_COPY.sectionSpacing }}>
            <label className="full">
              <span>{CUSTOMER_PROFILE_COPY.customAmountLabel}</span>
              <input
                className={rechargeAmountError ? 'field-error' : undefined}
                inputMode="decimal"
                placeholder={CUSTOMER_PROFILE_COPY.customAmountPlaceholder}
                value={customRechargeAmount}
                onChange={(event) => {
                  setCustomRechargeAmount(asDomainText<DisplayText>(event.target.value))
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
              disabled={rechargeAmountPreview === null || rechargeAmountError !== null}
              onClick={() => void submitRechargeFromPage()}
              type="button"
            >
              {CUSTOMER_PROFILE_COPY.rechargeConfirmButton}
            </button>
          </div>
        </section>
      ) : null}
    </Panel>
  )
}
