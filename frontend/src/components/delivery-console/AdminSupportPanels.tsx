import { Panel } from '@/components/delivery-console/LayoutPrimitives'

export function AdminSupportPanels(props: any) {
  const {
    afterSalesResolutionDrafts,
    afterSalesTickets,
    formatTime,
    setAfterSalesResolutionDrafts,
    runAction,
    buildAfterSalesResolutionPayload,
    resolveAfterSalesTicket,
    state,
    resolutionDrafts,
    setResolutionDrafts,
    buildResolutionPayload,
    resolveTicket,
  } = props

  return (
    <>
      <Panel title="售后申请处理" description="审核顾客提交的退货或赔偿申请，并回写最终处理结果。">
        <div className="ticket-grid">
          {afterSalesTickets.length === 0 ? (
            <div className="empty-card">当前没有售后申请。</div>
          ) : (
            afterSalesTickets.map((ticket: any) => {
              const draft = afterSalesResolutionDrafts[ticket.id]
              const isCompensation = ticket.requestType === 'CompensationRequest'
              const resolutionMode = draft?.resolutionMode ?? 'Balance'
              const needsAmount = resolutionMode !== 'Manual'

              return (
                <article key={ticket.id} className="ticket-card">
                  <div className="ticket-header">
                    <div>
                      <p className="ticket-kind">
                        {ticket.requestType === 'ReturnRequest' ? '退货售后' : '赔偿售后'}
                      </p>
                      <h3>订单 {ticket.orderId}</h3>
                    </div>
                    <span className={ticket.status === 'Open' ? 'badge warning' : 'badge success'}>
                      {ticket.status === 'Open'
                        ? '待审核'
                        : ticket.approved
                          ? '已通过'
                          : '已驳回'}
                    </span>
                  </div>
                  <p>{ticket.summary}</p>
                  <p className="meta-line">
                    {ticket.submittedByName ? `申请人 ${ticket.submittedByName} · ` : ''}
                    提交于 {formatTime(ticket.submittedAt)}
                  </p>
                  {isCompensation && ticket.expectedCompensationCents ? (
                    <p className="meta-line">
                      期望赔偿 ¥{(ticket.expectedCompensationCents / 100).toFixed(2)}
                    </p>
                  ) : null}
                  {ticket.status === 'Open' ? (
                    <div className="ticket-actions">
                      <select
                        value={resolutionMode}
                        onChange={(event) =>
                          setAfterSalesResolutionDrafts((current: Record<string, any>) => ({
                            ...current,
                            [ticket.id]: {
                              approved: current[ticket.id]?.approved ?? true,
                              resolutionNote:
                                current[ticket.id]?.resolutionNote ?? '售后申请核实通过',
                              resolutionMode: event.target.value,
                              actualCompensationYuan:
                                current[ticket.id]?.actualCompensationYuan ?? '',
                            },
                          }))
                        }
                      >
                        <option value="Balance">退回余额</option>
                        <option value="Coupon">补发优惠券</option>
                        <option value="Manual">仅记录处理结果</option>
                      </select>
                      {needsAmount ? (
                        <input
                          min="0"
                          placeholder={isCompensation ? '补偿金额（元）' : '退款金额（元，不填则默认实付金额）'}
                          step="0.01"
                          type="number"
                          value={draft?.actualCompensationYuan ?? ''}
                          onChange={(event) =>
                            setAfterSalesResolutionDrafts((current: Record<string, any>) => ({
                              ...current,
                              [ticket.id]: {
                                approved: current[ticket.id]?.approved ?? true,
                                resolutionNote:
                                  current[ticket.id]?.resolutionNote ?? '售后申请核实通过',
                                resolutionMode: current[ticket.id]?.resolutionMode ?? 'Balance',
                                actualCompensationYuan: event.target.value,
                              },
                            }))
                          }
                        />
                      ) : null}
                      <input
                        value={draft?.resolutionNote ?? '售后申请核实通过'}
                        onChange={(event) =>
                          setAfterSalesResolutionDrafts((current: Record<string, any>) => ({
                            ...current,
                            [ticket.id]: {
                              approved: current[ticket.id]?.approved ?? true,
                              resolutionMode: current[ticket.id]?.resolutionMode ?? 'Balance',
                              actualCompensationYuan: current[ticket.id]?.actualCompensationYuan ?? '',
                              resolutionNote: event.target.value,
                            },
                          }))
                        }
                      />
                      <button
                        className="primary-button"
                        onClick={() =>
                          void runAction(() =>
                            resolveAfterSalesTicket(
                              ticket.id,
                              buildAfterSalesResolutionPayload(
                                true,
                                afterSalesResolutionDrafts[ticket.id],
                              ),
                            ),
                          )
                        }
                        type="button"
                      >
                        同意售后
                      </button>
                      <button
                        className="secondary-button"
                        onClick={() =>
                          void runAction(() =>
                            resolveAfterSalesTicket(
                              ticket.id,
                              buildAfterSalesResolutionPayload(false, {
                                ...(afterSalesResolutionDrafts[ticket.id] ?? {
                                  approved: true,
                                  resolutionNote: '售后申请核实通过',
                                  resolutionMode: 'Balance',
                                  actualCompensationYuan: '',
                                }),
                                approved: false,
                                resolutionNote:
                                  afterSalesResolutionDrafts[ticket.id]?.resolutionNote ??
                                  '未达到售后标准，申请驳回',
                              }),
                            ),
                          )
                        }
                        type="button"
                      >
                        驳回申请
                      </button>
                    </div>
                  ) : (
                    <p className="meta-line">
                      {ticket.reviewedAt ? `处理于 ${formatTime(ticket.reviewedAt)} · ` : ''}
                      {ticket.approved ? '已通过' : '已驳回'}
                      {ticket.resolutionMode === 'Coupon' && ticket.issuedCoupon
                        ? ` · 已补发 ${ticket.issuedCoupon.title}`
                        : ''}
                      {ticket.actualCompensationCents
                        ? ` · 实际处理金额 ¥${(ticket.actualCompensationCents / 100).toFixed(2)}`
                        : ''}
                      {ticket.resolutionNote ? ` · ${ticket.resolutionNote}` : ''}
                    </p>
                  )}
                </article>
              )
            })
          )}
        </div>
      </Panel>

      <Panel title="管理员工单中心" description="处理用户反馈生成的工单。">
        <div className="ticket-grid">
          {state.tickets.filter((ticket: any) => ticket.kind !== 'DeliveryIssue').length === 0 ? (
            <div className="empty-card">当前没有待处理工单。</div>
          ) : (
            state.tickets
              .filter((ticket: any) => ticket.kind !== 'DeliveryIssue')
              .map((ticket: any) => (
                <article key={ticket.id} className="ticket-card">
                  <div className="ticket-header">
                    <div>
                      <p className="ticket-kind">{ticket.kind}</p>
                      <h3>订单 {ticket.orderId}</h3>
                    </div>
                    <span className={ticket.status === 'Open' ? 'badge warning' : 'badge success'}>
                      {ticket.status === 'Open' ? '待处理' : '已处理'}
                    </span>
                  </div>
                  <p>{ticket.summary}</p>
                  <p className="meta-line">最近更新 {formatTime(ticket.updatedAt)}</p>
                  {ticket.status === 'Open' ? (
                    <div className="ticket-actions">
                      <select
                        value={resolutionDrafts[ticket.orderId]?.resolution ?? '已回访用户'}
                        onChange={(event) =>
                          setResolutionDrafts((current: Record<string, any>) => ({
                            ...current,
                            [ticket.orderId]: {
                              ...buildResolutionPayload(current[ticket.orderId]),
                              resolution: event.target.value,
                            },
                          }))
                        }
                      >
                        <option value="已回访用户">已回访用户</option>
                        <option value="已补偿优惠券">已补偿优惠券</option>
                        <option value="已表扬骑手与商家">已表扬骑手与商家</option>
                      </select>
                      <input
                        value={resolutionDrafts[ticket.orderId]?.note ?? '已联系相关角色并记录'}
                        onChange={(event) =>
                          setResolutionDrafts((current: Record<string, any>) => ({
                            ...current,
                            [ticket.orderId]: {
                              ...buildResolutionPayload(current[ticket.orderId]),
                              note: event.target.value,
                            },
                          }))
                        }
                      />
                      <button
                        className="primary-button"
                        onClick={() =>
                          void runAction(() =>
                            resolveTicket(
                              ticket.orderId,
                              buildResolutionPayload(resolutionDrafts[ticket.orderId]),
                            ),
                          )
                        }
                        type="button"
                      >
                        处理工单
                      </button>
                    </div>
                  ) : (
                    <p className="meta-line">{ticket.resolutionNote}</p>
                  )}
                </article>
              ))
          )}
        </div>
      </Panel>
    </>
  )
}
