import { useState } from 'react'
import type { MerchantConsolePanelProps } from '@/pages/merchant/hooks/MerchantConsoleState'
import {
  MERCHANT_STORE_SUB_VIEW,
  type MerchantStoreSubView,
} from '@/objects/merchant/page/MerchantPageObjects'
import { MerchantMenuSection } from '@/pages/merchant/console/menu/MerchantMenuSection'
import { MerchantOrdersSection } from '@/pages/merchant/console/orders/MerchantOrdersSection'
import { MerchantStoreSidebar } from '@/pages/merchant/console/shell/MerchantStoreSidebar'
import { ORDER_STATUS, STORE_STATUS, type OrderSummary, type Store } from '@/objects/core/SharedObjects'

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
  const [activeSubView, setActiveSubView] = useState<MerchantStoreSubView>(MERCHANT_STORE_SUB_VIEW.menu)
  const newOrderCount = storeOrders.filter(
    (order) => order.status === ORDER_STATUS.pendingMerchantAcceptance,
  ).length
  const pendingOrderCount = storeOrders.filter(
    (order) =>
      order.status === ORDER_STATUS.pendingMerchantAcceptance ||
      order.status === ORDER_STATUS.preparing,
  ).length
  const showMenu = activeSubView === MERCHANT_STORE_SUB_VIEW.menu
  const showOrders = activeSubView === MERCHANT_STORE_SUB_VIEW.orders

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
          {newOrderCount > 0 ? (
            <span className="merchant-store-module__new-order-count">{newOrderCount}</span>
          ) : null}
          <div className="merchant-store-module__summary-actions">
            <span className={store.status === STORE_STATUS.revoked ? 'badge warning' : 'badge success'}>
              {store.status === STORE_STATUS.revoked ? '已取消' : '已通过'}
            </span>
            <span className="badge">{storeOrders.length} 笔订单</span>
          </div>
        </div>

        <div className="merchant-store-subnav" aria-label="店铺管理子界面">
          <button
            className={showMenu ? 'merchant-store-subnav__button is-active' : 'merchant-store-subnav__button'}
            onClick={() => setActiveSubView(MERCHANT_STORE_SUB_VIEW.menu)}
            type="button"
          >
            菜品管理
          </button>
          <button
            className={[
              'merchant-store-subnav__button',
              showOrders ? 'is-active' : undefined,
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => setActiveSubView(MERCHANT_STORE_SUB_VIEW.orders)}
            type="button"
          >
            订单管理
            <span className={pendingOrderCount > 0 ? 'badge warning' : 'badge'}>
              {pendingOrderCount > 0 ? `${pendingOrderCount} 待处理` : `${storeOrders.length} 笔`}
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
