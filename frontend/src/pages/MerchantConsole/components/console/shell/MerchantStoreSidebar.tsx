import type { MerchantStoreSidebarProps } from '@/pages/MerchantConsole/objects/MerchantConsoleObjects'
import {
  MerchantStoreEligibilityCard,
  MerchantStoreOperationCard,
  MerchantStoreOverviewCard,
} from '@/pages/MerchantConsole/components/console/shell/MerchantStorePanels'

export function MerchantStoreSidebar({
  store,
  props,
}: MerchantStoreSidebarProps) {
  return (
    <aside className="merchant-store-sidebar">
      <MerchantStoreOverviewCard props={props} store={store} />
      <MerchantStoreOperationCard props={props} store={store} />
      <MerchantStoreEligibilityCard props={props} store={store} />
    </aside>
  )
}
