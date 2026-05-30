export { MerchantOrderFooter } from '@/pages/merchant/console/orders/MerchantOrderFooter'
import { ORDER_STATUS, type OrderSummary } from '@/objects/core/SharedObjects'

export function getMerchantNewOrderCount(storeOrders: OrderSummary[]) {
  return storeOrders.filter(
    (order) => order.status === ORDER_STATUS.pendingMerchantAcceptance,
  ).length
}
