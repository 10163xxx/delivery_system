import type { AdminRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import { Panel } from '@/pages/DeliveryConsole/components/primitives/LayoutPrimitives'
import type { AppealResolutionDraft } from '@/pages/DeliveryConsole/objects/DeliveryDraftObjects'
import type {
  ApprovalFlag,
  EligibilityReview,
  EligibilityReviewId,
  ResolutionText,
} from '@/objects/core/SharedObjects'
import { asDomainBoolean, asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import { ELIGIBILITY_RESOLUTION_DEFAULTS } from '@/pages/AdminConsole/components/workspace/AdminReviewDefaults'

export function EligibilityReviewPanel({ props }: { props: AdminRoleProps }) {
  const {
    pendingEligibilityReviews,
    formatTime,
    eligibilityResolutionDrafts,
    setEligibilityResolutionDrafts,
    runAction,
    resolveEligibilityReview,
    buildAppealResolutionPayload,
  } = props

  return (
    <Panel title="营业资格复核" description="店铺或骑手被取消资格后，可提交复核申请等待管理员处理。">
      <div className="ticket-grid">
        {pendingEligibilityReviews.length === 0 ? (
          <div className="empty-card">当前没有待处理复核申请。</div>
        ) : (
          pendingEligibilityReviews.map((review: EligibilityReview) => (
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
                  value={
                    eligibilityResolutionDrafts[review.id]?.resolutionNote ??
                    ELIGIBILITY_RESOLUTION_DEFAULTS.approve
                  }
                  onChange={(event) =>
                    setEligibilityResolutionDrafts((current: Record<EligibilityReviewId, AppealResolutionDraft>) => ({
                      ...current,
                      [review.id]: {
                        ...(current[review.id] ?? buildAppealResolutionPayload()),
                        resolutionNote: asDomainText<ResolutionText>(event.target.value),
                      },
                    }))
                  }
                />
                <button
                  className="primary-button"
                  onClick={() =>
                    void runAction(() =>
                      resolveEligibilityReview(review.id, {
                        approved: asDomainBoolean<ApprovalFlag>(true),
                        resolutionNote:
                          eligibilityResolutionDrafts[review.id]?.resolutionNote ??
                          ELIGIBILITY_RESOLUTION_DEFAULTS.approve,
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
                        approved: asDomainBoolean<ApprovalFlag>(false),
                        resolutionNote:
                          eligibilityResolutionDrafts[review.id]?.resolutionNote ??
                          ELIGIBILITY_RESOLUTION_DEFAULTS.reject,
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
  )
}
