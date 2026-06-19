// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
export const APPEAL_ROLE = {
  merchant: 'Merchant',
  rider: 'Rider',
} as const

export type AppealRole = (typeof APPEAL_ROLE)[keyof typeof APPEAL_ROLE]
