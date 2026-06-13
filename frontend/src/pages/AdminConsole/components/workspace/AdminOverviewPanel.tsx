import type { AdminRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import { AdminDeliveryRoutePanel } from '@/pages/AdminConsole/components/workspace/AdminDeliveryRoutePanel'
import { MetricCard, Panel } from '@/pages/DeliveryConsole/components/primitives/LayoutPrimitives'
import { ORDER_STATUS, STORE_STATUS, TICKET_STATUS } from '@/objects/core/SharedObjects'

const ADMIN_OVERVIEW_CHART = {
  height: 180,
  pointRadius: '4',
  width: 520,
  xPadding: 28,
  yPadding: 22,
} as const

type StatusChartItem = {
  label: string
  value: number
  tone: string
}

function buildOrderStatusItems(props: AdminRoleProps): StatusChartItem[] {
  const { state } = props
  if (!state) return []

  const counts = {
    pending: state.orders.filter((order) => order.status === ORDER_STATUS.pendingMerchantAcceptance).length,
    preparing: state.orders.filter((order) => order.status === ORDER_STATUS.preparing).length,
    ready: state.orders.filter((order) => order.status === ORDER_STATUS.readyForPickup).length,
    delivering: state.orders.filter((order) => order.status === ORDER_STATUS.delivering).length,
    completed: state.orders.filter((order) => order.status === ORDER_STATUS.completed).length,
    escalated: state.orders.filter((order) => order.status === ORDER_STATUS.escalated).length,
  }

  return [
    { label: '待商家接单', value: counts.pending, tone: 'sunrise' },
    { label: '备餐中', value: counts.preparing, tone: 'amber' },
    { label: '待骑手取餐', value: counts.ready, tone: 'peach' },
    { label: '配送中', value: counts.delivering, tone: 'mint' },
    { label: '已完成', value: counts.completed, tone: 'leaf' },
    { label: '升级处理', value: counts.escalated, tone: 'rose' },
  ]
}

function buildStoreStatusItems(props: AdminRoleProps): StatusChartItem[] {
  const { state } = props
  if (!state) return []

  return [
    { label: '营业中', value: state.stores.filter((store) => store.status === STORE_STATUS.open).length, tone: 'leaf' },
    { label: '高峰忙碌', value: state.stores.filter((store) => store.status === STORE_STATUS.busy).length, tone: 'amber' },
    { label: '暂停营业', value: state.stores.filter((store) => store.status === STORE_STATUS.revoked).length, tone: 'rose' },
  ]
}

function buildQueueItems(props: AdminRoleProps): StatusChartItem[] {
  const { state, pendingAppeals, pendingApplications, pendingEligibilityReviews } = props
  if (!state) return []

  return [
    { label: '待审入驻', value: pendingApplications.length, tone: 'sunrise' },
    { label: '评价申诉', value: pendingAppeals.length, tone: 'peach' },
    { label: '资格复核', value: pendingEligibilityReviews.length, tone: 'amber' },
    { label: '开放工单', value: state.tickets.filter((ticket) => ticket.status === TICKET_STATUS.open).length, tone: 'rose' },
  ]
}

function getMaxValue(items: StatusChartItem[]) {
  return Math.max(...items.map((item) => item.value), 1)
}

function buildStatusLinePath(items: StatusChartItem[], maxValue: number) {
  if (items.length === 0) return ''

  const { height, width, xPadding, yPadding } = ADMIN_OVERVIEW_CHART
  const stepX = items.length > 1 ? (width - xPadding * 2) / (items.length - 1) : 0

  return items
    .map((item, index) => {
      const x = xPadding + stepX * index
      const y = height - yPadding - ((height - yPadding * 2) * item.value) / maxValue
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')
}

function StatusLineChart({
  items,
  title,
  description,
}: {
  items: StatusChartItem[]
  title: string
  description: string
}) {
  const maxValue = getMaxValue(items)
  const { height, pointRadius, width, xPadding, yPadding } = ADMIN_OVERVIEW_CHART
  const linePath = buildStatusLinePath(items, maxValue)

  return (
    <article className="admin-overview__chart-card">
      <div className="admin-overview__chart-head">
        <div>
          <p className="eyebrow">温和洞察</p>
          <h3>{title}</h3>
        </div>
        <span className="badge">{description}</span>
      </div>
      <div className="admin-overview__line-chart">
        <svg viewBox={`0 0 ${width} ${height}`} aria-label={title} role="img">
          <line className="admin-overview__line-axis" x1={xPadding} x2={xPadding} y1={yPadding} y2={height - yPadding} />
          <line className="admin-overview__line-axis" x1={xPadding} x2={width - xPadding} y1={height - yPadding} y2={height - yPadding} />
          <path className="admin-overview__line-path" d={linePath} />
          {items.map((item, index) => {
            const x = xPadding + (items.length > 1 ? ((width - xPadding * 2) / (items.length - 1)) * index : 0)
            const y = height - yPadding - ((height - yPadding * 2) * item.value) / maxValue

            return (
              <circle
                key={item.label}
                className={`admin-overview__line-point is-${item.tone}`}
                cx={x}
                cy={y}
                r={pointRadius}
              />
            )
          })}
        </svg>
      </div>
      <div className="admin-overview__line-labels">
        {items.map((item) => (
          <span key={item.label}>
            {item.label} <strong>{item.value}</strong>
          </span>
        ))}
      </div>
    </article>
  )
}

export function AdminOverviewPanel(props: AdminRoleProps) {
  const { state, formatPrice } = props
  if (!state) return null

  const openTickets = state.tickets.filter((ticket) => ticket.status === TICKET_STATUS.open).length
  const activeStores = state.stores.filter((store) => store.status !== STORE_STATUS.revoked).length
  const orderStatusItems = buildOrderStatusItems(props)
  const storeStatusItems = buildStoreStatusItems(props)
  const queueItems = buildQueueItems(props)

  return (
    <section className="panel-stack">
      <section className="hero-panel admin-overview">
        <div className="admin-overview__hero">
          <p className="eyebrow">运营总览</p>
          <h1>平台运行概况</h1>
          <p className="hero-copy">
            订单节奏、门店状态和待办压力集中展示，便于快速判断当前平台运行情况。
          </p>
          <div className="admin-overview__pills">
            <span className="badge success">平台收入 {formatPrice(state.admins[0]?.platformIncomeCents ?? 0)}</span>
            <span className="badge">{activeStores} 家门店在线服务</span>
            <span className="badge warning">{openTickets} 个问题待跟进</span>
          </div>
        </div>
        <div className="admin-overview__metrics">
          <MetricCard label="总订单量" value={String(state.metrics.totalOrders)} />
          <MetricCard label="活跃订单" value={String(state.metrics.activeOrders)} />
          <MetricCard label="已解决工单" value={String(state.metrics.resolvedTickets)} />
          <MetricCard label="综合评分" value={state.metrics.averageRating.toFixed(1)} />
        </div>
      </section>

      <div className="admin-overview__grid">
        <StatusLineChart items={orderStatusItems} title="订单流转节奏" description="查看当前运力节拍" />
        <StatusLineChart items={storeStatusItems} title="门店营业状态" description="观察供给是否平稳" />
        <StatusLineChart items={queueItems} title="治理任务负载" description="把待办压力拉平" />
      </div>

      <AdminDeliveryRoutePanel {...props} />

      <Panel title="角色服务概况" description="按顾客、商家、骑手三个角色查看当前服务侧重点。">
        <div className="admin-overview__care-grid">
          <article className="admin-overview__care-card">
            <h3>顾客端</h3>
            <p>结账、订单、售后都用更柔和的层级展示，降低信息噪音，减少犹豫感。</p>
          </article>
          <article className="admin-overview__care-card">
            <h3>商家端</h3>
            <p>让菜单、工单和经营信息更有呼吸感，高频操作更聚焦，减少连续处理时的疲劳。</p>
          </article>
          <article className="admin-overview__care-card">
            <h3>骑手端</h3>
            <p>将配送、收入和资料管理统一成更温和的卡片语言，切换场景时更顺手。</p>
          </article>
        </div>
      </Panel>
    </section>
  )
}
