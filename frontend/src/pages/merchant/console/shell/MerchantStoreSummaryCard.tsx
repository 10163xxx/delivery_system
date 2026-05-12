import type { MerchantConsolePanelProps } from '@/merchant/app/state/MerchantConsoleState'
import { MERCHANT_CONSOLE_COPY } from '@/pages/merchant/console/shell/MerchantConsoleCopy'
import { STORE_STATUS, type Store, type OrderSummary } from '@/shared/object/core/SharedObjects'

export function MerchantStoreSummaryCard({
  store,
  storeOrders,
  storeNewOrderCount,
  storePendingOrderCount,
  enterMerchantStore,
}: {
  store: Store
  storeOrders: OrderSummary[]
  storeNewOrderCount: number
  storePendingOrderCount: number
  enterMerchantStore: MerchantConsolePanelProps['enterMerchantStore']
}) {
  return (
    <article className="ticket-card merchant-store-module">
      <div className="merchant-store-module__summary">
        <div className="merchant-store-module__heading">
          <div>
            <p className="ticket-kind">店铺模块</p>
            <h3>{store.name}</h3>
          </div>
          <p className="meta-line">{store.category}</p>
        </div>
        {storeNewOrderCount > 0 ? (
          <span className="merchant-store-module__new-order-count">{storeNewOrderCount}</span>
        ) : null}
        <div className="merchant-store-module__summary-actions">
          <span className={store.status === STORE_STATUS.revoked ? 'badge warning' : 'badge success'}>
            {store.status === STORE_STATUS.revoked ? '已取消' : '已通过'}
          </span>
          <span className="badge">{storeOrders.length} 笔订单</span>
          {storePendingOrderCount > 0 ? (
            <span className="badge warning">{storePendingOrderCount} 待处理</span>
          ) : null}
          <button
            className="merchant-store-module__summary-toggle"
            onClick={() => enterMerchantStore(store.id)}
            type="button"
          >
            {storePendingOrderCount > 0
              ? MERCHANT_CONSOLE_COPY.actions.enterPendingStore
              : MERCHANT_CONSOLE_COPY.actions.enterStore}
          </button>
        </div>
      </div>
    </article>
  )
}
