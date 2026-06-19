// Business note: frontend mirror of backend system object/support code used by protocol and app state boundaries.
export const NOTE_STATUS = {
  draft: 'draft',
  published: 'published',
} as const

export type NoteStatus = (typeof NOTE_STATUS)[keyof typeof NOTE_STATUS]
