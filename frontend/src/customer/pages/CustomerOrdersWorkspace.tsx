import { useEffect, useState } from 'react'
import type { CustomerRoleProps } from '@/shared/app-build-role-props'
import { Panel } from '@/shared/components/LayoutPrimitives'
import { OrderList } from '@/order/pages/OrderList'
import { CustomerOrderDetailSection } from '@/order/pages/CustomerOrderHelpers'
import { ORDER_STATUS, type OrderSummary } from '@/shared/object'

type CustomerOrderSection = 'all' | 'active' | 'review' | ''

const ACTIVE_ORDER_STATUSES: OrderSummary['status'][] = [
  ORDER_STATUS.pendingMerchantAcceptance,
  ORDER_STATUS.preparing,
  ORDER_STATUS.readyForPickup,
  ORDER_STATUS.delivering,
]

export function CustomerOrdersWorkspace(props: CustomerRoleProps) {
  const {
    customerOrders,
    pendingCustomerReviewOrders,
    completedCustomerOrders,
    REVIEW_WINDOW_DAYS,
    formatPrice,
    formatTime,
    navigate,
    activeCustomerOrder,
  } = props
  const activeCustomerOrders = customerOrders.filter((order) =>
    ACTIVE_ORDER_STATUSES.includes(order.status),
  )
  const [customerOrderSection, setCustomerOrderSection] = useState<CustomerOrderSection>('')

  useEffect(() => {
    if (!customerOrderSection) return
    if (customerOrderSection === 'review' && pendingCustomerReviewOrders.length === 0) return
    if (customerOrderSection === 'active' && activeCustomerOrders.length === 0) return
  }, [activeCustomerOrders.length, customerOrderSection, pendingCustomerReviewOrders.length])

  if (props.customerWorkspaceView === 'order-detail') {
    return (
      <Panel title="订单详情" description="查看单个订单的完整商品、费用、进度和售后信息。">
        {activeCustomerOrder ? <CustomerOrderDetailSection order={activeCustomerOrder} props={props} /> : null}
      </Panel>
    )
  }

  return (
    <Panel title="顾客订单视图" description={`查看历史订单；仅最近 ${REVIEW_WINDOW_DAYS} 天内完成的订单可评价商家和骑手，并补充额外文字说明。`}>
      <div className={pendingCustomerReviewOrders.length > 0 ? 'banner info' : 'banner'}>
        {pendingCustomerReviewOrders.length > 0
          ? `当前有 ${pendingCustomerReviewOrders.length} 个最近 ${REVIEW_WINDOW_DAYS} 天内完成且未评价的订单，可在对应订单卡片中点击“去评价”。`
          : `当前没有待评价订单。仅最近 ${REVIEW_WINDOW_DAYS} 天内完成的订单支持评价；若订单刚送达，请等待几秒自动同步或点击“刷新状态”。`}
      </div>
      <div className="summary-bar">
        <div>
          <p>历史订单数</p>
          <strong>{customerOrders.length}</strong>
        </div>
        <div>
          <p>已完成订单</p>
          <strong>{completedCustomerOrders.length}</strong>
        </div>
      </div>
      <div className="order-section-switcher">
        <button className={customerOrderSection === 'all' ? 'primary-button' : 'secondary-button'} onClick={() => setCustomerOrderSection((current) => (current === 'all' ? '' : 'all'))} type="button">
          {customerOrderSection === 'all' ? '收起所有订单' : '查看所有订单'}
        </button>
        <button className={customerOrderSection === 'active' ? 'primary-button' : 'secondary-button'} onClick={() => setCustomerOrderSection((current) => (current === 'active' ? '' : 'active'))} type="button">
          {customerOrderSection === 'active' ? '收起待完成' : '查看待完成'}
        </button>
        <button className={customerOrderSection === 'review' ? 'primary-button' : 'secondary-button'} onClick={() => setCustomerOrderSection((current) => (current === 'review' ? '' : 'review'))} type="button">
          {customerOrderSection === 'review' ? '收起待评价' : '查看待评价'}
        </button>
      </div>
      {customerOrderSection ? (() => {
        const section =
          customerOrderSection === 'active'
            ? { title: '待完成', count: activeCustomerOrders.length, orders: activeCustomerOrders, emptyText: '当前没有待完成订单。' }
            : customerOrderSection === 'review'
              ? {
                  title: '待评价',
                  count: pendingCustomerReviewOrders.length,
                  orders: pendingCustomerReviewOrders,
                  emptyText: `当前没有待评价订单。仅最近 ${REVIEW_WINDOW_DAYS} 天内完成的订单支持评价。`,
                }
              : { title: '所有订单', count: customerOrders.length, orders: customerOrders, emptyText: '当前顾客还没有订单。' }

        return (
          <section className="order-section-card">
            <div className="order-section-header">
              <div>
                <p className="ticket-kind">{section.title}</p>
                <h3>{section.count} 单</h3>
              </div>
            </div>
            <OrderList
              orders={section.orders}
              emptyText={section.emptyText}
              formatPrice={formatPrice}
              formatTime={formatTime}
              onOpenOrder={(orderId) => navigate(`/customer/orders/${orderId}`)}
              statusLabels={props.statusLabels}
            />
          </section>
        )
      })() : (
        <div className="empty-card">请选择上方一个订单分类后再查看具体订单。</div>
      )}
    </Panel>
  )
}
