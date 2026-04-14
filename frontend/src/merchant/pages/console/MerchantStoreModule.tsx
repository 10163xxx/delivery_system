import { useState } from 'react'
import type { MerchantConsolePanelProps } from '@/merchant/app/merchant-console-state'
import { MerchantMenuSection } from '@/merchant/pages/console/MerchantMenuSection'
import { MerchantOrdersSection } from '@/merchant/pages/console/MerchantOrdersSection'
import { MerchantStoreSidebar } from '@/merchant/pages/console/MerchantStoreSidebar'
import { MERCHANT_CONSOLE_COPY } from '@/merchant/pages/console/copy'
import { ORDER_STATUS, STORE_STATUS, type OrderSummary, type Store } from '@/shared/object'

type MerchantStoreSubView = 'menu' | 'orders'

export function MerchantStoreModule({
  state,
  store,
  storeOrders,
  props,
}: {
  state: NonNullable<MerchantConsolePanelProps['state']>
  store: Store
  storeOrders: OrderSummary[]
  props: MerchantConsolePanelProps
}) {
  const [activeSubView, setActiveSubView] = useState<MerchantStoreSubView>('menu')
  const newOrderCount = storeOrders.filter(
    (order) => order.status === ORDER_STATUS.pendingMerchantAcceptance,
  ).length
  const pendingOrderCount = storeOrders.filter(
    (order) =>
      order.status === ORDER_STATUS.pendingMerchantAcceptance ||
      order.status === ORDER_STATUS.preparing,
  ).length
  const showMenu = activeSubView === 'menu'
  const showOrders = activeSubView === 'orders'

  return (
    <article className="ticket-card merchant-store-module">
      <div className="merchant-store-module__frame">
        <div className="merchant-store-module__hero">
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
            {newOrderCount > 0 ? (
              <button
                className="merchant-new-order-alert"
                onClick={() => setActiveSubView('orders')}
                type="button"
              >
                <strong>{newOrderCount} 笔{MERCHANT_CONSOLE_COPY.newOrderAlertTitle}</strong>
                <span>{MERCHANT_CONSOLE_COPY.newOrderAlertBody}</span>
              </button>
            ) : null}
          </div>
        </div>

        <div className="merchant-store-subnav" aria-label="店铺管理子界面">
          <button
            className={showMenu ? 'merchant-store-subnav__button is-active' : 'merchant-store-subnav__button'}
            onClick={() => setActiveSubView('menu')}
            type="button"
          >
            菜品管理
          </button>
          <button
            className={[
              'merchant-store-subnav__button',
              showOrders ? 'is-active' : undefined,
              newOrderCount > 0 ? 'has-new-orders' : undefined,
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => setActiveSubView('orders')}
            type="button"
          >
            订单管理
            <span className={newOrderCount > 0 ? 'badge urgent' : pendingOrderCount > 0 ? 'badge warning' : 'badge'}>
              {newOrderCount > 0
                ? `${newOrderCount} 新订单`
                : pendingOrderCount > 0
                  ? `${pendingOrderCount} 待处理`
                  : `${storeOrders.length} 笔`}
            </span>
          </button>
        </div>

        <div className="merchant-store-module__layout">
          <MerchantStoreSidebar props={props} store={store} />
          <div className="merchant-store-content">
            {showMenu ? <MerchantMenuSection props={props} store={store} /> : null}
            {showOrders ? (
              <MerchantOrdersSection
                props={props}
                state={state}
                store={store}
                storeOrders={storeOrders}
              />
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
}
