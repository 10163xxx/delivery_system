// Business note: frontend mirror of backend system object/support code used by protocol and app state boundaries.
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
