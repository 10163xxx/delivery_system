import type { AdminRoleProps } from '@/shared/AppBuildRoleProps'
import { Panel } from '@/shared/components/LayoutPrimitives'
import { TICKET_KIND, TICKET_STATUS, type AdminTicket } from '@/shared/object/SharedObjects'
import type { ResolutionDraftMap } from '@/shared/delivery-app/DeliveryAppObjects'
import { AfterSalesTicketsPanel } from '@/admin/pages/AdminAfterSalesPanel'

const TICKET_RESOLUTION_DEFAULTS = {
  resolution: '已回访用户',
  note: '已联系相关角色并记录',
} as const

function isDeliveryIssueTicket(ticket: AdminTicket) {
  return ticket.kind === TICKET_KIND.deliveryIssue
}

function AdminTicketCenterPanel({
  props,
  nonDeliveryTickets,
}: {
  props: AdminRoleProps
  nonDeliveryTickets: AdminTicket[]
}) {
  const {
    formatTime,
    resolutionDrafts,
    setResolutionDrafts,
    buildResolutionPayload,
    runAction,
    resolveTicket,
  } = props

  return (
    <Panel title="管理员工单中心" description="处理用户反馈生成的工单。">
      <div className="ticket-grid">
        {nonDeliveryTickets.length === 0 ? (
          <div className="empty-card">当前没有待处理工单。</div>
        ) : (
          nonDeliveryTickets.map((ticket) => (
            <article key={ticket.id} className="ticket-card">
              <div className="ticket-header">
                <div>
                  <p className="ticket-kind">{ticket.kind}</p>
                  <h3>订单 {ticket.orderId}</h3>
                </div>
                <span className={ticket.status === TICKET_STATUS.open ? 'badge warning' : 'badge success'}>
                  {ticket.status === TICKET_STATUS.open ? '待处理' : '已处理'}
                </span>
              </div>
              <p>{ticket.summary}</p>
              <p className="meta-line">最近更新 {formatTime(ticket.updatedAt)}</p>
              {ticket.status === TICKET_STATUS.open ? (
                <div className="ticket-actions">
                  <select
                    value={
                      resolutionDrafts[ticket.orderId]?.resolution ??
                      TICKET_RESOLUTION_DEFAULTS.resolution
                    }
                    onChange={(event) =>
                      setResolutionDrafts((current: ResolutionDraftMap) => ({
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
                    value={resolutionDrafts[ticket.orderId]?.note ?? TICKET_RESOLUTION_DEFAULTS.note}
                    onChange={(event) =>
                      setResolutionDrafts((current: ResolutionDraftMap) => ({
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
                        resolveTicket(ticket.orderId, buildResolutionPayload(resolutionDrafts[ticket.orderId])),
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
  )
}

export function AdminSupportPanels(props: AdminRoleProps) {
  if (!props.state) return null

  const nonDeliveryTickets = props.state.tickets.filter((ticket) => !isDeliveryIssueTicket(ticket))

  return (
    <>
      <AfterSalesTicketsPanel props={props} />
      <AdminTicketCenterPanel nonDeliveryTickets={nonDeliveryTickets} props={props} />
    </>
  )
}
