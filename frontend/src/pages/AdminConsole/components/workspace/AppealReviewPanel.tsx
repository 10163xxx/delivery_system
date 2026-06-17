import type { AdminRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import { Panel } from '@/pages/DeliveryConsole/components/primitives/LayoutPrimitives'
import type { AppealResolutionDraft } from '@/pages/DeliveryConsole/objects/DeliveryDraftObjects'
import type {
  ApprovalFlag,
  ResolutionText,
  ReviewAppeal,
  ReviewAppealId,
} from '@/objects/core/SharedObjects'
import { asDomainBoolean, asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import { APPEAL_RESOLUTION_DEFAULTS } from '@/pages/AdminConsole/components/workspace/AdminReviewDefaults'

export function AppealReviewPanel({ props }: { props: AdminRoleProps }) {
  const {
    pendingAppeals,
    formatTime,
    appealResolutionDrafts,
    setAppealResolutionDrafts,
    buildAppealResolutionPayload,
    runAction,
    resolveReviewAppeal,
  } = props

  return (
    <Panel title="评价申诉审核" description="商家或骑手申诉成功后，将撤销对应顾客评价。">
      <div className="ticket-grid">
        {pendingAppeals.length === 0 ? (
          <div className="empty-card">当前没有待审核申诉。</div>
        ) : (
          pendingAppeals.map((appeal: ReviewAppeal) => (
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
                  value={
                    appealResolutionDrafts[appeal.id]?.resolutionNote ??
                    APPEAL_RESOLUTION_DEFAULTS.approve
                  }
                  onChange={(event) =>
                    setAppealResolutionDrafts((current: Record<ReviewAppealId, AppealResolutionDraft>) => ({
                      ...current,
                      [appeal.id]: {
                        ...(current[appeal.id] ?? buildAppealResolutionPayload()),
                        resolutionNote: asDomainText<ResolutionText>(event.target.value),
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
                          approved: asDomainBoolean<ApprovalFlag>(true),
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
                          approved: asDomainBoolean<ApprovalFlag>(false),
                          resolutionNote:
                            appealResolutionDrafts[appeal.id]?.resolutionNote ??
                            APPEAL_RESOLUTION_DEFAULTS.reject,
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
  )
}
