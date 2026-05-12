import {
  CURRENCY_CENTS_SCALE,
  MEMBER_AUTO_DISPATCH_MINUTES,
  STANDARD_AUTO_DISPATCH_MINUTES,
} from '@/shared/delivery/DeliveryServices'

export const CUSTOMER_PROFILE_COPY = {
  membershipMember: '会员',
  membershipStandard: '普通',
  noneDisplay: '--',
  rechargePreviewMarginTop: '16px',
  sectionSpacing: '20px',
} as const

export const CUSTOMER_PROFILE_RULES = {
  centsScale: CURRENCY_CENTS_SCALE,
  memberAutoDispatchMinutes: MEMBER_AUTO_DISPATCH_MINUTES,
  standardAutoDispatchMinutes: STANDARD_AUTO_DISPATCH_MINUTES,
} as const
