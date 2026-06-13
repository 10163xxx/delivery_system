import { ORDER_STATUS } from '@/objects/core/SharedObjects'
import type { OrderStatus } from '@/objects/core/SharedObjects'

export type DeliveryWeatherTone = 'clear' | 'rainy'

export type DeliveryRouteEstimate = {
  weatherTone: DeliveryWeatherTone
  weatherLabel: string
  prepEstimateLabel: string
  riderEstimateLabel: string
  totalEstimateLabel: string
}

function clampMinutes(value: number, min: number) {
  return Math.max(min, Math.round(value))
}

function parseReferenceDate(value?: string) {
  if (!value) return new Date()
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed
}

function isRainyWindow(referenceTime?: string) {
  const date = parseReferenceDate(referenceTime)
  const month = date.getMonth() + 1
  const hour = date.getHours()
  return month >= 6 && month <= 9 && hour >= 15 && hour <= 21
}

function estimateRemainingPrepMinutes(avgPrepMinutes: number, status?: OrderStatus) {
  if (status === ORDER_STATUS.readyForPickup || status === ORDER_STATUS.delivering || status === ORDER_STATUS.completed) {
    return 0
  }
  if (status === ORDER_STATUS.preparing) return clampMinutes(avgPrepMinutes * 0.6, 4)
  if (status === ORDER_STATUS.pendingMerchantAcceptance) return clampMinutes(avgPrepMinutes + 4, 8)
  return clampMinutes(avgPrepMinutes, 6)
}

function estimateRiderMinutes(status: OrderStatus | undefined, rainy: boolean) {
  const baseMinutes =
    status === ORDER_STATUS.delivering
      ? 12
      : status === ORDER_STATUS.readyForPickup
        ? 20
        : 24

  return rainy ? baseMinutes + 8 : baseMinutes
}

function formatEstimate(minutes: number, suffix: string) {
  return minutes <= 0 ? `已完成${suffix}` : `预计 ${minutes} 分钟${suffix}`
}

export function buildDeliveryRouteEstimate(args: {
  avgPrepMinutes: number
  status?: OrderStatus
  referenceTime?: string
}): DeliveryRouteEstimate {
  const rainy = isRainyWindow(args.referenceTime)
  const prepMinutes = estimateRemainingPrepMinutes(args.avgPrepMinutes, args.status)
  const riderMinutes = estimateRiderMinutes(args.status, rainy)
  const totalMinutes = prepMinutes + riderMinutes

  return {
    weatherTone: rainy ? 'rainy' : 'clear',
    weatherLabel: rainy ? '雨天路况' : '天气平稳',
    prepEstimateLabel: formatEstimate(prepMinutes, '完成备餐'),
    riderEstimateLabel: formatEstimate(riderMinutes, '完成送达'),
    totalEstimateLabel: `合计预计 ${totalMinutes} 分钟${rainy ? '，雨天路况已顺延' : ''}`,
  }
}
