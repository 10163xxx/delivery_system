import type { CustomerRolePanelProps } from '@/pages/customer/object/CustomerPageObjects'
import { Panel } from '@/shared/components/primitives/LayoutPrimitives'
import { MEMBERSHIP_TIER } from '@/shared/object/core/SharedObjects'
import { CUSTOMER_PROFILE_COPY, CUSTOMER_PROFILE_RULES } from '@/pages/customer/profile/CustomerProfileCopy'

export function CustomerProfileOverviewPanel({ props }: CustomerRolePanelProps) {
  const { formatPrice, navigate, openRechargePage, selectedCustomer } = props

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
              <strong>
                {selectedCustomer.membershipTier === MEMBERSHIP_TIER.member
                  ? CUSTOMER_PROFILE_COPY.membershipMember
                  : CUSTOMER_PROFILE_COPY.membershipStandard}
              </strong>
            </div>
            <div>
              <p>近 30 天消费</p>
              <strong>{formatPrice(selectedCustomer.monthlySpendCents)}</strong>
            </div>
            <div>
              <p>自动派单时限</p>
              <strong>
                {selectedCustomer.membershipTier === MEMBERSHIP_TIER.member
                  ? `${CUSTOMER_PROFILE_RULES.memberAutoDispatchMinutes} 分钟`
                  : `${CUSTOMER_PROFILE_RULES.standardAutoDispatchMinutes} 分钟`}
              </strong>
            </div>
            <button className="secondary-button" onClick={() => openRechargePage()} type="button">
              充值
            </button>
            <button
              className="secondary-button"
              onClick={() => navigate('/customer/profile/coupons')}
              type="button"
            >
              优惠券
            </button>
            <button
              className="secondary-button"
              onClick={() => navigate('/customer/profile/addresses')}
              type="button"
            >
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
            <button
              className="secondary-button"
              onClick={() => navigate('/customer/profile/addresses')}
              type="button"
            >
              管理地址
            </button>
          </div>
        </>
      ) : null}
    </Panel>
  )
}
