import type {
  MerchantConsolePanelProps,
  PartialRefundResolutionDraftMap,
} from '@/pages/MerchantConsole/hooks/MerchantConsoleState'
import type { OrderSummary } from '@/objects/core/SharedObjects'
import { APPLICATION_STATUS } from '@/objects/core/SharedObjects'

export function MerchantRefundResolutionList({
  order,
  partialRefundResolutionDrafts,
  resolvePartialRefundRequest,
  setPartialRefundResolutionDrafts,
}: Pick<
  MerchantConsolePanelProps,
  'partialRefundResolutionDrafts' | 'resolvePartialRefundRequest' | 'setPartialRefundResolutionDrafts'
> & {
  order: OrderSummary
}) {
  if (!order.partialRefundRequests.length) return null

  return (
    <div className="panel-stack">
      {order.partialRefundRequests.map((refund) => (
        <div key={refund.id} className="ticket-actions">
          <span className="meta-line">
            缺货退款 · {refund.itemName} x {refund.quantity} ·
            {refund.status === APPLICATION_STATUS.pending
              ? ' 待处理'
              : refund.status === APPLICATION_STATUS.approved
                ? ' 已同意'
                : ' 已拒绝'}
          </span>
          <input
            disabled={refund.status !== APPLICATION_STATUS.pending}
            placeholder="处理说明"
            value={partialRefundResolutionDrafts[refund.id] ?? ''}
            onChange={(event) =>
              setPartialRefundResolutionDrafts((current: PartialRefundResolutionDraftMap) => ({
                ...current,
                [refund.id]: event.target.value,
              }))
            }
          />
          {refund.status === APPLICATION_STATUS.pending ? (
            <>
              <button
                className="primary-button"
                onClick={() => void resolvePartialRefundRequest(refund.id, true)}
                type="button"
              >
                同意退款
              </button>
              <button
                className="secondary-button"
                onClick={() => void resolvePartialRefundRequest(refund.id, false)}
                type="button"
              >
                拒绝退款
              </button>
            </>
          ) : (
            <span className="badge">{refund.resolutionNote ?? '已处理'}</span>
          )}
        </div>
      ))}
    </div>
  )
}
