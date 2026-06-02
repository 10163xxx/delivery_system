import type { MerchantConsolePanelProps } from '@/pages/merchant/hooks/MerchantConsoleState'
import { Panel } from '@/components/primitives/LayoutPrimitives'
import { MERCHANT_CONSOLE_COPY } from '@/pages/merchant/console/shell/MerchantConsoleCopy'
import { MerchantStoreModule } from '@/pages/merchant/console/shell/MerchantStoreModule'
import { MerchantStoreSummaryCard } from '@/pages/merchant/console/shell/MerchantStoreSummaryCard'
import { ORDER_STATUS, type OrderSummary, type Store } from '@/objects/core/SharedObjects'

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

  if (!state) return <div className="empty-card">{MERCHANT_CONSOLE_COPY.panel.storeEmpty}</div>
  const currentState = state

  return (
    <Panel title={MERCHANT_CONSOLE_COPY.panel.title} description={MERCHANT_CONSOLE_COPY.panel.description}>
      {merchantStores.length > 0 ? (
        <div className="merchant-store-list">
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
                store={store}
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
        <div className="empty-card">{MERCHANT_CONSOLE_COPY.panel.storeEmpty}</div>
      )}
    </Panel>
  )
}
