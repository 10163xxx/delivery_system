import type { CustomerRolePanelProps } from '@/pages/customer/object/CustomerPageObjects'
import { Panel } from '@/shared/components/primitives/LayoutPrimitives'
import { MEMBERSHIP_TIER, ROUTE_PATH } from '@/shared/object/core/SharedObjects'
import { CUSTOMER_PROFILE_COPY, CUSTOMER_PROFILE_RULES } from '@/pages/customer/profile/CustomerProfileCopy'

export function CustomerProfileOverviewPanel({ props }: CustomerRolePanelProps) {
  const { customerOrders, formatPrice, navigate, openRechargePage, selectedCustomer } = props
  const refundCount = customerOrders.reduce(
    (count, order) => count + order.partialRefundRequests.length,
    0,
  )

  return (
    <Panel
      title={CUSTOMER_PROFILE_COPY.overviewTitle}
      description={CUSTOMER_PROFILE_COPY.overviewDescription}
    >
      {selectedCustomer ? (
        <>
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
          <div className="summary-bar">
            <div>
              <p>{CUSTOMER_PROFILE_COPY.balanceLabel}</p>
              <strong>{formatPrice(selectedCustomer.balanceCents)}</strong>
            </div>
            <div>
              <p>{CUSTOMER_PROFILE_COPY.membershipLabel}</p>
              <strong>
                {selectedCustomer.membershipTier === MEMBERSHIP_TIER.member
                  ? CUSTOMER_PROFILE_COPY.membershipMember
                  : CUSTOMER_PROFILE_COPY.membershipStandard}
              </strong>
            </div>
            <div>
              <p>{CUSTOMER_PROFILE_COPY.spendLast30DaysLabel}</p>
              <strong>{formatPrice(selectedCustomer.monthlySpendCents)}</strong>
            </div>
            <div>
              <p>{CUSTOMER_PROFILE_COPY.autoDispatchLabel}</p>
              <strong>
                {selectedCustomer.membershipTier === MEMBERSHIP_TIER.member
                  ? `${CUSTOMER_PROFILE_RULES.memberAutoDispatchMinutes} 分钟`
                  : `${CUSTOMER_PROFILE_RULES.standardAutoDispatchMinutes} 分钟`}
              </strong>
            </div>
            <button className="secondary-button" onClick={() => openRechargePage()} type="button">
              {CUSTOMER_PROFILE_COPY.rechargeActionButton}
            </button>
            <button
              className="secondary-button"
              onClick={() => navigate(ROUTE_PATH.customerProfileCoupons)}
              type="button"
            >
              {CUSTOMER_PROFILE_COPY.overviewCouponsButton}
            </button>
            <button
              className="secondary-button"
              onClick={() => navigate(ROUTE_PATH.customerProfileAddresses)}
              type="button"
            >
              {CUSTOMER_PROFILE_COPY.addressManageButton}
            </button>
            <button
              className="secondary-button"
              onClick={() => navigate(ROUTE_PATH.customerProfileRefunds)}
              type="button"
            >
              {CUSTOMER_PROFILE_COPY.overviewRefundsButton}
            </button>
          </div>
          <div className="summary-bar">
            <div>
              <p>{CUSTOMER_PROFILE_COPY.addressCountLabel}</p>
              <strong>{selectedCustomer.addresses.length}</strong>
            </div>
            <div>
              <p>{CUSTOMER_PROFILE_COPY.defaultAddressLabel}</p>
              <strong>{selectedCustomer.defaultAddress}</strong>
            </div>
            <div>
              <p>{CUSTOMER_PROFILE_COPY.refundCountLabel}</p>
              <strong>{refundCount}</strong>
            </div>
            <button
              className="secondary-button"
              onClick={() => navigate(ROUTE_PATH.customerProfileAddresses)}
              type="button"
            >
              {CUSTOMER_PROFILE_COPY.overviewAddressesButton}
            </button>
            <button
              className="secondary-button"
              onClick={() => navigate(ROUTE_PATH.customerProfileRefunds)}
              type="button"
            >
              {CUSTOMER_PROFILE_COPY.refundListButton}
            </button>
          </div>
        </>
      ) : null}
    </Panel>
  )
}
