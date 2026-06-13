import { useState } from 'react'
import type {
  CustomerId,
  DisplayText,
  RiderId,
  StoreId,
} from '@/objects/core/SharedObjects'
import { asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import {
  MERCHANT_APPLICATION_VIEW as MERCHANT_APPLICATION_VIEWS,
  MERCHANT_WORKSPACE_VIEW as MERCHANT_WORKSPACE_VIEWS,
  type MerchantApplicationView,
  type MerchantWorkspaceView,
} from '@/pages/DeliveryConsole/objects/MerchantWorkspaceObjects'

export function useSelectionState() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<CustomerId | ''>('')
  const [selectedStoreCategory, setSelectedStoreCategory] = useState<DisplayText>(asDomainText<DisplayText>(''))
  const [selectedStoreId, setSelectedStoreId] = useState<StoreId | ''>('')
  const [selectedMerchantStoreId, setSelectedMerchantStoreId] = useState<StoreId | ''>('')
  const [selectedRiderId, setSelectedRiderId] = useState<RiderId | ''>('')
  const [merchantWorkspaceState, setMerchantWorkspaceState] =
    useState<MerchantWorkspaceView>(MERCHANT_WORKSPACE_VIEWS.application)
  const [merchantApplicationState, setMerchantApplicationState] =
    useState<MerchantApplicationView>(MERCHANT_APPLICATION_VIEWS.submit)

  return {
    selectedCustomerId,
    setSelectedCustomerId,
    selectedStoreCategory,
    setSelectedStoreCategory,
    selectedStoreId,
    setSelectedStoreId,
    selectedMerchantStoreId,
    setSelectedMerchantStoreId,
    selectedRiderId,
    setSelectedRiderId,
    merchantWorkspaceState,
    setMerchantWorkspaceState,
    merchantApplicationState,
    setMerchantApplicationState,
  }
}
