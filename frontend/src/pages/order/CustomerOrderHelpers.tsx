import { createInitialAfterSalesDraft } from '@/features/delivery/DeliveryServices'
import type { CustomerOrderDetailSectionProps } from '@/objects/order/page/OrderPageObjects'
import {
  AfterSalesActionPanel,
  renderCustomerOrderFooter,
} from '@/pages/order/CustomerOrderActionParts'
import {
  getAfterSalesSummary,
  isDeliveryIssueTicket,
  OrderItemsList,
  OrderTimeline,
  PartialRefundHistory,
  ReviewNotes,
} from '@/pages/order/CustomerOrderDisplayParts'
import {
  CustomerOrderDetailHeader,
  CustomerOrderPriceBreakdown,
  CustomerOrderSummaryBar,
} from '@/pages/order/CustomerOrderDetailParts'
import { OrderRoutePanel } from '@/pages/order/OrderRoutePanel'

export function CustomerOrderDetailSection({
  order,
  props,
}: CustomerOrderDetailSectionProps) {
  const {
    stateTickets,
    afterSalesDrafts,
    afterSalesErrors,
    statusLabels,
    navigate,
    formatPrice,
    formatTime,
    setAfterSalesDrafts,
    setAfterSalesErrors,
    submitAfterSalesRequest,
  } = props
  const orderTicket = stateTickets.find((ticket) =>
    isDeliveryIssueTicket(ticket, order.id),
  )
  const afterSalesDraft =
    afterSalesDrafts[order.id] ?? createInitialAfterSalesDraft()
  const afterSalesError = afterSalesErrors[order.id]
  const orderStore = props.stores.find((store) => store.id === order.storeId)

  return (
    <section className="order-section-card">
      <CustomerOrderDetailHeader navigate={navigate} order={order} statusLabels={statusLabels} />
      <CustomerOrderSummaryBar formatPrice={formatPrice} formatTime={formatTime} order={order} />
      <OrderRoutePanel order={order} formatTime={formatTime} storeAddress={orderStore?.storeAddress} />
      <OrderItemsList order={order} formatPrice={formatPrice} />
      <CustomerOrderPriceBreakdown formatPrice={formatPrice} order={order} />
      <OrderTimeline
        order={order}
        formatTime={formatTime}
        statusLabels={statusLabels}
      />
      <PartialRefundHistory order={order} />
      <ReviewNotes order={order} />
      <div className="timeline">
        <div className="timeline-item">
          <span>售后服务</span>
          <p>{getAfterSalesSummary(orderTicket, formatPrice)}</p>
        </div>
      </div>
      <AfterSalesActionPanel
        order={order}
        orderTicket={orderTicket}
        afterSalesDraft={afterSalesDraft}
        afterSalesError={afterSalesError}
        setAfterSalesDrafts={setAfterSalesDrafts}
        setAfterSalesErrors={setAfterSalesErrors}
        submitAfterSalesRequest={submitAfterSalesRequest}
      />
      {renderCustomerOrderFooter(order, props)}
    </section>
  )
}
