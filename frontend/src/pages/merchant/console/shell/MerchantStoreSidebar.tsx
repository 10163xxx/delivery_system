import type { MerchantStoreSidebarProps } from '@/objects/merchant/page/MerchantConsoleObjects'
import {
  MerchantStoreEligibilityCard,
  MerchantStoreOperationCard,
  MerchantStoreOverviewCard,
} from '@/pages/merchant/console/shell/MerchantStorePanels'

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
