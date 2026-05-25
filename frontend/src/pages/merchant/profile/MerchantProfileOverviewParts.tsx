import type {
  MerchantProfileOverviewMetricsProps,
  MerchantProfileOverviewSidebarProps,
  MerchantProfileWithdrawalSectionProps,
} from '@/pages/merchant/object/MerchantPageObjects'
import { DELIVERY_CONSOLE_MESSAGES } from '@/shared/delivery/DeliveryServices'
import {
  PAYOUT_ACCOUNT_TYPE,
  ROUTE_PATH,
  type MerchantWithdrawal,
} from '@/shared/object/core/SharedObjects'

function getMerchantTrendSummary(merchantMonthlyTrend: MerchantProfileOverviewSidebarProps['merchantMonthlyTrend']) {
  return {
    monthlyOrderCount: merchantMonthlyTrend.reduce((sum, entry) => sum + entry.orderCount, 0),
    monthlyIncomeCents: merchantMonthlyTrend.reduce((sum, entry) => sum + entry.incomeCents, 0),
  }
}

export function getCurrentPayoutAccountLabel(merchantProfile: MerchantProfileOverviewSidebarProps['merchantProfile']) {
  if (!merchantProfile?.payoutAccount) return '尚未设置'
  if (merchantProfile.payoutAccount.accountType === PAYOUT_ACCOUNT_TYPE.bank) {
    return `${merchantProfile.payoutAccount.bankName ?? '银行卡'} ${merchantProfile.payoutAccount.accountHolder} / ${merchantProfile.payoutAccount.accountNumber}`
  }
  return `支付宝 ${merchantProfile.payoutAccount.accountHolder} / ${merchantProfile.payoutAccount.accountNumber}`
}

function MerchantWithdrawalRecords({
  formatPrice,
  formatTime,
  withdrawalHistory,
}: {
  formatPrice: MerchantProfileWithdrawalSectionProps['formatPrice']
  formatTime: MerchantProfileWithdrawalSectionProps['formatTime']
  withdrawalHistory: MerchantWithdrawal[]
}) {
  if (!withdrawalHistory.length) return <div className="empty-card">当前还没有提现记录。</div>

  return (
    <>
      {withdrawalHistory.map((entry: MerchantWithdrawal) => (
        <article key={entry.id} className="ticket-card">
          <div className="ticket-header">
            <div><p className="ticket-kind">提现记录</p><h3>{formatPrice(entry.amountCents)}</h3></div>
            <span className="badge success">已提交</span>
          </div>
          <p className="meta-line">到账账户 {entry.accountLabel}</p>
          <p className="meta-line">申请时间 {formatTime(entry.requestedAt)}</p>
        </article>
      ))}
    </>
  )
}

export function MerchantProfileOverviewMetrics({
  formatPrice,
  merchantProfile,
  merchantStores,
}: MerchantProfileOverviewMetricsProps) {
  return (
    <div className="metrics-grid">
      <div className="metric-card"><span>累计收入</span><strong>{formatPrice(merchantProfile?.settledIncomeCents ?? 0)}</strong></div>
      <div className="metric-card"><span>已提现</span><strong>{formatPrice(merchantProfile?.withdrawnCents ?? 0)}</strong></div>
      <div className="metric-card"><span>可提现余额</span><strong>{formatPrice(merchantProfile?.availableToWithdrawCents ?? 0)}</strong></div>
      <div className="metric-card"><span>店铺数</span><strong>{merchantStores.length}</strong></div>
    </div>
  )
}

export function MerchantProfileOverviewSidebar(props: MerchantProfileOverviewSidebarProps) {
  const {
    formatPrice,
    merchantMonthlyTrend,
    merchantPendingApplications,
    merchantProfile,
    merchantReviewedApplications,
    merchantStores,
    navigate,
  } = props
  const { monthlyIncomeCents, monthlyOrderCount } = getMerchantTrendSummary(merchantMonthlyTrend)

  return (
    <aside className="merchant-store-sidebar">
      <section className="merchant-section-card">
        <p className="ticket-kind">基础信息</p>
        <div className="merchant-metric-list">
          <div><p>商家名称</p><strong>{merchantProfile?.merchantName ?? DELIVERY_CONSOLE_MESSAGES.profile.notConfigured}</strong></div>
          <div><p>入驻申请</p><strong>{merchantPendingApplications.length + merchantReviewedApplications.length} 条</strong></div>
          <div><p>已通过店铺</p><strong>{merchantStores.length} 家</strong></div>
        </div>
      </section>
      <section className="merchant-section-card">
        <div className="ticket-header">
          <div><p className="ticket-kind">经营数据</p><h3>近 30 天趋势</h3></div>
        </div>
        <div className="merchant-metric-list">
          <div><p>订单数</p><strong>{monthlyOrderCount} 单</strong></div>
          <div><p>收入</p><strong>{formatPrice(monthlyIncomeCents)}</strong></div>
        </div>
        <button className="primary-button" onClick={() => navigate(ROUTE_PATH.merchantProfileAnalytics)} type="button">查看趋势图</button>
      </section>
    </aside>
  )
}

export function MerchantProfileWithdrawalSection({
  formatPrice,
  formatTime,
  merchantProfile,
  merchantWithdrawAmount,
  merchantWithdrawError,
  setMerchantWithdrawAmount,
  setMerchantWithdrawFieldError,
  withdrawMerchantIncome,
}: MerchantProfileWithdrawalSectionProps) {
  return (
    <section className="merchant-section-card">
      <div className="ticket-header">
        <div><p className="ticket-kind">收入提现</p><h3>发起提现</h3></div>
        <span className="badge">可提 {formatPrice(merchantProfile?.availableToWithdrawCents ?? 0)}</span>
      </div>
      <div className="action-row">
        <input
          inputMode="decimal"
          placeholder="输入提现金额，例如 200"
          value={merchantWithdrawAmount}
          onChange={(event) => {
            setMerchantWithdrawAmount(event.target.value)
            setMerchantWithdrawFieldError(null)
          }}
        />
        <button
          className="primary-button"
          disabled={Boolean(merchantWithdrawError) || (merchantProfile?.availableToWithdrawCents ?? 0) <= 0}
          onClick={() => void withdrawMerchantIncome()}
          type="button"
        >
          申请提现
        </button>
      </div>
      {merchantWithdrawError ? <small className="field-error-text">{merchantWithdrawError}</small> : null}
      <div className="ticket-grid">
        <MerchantWithdrawalRecords
          formatPrice={formatPrice}
          formatTime={formatTime}
          withdrawalHistory={merchantProfile?.withdrawalHistory ?? []}
        />
      </div>
    </section>
  )
}
