import { useEffect, useState } from 'react'
import type { CustomerRoleProps } from '@/pages/delivery/app/roleProps'
import type {
  CustomerOrderSection,
  CustomerOrderSectionData,
} from '@/objects/customer/page/CustomerPageObjects'
import { CUSTOMER_ORDER_SECTION as CUSTOMER_ORDER_SECTIONS } from '@/objects/customer/page/CustomerPageObjects'
import { Panel } from '@/components/primitives/LayoutPrimitives'
import { OrderList } from '@/pages/order/OrderList'
import { CustomerOrderDetailSection } from '@/pages/order/CustomerOrderHelpers'
import { ORDER_STATUS, type OrderSummary } from '@/objects/core/SharedObjects'
import {
  buildCustomerOrderDetailRoute,
  CUSTOMER_WORKSPACE_VIEW,
} from '@/objects/page/DeliveryAppObjects'
import { CUSTOMER_ORDER_WORKSPACE_COPY } from '@/features/delivery/DeliveryMessages'

const ACTIVE_ORDER_STATUSES: OrderSummary['status'][] = [
  ORDER_STATUS.pendingMerchantAcceptance,
  ORDER_STATUS.preparing,
  ORDER_STATUS.readyForPickup,
  ORDER_STATUS.delivering,
]

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
      title: CUSTOMER_ORDER_WORKSPACE_COPY.reviewSectionTitle,
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
        ? CUSTOMER_ORDER_WORKSPACE_COPY.pendingReviewBanner(
            pendingCustomerReviewOrders.length,
            REVIEW_WINDOW_DAYS,
          )
        : CUSTOMER_ORDER_WORKSPACE_COPY.noPendingReviewBanner(REVIEW_WINDOW_DAYS)}
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
        {customerOrderSection === CUSTOMER_ORDER_SECTIONS.all
          ? CUSTOMER_ORDER_WORKSPACE_COPY.allSectionToggleCollapse
          : CUSTOMER_ORDER_WORKSPACE_COPY.allSectionToggleExpand}
      </button>
      <button className={customerOrderSection === CUSTOMER_ORDER_SECTIONS.active ? 'primary-button' : 'secondary-button'} onClick={() => setCustomerOrderSection((current) => (current === CUSTOMER_ORDER_SECTIONS.active ? CUSTOMER_ORDER_SECTIONS.none : CUSTOMER_ORDER_SECTIONS.active))} type="button">
        {customerOrderSection === CUSTOMER_ORDER_SECTIONS.active
          ? CUSTOMER_ORDER_WORKSPACE_COPY.activeSectionToggleCollapse
          : CUSTOMER_ORDER_WORKSPACE_COPY.activeSectionToggleExpand}
      </button>
      <button className={customerOrderSection === CUSTOMER_ORDER_SECTIONS.review ? 'primary-button' : 'secondary-button'} onClick={() => setCustomerOrderSection((current) => (current === CUSTOMER_ORDER_SECTIONS.review ? CUSTOMER_ORDER_SECTIONS.none : CUSTOMER_ORDER_SECTIONS.review))} type="button">
        {customerOrderSection === CUSTOMER_ORDER_SECTIONS.review
          ? CUSTOMER_ORDER_WORKSPACE_COPY.reviewSectionToggleCollapse
          : CUSTOMER_ORDER_WORKSPACE_COPY.reviewSectionToggleExpand}
      </button>
    </div>
  )
}

function OrderSectionContent({
  addPreviousOrderToCart,
  formatPrice,
  formatTime,
  navigate,
  repeatOrder,
  sectionData,
  statusLabels,
}: {
  addPreviousOrderToCart: CustomerRoleProps['addPreviousOrderToCart']
  formatPrice: CustomerRoleProps['formatPrice']
  formatTime: CustomerRoleProps['formatTime']
  navigate: CustomerRoleProps['navigate']
  repeatOrder: CustomerRoleProps['repeatOrder']
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
          <h3>{`${sectionData.count}${CUSTOMER_ORDER_WORKSPACE_COPY.sectionCountSuffix}`}</h3>
        </div>
      </div>
      <OrderList
        orders={sectionData.orders}
        emptyText={sectionData.emptyText}
        footer={(order) => (
          <div className="action-row">
            <button
              className="primary-button"
              onClick={() => addPreviousOrderToCart(order)}
              type="button"
            >
              {CUSTOMER_ORDER_WORKSPACE_COPY.addToCartButton}
            </button>
            <button
              className="secondary-button"
              onClick={() => repeatOrder(order)}
              type="button"
            >
              {CUSTOMER_ORDER_WORKSPACE_COPY.repeatOrderButton}
            </button>
          </div>
        )}
        formatPrice={formatPrice}
        formatTime={formatTime}
        onOpenOrder={(orderId) => navigate(buildCustomerOrderDetailRoute(orderId))}
        statusLabels={statusLabels}
      />
    </section>
  )
}

function CustomerOrderDetailPanel(props: CustomerRoleProps) {
  const { activeCustomerOrder } = props

  return (
    <Panel
      title={CUSTOMER_ORDER_WORKSPACE_COPY.orderDetailPanelTitle}
      description={CUSTOMER_ORDER_WORKSPACE_COPY.orderDetailPanelDescription}
    >
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
    <Panel
      title={CUSTOMER_ORDER_WORKSPACE_COPY.orderWorkspacePanelTitle}
      description={CUSTOMER_ORDER_WORKSPACE_COPY.orderWorkspacePanelDescription(REVIEW_WINDOW_DAYS)}
    >
      <OrderWorkspaceBanner
        pendingCustomerReviewOrders={pendingCustomerReviewOrders}
        REVIEW_WINDOW_DAYS={REVIEW_WINDOW_DAYS}
      />
      <div className="summary-bar">
        <div>
          <p>{CUSTOMER_ORDER_WORKSPACE_COPY.historyOrderCountLabel}</p>
          <strong>{customerOrders.length}</strong>
        </div>
        <div>
          <p>{CUSTOMER_ORDER_WORKSPACE_COPY.completedOrdersLabel}</p>
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
        addPreviousOrderToCart={props.addPreviousOrderToCart}
        repeatOrder={props.repeatOrder}
        sectionData={sectionData}
        statusLabels={props.statusLabels}
      />
    </Panel>
  )
}
