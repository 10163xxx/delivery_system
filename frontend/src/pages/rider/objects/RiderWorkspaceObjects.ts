import {
  PAYOUT_ACCOUNT_TYPE,
  type AccountHolderName,
  type AccountNumber,
  type BankName,
  type DisplayText,
  type MerchantPayoutAccountType,
} from '@/objects/core/SharedObjects'
import type { Rider } from '@/objects/core/SharedObjects'
import { asDomainText } from '@/features/delivery/DeliveryShared'

export const RIDER_WORKSPACE_VIEW = {
  console: 'console',
  acceptance: 'acceptance',
  profile: 'profile',
} as const

export type RiderWorkspaceView =
  (typeof RIDER_WORKSPACE_VIEW)[keyof typeof RIDER_WORKSPACE_VIEW]

export type RiderProfileDraft = {
  payoutAccountType: MerchantPayoutAccountType
  bankName: BankName
  accountNumber: AccountNumber
  accountHolder: AccountHolderName
}

export type RiderProfileErrors = {
  bankName?: DisplayText
  accountNumber?: DisplayText
  accountHolder?: DisplayText
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
    acceptance: '接单台',
    profile: '个人信息',
  },
  consolePanel: {
    title: '骑手配送台',
    description: '只显示当前骑手已接单且尚未完成配送的订单。',
    emptyOrders: '当前没有已接单待配送订单。',
    ...RIDER_CONSOLE_AVAILABILITY_COPY,
    ...RIDER_CONSOLE_SUPPORT_COPY,
  },
  acceptancePanel: {
    title: '骑手接单台',
    description: '展示所有商家已备好、尚未分配骑手的订单。',
    emptyOrders: '当前没有待接单订单。',
    unavailableHint: '骑手需要处于接单中状态才能抢单。',
  },
  profilePanel: {
    title: '骑手个人信息',
    description: '查看骑手资料，并进入历史订单或提现处理。',
    historyButton: '历史订单',
    withdrawButton: '提现',
    overviewButton: '资料概览',
    historyTitle: '历史订单',
    historyDescription: '只展示当前骑手已完成配送的历史订单。',
    emptyHistoryOrders: '当前还没有已完成配送的历史订单。',
  },
} as const

export function buildRiderProfileDraft(rider: Rider): RiderProfileDraft {
  return {
    payoutAccountType: rider.payoutAccount?.accountType ?? PAYOUT_ACCOUNT_TYPE.alipay,
    bankName: rider.payoutAccount?.bankName ?? asDomainText<BankName>(''),
    accountNumber: rider.payoutAccount?.accountNumber ?? asDomainText<AccountNumber>(''),
    accountHolder: rider.payoutAccount?.accountHolder ?? asDomainText<AccountHolderName>(''),
  }
}
