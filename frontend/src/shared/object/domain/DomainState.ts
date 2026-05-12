import type {
  DeliveryAccountCollections,
  DeliveryCommerceCollections,
  DeliveryGovernanceCollections,
  DeliveryOrderState,
} from '@/shared/object/domain/DomainSlices'

export type DeliveryAppState = DeliveryAccountCollections &
  DeliveryCommerceCollections &
  DeliveryGovernanceCollections & {
    deliveryState: DeliveryOrderState
  } & DeliveryOrderState
