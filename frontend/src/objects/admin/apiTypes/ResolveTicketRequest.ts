// Business note: service protocol DTO shared with backend apiTypes; keep field names and value object types aligned.
import type { NoteText, ResolutionText } from '@/objects/core/SharedObjects'

export type ResolveTicketRequest = {
  resolution: ResolutionText
  note: NoteText
}
