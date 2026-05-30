import type {
  IsoDateTime,
  NoteBody,
  NoteId,
  NoteStatus,
  NoteTitle,
} from '@/objects/domain/DomainObjects'

export type DemoNote = {
  id: NoteId
  title: NoteTitle
  body: NoteBody
  status: NoteStatus
  createdAt: IsoDateTime
}
