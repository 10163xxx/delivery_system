import type { MerchantConsolePanelProps } from '@/merchant/app/merchant-console-state'
import { MERCHANT_CONSOLE_COPY } from '@/merchant/pages/console/copy'
import { STORE_STATUS, type Store, type OrderSummary } from '@/shared/object'

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
        <div className="merchant-store-module__summary-actions">
          <span className={store.status === STORE_STATUS.revoked ? 'badge warning' : 'badge success'}>
            {store.status === STORE_STATUS.revoked ? '已取消' : '已通过'}
          </span>
          <span className="badge">{storeOrders.length} 笔订单</span>
          {storeNewOrderCount > 0 ? (
            <span className="badge urgent">{storeNewOrderCount} 新订单</span>
          ) : storePendingOrderCount > 0 ? (
            <span className="badge warning">{storePendingOrderCount} 待处理</span>
          ) : null}
          <button
            className={[
              'merchant-store-module__summary-toggle',
              storeNewOrderCount > 0 ? 'has-new-orders' : undefined,
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => enterMerchantStore(store.id)}
            type="button"
          >
            {storePendingOrderCount > 0
              ? MERCHANT_CONSOLE_COPY.enterPendingStore
              : MERCHANT_CONSOLE_COPY.enterStore}
          </button>
        </div>
      </div>
    </article>
  )
}
