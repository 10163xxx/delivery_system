import type { AdminRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import { Panel } from '@/pages/DeliveryConsole/components/primitives/LayoutPrimitives'
import type {
  DisplayText,
  MerchantApplication,
  MerchantApplicationId,
} from '@/objects/core/SharedObjects'
import { asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import { APPLICATION_REVIEW_DEFAULTS } from '@/pages/AdminConsole/components/workspace/AdminReviewDefaults'

export function MerchantApplicationReviewPanel({ props }: { props: AdminRoleProps }) {
  const {
    pendingApplications,
    formatTime,
    applicationReviewDrafts,
    setApplicationReviewDrafts,
    runAction,
    buildReviewApplicationPayload,
    approveMerchantApplication,
    rejectMerchantApplication,
  } = props

  return (
    <Panel title="商家入驻审核" description="管理员审核商家资料，通过后自动生成可营业店铺。">
      <div className="ticket-grid">
        {pendingApplications.length === 0 ? (
          <div className="empty-card">当前没有待审核商家申请。</div>
        ) : (
          pendingApplications.map((application: MerchantApplication) => (
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
                  value={applicationReviewDrafts[application.id] ?? APPLICATION_REVIEW_DEFAULTS.approve}
                  onChange={(event) =>
                    setApplicationReviewDrafts((current: Record<MerchantApplicationId, DisplayText>) => ({
                      ...current,
                      [application.id]: asDomainText<DisplayText>(event.target.value),
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
                          applicationReviewDrafts[application.id] ?? APPLICATION_REVIEW_DEFAULTS.approve,
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
                          applicationReviewDrafts[application.id] ?? APPLICATION_REVIEW_DEFAULTS.reject,
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
  )
}
