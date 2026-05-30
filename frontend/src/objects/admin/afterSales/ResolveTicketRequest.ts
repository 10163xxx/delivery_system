import type { NoteText, ResolutionText } from '@/objects/domain/DomainObjects'

export type ResolveTicketRequest = {
  resolution: ResolutionText
  note: NoteText
}
