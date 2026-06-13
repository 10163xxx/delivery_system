export const MEMBERSHIP_TIER = {
  standard: 'Standard',
  member: 'Member',
} as const

export type MembershipTier = (typeof MEMBERSHIP_TIER)[keyof typeof MEMBERSHIP_TIER]
