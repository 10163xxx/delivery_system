import type { NoteText, ResolutionText } from '@/objects/core/SharedObjects'

export type ResolveTicketRequest = {
  resolution: ResolutionText
  note: NoteText
}
