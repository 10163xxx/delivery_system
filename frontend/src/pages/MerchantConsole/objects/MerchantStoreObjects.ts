import type {
  OrderSummary,
  Store,
} from '@/objects/core/SharedObjects'
import type { MerchantConsolePanelProps } from '@/pages/MerchantConsole/objects/MerchantConsoleStateObjects'

export type MerchantStorePanelProps = {
  state: NonNullable<MerchantConsolePanelProps['state']>
  store: Store
  storeOrders: OrderSummary[]
  props: MerchantConsolePanelProps
}

export type MerchantStoreSidebarProps = {
  store: Store
  props: MerchantConsolePanelProps
}
