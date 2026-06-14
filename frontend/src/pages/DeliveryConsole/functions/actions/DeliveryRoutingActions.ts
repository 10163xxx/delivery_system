import type { DisplayText, Store, StoreId } from '@/objects/core/SharedObjects'
import { ROUTE_QUERY_KEY } from '@/objects/core/SharedObjects'
import { getInitialQuantities } from '@/pages/DeliveryConsole/functions/drafts/DeliveryDrafts'
import { asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import type { ActionArgs } from '@/pages/DeliveryConsole/objects/DeliveryPageActionTypes'
import type { MerchantApplicationView } from '@/pages/DeliveryConsole/objects/MerchantWorkspaceObjects'

export function chooseStoreCategoryAction(args: ActionArgs, category: string) {
  args.setSelectedStoreCategory(asDomainText<DisplayText>(category))
  args.setSelectedStoreId('')
  args.setQuantities({})
  args.setSelectedMenuItemConfigurations({})
  args.setMenuItemConfigurationModal(null)
  args.setError(null)
  args.setSearchParams({ [ROUTE_QUERY_KEY.category]: category })
}

export function resetStoreCategoryAction(args: ActionArgs) {
  args.setSelectedStoreCategory(asDomainText<DisplayText>(''))
  args.setSelectedStoreId('')
  args.setQuantities({})
  args.setSelectedMenuItemConfigurations({})
  args.setMenuItemConfigurationModal(null)
  args.setError(null)
  args.setSearchParams({})
}

export function enterStoreAction(args: ActionArgs, storeId: StoreId) {
  const store = args.state?.stores.find((entry: Store) => entry.id === storeId)
  if (store?.category) {
    args.setSelectedStoreCategory(store.category)
  }
  args.setSelectedStoreId(storeId)
  args.setQuantities(getInitialQuantities(store))
  args.setSelectedMenuItemConfigurations({})
  args.setMenuItemConfigurationModal(null)
  args.setSearchParams({
    [ROUTE_QUERY_KEY.store]: storeId,
    ...(store?.category ? { [ROUTE_QUERY_KEY.category]: store.category } : {}),
  })
}

export function leaveStoreAction(args: ActionArgs) {
  const store = args.selectedStore
  const category = store?.category
  args.setSelectedStoreId('')
  args.setQuantities({})
  args.setSelectedMenuItemConfigurations({})
  args.setMenuItemConfigurationModal(null)
  args.setError(null)
  args.setSearchParams(category ? { [ROUTE_QUERY_KEY.category]: category } : {})
}

export function changeMerchantApplicationViewAction(
  args: ActionArgs,
  view: MerchantApplicationView,
) {
  args.setMerchantApplicationState(view)
  args.setSearchParams({ [ROUTE_QUERY_KEY.merchantView]: view })
  args.setError(null)
}

export function leaveMerchantStoreAction(args: ActionArgs) {
  args.setError(null)
  args.setSelectedMerchantStoreId('')
}

export function enterMerchantStoreAction(args: ActionArgs, storeId: string) {
  args.setError(null)
  args.setSelectedMerchantStoreId(asDomainText<StoreId>(storeId))
}
