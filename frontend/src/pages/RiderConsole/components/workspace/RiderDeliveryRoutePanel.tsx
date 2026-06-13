import { AddressDetailsCard } from '@/pages/DeliveryConsole/components/address/AddressDetailsCard'
import type { AddressDetailsCardData } from '@/objects/view/address/AddressDetailsObjects'
import type { RiderRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import { DEFAULT_MERCHANT_PREP_MINUTES } from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import { buildDeliveryRouteEstimate } from '@/pages/DeliveryConsole/functions/map/DeliveryRouteEstimates'
import { ORDER_STATUS } from '@/objects/core/SharedObjects'

function buildRiderDetailsData(props: RiderRoleProps): AddressDetailsCardData {
  const { selectedRider, riderOrders, selectedRiderId, statusLabels } = props
  const firstOrder = riderOrders
    .filter((order) => order.riderId === selectedRiderId)
    .find((order) => order.status === ORDER_STATUS.readyForPickup || order.status === ORDER_STATUS.delivering)
  const firstStore = props.state?.stores.find((store) => store.id === firstOrder?.storeId)
  const estimate = firstOrder
    ? buildDeliveryRouteEstimate({
        avgPrepMinutes: firstStore?.avgPrepMinutes ?? DEFAULT_MERCHANT_PREP_MINUTES,
        status: firstOrder.status,
        referenceTime: firstOrder.scheduledDeliveryAt,
      })
    : undefined

  return {
    eyebrow: '配送地址',
    title: '当前配送信息',
    summary: selectedRider
      ? '只保留当前骑手正在处理的单子和送达地址，信息会随进度更新。'
      : '选择骑手后，这里会展示当前骑手正在处理的单子。',
    weatherTone: estimate?.weatherTone,
    weatherLabel: estimate?.weatherLabel,
    metrics: selectedRider
      ? [
          { label: '骑手', value: selectedRider.name },
          { label: '当前状态', value: statusLabels[firstOrder?.status ?? ORDER_STATUS.readyForPickup] },
          { label: '配送区域', value: selectedRider.zone },
        ]
      : [],
    records: firstOrder
      ? [
          {
            id: firstOrder.id,
            title: '当前配送单',
            subtitle: `${firstOrder.storeName} · ${props.formatTime(firstOrder.scheduledDeliveryAt)}`,
            status: statusLabels[firstOrder.status],
            fields: [
              {
                label: '店铺',
                value: firstOrder.storeName,
              },
              {
                label: '送达地址',
                value: firstOrder.deliveryAddress,
                mapQuery: firstOrder.deliveryAddress,
                weatherTone: estimate?.weatherTone,
                hint: estimate?.weatherTone === 'rainy' ? '雨天路况已计入预计送达时间。' : undefined,
              },
              {
                label: '预计送达',
                value: estimate?.totalEstimateLabel ?? '--',
              },
            ],
          },
        ]
      : [],
    emptyText: '当前没有正在配送的单子，接单后会自动显示。',
  }
}

export function RiderDeliveryRoutePanel(props: RiderRoleProps) {
  return <AddressDetailsCard data={buildRiderDetailsData(props)} />
}
