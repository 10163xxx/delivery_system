import { OrderChatPanel } from '@/components/delivery-console/OrderChatPanel'
import { OrderList } from '@/components/delivery-console/OrderList'
import { Panel } from '@/components/delivery-console/LayoutPrimitives'

export function RiderRoleView(props: any) {
  const {
    formatAggregateRating,
    formatPrice,
    formatTime,
    currentDisplayName,
    orderChatDrafts,
    selectedRider,
    selectedRiderId,
    setSelectedRiderId,
    role,
    session,
    state,
    eligibilityReviewDrafts,
    setEligibilityReviewDrafts,
    setOrderChatDrafts,
    runAction,
    buildEligibilityReviewPayload,
    riderOrders,
    riderAppealDrafts,
    setRiderAppealDrafts,
    buildReviewAppealPayload,
    statusLabels,
    submitOrderChatMessage,
    deliveryApi,
  } = props

  return (
    <section className="panel-stack">
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
          <div className="summary-bar">
            <div>
              <p>骑手评分</p>
              <strong>
                {formatAggregateRating(selectedRider.averageRating, selectedRider.ratingCount)}
              </strong>
            </div>
            <div>
              <p>当前状态</p>
              <strong>{selectedRider.availability}</strong>
            </div>
            <div>
              <p>累计收入</p>
              <strong>{formatPrice(selectedRider.earningsCents)}</strong>
            </div>
            <div>
              <p>1 星差评数</p>
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
                  deliveryApi.submitEligibilityReview(
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
                          deliveryApi.assignRider(order.id, { riderId: selectedRiderId }),
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
                      onClick={() => void runAction(() => deliveryApi.pickupOrder(order.id))}
                      type="button"
                    >
                      已取餐
                    </button>
                  ) : null}
                  {order.status === 'Delivering' && order.riderId === selectedRiderId ? (
                    <button
                      className="primary-button"
                      onClick={() => void runAction(() => deliveryApi.deliverOrder(order.id))}
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
                              deliveryApi.submitReviewAppeal(
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
                  disabled={order.riderId !== selectedRiderId}
                  disabledReason={
                    order.riderId === selectedRiderId
                      ? undefined
                      : '抢单成功后即可与顾客和商家聊天。'
                  }
                  formatTime={formatTime}
                  order={order}
                  onChangeDraft={(value) =>
                    setOrderChatDrafts((current: Record<string, string>) => ({
                      ...current,
                      [order.id]: value,
                    }))
                  }
                  onSubmit={() => void submitOrderChatMessage(order.id)}
                />
              </>
            )
          }}
          statusLabels={statusLabels}
        />
      </Panel>
    </section>
  )
}
