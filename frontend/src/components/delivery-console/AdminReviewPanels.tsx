import { Panel } from '@/components/delivery-console/LayoutPrimitives'

export function AdminReviewPanels(props: any) {
  const {
    pendingApplications,
    formatTime,
    applicationReviewDrafts,
    setApplicationReviewDrafts,
    runAction,
    buildReviewApplicationPayload,
    approveMerchantApplication,
    rejectMerchantApplication,
    pendingAppeals,
    appealResolutionDrafts,
    setAppealResolutionDrafts,
    buildAppealResolutionPayload,
    resolveReviewAppeal,
    pendingEligibilityReviews,
    eligibilityResolutionDrafts,
    setEligibilityResolutionDrafts,
    resolveEligibilityReview,
  } = props

  return (
    <>
      <Panel title="商家入驻审核" description="管理员审核商家资料，通过后自动生成可营业店铺。">
        <div className="ticket-grid">
          {pendingApplications.length === 0 ? (
            <div className="empty-card">当前没有待审核商家申请。</div>
          ) : (
            pendingApplications.map((application: any) => (
              <article key={application.id} className="ticket-card">
                <div className="ticket-header">
                  <div>
                    <p className="ticket-kind">商家入驻</p>
                    <h3>{application.storeName}</h3>
                  </div>
                  <span className="badge warning">待审核</span>
                </div>
                <p>
                  商家 {application.merchantName} · {application.category} · 预计出餐{' '}
                  {application.avgPrepMinutes} 分钟
                </p>
                <p className="meta-line">
                  提交于 {formatTime(application.submittedAt)}
                  {application.note ? ` · ${application.note}` : ''}
                </p>
                <div className="ticket-actions">
                  <input
                    value={applicationReviewDrafts[application.id] ?? '资料已核验'}
                    onChange={(event) =>
                      setApplicationReviewDrafts((current: Record<string, string>) => ({
                        ...current,
                        [application.id]: event.target.value,
                      }))
                    }
                  />
                  <button
                    className="primary-button"
                    onClick={() =>
                      void runAction(() =>
                        approveMerchantApplication(
                          application.id,
                          buildReviewApplicationPayload(
                            applicationReviewDrafts[application.id] ?? '资料已核验',
                          ),
                        ),
                      )
                    }
                    type="button"
                  >
                    通过
                  </button>
                  <button
                    className="secondary-button"
                    onClick={() =>
                      void runAction(() =>
                        rejectMerchantApplication(
                          application.id,
                          buildReviewApplicationPayload(
                            applicationReviewDrafts[application.id] ?? '资料不完整，请补充后重提',
                          ),
                        ),
                      )
                    }
                    type="button"
                  >
                    驳回
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </Panel>

      <Panel title="评价申诉审核" description="商家或骑手申诉成功后，将撤销对应顾客评价。">
        <div className="ticket-grid">
          {pendingAppeals.length === 0 ? (
            <div className="empty-card">当前没有待审核申诉。</div>
          ) : (
            pendingAppeals.map((appeal: any) => (
              <article key={appeal.id} className="ticket-card">
                <div className="ticket-header">
                  <div>
                    <p className="ticket-kind">{appeal.appellantRole} Appeal</p>
                    <h3>订单 {appeal.orderId}</h3>
                  </div>
                  <span className="badge warning">待审核</span>
                </div>
                <p>
                  申诉方 {appeal.appellantRole} · 顾客 {appeal.customerName}
                </p>
                <p>{appeal.reason}</p>
                <p className="meta-line">提交于 {formatTime(appeal.submittedAt)}</p>
                <div className="ticket-actions">
                  <input
                    value={appealResolutionDrafts[appeal.id]?.resolutionNote ?? '申诉成立，已撤销评价'}
                    onChange={(event) =>
                      setAppealResolutionDrafts((current: Record<string, any>) => ({
                        ...current,
                        [appeal.id]: {
                          ...(current[appeal.id] ?? buildAppealResolutionPayload()),
                          resolutionNote: event.target.value,
                        },
                      }))
                    }
                  />
                  <button
                    className="primary-button"
                    onClick={() =>
                      void runAction(() =>
                        resolveReviewAppeal(
                          appeal.id,
                          buildAppealResolutionPayload({
                            ...(appealResolutionDrafts[appeal.id] ?? buildAppealResolutionPayload()),
                            approved: true,
                          }),
                        ),
                      )
                    }
                    type="button"
                  >
                    申诉成功
                  </button>
                  <button
                    className="secondary-button"
                    onClick={() =>
                      void runAction(() =>
                        resolveReviewAppeal(
                          appeal.id,
                          buildAppealResolutionPayload({
                            approved: false,
                            resolutionNote:
                              appealResolutionDrafts[appeal.id]?.resolutionNote ??
                              '证据不足，维持原评价',
                          }),
                        ),
                      )
                    }
                    type="button"
                  >
                    驳回申诉
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </Panel>

      <Panel title="营业资格复核" description="店铺或骑手被取消资格后，可提交复核申请等待管理员处理。">
        <div className="ticket-grid">
          {pendingEligibilityReviews.length === 0 ? (
            <div className="empty-card">当前没有待处理复核申请。</div>
          ) : (
            pendingEligibilityReviews.map((review: any) => (
              <article key={review.id} className="ticket-card">
                <div className="ticket-header">
                  <div>
                    <p className="ticket-kind">{review.target} Review</p>
                    <h3>{review.targetName}</h3>
                  </div>
                  <span className="badge warning">待复核</span>
                </div>
                <p>{review.reason}</p>
                <p className="meta-line">提交于 {formatTime(review.submittedAt)}</p>
                <div className="ticket-actions">
                  <input
                    value={eligibilityResolutionDrafts[review.id]?.resolutionNote ?? '整改完成，恢复资格'}
                    onChange={(event) =>
                      setEligibilityResolutionDrafts((current: Record<string, any>) => ({
                        ...current,
                        [review.id]: {
                          ...(current[review.id] ?? buildAppealResolutionPayload()),
                          resolutionNote: event.target.value,
                        },
                      }))
                    }
                  />
                  <button
                    className="primary-button"
                    onClick={() =>
                      void runAction(() =>
                        resolveEligibilityReview(review.id, {
                          approved: true,
                          resolutionNote:
                            eligibilityResolutionDrafts[review.id]?.resolutionNote ??
                            '整改完成，恢复资格',
                        }),
                      )
                    }
                    type="button"
                  >
                    恢复资格
                  </button>
                  <button
                    className="secondary-button"
                    onClick={() =>
                      void runAction(() =>
                        resolveEligibilityReview(review.id, {
                          approved: false,
                          resolutionNote:
                            eligibilityResolutionDrafts[review.id]?.resolutionNote ??
                            '复核未通过，维持当前限制',
                        }),
                      )
                    }
                    type="button"
                  >
                    维持限制
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </Panel>
    </>
  )
}
