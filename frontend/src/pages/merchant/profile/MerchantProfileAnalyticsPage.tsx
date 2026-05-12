import type { MerchantRoleProps } from '@/shared/app/role-props'
import type { MerchantTrendPoint } from '@/pages/merchant/object/MerchantPageObjects'
import { Panel } from '@/shared/components/primitives/LayoutPrimitives'

const MERCHANT_PROFILE_ANALYTICS = {
  chartHeight: 240,
  chartWidth: 720,
  emptyDateLabel: '--',
  pointRadius: '3.5',
  xAxisPadding: 20,
  yAxisPadding: 24,
} as const

const MERCHANT_TREND_VALUE_KEY = {
  orderCount: 'orderCount',
  incomeCents: 'incomeCents',
} as const

type MerchantTrendValueKey =
  (typeof MERCHANT_TREND_VALUE_KEY)[keyof typeof MERCHANT_TREND_VALUE_KEY]

function buildLineChartPath(
  values: number[],
  chartWidth: number,
  chartHeight: number,
  paddingX: number,
  paddingY: number,
) {
  if (values.length === 0) return ''
  const maxValue = Math.max(...values, 1)
  const stepX = values.length > 1 ? (chartWidth - paddingX * 2) / (values.length - 1) : 0

  return values
    .map((value, index) => {
      const x = paddingX + stepX * index
      const y = chartHeight - paddingY - ((chartHeight - paddingY * 2) * value) / maxValue
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')
}

function getMerchantTrendSummary(merchantMonthlyTrend: MerchantRoleProps['merchantMonthlyTrend']) {
  return {
    monthlyOrderCount: merchantMonthlyTrend.reduce((sum, entry) => sum + entry.orderCount, 0),
    monthlyIncomeCents: merchantMonthlyTrend.reduce((sum, entry) => sum + entry.incomeCents, 0),
  }
}

function TrendLineChart({
  title,
  accentClassName,
  data,
  valueKey,
  formatValue,
}: {
  title: string
  accentClassName: string
  data: MerchantTrendPoint[]
  valueKey: MerchantTrendValueKey
  formatValue: (value: number) => string
}) {
  const chartWidth = MERCHANT_PROFILE_ANALYTICS.chartWidth
  const chartHeight = MERCHANT_PROFILE_ANALYTICS.chartHeight
  const paddingX = MERCHANT_PROFILE_ANALYTICS.xAxisPadding
  const paddingY = MERCHANT_PROFILE_ANALYTICS.yAxisPadding
  const values = data.map((entry) => entry[valueKey])
  const maxValue = Math.max(...values, 1)
  const path = buildLineChartPath(values, chartWidth, chartHeight, paddingX, paddingY)
  const lastValue = values[values.length - 1] ?? 0
  const totalValue = values.reduce((sum, value) => sum + value, 0)

  return (
    <section className="merchant-section-card merchant-analytics-card">
      <div className="ticket-header">
        <div>
          <p className="ticket-kind">近 30 天</p>
          <h3>{title}</h3>
        </div>
        <span className={`badge ${accentClassName}`}>峰值 {formatValue(maxValue)}</span>
      </div>
      <div className="merchant-analytics-summary">
        <div>
          <p>累计</p>
          <strong>{formatValue(totalValue)}</strong>
        </div>
        <div>
          <p>最近一天</p>
          <strong>{formatValue(lastValue)}</strong>
        </div>
      </div>
      <div className="merchant-line-chart">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} aria-label={title} role="img">
          <line className="merchant-line-chart__axis" x1={paddingX} x2={paddingX} y1={paddingY} y2={chartHeight - paddingY} />
          <line className="merchant-line-chart__axis" x1={paddingX} x2={chartWidth - paddingX} y1={chartHeight - paddingY} y2={chartHeight - paddingY} />
          <path className={`merchant-line-chart__path ${accentClassName}`} d={path} />
          {values.map((value, index) => {
            const x =
              paddingX + (values.length > 1 ? ((chartWidth - paddingX * 2) / (values.length - 1)) * index : 0)
            const y = chartHeight - paddingY - ((chartHeight - paddingY * 2) * value) / maxValue
            return (
              <circle
                key={`${title}-${data[index]?.dateLabel}`}
                className={`merchant-line-chart__point ${accentClassName}`}
                cx={x}
                cy={y}
                r={MERCHANT_PROFILE_ANALYTICS.pointRadius}
              />
            )
          })}
        </svg>
        <div className="merchant-line-chart__labels">
          <span>{data[0]?.dateLabel ?? MERCHANT_PROFILE_ANALYTICS.emptyDateLabel}</span>
          <span>{data[Math.floor(data.length / 2)]?.dateLabel ?? MERCHANT_PROFILE_ANALYTICS.emptyDateLabel}</span>
          <span>{data[data.length - 1]?.dateLabel ?? MERCHANT_PROFILE_ANALYTICS.emptyDateLabel}</span>
        </div>
      </div>
    </section>
  )
}

export function MerchantProfileAnalyticsPage(props: MerchantRoleProps) {
  const { merchantMonthlyTrend, formatPrice, navigate } = props
  const { monthlyIncomeCents, monthlyOrderCount } = getMerchantTrendSummary(merchantMonthlyTrend)

  return (
    <Panel title="经营趋势" description="查看近 30 天订单数和商家收入变化。">
      <div className="summary-bar">
        <div>
          <p>近 30 天订单数</p>
          <strong>{monthlyOrderCount} 单</strong>
        </div>
        <div>
          <p>近 30 天收入</p>
          <strong>{formatPrice(monthlyIncomeCents)}</strong>
        </div>
        <button className="secondary-button" onClick={() => navigate('/merchant/profile')} type="button">
          返回个人信息
        </button>
      </div>

      <div className="merchant-analytics-grid">
        <TrendLineChart accentClassName="orders" data={merchantMonthlyTrend} formatValue={(value) => `${value} 单`} title="每日订单数" valueKey={MERCHANT_TREND_VALUE_KEY.orderCount} />
        <TrendLineChart accentClassName="income" data={merchantMonthlyTrend} formatValue={(value) => formatPrice(value)} title="每日收入" valueKey={MERCHANT_TREND_VALUE_KEY.incomeCents} />
      </div>
    </Panel>
  )
}
