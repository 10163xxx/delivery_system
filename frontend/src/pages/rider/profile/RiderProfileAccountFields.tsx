import type { RiderProfileAccountSectionProps } from '@/pages/rider/object/RiderPageObjects'
import { PAYOUT_ACCOUNT_TYPE } from '@/shared/object/core/SharedObjects'
import { DELIVERY_CONSOLE_MESSAGES } from '@/shared/delivery/DeliveryServices'

export function getCurrentPayoutAccountLabel(selectedRider: RiderProfileAccountSectionProps['selectedRider']) {
  return selectedRider.payoutAccount
    ? selectedRider.payoutAccount.accountType === PAYOUT_ACCOUNT_TYPE.bank
      ? `${selectedRider.payoutAccount.bankName ?? '银行卡'} ${selectedRider.payoutAccount.accountHolder} / ${selectedRider.payoutAccount.accountNumber}`
      : `支付宝 ${selectedRider.payoutAccount.accountHolder} / ${selectedRider.payoutAccount.accountNumber}`
    : '尚未设置'
}

export function RiderProfilePayoutTypeField({
  profileDraft,
  setProfileDraft,
  setProfileErrors,
}: Pick<RiderProfileAccountSectionProps, 'profileDraft' | 'setProfileDraft' | 'setProfileErrors'>) {
  return (
    <label>
      <span>提现方式</span>
      <select
        value={profileDraft.payoutAccountType}
        onChange={(event) => {
          const value = event.target.value === PAYOUT_ACCOUNT_TYPE.bank ? PAYOUT_ACCOUNT_TYPE.bank : PAYOUT_ACCOUNT_TYPE.alipay
          setProfileDraft((current) => ({ ...current, payoutAccountType: value, bankName: value === PAYOUT_ACCOUNT_TYPE.bank ? current.bankName : '' }))
          setProfileErrors((current) => ({ ...current, bankName: undefined, accountNumber: undefined, accountHolder: undefined }))
        }}
      >
        <option value={PAYOUT_ACCOUNT_TYPE.alipay}>支付宝</option>
        <option value={PAYOUT_ACCOUNT_TYPE.bank}>银行卡</option>
      </select>
    </label>
  )
}

export function RiderProfilePayoutFields({
  BANK_OPTIONS,
  profileDraft,
  profileErrors,
  setProfileDraft,
  setProfileErrors,
}: Pick<RiderProfileAccountSectionProps, 'BANK_OPTIONS' | 'profileDraft' | 'profileErrors' | 'setProfileDraft' | 'setProfileErrors'>) {
  return (
    <>
      {profileDraft.payoutAccountType === PAYOUT_ACCOUNT_TYPE.bank ? (
        <label>
          <span>开户银行</span>
          <select
            className={profileErrors.bankName ? 'field-error' : undefined}
            value={profileDraft.bankName}
            onChange={(event) => {
              setProfileDraft((current) => ({ ...current, bankName: event.target.value }))
              setProfileErrors((current) => ({ ...current, bankName: undefined }))
            }}
          >
            <option value="">{DELIVERY_CONSOLE_MESSAGES.profile.bankOptionPlaceholder}</option>
            {BANK_OPTIONS.map((bank: string) => <option key={bank} value={bank}>{bank}</option>)}
          </select>
          {profileErrors.bankName ? <small className="field-error-text">{profileErrors.bankName}</small> : null}
        </label>
      ) : null}
      <label>
        <span>{profileDraft.payoutAccountType === PAYOUT_ACCOUNT_TYPE.bank ? '银行卡号' : '支付宝账号'}</span>
        <input
          className={profileErrors.accountNumber ? 'field-error' : undefined}
          value={profileDraft.accountNumber}
          placeholder={profileDraft.payoutAccountType === PAYOUT_ACCOUNT_TYPE.bank ? '输入银行卡号' : '输入支付宝账号'}
          onChange={(event) => {
            setProfileDraft((current) => ({ ...current, accountNumber: event.target.value }))
            setProfileErrors((current) => ({ ...current, accountNumber: undefined }))
          }}
        />
        {profileErrors.accountNumber ? <small className="field-error-text">{profileErrors.accountNumber}</small> : null}
      </label>
      <label>
        <span>{profileDraft.payoutAccountType === PAYOUT_ACCOUNT_TYPE.bank ? '持卡人姓名' : '账户姓名'}</span>
        <input
          className={profileErrors.accountHolder ? 'field-error' : undefined}
          value={profileDraft.accountHolder}
          placeholder="输入姓名"
          onChange={(event) => {
            setProfileDraft((current) => ({ ...current, accountHolder: event.target.value }))
            setProfileErrors((current) => ({ ...current, accountHolder: undefined }))
          }}
        />
        {profileErrors.accountHolder ? <small className="field-error-text">{profileErrors.accountHolder}</small> : null}
      </label>
    </>
  )
}

export function RiderProfileCurrentAccountSummary({
  selectedRider,
  onSave,
}: {
  selectedRider: RiderProfileAccountSectionProps['selectedRider']
  onSave: () => void
}) {
  return (
    <div className="summary-bar">
      <div>
        <p>当前到账账户</p>
        <strong>{getCurrentPayoutAccountLabel(selectedRider)}</strong>
      </div>
      <button className="primary-button" onClick={onSave} type="button">
        保存资料
      </button>
    </div>
  )
}
