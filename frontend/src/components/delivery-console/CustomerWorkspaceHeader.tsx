export function CustomerWorkspaceHeader({ customerWorkspaceView, navigate }: any) {
  return (
    <div className="summary-bar">
      <div>
        <p>顾客工作台</p>
        <strong>
          {customerWorkspaceView === 'order'
            ? '点餐'
            : customerWorkspaceView === 'orders'
              ? '订单'
              : customerWorkspaceView === 'coupons'
                ? '优惠券'
                : customerWorkspaceView === 'addresses'
                  ? '地址管理'
                  : customerWorkspaceView === 'recharge'
                    ? '充值'
                    : '个人信息'}
        </strong>
      </div>
      <div className="action-row">
        <button
          className={customerWorkspaceView === 'order' ? 'primary-button' : 'secondary-button'}
          onClick={() => navigate('/customer/order')}
          type="button"
        >
          点餐
        </button>
        <button
          className={customerWorkspaceView === 'orders' ? 'primary-button' : 'secondary-button'}
          onClick={() => navigate('/customer/orders')}
          type="button"
        >
          订单
        </button>
        <button
          className={
            customerWorkspaceView === 'profile' ||
            customerWorkspaceView === 'addresses' ||
            customerWorkspaceView === 'coupons' ||
            customerWorkspaceView === 'recharge'
              ? 'primary-button'
              : 'secondary-button'
          }
          onClick={() => navigate('/customer/profile')}
          type="button"
        >
          个人信息
        </button>
      </div>
    </div>
  )
}
