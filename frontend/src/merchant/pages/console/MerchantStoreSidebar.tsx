import type { MerchantConsolePanelProps } from '@/merchant/app/MerchantConsoleState'
import { ELIGIBILITY_REVIEW_TARGET, STORE_STATUS, type Store } from '@/shared/object/SharedObjects'

export function MerchantStoreSidebar({
  store,
  props,
}: {
  store: Store
  props: MerchantConsolePanelProps
}) {
  const {
    formatAggregateRating,
    formatPrice,
    formatBusinessHours,
    storeOperationErrors,
    getStoreOperationDraft,
    setStoreOperationDrafts,
    setStoreOperationErrors,
    submitStoreOperationalInfo,
    eligibilityReviewDrafts,
    setEligibilityReviewDrafts,
    runAction,
    buildEligibilityReviewPayload,
    submitEligibilityReview,
  } = props
  const operationErrors = storeOperationErrors[store.id]
  const draft = getStoreOperationDraft(store)

  return (
    <aside className="merchant-store-sidebar">
      <div className="merchant-section-card">
        <p className="ticket-kind">概览</p>
        <div className="merchant-metric-list">
          <div>
            <p>商家评分</p>
            <strong>{formatAggregateRating(store.averageRating, store.ratingCount)}</strong>
          </div>
          <div>
            <p>营业额</p>
            <strong>{formatPrice(store.revenueCents)}</strong>
          </div>
          <div>
            <p>营业时间</p>
            <strong>{formatBusinessHours(store.businessHours)}</strong>
          </div>
          <div>
            <p>预计出餐</p>
            <strong>{store.avgPrepMinutes} 分钟</strong>
          </div>
        </div>
      </div>

      <div className="merchant-section-card">
        <p className="ticket-kind">营业设置</p>
        <div className="form-grid">
          <label>
            <span>开业时间</span>
            <input
              className={operationErrors?.openTime ? 'field-error' : undefined}
              type="time"
              value={draft.openTime}
              onChange={(event) => {
                const value = event.target.value
                setStoreOperationDrafts((current) => ({
                  ...current,
                  [store.id]: { ...getStoreOperationDraft(store), openTime: value },
                }))
                setStoreOperationErrors((current) => ({
                  ...current,
                  [store.id]: { ...(current[store.id] ?? {}), openTime: undefined, closeTime: undefined },
                }))
              }}
            />
            {operationErrors?.openTime ? (
              <small className="field-error-text">{operationErrors.openTime}</small>
            ) : null}
          </label>
          <label>
            <span>打烊时间</span>
            <input
              className={operationErrors?.closeTime ? 'field-error' : undefined}
              type="time"
              value={draft.closeTime}
              onChange={(event) => {
                const value = event.target.value
                setStoreOperationDrafts((current) => ({
                  ...current,
                  [store.id]: { ...getStoreOperationDraft(store), closeTime: value },
                }))
                setStoreOperationErrors((current) => ({
                  ...current,
                  [store.id]: { ...(current[store.id] ?? {}), openTime: undefined, closeTime: undefined },
                }))
              }}
            />
            {operationErrors?.closeTime ? (
              <small className="field-error-text">{operationErrors.closeTime}</small>
            ) : null}
          </label>
          <label className="full">
            <span>预计出餐时间</span>
            <input
              className={operationErrors?.avgPrepMinutes ? 'field-error' : undefined}
              inputMode="numeric"
              max={120}
              min={1}
              value={draft.avgPrepMinutes}
              onChange={(event) => {
                const value = event.target.value
                setStoreOperationDrafts((current) => ({
                  ...current,
                  [store.id]: { ...getStoreOperationDraft(store), avgPrepMinutes: value },
                }))
                setStoreOperationErrors((current) => ({
                  ...current,
                  [store.id]: { ...(current[store.id] ?? {}), avgPrepMinutes: undefined },
                }))
              }}
            />
            {operationErrors?.avgPrepMinutes ? (
              <small className="field-error-text">{operationErrors.avgPrepMinutes}</small>
            ) : (
              <small className="field-hint">填写 1 到 120 的整数，单位为分钟。</small>
            )}
          </label>
        </div>
        <div className="summary-bar">
          <div>
            <p>当前设置</p>
            <strong>
              {draft.openTime} - {draft.closeTime} · {draft.avgPrepMinutes} 分钟
            </strong>
          </div>
          <button
            className="primary-button"
            onClick={() => void submitStoreOperationalInfo(store)}
            type="button"
          >
            保存营业设置
          </button>
        </div>
      </div>

      {store.status === STORE_STATUS.revoked ? (
        <div className="merchant-section-card">
          <p className="ticket-kind">资格处理</p>
          <div className="ticket-actions merchant-module-actions">
            <input
              placeholder="店铺复核理由"
              value={eligibilityReviewDrafts[store.id] ?? ''}
              onChange={(event) =>
                setEligibilityReviewDrafts((current) => ({
                  ...current,
                  [store.id]: event.target.value,
                }))
              }
            />
            <button
              className="primary-button"
              onClick={() =>
                void runAction(() =>
                  submitEligibilityReview(
                    buildEligibilityReviewPayload(
                      ELIGIBILITY_REVIEW_TARGET.store,
                      store.id,
                      eligibilityReviewDrafts[store.id] ?? '',
                    ),
                  ),
                )
              }
              type="button"
            >
              发起营业资格复核
            </button>
          </div>
        </div>
      ) : null}
    </aside>
  )
}
