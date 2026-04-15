import type { RiderRoleProps } from '@/shared/AppBuildRoleProps'
import {
  PAYOUT_ACCOUNT_TYPE,
  ROLE,
  type MerchantPayoutAccountType,
  type Rider,
} from '@/shared/object/SharedObjects'

export type RiderWorkspaceView = 'console' | 'profile'

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
    chatDisabledReason: '抢单成功后即可与顾客和商家聊天。',
    appealPending: '申诉处理中',
    appealPlaceholder: '骑手申诉理由',
    eligibilityPlaceholder: '骑手复核理由',
    eligibilityAction: '发起接单资格复核',
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

export function getVisibleRiders(props: RiderRoleProps): Rider[] {
  const { role, session, state } = props
  if (role === ROLE.rider) {
    return state?.riders.filter((rider) => rider.id === session?.user.linkedProfileId) ?? []
  }
  return state?.riders ?? []
}
