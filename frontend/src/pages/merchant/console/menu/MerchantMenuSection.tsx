import type {
  MerchantConsolePanelProps,
} from '@/merchant/app/state/MerchantConsoleState'
import type { Store } from '@/shared/object/core/SharedObjects'
import { MerchantMenuComposer } from '@/pages/merchant/console/menu/MerchantMenuComposer'
import { MerchantMenuCatalog } from '@/pages/merchant/console/menu/MerchantMenuCatalog'

export function MerchantMenuSection({
  store,
  props,
}: {
  store: Store
  props: MerchantConsolePanelProps
}) {
  return (
    <section className="merchant-section-card">
      <div className="ticket-header merchant-menu-header">
        <div>
          <p className="ticket-kind">菜品管理</p>
          <h3>店铺菜品</h3>
        </div>
        <MerchantMenuComposer props={props} store={store} />
      </div>
      <MerchantMenuCatalog props={props} store={store} />
    </section>
  )
}
