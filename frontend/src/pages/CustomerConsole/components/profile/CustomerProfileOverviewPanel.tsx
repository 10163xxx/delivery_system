import type { CustomerRolePanelProps } from '@/pages/CustomerConsole/objects/CustomerPanelObjects'
import { Panel } from '@/pages/DeliveryConsole/components/primitives/LayoutPrimitives'
import { ACCOUNT_STATUS, MEMBERSHIP_TIER, ROUTE_PATH } from '@/objects/core/SharedObjects'
import { CUSTOMER_PROFILE_COPY, CUSTOMER_PROFILE_RULES } from '@/pages/CustomerConsole/components/profile/CustomerProfileCopy'

function countRefundRequests(customerOrders: CustomerRolePanelProps['props']['customerOrders']) {
  return customerOrders.reduce((count, order) => count + order.partialRefundRequests.length, 0)
}

function formatMembershipLabel(
  selectedCustomer: NonNullable<CustomerRolePanelProps['props']['selectedCustomer']>,
) {
  return selectedCustomer.membershipTier === MEMBERSHIP_TIER.member
    ? CUSTOMER_PROFILE_COPY.membershipMember
    : CUSTOMER_PROFILE_COPY.membershipStandard
}

function formatCustomerStatusLabel(
  selectedCustomer: NonNullable<CustomerRolePanelProps['props']['selectedCustomer']>,
) {
  return selectedCustomer.accountStatus === ACCOUNT_STATUS.suspended
    ? CUSTOMER_PROFILE_COPY.customerStatusSuspended
    : CUSTOMER_PROFILE_COPY.customerStatusActive
}

function formatAutoDispatchLabel(
  selectedCustomer: NonNullable<CustomerRolePanelProps['props']['selectedCustomer']>,
) {
  return selectedCustomer.membershipTier === MEMBERSHIP_TIER.member
    ? `${CUSTOMER_PROFILE_RULES.memberAutoDispatchMinutes} 分钟`
    : `${CUSTOMER_PROFILE_RULES.standardAutoDispatchMinutes} 分钟`
}

function CustomerProfileIdentityFields({
  selectedCustomer,
}: {
  selectedCustomer: NonNullable<CustomerRolePanelProps['props']['selectedCustomer']>
}) {
  return (
    <div className="form-grid">
      <label>
        <span>{CUSTOMER_PROFILE_COPY.anonymousIdLabel}</span>
        <input value={selectedCustomer.name} disabled />
      </label>
      <label>
        <span>{CUSTOMER_PROFILE_COPY.phoneLabel}</span>
        <input value={selectedCustomer.phone} disabled />
      </label>
    </div>
  )
}

function CustomerProfileSummaryBar({
  actions,
  metrics,
}: {
  actions: Array<{ label: string; onClick: () => void }>
  metrics: Array<{ label: string; value: string | number }>
}) {
  return (
    <div className="summary-bar">
      {metrics.map((metric) => (
        <div key={metric.label}>
          <p>{metric.label}</p>
          <strong>{metric.value}</strong>
        </div>
      ))}
      {actions.map((action) => (
        <button
          className="secondary-button"
          key={action.label}
          onClick={action.onClick}
          type="button"
        >
          {action.label}
        </button>
      ))}
    </div>
  )
}

function CustomerProfileMainSummary({
  formatPrice,
  navigate,
  openRechargePage,
  selectedCustomer,
}: Pick<CustomerRolePanelProps['props'], 'formatPrice' | 'navigate' | 'openRechargePage'> & {
  selectedCustomer: NonNullable<CustomerRolePanelProps['props']['selectedCustomer']>
}) {
  const metrics = [
    {
      label: CUSTOMER_PROFILE_COPY.balanceLabel,
      value: formatPrice(selectedCustomer.balanceCents),
    },
    {
      label: CUSTOMER_PROFILE_COPY.membershipLabel,
      value: formatMembershipLabel(selectedCustomer),
    },
    {
      label: CUSTOMER_PROFILE_COPY.spendLast30DaysLabel,
      value: formatPrice(selectedCustomer.monthlySpendCents),
    },
    {
      label: CUSTOMER_PROFILE_COPY.customerStatusLabel,
      value: formatCustomerStatusLabel(selectedCustomer),
    },
    {
      label: CUSTOMER_PROFILE_COPY.reviewRevokedCountLabel,
      value: selectedCustomer.revokedReviewCount,
    },
    {
      label: CUSTOMER_PROFILE_COPY.autoDispatchLabel,
      value: formatAutoDispatchLabel(selectedCustomer),
    },
  ]
  const actions = [
    {
      label: CUSTOMER_PROFILE_COPY.rechargeActionButton,
      onClick: openRechargePage,
    },
    {
      label: CUSTOMER_PROFILE_COPY.overviewCouponsButton,
      onClick: () => navigate(ROUTE_PATH.customerProfileCoupons),
    },
    {
      label: CUSTOMER_PROFILE_COPY.addressManageButton,
      onClick: () => navigate(ROUTE_PATH.customerProfileAddresses),
    },
    {
      label: CUSTOMER_PROFILE_COPY.overviewRefundsButton,
      onClick: () => navigate(ROUTE_PATH.customerProfileRefunds),
    },
    {
      label: CUSTOMER_PROFILE_COPY.favoriteStoreManageButton,
      onClick: () => navigate(ROUTE_PATH.customerProfileFavorites),
    },
    {
      label: CUSTOMER_PROFILE_COPY.blockedStoreManageButton,
      onClick: () => navigate(ROUTE_PATH.customerProfileBlockedStores),
    },
  ]

  return <CustomerProfileSummaryBar actions={actions} metrics={metrics} />
}

function CustomerProfileActivitySummary({
  blockedStoreCount,
  favoriteStoreCount,
  navigate,
  refundCount,
  selectedCustomer,
}: Pick<CustomerRolePanelProps['props'], 'navigate'> & {
  blockedStoreCount: number
  favoriteStoreCount: number
  refundCount: number
  selectedCustomer: NonNullable<CustomerRolePanelProps['props']['selectedCustomer']>
}) {
  const metrics = [
    {
      label: CUSTOMER_PROFILE_COPY.addressCountLabel,
      value: selectedCustomer.addresses.length,
    },
    {
      label: CUSTOMER_PROFILE_COPY.defaultAddressLabel,
      value: selectedCustomer.defaultAddress,
    },
    {
      label: CUSTOMER_PROFILE_COPY.refundCountLabel,
      value: refundCount,
    },
    {
      label: CUSTOMER_PROFILE_COPY.favoriteStoreCountLabel,
      value: favoriteStoreCount,
    },
    {
      label: CUSTOMER_PROFILE_COPY.blockedStoreCountLabel,
      value: blockedStoreCount,
    },
  ]
  const actions = [
    {
      label: CUSTOMER_PROFILE_COPY.overviewAddressesButton,
      onClick: () => navigate(ROUTE_PATH.customerProfileAddresses),
    },
    {
      label: CUSTOMER_PROFILE_COPY.refundListButton,
      onClick: () => navigate(ROUTE_PATH.customerProfileRefunds),
    },
    {
      label: CUSTOMER_PROFILE_COPY.overviewFavoritesButton,
      onClick: () => navigate(ROUTE_PATH.customerProfileFavorites),
    },
    {
      label: CUSTOMER_PROFILE_COPY.overviewBlockedStoresButton,
      onClick: () => navigate(ROUTE_PATH.customerProfileBlockedStores),
    },
  ]

  return <CustomerProfileSummaryBar actions={actions} metrics={metrics} />
}

export function CustomerProfileOverviewPanel({ props }: CustomerRolePanelProps) {
  const { customerOrders, formatPrice, navigate, openRechargePage, selectedCustomer } = props
  const refundCount = countRefundRequests(customerOrders)

  return (
    <Panel
      title={CUSTOMER_PROFILE_COPY.overviewTitle}
      description={CUSTOMER_PROFILE_COPY.overviewDescription}
    >
      {selectedCustomer ? (
        <>
          <CustomerProfileIdentityFields selectedCustomer={selectedCustomer} />
          <CustomerProfileMainSummary
            formatPrice={formatPrice}
            navigate={navigate}
            openRechargePage={openRechargePage}
            selectedCustomer={selectedCustomer}
          />
          <CustomerProfileActivitySummary
            blockedStoreCount={props.blockedStores.length}
            favoriteStoreCount={props.favoriteStores.length}
            navigate={navigate}
            refundCount={refundCount}
            selectedCustomer={selectedCustomer}
          />
        </>
      ) : null}
    </Panel>
  )
}
