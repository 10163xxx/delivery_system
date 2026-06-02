import { AddressDetailsCard } from '@/components/address/AddressDetailsCard'
import type { AddressDetailsCardData } from '@/components/address/AddressDetailsObjects'
import { ORDER_STATUS } from '@/objects/core/SharedObjects'
import type { OrderSummary } from '@/objects/core/SharedObjects'
import { buildDeliveryRouteEstimate } from '@/features/delivery/DeliveryRouteEstimates'

type OrderRoutePanelProps = {
  order: OrderSummary
  formatTime: (value: string) => string
  storeAddress?: string
  riderTitle?: string
  riderDetail?: string
}

function getRiderTitle(props: OrderRoutePanelProps) {
  return props.riderTitle ?? props.order.riderName ?? '待分配骑手'
}

function getRiderDetail(props: OrderRoutePanelProps) {
  return props.riderDetail ?? (props.order.riderName ? '订单已经进入配送链路' : '平台正在匹配可用运力')
}

function getRouteStatusLabel(props: OrderRoutePanelProps, estimate: ReturnType<typeof buildDeliveryRouteEstimate>) {
  const { order } = props
  if (order.status === ORDER_STATUS.pendingMerchantAcceptance || order.status === ORDER_STATUS.preparing) {
    return `商家正在备餐，${estimate.prepEstimateLabel}`
  }
  if (order.status === ORDER_STATUS.readyForPickup || order.status === ORDER_STATUS.delivering) {
    return `骑手已接单，${estimate.riderEstimateLabel}`
  }
  return '配送路线已归档'
}

function getRouteEtaLabel(order: OrderSummary, estimate: ReturnType<typeof buildDeliveryRouteEstimate>) {
  if (order.status === ORDER_STATUS.pendingMerchantAcceptance || order.status === ORDER_STATUS.preparing) {
    return estimate.prepEstimateLabel
  }
  if (order.status === ORDER_STATUS.readyForPickup || order.status === ORDER_STATUS.delivering) {
    return estimate.riderEstimateLabel
  }
  return estimate.totalEstimateLabel
}

function buildOrderRouteDetailsData(props: OrderRoutePanelProps): AddressDetailsCardData {
  const { order, formatTime, storeAddress } = props
  const resolvedStoreAddress = storeAddress?.trim() || order.storeName
  const estimate = buildDeliveryRouteEstimate({
    avgPrepMinutes: 20,
    status: order.status,
    referenceTime: order.scheduledDeliveryAt,
  })
  const hasMerchantAddress = Boolean(resolvedStoreAddress.trim())
  const hasActiveRoute =
    hasMerchantAddress &&
    (order.status === ORDER_STATUS.pendingMerchantAcceptance ||
      order.status === ORDER_STATUS.preparing ||
      order.status === ORDER_STATUS.readyForPickup ||
      order.status === ORDER_STATUS.delivering)
  const riderHasAccepted =
    order.status === ORDER_STATUS.readyForPickup || order.status === ORDER_STATUS.delivering

  return {
    eyebrow: '订单地址',
    title: '本单配送信息',
    summary: hasActiveRoute
      ? getRouteStatusLabel(props, estimate)
      : `预计 ${formatTime(order.scheduledDeliveryAt)} 送达，配送时间会根据天气情况自动调整。`,
    weatherTone: estimate.weatherTone,
    weatherLabel: estimate.weatherLabel,
    metrics: [
      { label: '订单状态', value: order.status },
      { label: '订单金额', value: String(order.totalPriceCents / 100) + ' 元' },
      { label: '顾客', value: order.customerName },
    ],
    routePreview: hasActiveRoute && resolvedStoreAddress
        ? {
          startLabel: '商家地址',
          startAddress: resolvedStoreAddress,
          startQuery: storeAddress || order.storeName,
          endLabel: '顾客地址',
          endAddress: order.deliveryAddress,
          endQuery: order.deliveryAddress,
          statusLabel: getRouteStatusLabel(props, estimate),
          etaLabel: getRouteEtaLabel(order, estimate),
          weatherTone: estimate.weatherTone,
          showRouteCurve: riderHasAccepted,
          showDestinationMarker: riderHasAccepted,
        }
      : undefined,
    records: [
      {
        id: order.id,
        title: '配送单',
        subtitle: `${order.storeName} -> ${order.customerName}`,
        status: order.status,
        fields: [
          {
            label: '店铺',
            value: order.storeName,
          },
          ...(resolvedStoreAddress
            ? [
                {
                  label: '商家地址',
                  value: resolvedStoreAddress,
                },
              ]
            : []),
          {
            label: '骑手',
            value: `${getRiderTitle(props)} · ${getRiderDetail(props)}`,
          },
          {
            label: '送达地址',
            value: order.deliveryAddress,
            mapQuery: order.deliveryAddress,
            weatherTone: estimate.weatherTone,
            hint: estimate.weatherTone === 'rainy' ? '雨天路况已计入预计送达时间。' : undefined,
          },
          ...(order.status === ORDER_STATUS.pendingMerchantAcceptance || order.status === ORDER_STATUS.preparing
            ? [
                {
                  label: '商家备餐剩余',
                  value: estimate.prepEstimateLabel,
                },
              ]
            : []),
          ...(order.status === ORDER_STATUS.readyForPickup || order.status === ORDER_STATUS.delivering
            ? [
                {
                  label: '骑手送达剩余',
                  value: estimate.riderEstimateLabel,
                },
              ]
            : []),
          {
            label: '合计预计时间',
            value: estimate.totalEstimateLabel,
          },
        ],
      },
    ],
    emptyText: '当前没有可展示的路线信息。',
  }
}

export function OrderRoutePanel(props: OrderRoutePanelProps) {
  return <AddressDetailsCard data={buildOrderRouteDetailsData(props)} />
}
