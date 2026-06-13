import type { MerchantRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import type { MerchantProfileFormProps } from '@/pages/MerchantConsole/objects/MerchantPageObjects'
import { Panel } from '@/pages/DeliveryConsole/components/primitives/LayoutPrimitives'
import { DELIVERY_CONSOLE_MESSAGES } from '@/pages/DeliveryConsole/functions/shared/DeliveryMessages'
import {
  PAYOUT_ACCOUNT_TYPE,
  type AccountHolderName,
  type AccountNumber,
  type BankName,
  type PhoneNumber,
} from '@/objects/core/SharedObjects'
import { asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import {
  getCurrentPayoutAccountLabel,
  MerchantProfileOverviewMetrics,
  MerchantProfileOverviewSidebar,
  MerchantProfileWithdrawalSection,
} from '@/pages/MerchantConsole/components/profile/MerchantProfileOverviewParts'

function MerchantProfileContactField({
  merchantProfileDraft,
  merchantProfileFormErrors,
  setMerchantProfileDraft,
  setMerchantProfileFormErrors,
}: Pick<MerchantProfileFormProps, 'merchantProfileDraft' | 'merchantProfileFormErrors' | 'setMerchantProfileDraft' | 'setMerchantProfileFormErrors'>) {
  return (
    <label>
      <span>联系电话</span>
      <input className={merchantProfileFormErrors.contactPhone ? 'field-error' : undefined} placeholder="例如 13800138000" value={merchantProfileDraft.contactPhone} onChange={(event) => { setMerchantProfileDraft((current) => ({ ...current, contactPhone: asDomainText<PhoneNumber>(event.target.value) })); setMerchantProfileFormErrors((current) => ({ ...current, contactPhone: undefined })) }} />
      {merchantProfileFormErrors.contactPhone ? <small className="field-error-text">{merchantProfileFormErrors.contactPhone}</small> : null}
    </label>
  )
}

function MerchantProfilePayoutFields({
  BANK_OPTIONS,
  merchantProfileDraft,
  merchantProfileFormErrors,
  setMerchantProfileDraft,
  setMerchantProfileFormErrors,
}: MerchantProfileFormProps) {
  return (
    <>
      <label>
        <span>提现方式</span>
        <select value={merchantProfileDraft.payoutAccountType} onChange={(event) => { const value = event.target.value === PAYOUT_ACCOUNT_TYPE.bank ? PAYOUT_ACCOUNT_TYPE.bank : PAYOUT_ACCOUNT_TYPE.alipay; setMerchantProfileDraft((current) => ({ ...current, payoutAccountType: value, bankName: value === PAYOUT_ACCOUNT_TYPE.bank ? current.bankName : asDomainText<BankName>('') })); setMerchantProfileFormErrors((current) => ({ ...current, bankName: undefined, accountNumber: undefined, accountHolder: undefined })) }}>
          <option value={PAYOUT_ACCOUNT_TYPE.alipay}>支付宝</option>
          <option value={PAYOUT_ACCOUNT_TYPE.bank}>银行卡</option>
        </select>
      </label>
      {merchantProfileDraft.payoutAccountType === PAYOUT_ACCOUNT_TYPE.bank ? (
        <label>
          <span>开户银行</span>
          <select className={merchantProfileFormErrors.bankName ? 'field-error' : undefined} value={merchantProfileDraft.bankName} onChange={(event) => { setMerchantProfileDraft((current) => ({ ...current, bankName: asDomainText<BankName>(event.target.value) })); setMerchantProfileFormErrors((current) => ({ ...current, bankName: undefined })) }}>
            <option value="">{DELIVERY_CONSOLE_MESSAGES.profile.bankOptionPlaceholder}</option>
            {BANK_OPTIONS.map((bank) => <option key={bank} value={bank}>{bank}</option>)}
          </select>
          {merchantProfileFormErrors.bankName ? <small className="field-error-text">{merchantProfileFormErrors.bankName}</small> : null}
        </label>
      ) : null}
      <label>
        <span>{merchantProfileDraft.payoutAccountType === PAYOUT_ACCOUNT_TYPE.bank ? '银行卡号' : '支付宝账号'}</span>
        <input className={merchantProfileFormErrors.accountNumber ? 'field-error' : undefined} placeholder={merchantProfileDraft.payoutAccountType === PAYOUT_ACCOUNT_TYPE.bank ? '输入银行卡号' : '输入支付宝账号'} value={merchantProfileDraft.accountNumber} onChange={(event) => { setMerchantProfileDraft((current) => ({ ...current, accountNumber: asDomainText<AccountNumber>(event.target.value) })); setMerchantProfileFormErrors((current) => ({ ...current, accountNumber: undefined })) }} />
        {merchantProfileFormErrors.accountNumber ? <small className="field-error-text">{merchantProfileFormErrors.accountNumber}</small> : null}
      </label>
      <label>
        <span>{merchantProfileDraft.payoutAccountType === PAYOUT_ACCOUNT_TYPE.bank ? '持卡人姓名' : '账户姓名'}</span>
        <input className={merchantProfileFormErrors.accountHolder ? 'field-error' : undefined} placeholder="输入姓名" value={merchantProfileDraft.accountHolder} onChange={(event) => { setMerchantProfileDraft((current) => ({ ...current, accountHolder: asDomainText<AccountHolderName>(event.target.value) })); setMerchantProfileFormErrors((current) => ({ ...current, accountHolder: undefined })) }} />
        {merchantProfileFormErrors.accountHolder ? <small className="field-error-text">{merchantProfileFormErrors.accountHolder}</small> : null}
      </label>
    </>
  )
}

function MerchantProfileAccountForm({
  BANK_OPTIONS,
  merchantProfileDraft,
  merchantProfileFormErrors,
  setMerchantProfileDraft,
  setMerchantProfileFormErrors,
}: MerchantProfileFormProps) {
  return (
    <div className="form-grid">
      <MerchantProfileContactField merchantProfileDraft={merchantProfileDraft} merchantProfileFormErrors={merchantProfileFormErrors} setMerchantProfileDraft={setMerchantProfileDraft} setMerchantProfileFormErrors={setMerchantProfileFormErrors} />
      <MerchantProfilePayoutFields BANK_OPTIONS={BANK_OPTIONS} merchantProfileDraft={merchantProfileDraft} merchantProfileFormErrors={merchantProfileFormErrors} setMerchantProfileDraft={setMerchantProfileDraft} setMerchantProfileFormErrors={setMerchantProfileFormErrors} />
    </div>
  )
}

export function MerchantProfileOverviewPanel(props: MerchantRoleProps) {
  const {
    BANK_OPTIONS,
    merchantProfile,
    merchantProfileDraft,
    merchantProfileFormErrors,
    saveMerchantProfile,
    setMerchantProfileDraft,
    setMerchantProfileFormErrors,
  } = props

  return (
    <Panel title="商家个人信息" description="维护提现信息，查看累计收入、已提现金额和可提现余额。">
      <MerchantProfileOverviewMetrics {...props} />
      <div className="merchant-store-module__layout">
        <MerchantProfileOverviewSidebar {...props} />
        <div className="merchant-store-content">
          <section className="merchant-section-card">
            <div className="ticket-header">
              <div><p className="ticket-kind">账户资料</p><h3>提现账户与联系信息</h3></div>
            </div>
            <MerchantProfileAccountForm BANK_OPTIONS={BANK_OPTIONS} merchantProfileDraft={merchantProfileDraft} merchantProfileFormErrors={merchantProfileFormErrors} setMerchantProfileDraft={setMerchantProfileDraft} setMerchantProfileFormErrors={setMerchantProfileFormErrors} />
            <div className="summary-bar">
              <div>
                <p>当前到账账户</p>
                <strong>{getCurrentPayoutAccountLabel(merchantProfile)}</strong>
              </div>
              <button className="primary-button" onClick={() => void saveMerchantProfile()} type="button">保存资料</button>
            </div>
          </section>
          <MerchantProfileWithdrawalSection {...props} />
        </div>
      </div>
    </Panel>
  )
}
