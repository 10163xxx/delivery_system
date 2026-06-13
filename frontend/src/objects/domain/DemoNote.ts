import type {
  IsoDateTime,
  NoteBody,
  NoteId,
  NoteStatus,
  NoteTitle,
} from '@/objects/core/SharedObjects'

export type DemoNote = {
  id: NoteId
  title: NoteTitle
  body: NoteBody
  status: NoteStatus
  createdAt: IsoDateTime
}
