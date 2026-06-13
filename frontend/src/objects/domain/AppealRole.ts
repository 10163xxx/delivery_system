export const APPEAL_ROLE = {
  merchant: 'Merchant',
  rider: 'Rider',
} as const

export type AppealRole = (typeof APPEAL_ROLE)[keyof typeof APPEAL_ROLE]
