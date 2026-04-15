import type { MerchantConsolePanelProps } from '@/merchant/app/MerchantConsoleState'
import { Panel } from '@/shared/components/LayoutPrimitives'
import { MERCHANT_CONSOLE_COPY } from '@/merchant/pages/console/MerchantConsoleCopy'
import { MerchantStoreModule } from '@/merchant/pages/console/MerchantStoreModule'
import { MerchantStoreSummaryCard } from '@/merchant/pages/console/MerchantStoreSummaryCard'
import { ORDER_STATUS, type OrderSummary, type Store } from '@/shared/object/SharedObjects'

function getPendingMerchantOrders(orders: OrderSummary[]) {
  return orders.filter(
    (order) =>
      order.status === ORDER_STATUS.pendingMerchantAcceptance ||
      order.status === ORDER_STATUS.preparing,
  )
}

function getNewMerchantOrders(orders: OrderSummary[]) {
  return orders.filter((order) => order.status === ORDER_STATUS.pendingMerchantAcceptance)
}

export function MerchantConsolePanel(props: MerchantConsolePanelProps) {
  const { activeMerchantStore, storesToRender, merchantStores, leaveMerchantStore, state, enterMerchantStore } =
    props

  if (!state) return <div className="empty-card">{MERCHANT_CONSOLE_COPY.storeEmpty}</div>
  const currentState = state
  const merchantStoreIds = new Set(merchantStores.map((store) => store.id))
  const merchantOrders = currentState.orders.filter((order) => merchantStoreIds.has(order.storeId))
  const pendingOrders = getPendingMerchantOrders(merchantOrders)
  const newOrders = getNewMerchantOrders(merchantOrders)
  const pendingStoreCount = new Set(pendingOrders.map((order) => order.storeId)).size
  const firstPendingStoreId = pendingOrders[0]?.storeId

  return (
    <Panel title={MERCHANT_CONSOLE_COPY.title} description={MERCHANT_CONSOLE_COPY.description}>
      {merchantStores.length > 0 ? (
        <div className="merchant-store-list">
          {pendingOrders.length > 0 ? (
            <div className="merchant-pending-overview" role="status">
              <div>
                <p className="ticket-kind">{MERCHANT_CONSOLE_COPY.pendingOrdersOverviewTitle}</p>
                <h3>
                  {newOrders.length > 0 ? `${newOrders.length} 笔新订单` : `${pendingOrders.length} 笔待处理`}
                </h3>
                <p className="meta-line">
                  共 {pendingStoreCount} 家店铺需要处理。
                  {MERCHANT_CONSOLE_COPY.pendingOrdersOverviewBody}
                </p>
              </div>
              <div className="merchant-pending-overview__badges">
                {newOrders.length > 0 ? <span className="badge urgent">{newOrders.length} 新订单</span> : null}
                <span className="badge warning">{pendingOrders.length} 待处理</span>
                {firstPendingStoreId ? (
                  <button
                    className="merchant-pending-overview__action"
                    onClick={() => enterMerchantStore(firstPendingStoreId)}
                    type="button"
                  >
                    {MERCHANT_CONSOLE_COPY.pendingOrdersAction}
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          {activeMerchantStore ? (
            <div className="summary-bar merchant-store-single-bar">
              <div>
                <p>当前店铺</p>
                <strong>{activeMerchantStore.name}</strong>
              </div>
              <button className="secondary-button" onClick={() => leaveMerchantStore()} type="button">
                返回全部店铺
              </button>
            </div>
          ) : null}

          {storesToRender.map((store: Store) => {
            const storeOrders = currentState.orders.filter((order) => order.storeId === store.id)
            const storeNewOrderCount = getNewMerchantOrders(storeOrders).length
            const storePendingOrderCount = getPendingMerchantOrders(storeOrders).length

            return activeMerchantStore ? (
              <MerchantStoreModule
                key={store.id}
                props={props}
                state={currentState}
                store={store}
                storeOrders={storeOrders}
              />
            ) : (
              <MerchantStoreSummaryCard
                key={store.id}
                enterMerchantStore={enterMerchantStore}
                store={store}
                storeNewOrderCount={storeNewOrderCount}
                storeOrders={storeOrders}
                storePendingOrderCount={storePendingOrderCount}
              />
            )
          })}
        </div>
      ) : (
        <div className="empty-card">{MERCHANT_CONSOLE_COPY.storeEmpty}</div>
      )}
    </Panel>
  )
}
