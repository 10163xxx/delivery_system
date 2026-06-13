import type { CustomerRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import type { CustomerRolePanelProps } from '@/pages/CustomerConsole/objects/CustomerPanelObjects'
import { Panel } from '@/pages/DeliveryConsole/components/primitives/LayoutPrimitives'
import {
  APPLICATION_STATUS,
  ROUTE_PATH,
  type OrderPartialRefundRequest,
  type OrderSummary,
} from '@/objects/core/SharedObjects'
import { CUSTOMER_PROFILE_COPY } from '@/pages/CustomerConsole/components/profile/CustomerProfileCopy'

function ReturnToProfileButton({ navigate }: Pick<CustomerRoleProps, 'navigate'>) {
  return (
    <button className="secondary-button" onClick={() => navigate(ROUTE_PATH.customerProfile)} type="button">
      {CUSTOMER_PROFILE_COPY.returnToProfileButton}
    </button>
  )
}

type RefundRecord = {
  order: OrderSummary
  refund: OrderPartialRefundRequest
}

function getRefundStatusLabel(status: OrderPartialRefundRequest['status']) {
  if (status === APPLICATION_STATUS.pending) return CUSTOMER_PROFILE_COPY.refundPendingLabel
  if (status === APPLICATION_STATUS.approved) return CUSTOMER_PROFILE_COPY.refundApprovedLabel
  return CUSTOMER_PROFILE_COPY.refundRejectedLabel
}

function getRefundStatusClassName(status: OrderPartialRefundRequest['status']) {
  if (status === APPLICATION_STATUS.approved) return 'badge success'
  if (status === APPLICATION_STATUS.rejected) return 'badge warning'
  return 'badge'
}

function RefundCards({
  formatTime,
  refunds,
}: {
  formatTime: CustomerRoleProps['formatTime']
  refunds: RefundRecord[]
}) {
  if (refunds.length === 0) return <div className="empty-card">{CUSTOMER_PROFILE_COPY.refundEmptyState}</div>

  return (
    <>
      {refunds.map(({ order, refund }: RefundRecord) => (
        <article key={refund.id} className="ticket-card">
          <div className="ticket-header">
            <div>
              <p className="ticket-kind">{CUSTOMER_PROFILE_COPY.refundOrderTicketKind}</p>
              <h3>{refund.itemName}</h3>
            </div>
            <span className={getRefundStatusClassName(refund.status)}>{getRefundStatusLabel(refund.status)}</span>
          </div>
          <p>
            {CUSTOMER_PROFILE_COPY.refundOrderPrefix}
            {order.id}
            {' · '}
            {order.storeName}
            {' · '}
            {CUSTOMER_PROFILE_COPY.refundApplyQuantityPrefix}
            {refund.quantity}
            {CUSTOMER_PROFILE_COPY.refundApplyQuantitySuffix}
          </p>
          <p>{refund.reason}</p>
          <p className="meta-line">
            {CUSTOMER_PROFILE_COPY.refundSubmittedAtPrefix}
            {formatTime(refund.submittedAt)}
            {refund.reviewedAt
              ? `${CUSTOMER_PROFILE_COPY.refundReviewedAtPrefix}${formatTime(refund.reviewedAt)}`
              : ''}
          </p>
          {refund.resolutionNote ? (
            <p className="meta-line">
              {CUSTOMER_PROFILE_COPY.refundResolutionNotePrefix}
              {refund.resolutionNote}
            </p>
          ) : null}
        </article>
      ))}
    </>
  )
}

export function CustomerProfileRefundsPanel({ props }: CustomerRolePanelProps) {
  const { customerOrders, formatTime, navigate, selectedCustomer } = props

  const refunds = customerOrders
    .flatMap((order) =>
      order.partialRefundRequests.map((refund) => ({
        order,
        refund,
      })),
    )
    .sort((left, right) => {
      const rightTime = new Date(right.refund.submittedAt).getTime()
      const leftTime = new Date(left.refund.submittedAt).getTime()
      return rightTime - leftTime
    })

  const pendingCount = refunds.filter(({ refund }) => refund.status === APPLICATION_STATUS.pending).length
  const approvedCount = refunds.filter(({ refund }) => refund.status === APPLICATION_STATUS.approved).length

  return (
    <Panel
      title={CUSTOMER_PROFILE_COPY.refundPageTitle}
      description={CUSTOMER_PROFILE_COPY.refundDescription}
    >
      {selectedCustomer ? (
        <>
          <div className="summary-bar">
            <div>
              <p>{CUSTOMER_PROFILE_COPY.currentAccountLabel}</p>
              <strong>{selectedCustomer.name}</strong>
            </div>
            <div>
              <p>{CUSTOMER_PROFILE_COPY.refundTotalCountLabel}</p>
              <strong>{refunds.length}</strong>
            </div>
            <div>
              <p>{CUSTOMER_PROFILE_COPY.refundProcessingCountLabel}</p>
              <strong>{pendingCount}</strong>
            </div>
            <div>
              <p>{CUSTOMER_PROFILE_COPY.refundApprovedCountLabel}</p>
              <strong>{approvedCount}</strong>
            </div>
            <ReturnToProfileButton navigate={navigate} />
          </div>
          <div className="ticket-grid">
            <RefundCards formatTime={formatTime} refunds={refunds} />
          </div>
        </>
      ) : null}
    </Panel>
  )
}
