// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
export const MEMBERSHIP_TIER = {
  standard: 'Standard',
  member: 'Member',
} as const

export type MembershipTier = (typeof MEMBERSHIP_TIER)[keyof typeof MEMBERSHIP_TIER]
