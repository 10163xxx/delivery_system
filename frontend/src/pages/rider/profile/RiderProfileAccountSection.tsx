import { buildRiderProfileDraft, type RiderProfileDraft, type RiderProfileErrors } from '@/rider/object/profile/RiderWorkspaceObjects'
import type { RiderProfileAccountSectionProps, RiderProfileWorkspaceProps } from '@/pages/rider/object/RiderPageObjects'
import { PAYOUT_ACCOUNT_TYPE } from '@/shared/object/core/SharedObjects'
import { DELIVERY_CONSOLE_MESSAGES, isValidBankAccountNumber } from '@/shared/delivery/DeliveryServices'
import {
  RiderProfileCurrentAccountSummary,
  RiderProfilePayoutFields,
  RiderProfilePayoutTypeField,
} from '@/pages/rider/profile/RiderProfileAccountFields'

export function createInitialRiderProfileDraft(selectedRider: RiderProfileWorkspaceProps['selectedRider']) {
  return buildRiderProfileDraft(selectedRider)
}

function validateProfileDraft(profileDraft: RiderProfileDraft) {
  const accountNumber = profileDraft.accountNumber.trim()
  const accountHolder = profileDraft.accountHolder.trim()
  const bankName = profileDraft.bankName.trim()
  const nextErrors: RiderProfileErrors = {
    bankName: profileDraft.payoutAccountType === PAYOUT_ACCOUNT_TYPE.bank ? (bankName ? undefined : '请选择开户银行') : undefined,
    accountNumber: accountNumber ? undefined : DELIVERY_CONSOLE_MESSAGES.profile.payoutAccountNumberRequired,
    accountHolder: accountHolder ? undefined : DELIVERY_CONSOLE_MESSAGES.profile.payoutAccountHolderRequired,
  }

  if (profileDraft.payoutAccountType === PAYOUT_ACCOUNT_TYPE.alipay && accountNumber && accountNumber.length < 4) {
    nextErrors.accountNumber = DELIVERY_CONSOLE_MESSAGES.profile.alipayAccountInvalid
  }
  if (profileDraft.payoutAccountType === PAYOUT_ACCOUNT_TYPE.bank && accountNumber && !isValidBankAccountNumber(accountNumber)) {
    nextErrors.accountNumber = DELIVERY_CONSOLE_MESSAGES.profile.bankAccountInvalid
  }
  return nextErrors
}

export function RiderProfileAccountSection({
  BANK_OPTIONS,
  profileDraft,
  profileErrors,
  runAction,
  selectedRider,
  setProfileDraft,
  setProfileErrors,
  updateRiderProfile,
}: RiderProfileAccountSectionProps) {
  async function saveRiderProfile() {
    const nextErrors = validateProfileDraft(profileDraft)
    setProfileErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    await runAction(() =>
      updateRiderProfile(selectedRider.id, {
        payoutAccount: {
          accountType: profileDraft.payoutAccountType,
          bankName: profileDraft.payoutAccountType === PAYOUT_ACCOUNT_TYPE.bank ? profileDraft.bankName.trim() : undefined,
          accountNumber: profileDraft.accountNumber.trim(),
          accountHolder: profileDraft.accountHolder.trim(),
        },
      }),
    )
  }

  return (
    <section className="merchant-section-card">
      <div className="ticket-header">
        <div>
          <p className="ticket-kind">账户资料</p>
          <h3>提现账户</h3>
        </div>
      </div>
      <div className="form-grid">
        <RiderProfilePayoutTypeField
          profileDraft={profileDraft}
          setProfileDraft={setProfileDraft}
          setProfileErrors={setProfileErrors}
        />
        <RiderProfilePayoutFields
          BANK_OPTIONS={BANK_OPTIONS}
          profileDraft={profileDraft}
          profileErrors={profileErrors}
          setProfileDraft={setProfileDraft}
          setProfileErrors={setProfileErrors}
        />
      </div>
      <RiderProfileCurrentAccountSummary selectedRider={selectedRider} onSave={() => void saveRiderProfile()} />
    </section>
  )
}
