// Business note: planner protocol DTO shared with backend planner APIs; keep field names and value object types aligned.
import type { NoteBody, NoteStatus, NoteTitle } from '@/objects/core/SharedObjects'

export type SaveDemoNoteRequest = {
  title: NoteTitle
  body: NoteBody
  status: NoteStatus
}
