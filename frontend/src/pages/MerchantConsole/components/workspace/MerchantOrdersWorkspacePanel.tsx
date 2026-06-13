import { Panel } from '@/pages/DeliveryConsole/components/primitives/LayoutPrimitives'
import type { MerchantConsolePanelProps } from '@/pages/MerchantConsole/hooks/MerchantConsoleState'
import { MerchantDeliveryRoutePanel } from '@/pages/MerchantConsole/components/workspace/MerchantDeliveryRoutePanel'
import { MerchantOrderFooter } from '@/pages/MerchantConsole/components/console/orders/MerchantOrderFooter'
import { OrderList } from '@/pages/OrderConsole/components/OrderList'
import {
  CustomerOrderPriceBreakdown,
  CustomerOrderSummaryBar,
} from '@/pages/OrderConsole/components/CustomerOrderDetailParts'
import {
  OrderItemsList,
  OrderTimeline,
} from '@/pages/OrderConsole/components/CustomerOrderDisplayParts'
import { MERCHANT_CONSOLE_COPY } from '@/pages/MerchantConsole/components/console/shell/MerchantConsoleCopy'
import { ORDER_STATUS, type OrderStatus, type OrderSummary, type Store } from '@/objects/core/SharedObjects'
import { useEffect, useMemo, useState } from 'react'

const MERCHANT_ORDER_PAGE_SIZE = 20
const ACTIVE_MERCHANT_ORDER_STATUSES: readonly OrderStatus[] = [
  ORDER_STATUS.pendingMerchantAcceptance,
  ORDER_STATUS.preparing,
  ORDER_STATUS.readyForPickup,
  ORDER_STATUS.delivering,
]

function getMerchantOrderStore(merchantStores: Store[], order: OrderSummary) {
  return merchantStores.find((store) => store.id === order.storeId)
}

function getSortedOrders(orders: OrderSummary[]) {
  return orders.slice().sort((left, right) => {
    const activeOrderRank =
      Number(ACTIVE_MERCHANT_ORDER_STATUSES.includes(right.status)) -
      Number(ACTIVE_MERCHANT_ORDER_STATUSES.includes(left.status))
    if (activeOrderRank !== 0) return activeOrderRank
    return right.createdAt.localeCompare(left.createdAt)
  })
}

function MerchantOrderSummaryCard({
  formatPrice,
  formatTime,
  onOpen,
  order,
  statusLabel,
}: {
  formatPrice: MerchantConsolePanelProps['formatPrice']
  formatTime: MerchantConsolePanelProps['formatTime']
  onOpen: (orderId: string) => void
  order: OrderSummary
  statusLabel: string
}) {
  const totalItemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)
  const cardClassName = [
    'merchant-order-summary-card',
    order.status === ORDER_STATUS.pendingMerchantAcceptance ? 'has-new-order' : '',
  ].filter(Boolean).join(' ')

  return (
    <article className={cardClassName}>
      <div>
        <p className="order-id">{order.id}</p>
        <h3>{order.storeName} {'->'} {order.customerName}</h3>
        <p className="meta-line">
          {formatTime(order.createdAt)} · {totalItemCount} 件商品
        </p>
      </div>
      <div className="merchant-order-summary-card__meta">
        <span className={order.status === ORDER_STATUS.pendingMerchantAcceptance ? 'badge urgent' : 'badge'}>
          {statusLabel}
        </span>
        <strong>{formatPrice(order.totalPriceCents)}</strong>
        <button className="secondary-button" onClick={() => onOpen(order.id)} type="button">
          查看详情
        </button>
      </div>
    </article>
  )
}

function MerchantOrderPagination({
  currentPage,
  onChangePage,
  pageCount,
}: {
  currentPage: number
  onChangePage: (page: number) => void
  pageCount: number
}) {
  if (pageCount <= 1) return null

  return (
    <div className="summary-bar merchant-order-pagination">
      <label>
        <span>订单分组</span>
        <select
          value={currentPage}
          onChange={(event) => onChangePage(Number(event.target.value))}
        >
          {Array.from({ length: pageCount }, (_, index) => {
            const start = index * MERCHANT_ORDER_PAGE_SIZE + 1
            const end = (index + 1) * MERCHANT_ORDER_PAGE_SIZE
            return (
              <option key={index} value={index}>
                第 {index + 1} 组（{start}-{end}）
              </option>
            )
          })}
        </select>
      </label>
    </div>
  )
}

function MerchantOrderDetailView({
  merchantStores,
  order,
  props,
  state,
  onBack,
}: {
  merchantStores: Store[]
  order: OrderSummary
  props: MerchantConsolePanelProps
  state: NonNullable<MerchantConsolePanelProps['state']>
  onBack: () => void
}) {
  const store = getMerchantOrderStore(merchantStores, order)

  return (
    <div className="merchant-store-list">
      <div className="summary-bar merchant-store-single-bar">
        <div>
          <p>订单详情</p>
          <strong>{order.storeName} {'->'} {order.customerName}</strong>
          <p className="meta-line">订单号 {order.id} · 状态 {props.statusLabels[order.status]}</p>
        </div>
        <button className="secondary-button" onClick={onBack} type="button">
          返回订单列表
        </button>
      </div>
      <CustomerOrderSummaryBar
        formatPrice={props.formatPrice}
        formatTime={props.formatTime}
        order={order}
      />
      <section className="merchant-section-card">
        <div className="panel-header">
          <div>
            <p className="ticket-kind">商品明细</p>
            <h3>{order.customerName}</h3>
          </div>
        </div>
        <OrderItemsList order={order} formatPrice={props.formatPrice} />
        <CustomerOrderPriceBreakdown order={order} formatPrice={props.formatPrice} />
        {order.remark ? <p className="meta-line">订单备注：{order.remark}</p> : null}
        <p className="meta-line">配送地址：{order.deliveryAddress}</p>
      </section>
      <section className="merchant-section-card">
        <div className="panel-header">
          <div>
            <p className="ticket-kind">订单进度</p>
            <h3>时间线</h3>
          </div>
        </div>
        <OrderTimeline order={order} formatTime={props.formatTime} statusLabels={props.statusLabels} />
      </section>
      <OrderList
        orders={[order]}
        emptyText={MERCHANT_CONSOLE_COPY.panel.orderEmpty}
        formatPrice={props.formatPrice}
        formatTime={props.formatTime}
        footer={() => (store ? <MerchantOrderFooter order={order} props={props} state={state} store={store} /> : null)}
        statusLabels={props.statusLabels}
      />
    </div>
  )
}

export function MerchantOrdersWorkspacePanel(props: MerchantConsolePanelProps) {
  const { merchantStores, state } = props
  const [selectedOrderId, setSelectedOrderId] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const storeIds = useMemo(
    () => merchantStores.map((store) => store.id),
    [merchantStores],
  )
  const orders = useMemo(
    () => getSortedOrders((state?.orders ?? []).filter((order) => storeIds.includes(order.storeId))),
    [state?.orders, storeIds],
  )
  const newOrderCount = orders.filter((order) => order.status === ORDER_STATUS.pendingMerchantAcceptance).length
  const pageCount = Math.max(1, Math.ceil(orders.length / MERCHANT_ORDER_PAGE_SIZE))
  const selectedOrder = orders.find((order) => order.id === selectedOrderId)
  const visibleOrders = orders.slice(
    currentPage * MERCHANT_ORDER_PAGE_SIZE,
    currentPage * MERCHANT_ORDER_PAGE_SIZE + MERCHANT_ORDER_PAGE_SIZE,
  )

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, pageCount - 1))
  }, [pageCount])

  if (!state) return <div className="empty-card">{MERCHANT_CONSOLE_COPY.panel.orderEmpty}</div>

  if (selectedOrder) {
    return (
      <Panel title="订单详情" description="查看并处理当前订单的完整信息。">
        <MerchantOrderDetailView
          merchantStores={merchantStores}
          order={selectedOrder}
          props={props}
          state={state}
          onBack={() => setSelectedOrderId('')}
        />
      </Panel>
    )
  }

  return (
    <Panel title="订单页" description="查看所有店铺订单和配送处理状态。">
      {merchantStores.length > 0 ? (
        <div className="merchant-store-list">
          <MerchantDeliveryRoutePanel {...props} />
          <div className="summary-bar">
            <div>
              <p>订单概览</p>
              <strong>{orders.length} 笔订单</strong>
              <p className="meta-line">每组显示 {MERCHANT_ORDER_PAGE_SIZE} 条，打开订单查看完整信息。</p>
            </div>
            <div className="action-row">
              <span className={newOrderCount > 0 ? 'badge urgent' : 'badge'}>
                {newOrderCount > 0 ? `${newOrderCount} 笔新订单` : '暂无新订单'}
              </span>
            </div>
          </div>
          {visibleOrders.length > 0 ? (
            <div className="merchant-order-summary-list">
              {visibleOrders.map((order) => (
                <MerchantOrderSummaryCard
                  key={order.id}
                  formatPrice={props.formatPrice}
                  formatTime={props.formatTime}
                  onOpen={setSelectedOrderId}
                  order={order}
                  statusLabel={props.statusLabels[order.status]}
                />
              ))}
            </div>
          ) : (
            <div className="empty-card">{MERCHANT_CONSOLE_COPY.panel.orderEmpty}</div>
          )}
          <MerchantOrderPagination
            currentPage={currentPage}
            onChangePage={setCurrentPage}
            pageCount={pageCount}
          />
        </div>
      ) : (
        <div className="empty-card">{MERCHANT_CONSOLE_COPY.panel.storeEmpty}</div>
      )}
    </Panel>
  )
}
