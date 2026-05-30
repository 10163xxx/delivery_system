import type { NoteBody, NoteStatus, NoteTitle } from '@/objects/domain/DomainObjects'

export type SaveDemoNoteRequest = {
  title: NoteTitle
  body: NoteBody
  status: NoteStatus
}
