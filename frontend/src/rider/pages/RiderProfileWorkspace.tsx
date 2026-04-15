import { useState } from 'react'
import type { RiderRoleProps } from '@/shared/AppBuildRoleProps'
import {
  buildRiderProfileDraft,
  type RiderProfileDraft,
  type RiderProfileErrors,
} from '@/rider/app/RiderSupport'
import { PAYOUT_ACCOUNT_TYPE, type Rider } from '@/shared/object/SharedObjects'
import {
  CURRENCY_CENTS_SCALE,
  DELIVERY_CONSOLE_MESSAGES,
  MAX_WITHDRAW_AMOUNT_YUAN,
  isValidBankAccountNumber,
} from '@/shared/delivery/DeliveryServices'

type RiderProfileWorkspaceProps = Pick<
  RiderRoleProps,
  'BANK_OPTIONS' | 'formatPrice' | 'formatTime' | 'runAction' | 'updateRiderProfile' | 'withdrawRiderIncome'
> & {
  selectedRider: Rider
}

export function RiderProfileWorkspace({
  BANK_OPTIONS,
  formatPrice,
  formatTime,
  runAction,
  selectedRider,
  updateRiderProfile,
  withdrawRiderIncome,
}: RiderProfileWorkspaceProps) {
  const [profileDraft, setProfileDraft] = useState<RiderProfileDraft>(() =>
    buildRiderProfileDraft(selectedRider),
  )
  const [profileErrors, setProfileErrors] = useState<RiderProfileErrors>({})
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawError, setWithdrawError] = useState<string | null>(null)

  function validateProfileDraft() {
    const accountNumber = profileDraft.accountNumber.trim()
    const accountHolder = profileDraft.accountHolder.trim()
    const bankName = profileDraft.bankName.trim()
    const nextErrors: Record<string, string | undefined> = {
      bankName:
        profileDraft.payoutAccountType === PAYOUT_ACCOUNT_TYPE.bank
          ? bankName
            ? undefined
            : '请选择开户银行'
          : undefined,
      accountNumber: accountNumber ? undefined : DELIVERY_CONSOLE_MESSAGES.payoutAccountNumberRequired,
      accountHolder: accountHolder ? undefined : DELIVERY_CONSOLE_MESSAGES.payoutAccountHolderRequired,
    }

    if (
      profileDraft.payoutAccountType === PAYOUT_ACCOUNT_TYPE.alipay &&
      accountNumber &&
      accountNumber.length < 4
    ) {
      nextErrors.accountNumber = DELIVERY_CONSOLE_MESSAGES.alipayAccountInvalid
    }

    if (
      profileDraft.payoutAccountType === PAYOUT_ACCOUNT_TYPE.bank &&
      accountNumber &&
      !isValidBankAccountNumber(accountNumber)
    ) {
      nextErrors.accountNumber = DELIVERY_CONSOLE_MESSAGES.bankAccountInvalid
    }

    setProfileErrors(nextErrors)
    return !Object.values(nextErrors).some(Boolean)
  }

  async function saveRiderProfile() {
    if (!validateProfileDraft()) return

    await runAction(() =>
      updateRiderProfile(selectedRider.id, {
        payoutAccount: {
          accountType: profileDraft.payoutAccountType,
          bankName:
            profileDraft.payoutAccountType === PAYOUT_ACCOUNT_TYPE.bank
              ? profileDraft.bankName.trim()
              : undefined,
          accountNumber: profileDraft.accountNumber.trim(),
          accountHolder: profileDraft.accountHolder.trim(),
        },
      }),
    )
  }

  function parseWithdrawAmount(value: string) {
    const normalized = value.trim()
    if (!normalized) return null
    const amount = Number(normalized)
    if (!Number.isFinite(amount)) return null
    return amount
  }

  async function submitWithdraw() {
    const amount = parseWithdrawAmount(withdrawAmount)
    if (amount === null || amount <= 0) {
      setWithdrawError(DELIVERY_CONSOLE_MESSAGES.invalidWithdrawAmount)
      return
    }
    if (amount > MAX_WITHDRAW_AMOUNT_YUAN) {
      setWithdrawError(DELIVERY_CONSOLE_MESSAGES.withdrawAmountTooLarge)
      return
    }
    if (Math.round(amount * CURRENCY_CENTS_SCALE) > selectedRider.availableToWithdrawCents) {
      setWithdrawError(DELIVERY_CONSOLE_MESSAGES.withdrawExceedsAvailableBalance)
      return
    }
    setWithdrawError(null)

    const success = await runAction(() =>
      withdrawRiderIncome(selectedRider.id, {
        amountCents: Math.round(amount * CURRENCY_CENTS_SCALE),
      }),
    )
    if (!success) return

    setWithdrawAmount('')
  }

  return (
    <div className="merchant-store-module__layout">
      <aside className="merchant-store-sidebar">
        <section className="merchant-section-card">
          <p className="ticket-kind">基础信息</p>
          <div className="merchant-metric-list">
            <div>
              <p>骑手姓名</p>
              <strong>{selectedRider.name}</strong>
            </div>
            <div>
              <p>配送工具</p>
              <strong>{selectedRider.vehicle}</strong>
            </div>
            <div>
              <p>当前状态</p>
              <strong>{selectedRider.availability}</strong>
            </div>
          </div>
        </section>
      </aside>

      <div className="merchant-store-content">
        <section className="merchant-section-card">
          <div className="ticket-header">
            <div>
              <p className="ticket-kind">账户资料</p>
              <h3>提现账户</h3>
            </div>
          </div>
          <div className="form-grid">
            <label>
              <span>提现方式</span>
              <select
                value={profileDraft.payoutAccountType}
                onChange={(event) => {
                  const value =
                    event.target.value === PAYOUT_ACCOUNT_TYPE.bank
                      ? PAYOUT_ACCOUNT_TYPE.bank
                      : PAYOUT_ACCOUNT_TYPE.alipay
                  setProfileDraft((current) => ({
                    ...current,
                    payoutAccountType: value,
                    bankName: value === PAYOUT_ACCOUNT_TYPE.bank ? current.bankName : '',
                  }))
                  setProfileErrors((current) => ({
                    ...current,
                    bankName: undefined,
                    accountNumber: undefined,
                    accountHolder: undefined,
                  }))
                }}
              >
                <option value={PAYOUT_ACCOUNT_TYPE.alipay}>支付宝</option>
                <option value={PAYOUT_ACCOUNT_TYPE.bank}>银行卡</option>
              </select>
            </label>
            {profileDraft.payoutAccountType === PAYOUT_ACCOUNT_TYPE.bank ? (
              <label>
                <span>开户银行</span>
                <select
                  className={profileErrors.bankName ? 'field-error' : undefined}
                  value={profileDraft.bankName}
                  onChange={(event) => {
                    setProfileDraft((current) => ({
                      ...current,
                      bankName: event.target.value,
                    }))
                    setProfileErrors((current) => ({ ...current, bankName: undefined }))
                  }}
                >
                  <option value="">{DELIVERY_CONSOLE_MESSAGES.bankOptionPlaceholder}</option>
                  {BANK_OPTIONS.map((bank: string) => (
                    <option key={bank} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>
                {profileErrors.bankName ? (
                  <small className="field-error-text">{profileErrors.bankName}</small>
                ) : null}
              </label>
            ) : null}
            <label>
              <span>
                {profileDraft.payoutAccountType === PAYOUT_ACCOUNT_TYPE.bank ? '银行卡号' : '支付宝账号'}
              </span>
              <input
                className={profileErrors.accountNumber ? 'field-error' : undefined}
                value={profileDraft.accountNumber}
                placeholder={
                  profileDraft.payoutAccountType === PAYOUT_ACCOUNT_TYPE.bank
                    ? '输入银行卡号'
                    : '输入支付宝账号'
                }
                onChange={(event) => {
                  setProfileDraft((current) => ({
                    ...current,
                    accountNumber: event.target.value,
                  }))
                  setProfileErrors((current) => ({ ...current, accountNumber: undefined }))
                }}
              />
              {profileErrors.accountNumber ? (
                <small className="field-error-text">{profileErrors.accountNumber}</small>
              ) : null}
            </label>
            <label>
              <span>
                {profileDraft.payoutAccountType === PAYOUT_ACCOUNT_TYPE.bank ? '持卡人姓名' : '账户姓名'}
              </span>
              <input
                className={profileErrors.accountHolder ? 'field-error' : undefined}
                value={profileDraft.accountHolder}
                placeholder="输入姓名"
                onChange={(event) => {
                  setProfileDraft((current) => ({
                    ...current,
                    accountHolder: event.target.value,
                  }))
                  setProfileErrors((current) => ({ ...current, accountHolder: undefined }))
                }}
              />
              {profileErrors.accountHolder ? (
                <small className="field-error-text">{profileErrors.accountHolder}</small>
              ) : null}
            </label>
          </div>
          <div className="summary-bar">
            <div>
              <p>当前到账账户</p>
              <strong>
                {selectedRider.payoutAccount
                  ? selectedRider.payoutAccount.accountType === PAYOUT_ACCOUNT_TYPE.bank
                    ? `${selectedRider.payoutAccount.bankName ?? '银行卡'} ${selectedRider.payoutAccount.accountHolder} / ${selectedRider.payoutAccount.accountNumber}`
                    : `支付宝 ${selectedRider.payoutAccount.accountHolder} / ${selectedRider.payoutAccount.accountNumber}`
                  : '尚未设置'}
              </strong>
            </div>
            <button className="primary-button" onClick={() => void saveRiderProfile()} type="button">
              保存资料
            </button>
          </div>
        </section>

        <section className="merchant-section-card">
          <div className="ticket-header">
            <div>
              <p className="ticket-kind">收入提现</p>
              <h3>发起提现</h3>
            </div>
            <span className="badge">可提 {formatPrice(selectedRider.availableToWithdrawCents)}</span>
          </div>
          <div className="action-row">
            <input
              inputMode="decimal"
              placeholder="输入提现金额，例如 200"
              value={withdrawAmount}
              onChange={(event) => {
                setWithdrawAmount(event.target.value)
                setWithdrawError(null)
              }}
            />
            <button className="primary-button" onClick={() => void submitWithdraw()} type="button">
              申请提现
            </button>
          </div>
          {withdrawError ? <small className="field-error-text">{withdrawError}</small> : null}

          {selectedRider.withdrawalHistory?.length ? (
            selectedRider.withdrawalHistory.map((entry) => (
              <article key={entry.id} className="ticket-card">
                <div className="ticket-header">
                  <div>
                    <p className="ticket-kind">提现记录</p>
                    <h3>{formatPrice(entry.amountCents)}</h3>
                  </div>
                  <span className="badge">{formatTime(entry.requestedAt)}</span>
                </div>
                <p className="meta-line">{entry.accountLabel}</p>
              </article>
            ))
          ) : (
            <div className="empty-card">当前还没有提现记录。</div>
          )}
        </section>
      </div>
    </div>
  )
}
