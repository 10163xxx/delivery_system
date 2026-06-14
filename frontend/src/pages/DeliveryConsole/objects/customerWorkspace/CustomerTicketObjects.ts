import type {
  OrderId,
  ResolveTicketRequest,
} from '@/objects/core/SharedObjects'

export type ResolutionDraftMap = Record<OrderId, ResolveTicketRequest>
