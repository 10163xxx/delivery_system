import type { AdminRoleProps } from '@/pages/delivery/app/roleProps'
import { AddressDetailsCard } from '@/components/address/AddressDetailsCard'
import type { AddressDetailsCardData, AddressDetailsRecord } from '@/components/address/AddressDetailsObjects'
import {
  DEFAULT_MERCHANT_PREP_MINUTES,
  DELIVERY_ROUTE_RECORD_PREVIEW_COUNT,
  ZERO_COUNT,
  statusLabels,
} from '@/features/delivery/DeliveryConstants'
import { buildDeliveryRouteEstimate } from '@/features/delivery/DeliveryRouteEstimates'
import { ORDER_STATUS, TICKET_STATUS } from '@/objects/core/SharedObjects'

function buildAdminRecords(props: AdminRoleProps): AddressDetailsRecord[] {
  const { state, formatTime } = props
  if (!state) return []

  return state.orders
    .filter((order) =>
      order.status === ORDER_STATUS.preparing ||
      order.status === ORDER_STATUS.readyForPickup ||
      order.status === ORDER_STATUS.delivering,
    )
    .slice(ZERO_COUNT, DELIVERY_ROUTE_RECORD_PREVIEW_COUNT)
    .map((order) => {
      const store = state.stores.find((item) => item.id === order.storeId)
      const estimate = buildDeliveryRouteEstimate({
        avgPrepMinutes: store?.avgPrepMinutes ?? DEFAULT_MERCHANT_PREP_MINUTES,
        status: order.status,
        referenceTime: order.scheduledDeliveryAt,
      })

      return {
        id: order.id,
        title: '平台配送单',
        subtitle: `${order.storeName} · ${formatTime(order.scheduledDeliveryAt)}`,
        status: statusLabels[order.status],
        fields: [
          {
            label: '店铺',
            value: order.storeName,
          },
          ...(store?.storeAddress
            ? [{
                label: '店铺地址',
                value: store.storeAddress,
                mapQuery: store.storeAddress,
              }]
            : []),
          {
            label: '骑手',
            value: order.riderName ?? '待分配骑手',
          },
          {
            label: '顾客地址',
            value: order.deliveryAddress,
            mapQuery: order.deliveryAddress,
            weatherTone: estimate.weatherTone,
            hint: estimate.weatherTone === 'rainy' ? '雨天会自动上调骑手送达预计时间。' : undefined,
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

function buildAdminDetailsData(props: AdminRoleProps): AddressDetailsCardData {
  const records = buildAdminRecords(props)
  const activeOrders = props.state?.orders.filter((order) => order.status !== ORDER_STATUS.completed).length ?? 0
  const firstOrder = props.state?.orders.find((order) =>
    order.status === ORDER_STATUS.preparing ||
    order.status === ORDER_STATUS.readyForPickup ||
    order.status === ORDER_STATUS.delivering,
  )
  const firstStore = props.state?.stores.find((store) => store.id === firstOrder?.storeId)
  const estimate = firstOrder
    ? buildDeliveryRouteEstimate({
        avgPrepMinutes: firstStore?.avgPrepMinutes ?? DEFAULT_MERCHANT_PREP_MINUTES,
        status: firstOrder.status,
        referenceTime: firstOrder.scheduledDeliveryAt,
      })
    : undefined

  return {
    eyebrow: '平台地址',
    title: '供给与送达信息',
    summary: '直接展示店铺、骑手、顾客地址，并按天气情况动态调整配送预计时间。',
    weatherTone: estimate?.weatherTone,
    weatherLabel: estimate?.weatherLabel,
    metrics: [
      { label: '活跃地址单', value: String(records.length) },
      { label: '进行中订单', value: String(activeOrders) },
      {
        label: '开放工单',
        value: String(props.state?.tickets.filter((ticket) => ticket.status === TICKET_STATUS.open).length ?? 0),
      },
    ],
    records,
    emptyText: '当前没有可展示的活跃地址信息，新的配送单会在这里汇总。',
  }
}

export function AdminDeliveryRoutePanel(props: AdminRoleProps) {
  return <AddressDetailsCard data={buildAdminDetailsData(props)} />
}
