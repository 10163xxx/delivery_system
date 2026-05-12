import type { Dispatch, SetStateAction } from 'react'
import type { MerchantDraft, MerchantProfileDraft, MerchantWorkspaceView } from '@/shared/object/core/DeliveryAppObjects'
import type { Customer, MerchantPayoutAccountType, Store } from '@/shared/object/core/SharedObjects'

type SyncPageStateDataArgs = {
  state: {
    customers: Customer[]
    stores: Store[]
    riders: { id: string }[]
  }
  session: {
    user: {
      role: string
      linkedProfileId?: string
      displayName: string
    }
  }
  selectedCustomerId: string
  selectedRiderId: string
  selectedStoreId: string
}

type SyncPageStateSetterArgs = {
  setDeliveryAddress: (value: string) => void
  setDeliveryAddressError: (value: string | null) => void
  setMerchantDraft: Dispatch<SetStateAction<MerchantDraft>>
  setQuantities: (value: Record<string, number>) => void
  setSelectedCustomerId: (value: string) => void
  setSelectedRiderId: (value: string) => void
  setSelectedStoreId: (value: string) => void
}

export type SyncPageStateArgs = SyncPageStateDataArgs & SyncPageStateSetterArgs

export type SyncStoreRouteArgs = {
  searchParams: URLSearchParams
  selectedStoreCategory: string
  selectedStoreId: string
  setQuantities: (value: Record<string, number>) => void
  setSelectedStoreCategory: (value: string) => void
  setSelectedStoreId: (value: string) => void
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
  selectedMerchantStoreId: string
  setSelectedMerchantStoreId: (value: string) => void
}
