import { useEffect, useState } from 'react'
import type { CustomerRoleProps } from '@/shared/app/role-props'
import type {
  CustomerOrderSection,
  CustomerOrderSectionData,
} from '@/pages/customer/object/CustomerPageObjects'
import { CUSTOMER_ORDER_SECTION as CUSTOMER_ORDER_SECTIONS } from '@/pages/customer/object/CustomerPageObjects'
import { Panel } from '@/shared/components/primitives/LayoutPrimitives'
import { OrderList } from '@/pages/order/OrderList'
import { CustomerOrderDetailSection } from '@/pages/order/CustomerOrderHelpers'
import { ORDER_STATUS, type OrderSummary } from '@/shared/object/core/SharedObjects'
import { CUSTOMER_WORKSPACE_VIEW } from '@/shared/object/core/DeliveryAppObjects'

const ACTIVE_ORDER_STATUSES: OrderSummary['status'][] = [
  ORDER_STATUS.pendingMerchantAcceptance,
  ORDER_STATUS.preparing,
  ORDER_STATUS.readyForPickup,
  ORDER_STATUS.delivering,
]

const CUSTOMER_ORDER_WORKSPACE_COPY = {
  activeSectionTitle: '待完成',
  allSectionTitle: '所有订单',
  emptySelection: '请选择上方一个订单分类后再查看具体订单。',
  noActiveOrders: '当前没有待完成订单。',
  noOrders: '当前顾客还没有订单。',
  noReviewOrders: (reviewWindowDays: number) =>
    `当前没有待评价订单。仅最近 ${reviewWindowDays} 天内完成的订单支持评价。`,
} as const

function getCustomerOrderSectionData(args: {
  customerOrderSection: CustomerOrderSection
  customerOrders: OrderSummary[]
  activeCustomerOrders: OrderSummary[]
  pendingCustomerReviewOrders: OrderSummary[]
  REVIEW_WINDOW_DAYS: number
}): CustomerOrderSectionData | null {
  const {
    customerOrderSection,
    customerOrders,
    activeCustomerOrders,
    pendingCustomerReviewOrders,
    REVIEW_WINDOW_DAYS,
  } = args

  if (customerOrderSection === CUSTOMER_ORDER_SECTIONS.active) {
    return {
      title: CUSTOMER_ORDER_WORKSPACE_COPY.activeSectionTitle,
      count: activeCustomerOrders.length,
      orders: activeCustomerOrders,
      emptyText: CUSTOMER_ORDER_WORKSPACE_COPY.noActiveOrders,
    }
  }

  if (customerOrderSection === CUSTOMER_ORDER_SECTIONS.review) {
    return {
      title: '待评价',
      count: pendingCustomerReviewOrders.length,
      orders: pendingCustomerReviewOrders,
      emptyText: CUSTOMER_ORDER_WORKSPACE_COPY.noReviewOrders(REVIEW_WINDOW_DAYS),
    }
  }

  if (customerOrderSection === CUSTOMER_ORDER_SECTIONS.all) {
    return {
      title: CUSTOMER_ORDER_WORKSPACE_COPY.allSectionTitle,
      count: customerOrders.length,
      orders: customerOrders,
      emptyText: CUSTOMER_ORDER_WORKSPACE_COPY.noOrders,
    }
  }

  return null
}

function getActiveCustomerOrders(customerOrders: OrderSummary[]) {
  return customerOrders.filter((order: OrderSummary) => ACTIVE_ORDER_STATUSES.includes(order.status))
}

function OrderWorkspaceBanner({
  pendingCustomerReviewOrders,
  REVIEW_WINDOW_DAYS,
}: Pick<CustomerRoleProps, 'pendingCustomerReviewOrders' | 'REVIEW_WINDOW_DAYS'>) {
  return (
    <div className={pendingCustomerReviewOrders.length > 0 ? 'banner info' : 'banner'}>
      {pendingCustomerReviewOrders.length > 0
        ? `当前有 ${pendingCustomerReviewOrders.length} 个最近 ${REVIEW_WINDOW_DAYS} 天内完成且未评价的订单，可在对应订单卡片中点击“去评价”。`
        : `当前没有待评价订单。仅最近 ${REVIEW_WINDOW_DAYS} 天内完成的订单支持评价；若订单刚送达，请等待几秒自动同步或点击“刷新状态”。`}
    </div>
  )
}

function OrderSectionSwitcher({
  customerOrderSection,
  setCustomerOrderSection,
}: {
  customerOrderSection: CustomerOrderSection
  setCustomerOrderSection: React.Dispatch<React.SetStateAction<CustomerOrderSection>>
}) {
  return (
    <div className="order-section-switcher">
      <button className={customerOrderSection === CUSTOMER_ORDER_SECTIONS.all ? 'primary-button' : 'secondary-button'} onClick={() => setCustomerOrderSection((current) => (current === CUSTOMER_ORDER_SECTIONS.all ? CUSTOMER_ORDER_SECTIONS.none : CUSTOMER_ORDER_SECTIONS.all))} type="button">
        {customerOrderSection === CUSTOMER_ORDER_SECTIONS.all ? '收起所有订单' : '查看所有订单'}
      </button>
      <button className={customerOrderSection === CUSTOMER_ORDER_SECTIONS.active ? 'primary-button' : 'secondary-button'} onClick={() => setCustomerOrderSection((current) => (current === CUSTOMER_ORDER_SECTIONS.active ? CUSTOMER_ORDER_SECTIONS.none : CUSTOMER_ORDER_SECTIONS.active))} type="button">
        {customerOrderSection === CUSTOMER_ORDER_SECTIONS.active ? '收起待完成' : '查看待完成'}
      </button>
      <button className={customerOrderSection === CUSTOMER_ORDER_SECTIONS.review ? 'primary-button' : 'secondary-button'} onClick={() => setCustomerOrderSection((current) => (current === CUSTOMER_ORDER_SECTIONS.review ? CUSTOMER_ORDER_SECTIONS.none : CUSTOMER_ORDER_SECTIONS.review))} type="button">
        {customerOrderSection === CUSTOMER_ORDER_SECTIONS.review ? '收起待评价' : '查看待评价'}
      </button>
    </div>
  )
}

function OrderSectionContent({
  formatPrice,
  formatTime,
  navigate,
  sectionData,
  statusLabels,
}: {
  formatPrice: CustomerRoleProps['formatPrice']
  formatTime: CustomerRoleProps['formatTime']
  navigate: CustomerRoleProps['navigate']
  sectionData: CustomerOrderSectionData | null
  statusLabels: CustomerRoleProps['statusLabels']
}) {
  if (!sectionData) {
    return <div className="empty-card">{CUSTOMER_ORDER_WORKSPACE_COPY.emptySelection}</div>
  }

  return (
    <section className="order-section-card">
      <div className="order-section-header">
        <div>
          <p className="ticket-kind">{sectionData.title}</p>
          <h3>{sectionData.count} 单</h3>
        </div>
      </div>
      <OrderList
        orders={sectionData.orders}
        emptyText={sectionData.emptyText}
        formatPrice={formatPrice}
        formatTime={formatTime}
        onOpenOrder={(orderId) => navigate(`/customer/orders/${orderId}`)}
        statusLabels={statusLabels}
      />
    </section>
  )
}

function CustomerOrderDetailPanel(props: CustomerRoleProps) {
  const { activeCustomerOrder } = props

  return (
    <Panel title="订单详情" description="查看单个订单的完整商品、费用、进度和售后信息。">
      {activeCustomerOrder ? <CustomerOrderDetailSection order={activeCustomerOrder} props={props} /> : null}
    </Panel>
  )
}

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
  const activeCustomerOrders = getActiveCustomerOrders(customerOrders)
  const [customerOrderSection, setCustomerOrderSection] = useState<CustomerOrderSection>(CUSTOMER_ORDER_SECTIONS.none)
  const sectionData = getCustomerOrderSectionData({
    customerOrderSection,
    customerOrders,
    activeCustomerOrders,
    pendingCustomerReviewOrders,
    REVIEW_WINDOW_DAYS,
  })

  useEffect(() => {
    if (!customerOrderSection) return
    if (customerOrderSection === CUSTOMER_ORDER_SECTIONS.review && pendingCustomerReviewOrders.length === 0) return
    if (customerOrderSection === CUSTOMER_ORDER_SECTIONS.active && activeCustomerOrders.length === 0) return
  }, [activeCustomerOrders.length, customerOrderSection, pendingCustomerReviewOrders.length])

  if (props.customerWorkspaceView === CUSTOMER_WORKSPACE_VIEW.orderDetail) {
    return <CustomerOrderDetailPanel {...props} activeCustomerOrder={activeCustomerOrder} />
  }

  return (
    <Panel title="顾客订单视图" description={`查看历史订单；仅最近 ${REVIEW_WINDOW_DAYS} 天内完成的订单可评价商家和骑手，并补充额外文字说明。`}>
      <OrderWorkspaceBanner
        pendingCustomerReviewOrders={pendingCustomerReviewOrders}
        REVIEW_WINDOW_DAYS={REVIEW_WINDOW_DAYS}
      />
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
      <OrderSectionSwitcher
        customerOrderSection={customerOrderSection}
        setCustomerOrderSection={setCustomerOrderSection}
      />
      <OrderSectionContent
        formatPrice={formatPrice}
        formatTime={formatTime}
        navigate={navigate}
        sectionData={sectionData}
        statusLabels={props.statusLabels}
      />
    </Panel>
  )
}
