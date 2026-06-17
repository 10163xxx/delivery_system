import { useEffect, useState } from 'react'
import type { CustomerRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import type { CustomerOrderSection, CustomerOrderSectionData } from '@/pages/CustomerConsole/objects/CustomerOrderObjects'
import { CUSTOMER_ORDER_SECTION as CUSTOMER_ORDER_SECTIONS } from '@/pages/CustomerConsole/objects/CustomerOrderObjects'
import { Panel } from '@/pages/DeliveryConsole/components/primitives/LayoutPrimitives'
import { OrderList } from '@/pages/OrderConsole/components/OrderList'
import { CustomerOrderDetailSection } from '@/pages/OrderConsole/components/CustomerOrderDetailSection'
import type { OrderId } from '@/objects/core/SharedObjects'
import { asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import { buildCustomerOrderDetailRoute, CUSTOMER_WORKSPACE_VIEW } from '@/pages/DeliveryConsole/objects/CustomerWorkspaceObjects'
import {
  CUSTOMER_ORDER_WORKSPACE_COPY,
  CUSTOMER_ORDER_WORKSPACE_LAYOUT,
  DELIVERY_UI,
  formatNoPendingReviewBanner,
  formatOrderWorkspacePanelDescription,
  formatPendingReviewBanner,
} from '@/pages/DeliveryConsole/functions/shared/DeliveryMessages'
import { ZERO_COUNT } from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import {
  getActiveCustomerOrders,
  getCustomerOrderSectionData,
  getRepeatOrderAvailability,
} from '@/pages/CustomerConsole/functions/customerOrders/CustomerOrderWorkspaceData'

function OrderWorkspaceBanner({
  pendingCustomerReviewOrders,
  REVIEW_WINDOW_DAYS,
}: Pick<CustomerRoleProps, 'pendingCustomerReviewOrders' | 'REVIEW_WINDOW_DAYS'>) {
  return (
    <div className={pendingCustomerReviewOrders.length > ZERO_COUNT ? DELIVERY_UI.bannerInfoClassName : DELIVERY_UI.bannerClassName}>
      {pendingCustomerReviewOrders.length > ZERO_COUNT
        ? formatPendingReviewBanner(
            pendingCustomerReviewOrders.length,
            REVIEW_WINDOW_DAYS,
          )
        : formatNoPendingReviewBanner(REVIEW_WINDOW_DAYS)}
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
    <div className={CUSTOMER_ORDER_WORKSPACE_LAYOUT.orderSectionSwitcherClassName}>
      <button className={customerOrderSection === CUSTOMER_ORDER_SECTIONS.all ? DELIVERY_UI.primaryButtonClassName : DELIVERY_UI.secondaryButtonClassName} onClick={() => setCustomerOrderSection((current) => (current === CUSTOMER_ORDER_SECTIONS.all ? CUSTOMER_ORDER_SECTIONS.none : CUSTOMER_ORDER_SECTIONS.all))} type={DELIVERY_UI.buttonType}>
        {customerOrderSection === CUSTOMER_ORDER_SECTIONS.all
          ? CUSTOMER_ORDER_WORKSPACE_COPY.allSectionToggleCollapse
          : CUSTOMER_ORDER_WORKSPACE_COPY.allSectionToggleExpand}
      </button>
      <button className={customerOrderSection === CUSTOMER_ORDER_SECTIONS.active ? DELIVERY_UI.primaryButtonClassName : DELIVERY_UI.secondaryButtonClassName} onClick={() => setCustomerOrderSection((current) => (current === CUSTOMER_ORDER_SECTIONS.active ? CUSTOMER_ORDER_SECTIONS.none : CUSTOMER_ORDER_SECTIONS.active))} type={DELIVERY_UI.buttonType}>
        {customerOrderSection === CUSTOMER_ORDER_SECTIONS.active
          ? CUSTOMER_ORDER_WORKSPACE_COPY.activeSectionToggleCollapse
          : CUSTOMER_ORDER_WORKSPACE_COPY.activeSectionToggleExpand}
      </button>
      <button className={customerOrderSection === CUSTOMER_ORDER_SECTIONS.review ? DELIVERY_UI.primaryButtonClassName : DELIVERY_UI.secondaryButtonClassName} onClick={() => setCustomerOrderSection((current) => (current === CUSTOMER_ORDER_SECTIONS.review ? CUSTOMER_ORDER_SECTIONS.none : CUSTOMER_ORDER_SECTIONS.review))} type={DELIVERY_UI.buttonType}>
        {customerOrderSection === CUSTOMER_ORDER_SECTIONS.review
          ? CUSTOMER_ORDER_WORKSPACE_COPY.reviewSectionToggleCollapse
          : CUSTOMER_ORDER_WORKSPACE_COPY.reviewSectionToggleExpand}
      </button>
    </div>
  )
}

function OrderSectionContent({
  formatPrice,
  formatTime,
  isStoreCurrentlyOpen,
  navigate,
  repeatOrder,
  sectionData,
  statusLabels,
  stores,
}: {
  formatPrice: CustomerRoleProps['formatPrice']
  formatTime: CustomerRoleProps['formatTime']
  isStoreCurrentlyOpen: CustomerRoleProps['isStoreCurrentlyOpen']
  navigate: CustomerRoleProps['navigate']
  repeatOrder: CustomerRoleProps['repeatOrder']
  sectionData: CustomerOrderSectionData | null
  statusLabels: CustomerRoleProps['statusLabels']
  stores: CustomerRoleProps['stores']
}) {
  if (!sectionData) {
    return <div className={DELIVERY_UI.emptyCardClassName}>{CUSTOMER_ORDER_WORKSPACE_COPY.emptySelection}</div>
  }

  return (
    <section className={CUSTOMER_ORDER_WORKSPACE_LAYOUT.orderSectionCardClassName}>
      <div className={CUSTOMER_ORDER_WORKSPACE_LAYOUT.orderSectionHeaderClassName}>
        <div>
          <p className={DELIVERY_UI.ticketKindClassName}>{sectionData.title}</p>
          <h3>{`${sectionData.count}${CUSTOMER_ORDER_WORKSPACE_COPY.sectionCountSuffix}`}</h3>
        </div>
      </div>
      <OrderList
        orders={sectionData.orders}
        emptyText={sectionData.emptyText}
        footer={(order) => {
          const repeatAvailability = getRepeatOrderAvailability(order, stores, isStoreCurrentlyOpen)

          return (
            <div className={DELIVERY_UI.actionRowClassName}>
              <button
                className={DELIVERY_UI.secondaryButtonClassName}
                disabled={!repeatAvailability.canRepeat}
                onClick={() => {
                  if (repeatAvailability.canRepeat) repeatOrder(order)
                }}
                title={repeatAvailability.canRepeat ? undefined : repeatAvailability.reason}
                type={DELIVERY_UI.buttonType}
              >
                {CUSTOMER_ORDER_WORKSPACE_COPY.repeatOrderButton}
              </button>
              {!repeatAvailability.canRepeat ? (
                <small className={DELIVERY_UI.metaLineClassName}>{repeatAvailability.reason}</small>
              ) : null}
            </div>
          )
        }}
        formatPrice={formatPrice}
        formatTime={formatTime}
        onOpenOrder={(orderId) => navigate(buildCustomerOrderDetailRoute(asDomainText<OrderId>(orderId)))}
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
    if (customerOrderSection === CUSTOMER_ORDER_SECTIONS.review && pendingCustomerReviewOrders.length === ZERO_COUNT) return
    if (customerOrderSection === CUSTOMER_ORDER_SECTIONS.active && activeCustomerOrders.length === ZERO_COUNT) return
  }, [activeCustomerOrders.length, customerOrderSection, pendingCustomerReviewOrders.length])

  if (props.customerWorkspaceView === CUSTOMER_WORKSPACE_VIEW.orderDetail) {
    return <CustomerOrderDetailPanel {...props} activeCustomerOrder={activeCustomerOrder} />
  }

  return (
    <Panel
      title={CUSTOMER_ORDER_WORKSPACE_COPY.orderWorkspacePanelTitle}
      description={formatOrderWorkspacePanelDescription(REVIEW_WINDOW_DAYS)}
    >
      <OrderWorkspaceBanner
        pendingCustomerReviewOrders={pendingCustomerReviewOrders}
        REVIEW_WINDOW_DAYS={REVIEW_WINDOW_DAYS}
      />
      <div className={DELIVERY_UI.summaryBarClassName}>
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
        isStoreCurrentlyOpen={props.isStoreCurrentlyOpen}
        navigate={navigate}
        repeatOrder={props.repeatOrder}
        sectionData={sectionData}
        statusLabels={props.statusLabels}
        stores={props.stores}
      />
    </Panel>
  )
}
