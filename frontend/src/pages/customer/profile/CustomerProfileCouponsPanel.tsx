import type { CustomerRoleProps } from '@/pages/delivery/app/roleProps'
import type { CustomerRolePanelProps } from '@/objects/customer/page/CustomerPageObjects'
import { Panel } from '@/components/primitives/LayoutPrimitives'
import { ROUTE_PATH, type Coupon } from '@/objects/core/SharedObjects'
import { CUSTOMER_PROFILE_COPY } from '@/pages/customer/profile/CustomerProfileCopy'

function ReturnToProfileButton({ navigate }: Pick<CustomerRoleProps, 'navigate'>) {
  return (
    <button className="secondary-button" onClick={() => navigate(ROUTE_PATH.customerProfile)} type="button">
      {CUSTOMER_PROFILE_COPY.returnToProfileButton}
    </button>
  )
}

function CouponCards({
  coupons,
  formatPrice,
  formatTime,
}: {
  coupons: Coupon[]
  formatPrice: CustomerRoleProps['formatPrice']
  formatTime: CustomerRoleProps['formatTime']
}) {
  if (coupons.length === 0) return <div className="empty-card">{CUSTOMER_PROFILE_COPY.couponEmptyState}</div>

  return (
    <>
      {coupons.map((coupon: Coupon) => (
        <article key={coupon.id} className="ticket-card">
          <div className="ticket-header">
            <div>
              <p className="ticket-kind">{CUSTOMER_PROFILE_COPY.couponTicketKind}</p>
              <h3>{coupon.title}</h3>
            </div>
            <span className="badge success">{formatPrice(coupon.discountCents)}</span>
          </div>
          <p>{coupon.description}</p>
          <p className="meta-line">
            {CUSTOMER_PROFILE_COPY.couponMinSpendPrefix}
            {formatPrice(coupon.minimumSpendCents)}
            {CUSTOMER_PROFILE_COPY.couponUsableSuffix}
            {' · '}
            {CUSTOMER_PROFILE_COPY.couponExpiresPrefix}
            {formatTime(coupon.expiresAt)}
          </p>
        </article>
      ))}
    </>
  )
}

export function CustomerProfileCouponsPanel({ props }: CustomerRolePanelProps) {
  const { formatPrice, formatTime, navigate, selectedCustomer } = props

  return (
    <Panel
      title={CUSTOMER_PROFILE_COPY.couponPageTitle}
      description={CUSTOMER_PROFILE_COPY.couponDescription}
    >
      {selectedCustomer ? (
        <>
          <div className="summary-bar">
            <div>
              <p>{CUSTOMER_PROFILE_COPY.currentAccountLabel}</p>
              <strong>{selectedCustomer.name}</strong>
            </div>
            <div>
              <p>{CUSTOMER_PROFILE_COPY.couponCountLabel}</p>
              <strong>{selectedCustomer.coupons.length}</strong>
            </div>
            <div>
              <p>{CUSTOMER_PROFILE_COPY.balanceLabel}</p>
              <strong>{formatPrice(selectedCustomer.balanceCents)}</strong>
            </div>
            <ReturnToProfileButton navigate={navigate} />
          </div>
          <div className="ticket-grid">
            <CouponCards
              coupons={selectedCustomer.coupons}
              formatPrice={formatPrice}
              formatTime={formatTime}
            />
          </div>
        </>
      ) : null}
    </Panel>
  )
}
