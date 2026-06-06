import { AddressDetailsCard } from '@/components/address/AddressDetailsCard'
import type { AddressDetailsCardData, AddressDetailsRecord } from '@/components/address/AddressDetailsObjects'
import type { MerchantConsolePanelProps } from '@/pages/merchant/objects/MerchantConsoleObjects'
import {
  DELIVERY_ROUTE_RECORD_PREVIEW_COUNT,
  ZERO_COUNT,
} from '@/features/delivery/DeliveryConstants'
import { buildDeliveryRouteEstimate } from '@/features/delivery/DeliveryRouteEstimates'
import { formatBusinessHours } from '@/features/delivery/DeliverySchedule'
import { ORDER_STATUS } from '@/objects/core/SharedObjects'

function buildMerchantRecords(props: MerchantConsolePanelProps): AddressDetailsRecord[] {
  const focusStore = props.activeMerchantStore ?? props.storesToRender[0]
  if (!focusStore || !props.state) return []

  return props.state.orders
    .filter((order) => order.storeId === focusStore.id)
    .filter((order) =>
      order.status === ORDER_STATUS.pendingMerchantAcceptance ||
      order.status === ORDER_STATUS.preparing ||
      order.status === ORDER_STATUS.readyForPickup,
    )
    .slice(ZERO_COUNT, DELIVERY_ROUTE_RECORD_PREVIEW_COUNT)
    .map((order) => {
      const estimate = buildDeliveryRouteEstimate({
        avgPrepMinutes: focusStore.avgPrepMinutes,
        status: order.status,
        referenceTime: order.scheduledDeliveryAt,
      })

      return {
        id: order.id,
        title: '门店配送单',
        subtitle: `${order.customerName} · ${props.formatTime(order.scheduledDeliveryAt)}`,
        status: props.statusLabels[order.status],
        fields: [
          {
            label: '当前店铺',
            value: focusStore.name,
          },
          {
            label: '店铺地址',
            value: focusStore.storeAddress,
            mapQuery: focusStore.storeAddress,
          },
          {
            label: '顾客',
            value: order.customerName,
          },
          {
            label: '送达地址',
            value: order.deliveryAddress,
            mapQuery: order.deliveryAddress,
            weatherTone: estimate.weatherTone,
            hint: estimate.weatherTone === 'rainy' ? '雨天路况会拉长骑手送达预计时间。' : undefined,
          },
          {
            label: '商家备餐预计时间',
            value: estimate.prepEstimateLabel,
          },
          {
            label: '骑手送餐预计时间',
            value: estimate.riderEstimateLabel,
          },
          {
            label: '合计预计时间',
            value: estimate.totalEstimateLabel,
          },
        ],
      }
    })
}

function buildMerchantDetailsData(props: MerchantConsolePanelProps): AddressDetailsCardData {
  const focusStore = props.activeMerchantStore ?? props.storesToRender[0]
  const records = buildMerchantRecords(props)
  const firstOrder = props.state?.orders.find((order) =>
    order.storeId === focusStore?.id &&
    (order.status === ORDER_STATUS.pendingMerchantAcceptance ||
      order.status === ORDER_STATUS.preparing ||
      order.status === ORDER_STATUS.readyForPickup),
  )
  const estimate = focusStore && firstOrder
    ? buildDeliveryRouteEstimate({
        avgPrepMinutes: focusStore.avgPrepMinutes,
        status: firstOrder.status,
        referenceTime: firstOrder.scheduledDeliveryAt,
      })
    : undefined

  return {
    eyebrow: '门店地址',
    title: '配送地址一览',
    summary: focusStore
      ? '直接展示当前订单的真实送达地址，备餐和送餐预计时间会按天气自动顺延。'
      : '进入店铺后，这里会展示当前订单的真实送达地址。',
    weatherTone: estimate?.weatherTone,
    weatherLabel: estimate?.weatherLabel,
    metrics: focusStore
      ? [
          { label: '当前店铺', value: focusStore.name },
          { label: '营业时段', value: formatBusinessHours(focusStore.businessHours) },
          { label: '备餐时长', value: `${focusStore.avgPrepMinutes} 分钟` },
        ]
      : [],
    records,
    emptyText: '当前没有待处理的配送地址信息，新的订单地址会在这里出现。',
  }
}

export function MerchantDeliveryRoutePanel(props: MerchantConsolePanelProps) {
  return <AddressDetailsCard data={buildMerchantDetailsData(props)} />
}
