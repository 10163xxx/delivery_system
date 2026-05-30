import type { Dispatch, SetStateAction } from 'react'
import type { RiderProfileWorkspaceProps } from '@/objects/rider/page/RiderPageObjects'
import { CURRENCY_CENTS_SCALE, DELIVERY_CONSOLE_MESSAGES, MAX_WITHDRAW_AMOUNT_YUAN } from '@/features/delivery/DeliveryServices'

function parseWithdrawAmount(value: string) {
  const normalized = value.trim()
  if (!normalized) return null
  const amount = Number(normalized)
  if (!Number.isFinite(amount)) return null
  return amount
}

export function RiderProfileWithdrawSection({
  formatPrice,
  formatTime,
  runAction,
  selectedRider,
  setWithdrawAmount,
  setWithdrawError,
  withdrawAmount,
  withdrawError,
  withdrawRiderIncome,
}: Pick<RiderProfileWorkspaceProps, 'formatPrice' | 'formatTime' | 'runAction' | 'selectedRider' | 'withdrawRiderIncome'> & {
  withdrawAmount: string
  withdrawError: string | null
  setWithdrawAmount: Dispatch<SetStateAction<string>>
  setWithdrawError: Dispatch<SetStateAction<string | null>>
}) {
  async function submitWithdraw() {
    const amount = parseWithdrawAmount(withdrawAmount)
    if (amount === null || amount <= 0) {
      setWithdrawError(DELIVERY_CONSOLE_MESSAGES.account.invalidWithdrawAmount)
      return
    }
    if (amount > MAX_WITHDRAW_AMOUNT_YUAN) {
      setWithdrawError(DELIVERY_CONSOLE_MESSAGES.account.withdrawAmountTooLarge)
      return
    }
    if (Math.round(amount * CURRENCY_CENTS_SCALE) > selectedRider.availableToWithdrawCents) {
      setWithdrawError(DELIVERY_CONSOLE_MESSAGES.account.withdrawExceedsAvailableBalance)
      return
    }
    setWithdrawError(null)

    const success = await runAction(() =>
      withdrawRiderIncome(selectedRider.id, { amountCents: Math.round(amount * CURRENCY_CENTS_SCALE) }),
    )
    if (!success) return
    setWithdrawAmount('')
  }

  return (
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
  )
}
