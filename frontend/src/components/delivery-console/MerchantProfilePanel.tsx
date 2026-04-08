import { Panel } from '@/components/delivery-console/LayoutPrimitives'
import { DELIVERY_CONSOLE_MESSAGES } from '@/features/delivery-console'

export function MerchantProfilePanel(props: any) {
  const {
    formatPrice,
    merchantProfile,
    merchantStores,
    merchantPendingApplications,
    merchantReviewedApplications,
    merchantProfileDraft,
    merchantProfileFormErrors,
    setMerchantProfileDraft,
    setMerchantProfileFormErrors,
    BANK_OPTIONS,
    saveMerchantProfile,
    merchantWithdrawAmount,
    setMerchantWithdrawAmount,
    setMerchantWithdrawFieldError,
    merchantWithdrawError,
    withdrawMerchantIncome,
    formatTime,
  } = props

  return (
    <Panel title="商家个人信息" description="维护提现信息，查看累计收入、已提现金额和可提现余额。">
      <div className="metrics-grid">
        <div className="metric-card"><span>累计收入</span><strong>{formatPrice(merchantProfile?.settledIncomeCents ?? 0)}</strong></div>
        <div className="metric-card"><span>已提现</span><strong>{formatPrice(merchantProfile?.withdrawnCents ?? 0)}</strong></div>
        <div className="metric-card"><span>可提现余额</span><strong>{formatPrice(merchantProfile?.availableToWithdrawCents ?? 0)}</strong></div>
        <div className="metric-card"><span>店铺数</span><strong>{merchantStores.length}</strong></div>
      </div>

      <div className="merchant-store-module__layout">
        <aside className="merchant-store-sidebar">
          <section className="merchant-section-card">
            <p className="ticket-kind">基础信息</p>
            <div className="merchant-metric-list">
              <div><p>商家名称</p><strong>{merchantProfile?.merchantName ?? '未配置'}</strong></div>
              <div><p>入驻申请</p><strong>{merchantPendingApplications.length + merchantReviewedApplications.length} 条</strong></div>
              <div><p>已通过店铺</p><strong>{merchantStores.length} 家</strong></div>
            </div>
          </section>
        </aside>

        <div className="merchant-store-content">
          <section className="merchant-section-card">
            <div className="ticket-header">
              <div><p className="ticket-kind">账户资料</p><h3>提现账户与联系信息</h3></div>
            </div>
            <div className="form-grid">
              <label>
                <span>联系电话</span>
                <input className={merchantProfileFormErrors.contactPhone ? 'field-error' : undefined} placeholder="例如 13800138000" value={merchantProfileDraft.contactPhone} onChange={(event) => { setMerchantProfileDraft((current: any) => ({ ...current, contactPhone: event.target.value })); setMerchantProfileFormErrors((current: any) => ({ ...current, contactPhone: undefined })) }} />
                {merchantProfileFormErrors.contactPhone ? <small className="field-error-text">{merchantProfileFormErrors.contactPhone}</small> : null}
              </label>
              <label>
                <span>提现方式</span>
                <select value={merchantProfileDraft.payoutAccountType} onChange={(event) => { setMerchantProfileDraft((current: any) => ({ ...current, payoutAccountType: event.target.value, bankName: event.target.value === 'bank' ? current.bankName : '' })); setMerchantProfileFormErrors((current: any) => ({ ...current, bankName: undefined, accountNumber: undefined, accountHolder: undefined })) }}>
                  <option value="alipay">支付宝</option>
                  <option value="bank">银行卡</option>
                </select>
              </label>
              {merchantProfileDraft.payoutAccountType === 'bank' ? (
                <label>
                  <span>开户银行</span>
                  <select className={merchantProfileFormErrors.bankName ? 'field-error' : undefined} value={merchantProfileDraft.bankName} onChange={(event) => { setMerchantProfileDraft((current: any) => ({ ...current, bankName: event.target.value })); setMerchantProfileFormErrors((current: any) => ({ ...current, bankName: undefined })) }}>
                    <option value="">{DELIVERY_CONSOLE_MESSAGES.bankOptionPlaceholder}</option>
                    {BANK_OPTIONS.map((bank: string) => <option key={bank} value={bank}>{bank}</option>)}
                  </select>
                  {merchantProfileFormErrors.bankName ? <small className="field-error-text">{merchantProfileFormErrors.bankName}</small> : null}
                </label>
              ) : null}
              <label>
                <span>{merchantProfileDraft.payoutAccountType === 'bank' ? '银行卡号' : '支付宝账号'}</span>
                <input className={merchantProfileFormErrors.accountNumber ? 'field-error' : undefined} placeholder={merchantProfileDraft.payoutAccountType === 'bank' ? '输入银行卡号' : '输入支付宝账号'} value={merchantProfileDraft.accountNumber} onChange={(event) => { setMerchantProfileDraft((current: any) => ({ ...current, accountNumber: event.target.value })); setMerchantProfileFormErrors((current: any) => ({ ...current, accountNumber: undefined })) }} />
                {merchantProfileFormErrors.accountNumber ? <small className="field-error-text">{merchantProfileFormErrors.accountNumber}</small> : null}
              </label>
              <label>
                <span>{merchantProfileDraft.payoutAccountType === 'bank' ? '持卡人姓名' : '账户姓名'}</span>
                <input className={merchantProfileFormErrors.accountHolder ? 'field-error' : undefined} placeholder="输入姓名" value={merchantProfileDraft.accountHolder} onChange={(event) => { setMerchantProfileDraft((current: any) => ({ ...current, accountHolder: event.target.value })); setMerchantProfileFormErrors((current: any) => ({ ...current, accountHolder: undefined })) }} />
                {merchantProfileFormErrors.accountHolder ? <small className="field-error-text">{merchantProfileFormErrors.accountHolder}</small> : null}
              </label>
            </div>
            <div className="summary-bar">
              <div>
                <p>当前到账账户</p>
                <strong>{merchantProfile?.payoutAccount ? merchantProfile.payoutAccount.accountType === 'bank' ? `${merchantProfile.payoutAccount.bankName ?? '银行卡'} ${merchantProfile.payoutAccount.accountHolder} / ${merchantProfile.payoutAccount.accountNumber}` : `支付宝 ${merchantProfile.payoutAccount.accountHolder} / ${merchantProfile.payoutAccount.accountNumber}` : '尚未设置'}</strong>
              </div>
              <button className="primary-button" onClick={() => void saveMerchantProfile()} type="button">保存资料</button>
            </div>
          </section>

          <section className="merchant-section-card">
            <div className="ticket-header">
              <div><p className="ticket-kind">收入提现</p><h3>发起提现</h3></div>
              <span className="badge">可提 {formatPrice(merchantProfile?.availableToWithdrawCents ?? 0)}</span>
            </div>
            <div className="action-row">
              <input inputMode="decimal" placeholder="输入提现金额，例如 200" value={merchantWithdrawAmount} onChange={(event) => { setMerchantWithdrawAmount(event.target.value); setMerchantWithdrawFieldError(null) }} />
              <button className="primary-button" disabled={Boolean(merchantWithdrawError) || (merchantProfile?.availableToWithdrawCents ?? 0) <= 0} onClick={() => void withdrawMerchantIncome()} type="button">申请提现</button>
            </div>
            {merchantWithdrawError ? <small className="field-error-text">{merchantWithdrawError}</small> : null}
            <div className="ticket-grid">
              {merchantProfile?.withdrawalHistory?.length ? merchantProfile.withdrawalHistory.map((entry: any) => (
                <article key={entry.id} className="ticket-card">
                  <div className="ticket-header">
                    <div><p className="ticket-kind">提现记录</p><h3>{formatPrice(entry.amountCents)}</h3></div>
                    <span className="badge success">已提交</span>
                  </div>
                  <p className="meta-line">到账账户 {entry.accountLabel}</p>
                  <p className="meta-line">申请时间 {formatTime(entry.requestedAt)}</p>
                </article>
              )) : <div className="empty-card">当前还没有提现记录。</div>}
            </div>
          </section>
        </div>
      </div>
    </Panel>
  )
}
