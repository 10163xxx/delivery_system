import type { MerchantConsolePanelProps } from '@/merchant/app/state/MerchantConsoleState'
import { MerchantMenuItemCard } from '@/pages/merchant/console/menu/MerchantMenuItemCard'
import type { Store } from '@/shared/object/core/SharedObjects'

export function MerchantMenuCatalog({
  store,
  props,
}: {
  store: Store
  props: MerchantConsolePanelProps
}) {
  return (
    <div className="menu-grid merchant-menu-grid">
      {store.menu.map((item) => (
        <MerchantMenuItemCard key={item.id} item={item} props={props} store={store} />
      ))}
    </div>
  )
}
