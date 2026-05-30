import type {
  DeliveryAccountCollections,
  DeliveryCommerceCollections,
  DeliveryGovernanceCollections,
  DeliveryOrderState,
} from '@/objects/domain/DomainSlices'

export type DeliveryAppState = DeliveryAccountCollections &
  DeliveryCommerceCollections &
  DeliveryGovernanceCollections & {
    deliveryState: DeliveryOrderState
  } & DeliveryOrderState
