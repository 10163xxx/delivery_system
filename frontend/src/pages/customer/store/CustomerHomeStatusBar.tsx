import { AddressTileMap } from '@/components/address/AddressTileMap'
import { buildDeliveryRouteEstimate } from '@/features/delivery/DeliveryRouteEstimates'
import { CUSTOMER_HOME_COPY } from '@/features/delivery/DeliveryMessages'
import type { CustomerRoleProps } from '@/pages/delivery/app/roleProps'
import { ORDER_STATUS } from '@/objects/core/SharedObjects'

export function CustomerStatusBar({ props }: { props: CustomerRoleProps }) {
  const { selectedCustomer } = props

  if (!selectedCustomer) return null
  const activeOrder = getLatestActiveCustomerOrder(props.customerOrders)
  const activeStore = activeOrder
    ? props.stores.find((store) => store.id === activeOrder.storeId)
    : null
  const activeEstimate = activeOrder && activeStore
    ? buildDeliveryRouteEstimate({
        avgPrepMinutes: activeStore.avgPrepMinutes,
        status: activeOrder.status,
        referenceTime: activeOrder.scheduledDeliveryAt,
      })
    : null
  const etaLabel = activeOrder && activeEstimate
    ? getHomeMapEtaLabel(activeOrder.status, activeEstimate.prepEstimateLabel, activeEstimate.riderEstimateLabel)
    : undefined
  const etaStageLabel = activeOrder ? getHomeMapStageLabel(activeOrder.status) : undefined

  return (
    <div className="summary-bar customer-home-status">
      <div className="customer-home-address">
        <div className="customer-home-address-copy">
          <p>{CUSTOMER_HOME_COPY.currentAddressLabel}</p>
          <strong>{CUSTOMER_HOME_COPY.currentAddressLabel}</strong>
        </div>
        <div className="customer-home-map-shell">
          <AddressTileMap
            primaryLabel={CUSTOMER_HOME_COPY.currentAddressLabel}
            primaryAddress={selectedCustomer.defaultAddress}
            primaryCoordinate={selectedCustomer.location}
            primaryQuery={selectedCustomer.defaultAddress}
            secondaryLabel={activeStore ? '商家地址' : undefined}
            secondaryAddress={activeStore?.storeAddress}
            secondaryCoordinate={activeStore?.location}
            secondaryQuery={activeStore?.storeAddress || activeStore?.name}
            etaStageLabel={etaStageLabel}
            etaLabel={etaLabel}
            showRouteCurve={Boolean(activeStore && activeOrder)}
            showSecondaryMarker={Boolean(activeStore && activeOrder)}
            weatherTone={activeEstimate?.weatherTone}
          />
        </div>
      </div>
    </div>
  )
}

function getHomeMapStageLabel(status: CustomerRoleProps['customerOrders'][number]['status']) {
  if (status === ORDER_STATUS.pendingMerchantAcceptance) return '当前阶段：待商家接单'
  if (status === ORDER_STATUS.preparing) return '当前阶段：商家备餐中'
  if (status === ORDER_STATUS.readyForPickup) return '当前阶段：待骑手取餐'
  if (status === ORDER_STATUS.delivering) return '当前阶段：骑手配送中'
  return '当前阶段：订单进行中'
}

function getHomeMapEtaLabel(
  status: CustomerRoleProps['customerOrders'][number]['status'],
  prepEstimateLabel: string,
  riderEstimateLabel: string,
) {
  if (status === ORDER_STATUS.pendingMerchantAcceptance || status === ORDER_STATUS.preparing) {
    return prepEstimateLabel
  }
  return riderEstimateLabel
}

function getLatestActiveCustomerOrder(orders: CustomerRoleProps['customerOrders']) {
  return orders
    .filter(
      (order) =>
        order.status === ORDER_STATUS.pendingMerchantAcceptance ||
        order.status === ORDER_STATUS.preparing ||
        order.status === ORDER_STATUS.readyForPickup ||
        order.status === ORDER_STATUS.delivering,
    )
    .slice()
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))[0] ?? null
}
