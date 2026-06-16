import { PAYOUT_ACCOUNT_TYPE } from '@/objects/core/SharedObjects'
import type { MerchantProfileOverviewSidebarProps } from '@/pages/MerchantConsole/objects/MerchantPageObjects'

export function getCurrentMerchantPayoutAccountLabel(
  merchantProfile: MerchantProfileOverviewSidebarProps['merchantProfile'],
) {
  if (!merchantProfile?.payoutAccount) return '尚未设置'
  if (merchantProfile.payoutAccount.accountType === PAYOUT_ACCOUNT_TYPE.bank) {
    return `${merchantProfile.payoutAccount.bankName ?? '银行卡'} ${merchantProfile.payoutAccount.accountHolder} / ${merchantProfile.payoutAccount.accountNumber}`
  }
  return `支付宝 ${merchantProfile.payoutAccount.accountHolder} / ${merchantProfile.payoutAccount.accountNumber}`
}
