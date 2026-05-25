import {
  PAYOUT_ACCOUNT_TYPE,
  type MerchantPayoutAccountType,
} from '@/shared/object/core/SharedObjects'
import type { Rider } from '@/shared/object/core/SharedObjects'

export const RIDER_WORKSPACE_VIEW = {
  console: 'console',
  profile: 'profile',
} as const

export type RiderWorkspaceView =
  (typeof RIDER_WORKSPACE_VIEW)[keyof typeof RIDER_WORKSPACE_VIEW]

export type RiderProfileDraft = {
  payoutAccountType: MerchantPayoutAccountType
  bankName: string
  accountNumber: string
  accountHolder: string
}

export type RiderProfileErrors = {
  bankName?: string
  accountNumber?: string
  accountHolder?: string
}

const RIDER_CONSOLE_AVAILABILITY_COPY = {
  availabilityAvailable: '接单中',
  availabilityOnDelivery: '配送中',
  availabilitySuspended: '已取消接单资格',
  availabilityUnavailable: '暂不接单',
  startAccepting: '开始接单',
  stopAccepting: '不再接单',
  onDeliveryLocked: '配送中不可切换接单状态',
} as const

const RIDER_CONSOLE_SUPPORT_COPY = {
  chatDisabledReason: '抢单成功后即可与顾客和商家聊天。',
  appealPending: '申诉处理中',
  appealPlaceholder: '骑手申诉理由',
  eligibilityPlaceholder: '骑手复核理由',
  eligibilityAction: '发起接单资格复核',
} as const

export const RIDER_CONSOLE_COPY = {
  workspace: {
    title: '骑手工作台',
    console: '配送台',
    profile: '个人信息',
  },
  consolePanel: {
    title: '骑手配送台',
    description: '骑手评分按顾客反馈平均值实时计算。',
    emptyOrders: '当前没有可配送订单。',
    ...RIDER_CONSOLE_AVAILABILITY_COPY,
    ...RIDER_CONSOLE_SUPPORT_COPY,
  },
  profilePanel: {
    title: '骑手个人信息',
    description: '维护提现账户，查看累计收入、已提现金额和可提现余额。',
  },
} as const

export function buildRiderProfileDraft(rider: Rider): RiderProfileDraft {
  return {
    payoutAccountType: rider.payoutAccount?.accountType ?? PAYOUT_ACCOUNT_TYPE.alipay,
    bankName: rider.payoutAccount?.bankName ?? '',
    accountNumber: rider.payoutAccount?.accountNumber ?? '',
    accountHolder: rider.payoutAccount?.accountHolder ?? '',
  }
}
