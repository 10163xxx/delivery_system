import { AddressDetailsCard } from '@/components/address/AddressDetailsCard'
import type { AddressDetailsCardData } from '@/components/address/AddressDetailsObjects'
import type { CheckoutPanelProps } from '@/objects/customer/page/CustomerPageObjects'
import { buildDeliveryRouteEstimate } from '@/features/delivery/DeliveryRouteEstimates'
import { formatBusinessHours, formatDateTimeLocalValue } from '@/features/delivery/DeliverySchedule'

function buildCustomerDeliveryDetailsData(props: CheckoutPanelProps): AddressDetailsCardData {
  const { deliveryAddress, formatPrice, isStoreCurrentlyOpen, scheduledDeliveryTime, selectedCustomer, selectedStore } = props
  const selectedAddress = deliveryAddress.trim() || selectedCustomer?.defaultAddress || ''
  const isStoreOpen = selectedStore ? isStoreCurrentlyOpen(selectedStore) : false
  const resolvedStoreAddress = selectedStore ? (selectedStore.storeAddress.trim() || selectedStore.name) : ''
  const estimate = selectedStore
    ? buildDeliveryRouteEstimate({
        avgPrepMinutes: selectedStore.avgPrepMinutes,
        referenceTime: scheduledDeliveryTime,
      })
    : undefined

  return {
    eyebrow: '配送地址',
    title: '本次配送信息',
    summary: selectedStore && selectedCustomer
      ? '直接展示本次订单的真实送达地址，并按天气情况调整备餐和配送预计时间。'
      : '选中店铺后，这里会显示本次订单的真实地址信息。',
    weatherTone: estimate?.weatherTone,
    weatherLabel: estimate?.weatherLabel,
    routePreview: selectedStore && selectedCustomer && selectedAddress
      ? {
          startLabel: '商家地址',
          startAddress: resolvedStoreAddress,
          startCoordinate: selectedStore.location,
          startQuery: selectedStore.storeAddress || selectedStore.name,
          endLabel: '收货地址',
          endAddress: selectedAddress,
          endQuery: selectedAddress,
          statusLabel: isStoreOpen ? '门店已就绪，正在准备接单' : '门店暂未营业',
          etaLabel: estimate?.prepEstimateLabel ?? `${selectedStore.avgPrepMinutes} 分钟完成备餐`,
          weatherTone: estimate?.weatherTone,
          showRouteCurve: false,
          showDestinationMarker: false,
        }
      : undefined,
    metrics: selectedStore
      ? [
          { label: '门店状态', value: isStoreOpen ? '营业中' : '休息中' },
          { label: '营业时段', value: formatBusinessHours(selectedStore.businessHours) },
          { label: '配送费', value: formatPrice(props.deliveryFeeCents) },
          { label: '配送距离', value: props.selectedStoreDeliveryDistanceLabel ?? '--' },
        ]
      : [],
    records: selectedStore && selectedCustomer && selectedAddress
      ? [
          {
            id: `${selectedStore.id}-${selectedCustomer.id}`,
            title: '顾客下单',
            subtitle: scheduledDeliveryTime
              ? `预约 ${formatDateTimeLocalValue(scheduledDeliveryTime)} 送达`
              : '填写地址后即可确认配送安排',
            status: isStoreOpen ? '准备接单' : '等待营业',
            fields: [
              {
                label: '店铺',
                value: `${selectedStore.name} · ${selectedStore.category}`,
              },
              {
                label: '店铺地址',
                value: selectedStore.storeAddress,
                mapQuery: selectedStore.storeAddress,
              },
              {
                label: '收货人',
                value: selectedCustomer.name,
              },
              {
                label: '收货地址',
                value: selectedAddress,
                mapQuery: selectedAddress,
                weatherTone: estimate?.weatherTone,
                hint: estimate?.weatherTone === 'rainy' ? '雨天路况会拉长骑手送达时间。' : undefined,
              },
              {
                label: '商家备餐预计时间',
                value: estimate?.prepEstimateLabel ?? `${selectedStore.avgPrepMinutes} 分钟`,
              },
              {
                label: '骑手送餐预计时间',
                value: estimate?.riderEstimateLabel ?? '预计 24 分钟完成送达',
              },
              {
                label: '合计预计时间',
                value: estimate?.totalEstimateLabel ?? '合计预计 0 分钟',
              },
            ],
          },
        ]
      : [],
    emptyText: '当前还没有可展示的配送地址，请先选择店铺并填写送达地址。',
  }
}

export function CustomerDeliveryRoutePanel(props: CheckoutPanelProps) {
  return <AddressDetailsCard data={buildCustomerDeliveryDetailsData(props)} />
}
