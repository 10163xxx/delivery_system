import { useEffect, useState } from 'react'
import { OrderChatPanel } from '@/components/delivery-console/OrderChatPanel'
import { OrderList } from '@/components/delivery-console/OrderList'
import { Panel } from '@/components/delivery-console/LayoutPrimitives'
import {
  CURRENCY_CENTS_SCALE,
  DELIVERY_CONSOLE_MESSAGES,
  MAX_WITHDRAW_AMOUNT_YUAN,
} from '@/features/delivery-console'

export function RiderRoleView(props: any) {
  const {
    formatAggregateRating,
    formatPrice,
    formatTime,
    currentDisplayName,
    orderChatDrafts,
    orderChatErrors,
    selectedRider,
    selectedRiderId,
    setSelectedRiderId,
    role,
    session,
    state,
    eligibilityReviewDrafts,
    setEligibilityReviewDrafts,
    setOrderChatDrafts,
    setOrderChatErrors,
    runAction,
    buildEligibilityReviewPayload,
    riderOrders,
    riderAppealDrafts,
    setRiderAppealDrafts,
    buildReviewAppealPayload,
    statusLabels,
    submitOrderChatMessage,
    updateRiderProfile,
    withdrawRiderIncome,
    submitEligibilityReview,
    assignRider,
    pickupOrder,
    deliverOrder,
    submitReviewAppeal,
    BANK_OPTIONS,
  } = props
  const [profileDraft, setProfileDraft] = useState({
    payoutAccountType: 'alipay',
    bankName: '',
    accountNumber: '',
    accountHolder: '',
  })
  const [workspaceView, setWorkspaceView] = useState<'console' | 'profile'>('console')
  const [profileErrors, setProfileErrors] = useState<Record<string, string | undefined>>({})
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawError, setWithdrawError] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedRider) return
    setProfileDraft({
      payoutAccountType: selectedRider.payoutAccount?.accountType ?? 'alipay',
      bankName: selectedRider.payoutAccount?.bankName ?? '',
      accountNumber: selectedRider.payoutAccount?.accountNumber ?? '',
      accountHolder: selectedRider.payoutAccount?.accountHolder ?? '',
    })
    setProfileErrors({})
  }, [selectedRider?.id, selectedRider])

  function validateProfileDraft() {
    const accountNumber = profileDraft.accountNumber.trim()
    const accountHolder = profileDraft.accountHolder.trim()
    const bankName = profileDraft.bankName.trim()
    const nextErrors: Record<string, string | undefined> = {
      bankName:
        profileDraft.payoutAccountType === 'bank'
          ? bankName
            ? undefined
            : '请选择开户银行'
          : undefined,
      accountNumber: accountNumber ? undefined : DELIVERY_CONSOLE_MESSAGES.payoutAccountNumberRequired,
      accountHolder: accountHolder ? undefined : DELIVERY_CONSOLE_MESSAGES.payoutAccountHolderRequired,
    }

    if (profileDraft.payoutAccountType === 'alipay' && accountNumber && accountNumber.length < 4) {
      nextErrors.accountNumber = DELIVERY_CONSOLE_MESSAGES.alipayAccountInvalid
    }

    if (
      profileDraft.payoutAccountType === 'bank' &&
      accountNumber &&
      !/^[0-9 ]{8,30}$/.test(accountNumber)
    ) {
      nextErrors.accountNumber = DELIVERY_CONSOLE_MESSAGES.bankAccountInvalid
    }

    setProfileErrors(nextErrors)
    return !Object.values(nextErrors).some(Boolean)
  }

  async function saveRiderProfile() {
    if (!selectedRider) return
    if (!validateProfileDraft()) return

    await runAction(() =>
      updateRiderProfile(selectedRider.id, {
        payoutAccount: {
          accountType: profileDraft.payoutAccountType,
          bankName:
            profileDraft.payoutAccountType === 'bank'
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
    if (!selectedRider) return
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
    <section className="panel-stack">
      <div className="summary-bar">
        <div>
          <p>骑手工作台</p>
          <strong>{workspaceView === 'console' ? '配送台' : '个人信息'}</strong>
        </div>
        <div className="action-row">
          <button
            className={workspaceView === 'console' ? 'primary-button' : 'secondary-button'}
            onClick={() => setWorkspaceView('console')}
            type="button"
          >
            配送台
          </button>
          <button
            className={workspaceView === 'profile' ? 'primary-button' : 'secondary-button'}
            onClick={() => setWorkspaceView('profile')}
            type="button"
          >
            个人信息
          </button>
        </div>
      </div>

      {workspaceView === 'console' ? (
        <Panel title="骑手配送台" description="骑手评分按顾客反馈平均值实时计算。">
          <label className="compact-select">
            <span>骑手</span>
            <select
              value={selectedRiderId}
              disabled={role === 'rider'}
              onChange={(event) => setSelectedRiderId(event.target.value)}
            >
              {(role === 'rider'
                ? state.riders.filter((rider: any) => rider.id === session.user.linkedProfileId)
                : state.riders
              ).map((rider: any) => (
                <option key={rider.id} value={rider.id}>
                  {rider.name} · {rider.vehicle}
                </option>
              ))}
            </select>
          </label>

          {selectedRider ? (
            <div className="metrics-grid">
              <div className="metric-card">
                <span>骑手评分</span>
                <strong>
                  {formatAggregateRating(selectedRider.averageRating, selectedRider.ratingCount)}
                </strong>
              </div>
              <div className="metric-card">
                <span>当前状态</span>
                <strong>{selectedRider.availability}</strong>
              </div>
              <div className="metric-card">
                <span>累计收入</span>
                <strong>{formatPrice(selectedRider.earningsCents)}</strong>
              </div>
              <div className="metric-card">
                <span>1 星差评数</span>
                <strong>{selectedRider.oneStarRatingCount}</strong>
              </div>
            </div>
          ) : null}

          {selectedRider?.availability === 'Suspended' ? (
            <div className="ticket-actions">
              <input
                placeholder="骑手复核理由"
                value={eligibilityReviewDrafts[selectedRider.id] ?? ''}
                onChange={(event) =>
                  setEligibilityReviewDrafts((current: Record<string, string>) => ({
                    ...current,
                    [selectedRider.id]: event.target.value,
                  }))
                }
              />
              <button
                className="primary-button"
                onClick={() =>
                  void runAction(() =>
                    submitEligibilityReview(
                      buildEligibilityReviewPayload(
                        'Rider',
                        selectedRider.id,
                        eligibilityReviewDrafts[selectedRider.id] ?? '',
                      ),
                    ),
                  )
                }
                type="button"
              >
                发起接单资格复核
              </button>
            </div>
          ) : null}

          <OrderList
            orders={riderOrders}
            emptyText="当前没有可配送订单。"
            formatPrice={formatPrice}
            formatTime={formatTime}
            footer={(order) => {
              const hasSubmittedRiderReview = order.riderRating != null
              const hasPendingRiderAppeal = state.reviewAppeals.some(
                (appeal: any) =>
                  appeal.orderId === order.id &&
                  appeal.appellantRole === 'Rider' &&
                  appeal.status === 'Pending',
              )

              return (
                <>
                  <div className="action-row">
                    {order.status === 'ReadyForPickup' && !order.riderId ? (
                      <button
                        className="primary-button"
                        onClick={() =>
                          void runAction(() =>
                            assignRider(order.id, { riderId: selectedRiderId }),
                          )
                        }
                        type="button"
                      >
                        抢单
                      </button>
                    ) : null}
                    {order.status === 'ReadyForPickup' && order.riderId === selectedRiderId ? (
                      <button
                        className="secondary-button"
                        onClick={() => void runAction(() => pickupOrder(order.id))}
                        type="button"
                      >
                        已取餐
                      </button>
                    ) : null}
                    {order.status === 'Delivering' && order.riderId === selectedRiderId ? (
                      <button
                        className="primary-button"
                        onClick={() => void runAction(() => deliverOrder(order.id))}
                        type="button"
                      >
                        确认送达
                      </button>
                    ) : null}
                    {order.reviewStatus === 'Active' &&
                    order.riderId === selectedRiderId &&
                    hasSubmittedRiderReview ? (
                      hasPendingRiderAppeal ? (
                        <span className="badge warning">申诉处理中</span>
                      ) : (
                        <>
                          <input
                            placeholder="骑手申诉理由"
                            value={riderAppealDrafts[order.id] ?? ''}
                            onChange={(event) =>
                              setRiderAppealDrafts((current: Record<string, string>) => ({
                                ...current,
                                [order.id]: event.target.value,
                              }))
                            }
                          />
                          <button
                            className="secondary-button"
                            onClick={() =>
                              void runAction(() =>
                                submitReviewAppeal(
                                  order.id,
                                  buildReviewAppealPayload('Rider', riderAppealDrafts[order.id] ?? ''),
                                ),
                              )
                            }
                            type="button"
                          >
                            提交申诉
                          </button>
                        </>
                      )
                    ) : null}
                  </div>
                  <OrderChatPanel
                    currentDisplayName={currentDisplayName}
                    currentRole="rider"
                    draft={orderChatDrafts[order.id] ?? ''}
                    errorText={orderChatErrors[order.id]}
                    disabled={order.riderId !== selectedRiderId}
                    disabledReason={
                      order.riderId === selectedRiderId
                        ? undefined
                        : '抢单成功后即可与顾客和商家聊天。'
                    }
                    formatTime={formatTime}
                    order={order}
                    onChangeDraft={(value) => {
                      setOrderChatDrafts((current: Record<string, string>) => ({
                        ...current,
                        [order.id]: value,
                      }))
                      setOrderChatErrors((current: Record<string, string>) => {
                        if (!current[order.id]) return current
                        const next = { ...current }
                        delete next[order.id]
                        return next
                      })
                    }}
                    onSubmit={() => void submitOrderChatMessage(order.id)}
                  />
                </>
              )
            }}
            statusLabels={statusLabels}
          />
        </Panel>
      ) : (
        <Panel title="骑手个人信息" description="维护提现账户，查看累计收入、已提现金额和可提现余额。">
          {selectedRider ? (
            <>
              <div className="metrics-grid">
                <div className="metric-card">
                  <span>累计收入</span>
                  <strong>{formatPrice(selectedRider.earningsCents)}</strong>
                </div>
                <div className="metric-card">
                  <span>已提现</span>
                  <strong>{formatPrice(selectedRider.withdrawnCents)}</strong>
                </div>
                <div className="metric-card">
                  <span>可提现余额</span>
                  <strong>{formatPrice(selectedRider.availableToWithdrawCents)}</strong>
                </div>
                <div className="metric-card">
                  <span>配送区域</span>
                  <strong>{selectedRider.zone}</strong>
                </div>
              </div>

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
                          const value = event.target.value
                          setProfileDraft((current) => ({
                            ...current,
                            payoutAccountType: value,
                            bankName: value === 'bank' ? current.bankName : '',
                          }))
                          setProfileErrors((current) => ({
                            ...current,
                            bankName: undefined,
                            accountNumber: undefined,
                            accountHolder: undefined,
                          }))
                        }}
                      >
                        <option value="alipay">支付宝</option>
                        <option value="bank">银行卡</option>
                      </select>
                    </label>
                    {profileDraft.payoutAccountType === 'bank' ? (
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
                      <span>{profileDraft.payoutAccountType === 'bank' ? '银行卡号' : '支付宝账号'}</span>
                      <input
                        className={profileErrors.accountNumber ? 'field-error' : undefined}
                        value={profileDraft.accountNumber}
                        placeholder={profileDraft.payoutAccountType === 'bank' ? '输入银行卡号' : '输入支付宝账号'}
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
                      <span>{profileDraft.payoutAccountType === 'bank' ? '持卡人姓名' : '账户姓名'}</span>
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
                            ? selectedRider.payoutAccount.accountType === 'bank'
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
                      selectedRider.withdrawalHistory.map((entry: any) => (
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
            </>
          ) : (
            <div className="empty-card">当前没有可用的骑手资料。</div>
          )}
        </Panel>
      )}
    </section>
  )
}
