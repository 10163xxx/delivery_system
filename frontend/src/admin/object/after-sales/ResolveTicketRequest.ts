import type { ResolutionText } from '@/shared/object/domain/DomainObjects'

export type ResolveTicketRequest = {
  resolution: ResolutionText
  note: ResolutionText
}
