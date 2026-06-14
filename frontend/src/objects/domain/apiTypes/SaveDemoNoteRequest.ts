import type { NoteBody, NoteStatus, NoteTitle } from '@/objects/core/SharedObjects'

export type SaveDemoNoteRequest = {
  title: NoteTitle
  body: NoteBody
  status: NoteStatus
}
