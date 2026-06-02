import type { MerchantConsolePanelProps } from '@/pages/merchant/hooks/MerchantConsoleState'
import { MerchantMenuSection } from '@/pages/merchant/console/menu/MerchantMenuSection'
import { MerchantStoreSidebar } from '@/pages/merchant/console/shell/MerchantStoreSidebar'
import { STORE_STATUS, type Store } from '@/objects/core/SharedObjects'

export function MerchantStoreModule({
  store,
  props,
}: {
  store: Store
  props: MerchantConsolePanelProps
}) {
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
          </div>
        </div>

        <div className="merchant-store-module__layout">
          <MerchantStoreSidebar props={props} store={store} />
          <div className="merchant-store-content">
            <MerchantMenuSection props={props} store={store} />
          </div>
        </div>
      </div>
    </article>
  )
}
