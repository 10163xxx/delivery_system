import type { Dispatch, SetStateAction } from 'react'
import type { MenuItem, Store } from '@/shared/object/SharedObjects'
import {
  createInitialReviewDraft,
  DELIVERY_CONSOLE_MESSAGES,
  formatRemainingQuantityMessage,
  formatStoreClosedMessage,
  formatBusinessHours,
  getInitialQuantities,
  getTodayDeliveryWindow,
  validateScheduledDeliveryTime,
} from '@/shared/delivery/DeliveryServices'
import type {
  MerchantApplicationView,
  ReviewDraft,
} from '@/shared/delivery-app/DeliveryAppObjects'

export type ActionArgs = {
  state: { stores: Store[] } | null
  selectedStore: Store | undefined
  selectedCustomer: { coupons: { id: string; minimumSpendCents: number }[] } | undefined
  selectedStoreIsOpen: boolean
  quantities: Record<string, number>
  scheduledDeliveryTime: string
  setSelectedStoreCategory: Dispatch<SetStateAction<string>>
  setSelectedStoreId: Dispatch<SetStateAction<string>>
  setQuantities: Dispatch<SetStateAction<Record<string, number>>>
  setError: Dispatch<SetStateAction<string | null>>
  setSearchParams: (nextInit: URLSearchParams | Record<string, string>) => void
  setMerchantApplicationState: Dispatch<SetStateAction<MerchantApplicationView>>
  setSelectedMerchantStoreId: Dispatch<SetStateAction<string>>
  setIsCheckoutExpanded: Dispatch<SetStateAction<boolean>>
  setScheduledDeliveryTime: Dispatch<SetStateAction<string>>
  setScheduledDeliveryError: Dispatch<SetStateAction<string | null>>
  setScheduledDeliveryTouched: Dispatch<SetStateAction<boolean>>
  setReviewDrafts: Dispatch<SetStateAction<Record<string, ReviewDraft>>>
  setReviewErrors: Dispatch<SetStateAction<Record<string, string>>>
}

export function getTodayDeliveryWindowAction() {
  return getTodayDeliveryWindow()
}

export function chooseStoreCategoryAction(args: ActionArgs, category: string) {
  args.setSelectedStoreCategory(category)
  args.setSelectedStoreId('')
  args.setQuantities({})
  args.setError(null)
  args.setSearchParams({})
}

export function resetStoreCategoryAction(args: ActionArgs) {
  args.setSelectedStoreCategory('')
  args.setSelectedStoreId('')
  args.setQuantities({})
  args.setError(null)
  args.setSearchParams({})
}

export function enterStoreAction(args: ActionArgs, storeId: string) {
  const store = args.state?.stores.find((entry: Store) => entry.id === storeId)
  if (store?.category) {
    args.setSelectedStoreCategory(store.category)
  }
  args.setSelectedStoreId(storeId)
  args.setQuantities(getInitialQuantities(store))
  args.setSearchParams({ store: storeId })
}

export function leaveStoreAction(args: ActionArgs) {
  args.setSelectedStoreId('')
  args.setQuantities({})
  args.setError(null)
  args.setSearchParams({})
}

export function changeMerchantApplicationViewAction(
  args: ActionArgs,
  view: MerchantApplicationView,
) {
  args.setMerchantApplicationState(view)
  args.setSearchParams({ merchantView: view })
  args.setError(null)
}

export function leaveMerchantStoreAction(args: ActionArgs) {
  args.setError(null)
  args.setSelectedMerchantStoreId('')
}

export function enterMerchantStoreAction(args: ActionArgs, storeId: string) {
  args.setError(null)
  args.setSelectedMerchantStoreId(storeId)
}

export function updateQuantityAction(args: ActionArgs, menuItem: MenuItem, nextValue: number) {
  const nextQuantity = Math.max(0, nextValue)
  const remainingQuantity = menuItem.remainingQuantity
  const hasStockLimit = remainingQuantity != null
  const cappedQuantity =
    !hasStockLimit ? nextQuantity : Math.min(nextQuantity, Math.max(remainingQuantity, 0))

  args.setQuantities((current: Record<string, number>) => ({
    ...current,
    [menuItem.id]: cappedQuantity,
  }))

  if (hasStockLimit && nextQuantity > remainingQuantity) {
    args.setError(formatRemainingQuantityMessage(menuItem.name, remainingQuantity))
  } else {
    args.setError(null)
  }
}

export function openCheckoutAction(args: ActionArgs, todayDeliveryWindow = getTodayDeliveryWindow()) {
  if (!args.selectedStore || !args.selectedCustomer) return
  if (!args.selectedStoreIsOpen) {
    args.setError(formatStoreClosedMessage(formatBusinessHours(args.selectedStore.businessHours)))
    return
  }
  const selectedItems = args.selectedStore.menu.filter(
    (item: MenuItem) => (args.quantities[item.id] ?? 0) > 0,
  )
  if (selectedItems.length === 0) {
    args.setError(DELIVERY_CONSOLE_MESSAGES.noMenuItemSelected)
    return
  }

  if (!todayDeliveryWindow.isAvailable) {
    args.setError(DELIVERY_CONSOLE_MESSAGES.noSameDayDeliveryWindow)
    return
  }

  args.setError(null)
  if (validateScheduledDeliveryTime(args.scheduledDeliveryTime) !== null) {
    args.setScheduledDeliveryTime(todayDeliveryWindow.minimumValue)
    args.setScheduledDeliveryError(null)
    args.setScheduledDeliveryTouched(false)
  }
  args.setIsCheckoutExpanded(true)
}

export function updateReviewDraftAction(
  args: ActionArgs,
  orderId: string,
  patch: Partial<ReviewDraft>,
) {
  args.setReviewDrafts((current: Record<string, ReviewDraft>) => ({
    ...current,
    [orderId]: {
      ...(current[orderId] ?? createInitialReviewDraft()),
      ...patch,
    },
  }))
  args.setReviewErrors((current: Record<string, string>) => {
    if (!current[orderId]) return current
    const next = { ...current }
    delete next[orderId]
    return next
  })
}
