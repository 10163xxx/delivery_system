import type { Dispatch, SetStateAction } from 'react'
import type { MerchantDraft } from '@/pages/DeliveryConsole/objects/DeliveryDraftObjects'
import type { MerchantProfileDraft, MerchantWorkspaceView } from '@/pages/DeliveryConsole/objects/MerchantWorkspaceObjects'
import type {
  Customer,
  CustomerId,
  AddressText,
  DisplayText,
  MenuItemId,
  MerchantPayoutAccountType,
  RiderId,
  Store,
  StoreId,
} from '@/objects/core/SharedObjects'
import type { AuthSession } from '@/objects/auth/AuthSession'

type SyncPageStateDataArgs = {
  state: {
    customers: Customer[]
    stores: Store[]
    riders: { id: RiderId }[]
  }
  session: AuthSession
  selectedCustomerId: CustomerId | ''
  selectedRiderId: RiderId | ''
  selectedStoreId: StoreId | ''
}

type SyncPageStateSetterArgs = {
  setDeliveryAddress: (value: AddressText) => void
  setDeliveryAddressError: (value: DisplayText | null) => void
  setMerchantDraft: Dispatch<SetStateAction<MerchantDraft>>
  setQuantities: (value: Record<MenuItemId, number>) => void
  setSelectedCustomerId: (value: CustomerId | '') => void
  setSelectedRiderId: (value: RiderId | '') => void
  setSelectedStoreId: (value: StoreId | '') => void
}

export type SyncPageStateArgs = SyncPageStateDataArgs & SyncPageStateSetterArgs

export type SyncStoreRouteArgs = {
  blockedStoreIds: StoreId[]
  searchParams: URLSearchParams
  selectedStoreCategory: DisplayText
  selectedStoreId: StoreId | ''
  setQuantities: (value: Record<MenuItemId, number>) => void
  setSelectedStoreCategory: (value: DisplayText) => void
  setSelectedStoreId: (value: StoreId | '') => void
  state: { stores: Store[] }
}

export type SyncMerchantProfileDraftArgs = {
  merchantProfile: {
    id: string
    contactPhone: string
    payoutAccount?: {
      accountType?: MerchantPayoutAccountType
      bankName?: string
      accountNumber?: string
      accountHolder?: string
    }
  }
  lastMerchantProfileDraftSyncIdRef: { current: string | null }
  setMerchantProfileDraft: Dispatch<SetStateAction<MerchantProfileDraft>>
  setMerchantProfileFormErrors: (value: Record<string, never>) => void
}

export type ResetInvalidMerchantStoreSelectionArgs = {
  merchantStores: Store[]
  merchantWorkspaceView: MerchantWorkspaceView
  selectedMerchantStoreId: StoreId | ''
  setSelectedMerchantStoreId: (value: StoreId | '') => void
}
