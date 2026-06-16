import type { CustomerRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import { Panel } from '@/pages/DeliveryConsole/components/primitives/LayoutPrimitives'
import { ROUTE_PATH, type DisplayText } from '@/objects/core/SharedObjects'
import {
  CUSTOMER_PROFILE_COPY,
  CUSTOMER_PROFILE_RULES,
} from '@/pages/CustomerConsole/components/profile/CustomerProfileCopy'
import { asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'

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

function RechargeSummaryBar({
  formatPrice,
  presetAmounts,
  selectedCustomer,
}: Pick<CustomerRoleProps, 'formatPrice' | 'selectedCustomer'> & { presetAmounts: readonly number[] }) {
  if (!selectedCustomer) return null

  return (
    <div className="summary-bar">
      <div>
        <p>{CUSTOMER_PROFILE_COPY.currentBalanceLabel}</p>
        <strong>{formatPrice(selectedCustomer.balanceCents)}</strong>
      </div>
      <div>
        <p>{CUSTOMER_PROFILE_COPY.quickAmountsLabel}</p>
        <strong>
          {presetAmounts.join(' / ')}
          {CUSTOMER_PROFILE_COPY.rechargePresetAmountSuffix}
        </strong>
      </div>
    </div>
  )
}

function RechargePresetButtons({
  presetAmounts,
  selectedRechargeAmount,
  selectRechargeAmount,
}: Pick<CustomerRoleProps, 'selectedRechargeAmount' | 'selectRechargeAmount'> & { presetAmounts: readonly number[] }) {
  return (
    <div
      className="action-row"
      style={{ marginTop: CUSTOMER_PROFILE_COPY.sectionSpacing, flexWrap: 'wrap' }}
    >
      {presetAmounts.map((amount: number) => (
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
  )
}

function CustomRechargeAmountField({
  customRechargeAmount,
  rechargeAmountError,
  setCustomRechargeAmount,
  setError,
  setSelectedRechargeAmount,
}: Pick<
  CustomerRoleProps,
  | 'customRechargeAmount'
  | 'rechargeAmountError'
  | 'setCustomRechargeAmount'
  | 'setError'
  | 'setSelectedRechargeAmount'
>) {
  return (
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
  )
}

function RechargeActionRow({
  navigate,
  rechargeAmountError,
  rechargeAmountPreview,
  submitRechargeFromPage,
}: Pick<
  CustomerRoleProps,
  'navigate' | 'rechargeAmountError' | 'rechargeAmountPreview' | 'submitRechargeFromPage'
>) {
  return (
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
  )
}

function CustomerRechargeContent({ props }: { props: CustomerRoleProps }) {
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

  if (!selectedCustomer) return null

  return (
    <section className="review-page-panel">
      <RechargeSummaryBar
        formatPrice={formatPrice}
        presetAmounts={RECHARGE_PRESET_AMOUNTS}
        selectedCustomer={selectedCustomer}
      />
      <RechargePresetButtons
        presetAmounts={RECHARGE_PRESET_AMOUNTS}
        selectedRechargeAmount={selectedRechargeAmount}
        selectRechargeAmount={selectRechargeAmount}
      />
      <CustomRechargeAmountField
        customRechargeAmount={customRechargeAmount}
        rechargeAmountError={rechargeAmountError}
        setCustomRechargeAmount={setCustomRechargeAmount}
        setError={setError}
        setSelectedRechargeAmount={setSelectedRechargeAmount}
      />
      <RechargeBalancePreview
        balanceCents={selectedCustomer.balanceCents}
        formatPrice={formatPrice}
        rechargeAmountPreview={rechargeAmountPreview}
      />
      <RechargeActionRow
        navigate={navigate}
        rechargeAmountError={rechargeAmountError}
        rechargeAmountPreview={rechargeAmountPreview}
        submitRechargeFromPage={submitRechargeFromPage}
      />
    </section>
  )
}

export function CustomerProfileRechargePanel({ props }: { props: CustomerRoleProps }) {
  return (
    <Panel
      title={CUSTOMER_PROFILE_COPY.rechargeTitle}
      description={CUSTOMER_PROFILE_COPY.rechargeDescription}
    >
      <CustomerRechargeContent props={props} />
    </Panel>
  )
}
