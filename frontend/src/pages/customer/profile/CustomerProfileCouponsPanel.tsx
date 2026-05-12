import type { CustomerRoleProps } from '@/shared/app/role-props'
import type { CustomerRolePanelProps } from '@/pages/customer/object/CustomerPageObjects'
import { Panel } from '@/shared/components/primitives/LayoutPrimitives'
import type { Coupon } from '@/shared/object/core/SharedObjects'

function ReturnToProfileButton({ navigate }: Pick<CustomerRoleProps, 'navigate'>) {
  return (
    <button className="secondary-button" onClick={() => navigate('/customer/profile')} type="button">
      返回个人信息
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
  if (coupons.length === 0) return <div className="empty-card">当前没有可用优惠券。</div>

  return (
    <>
      {coupons.map((coupon: Coupon) => (
        <article key={coupon.id} className="ticket-card">
          <div className="ticket-header">
            <div>
              <p className="ticket-kind">优惠券</p>
              <h3>{coupon.title}</h3>
            </div>
            <span className="badge success">{formatPrice(coupon.discountCents)}</span>
          </div>
          <p>{coupon.description}</p>
          <p className="meta-line">
            满 {formatPrice(coupon.minimumSpendCents)} 可用 · 到期 {formatTime(coupon.expiresAt)}
          </p>
        </article>
      ))}
    </>
  )
}

export function CustomerProfileCouponsPanel({ props }: CustomerRolePanelProps) {
  const { formatPrice, formatTime, navigate, selectedCustomer } = props

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
