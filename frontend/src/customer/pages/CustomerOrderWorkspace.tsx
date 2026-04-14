import type { CustomerRoleProps } from '@/shared/app-build-role-props'
import { Panel } from '@/shared/components/LayoutPrimitives'
import { CustomerCheckoutPanel } from '@/customer/pages/CustomerCheckoutPanel'
import { CustomerStoreBrowse } from '@/customer/pages/CustomerStoreBrowse'

export function CustomerOrderWorkspace(props: CustomerRoleProps) {
  const {
    selectedStore,
    selectedStoreCategory,
  } = props

  return (
    <Panel
      title={selectedStore ? `${selectedStore.name} · 店内点餐` : '顾客下单'}
      description={
        selectedStore
          ? '当前已进入店铺，可直接选择菜品并提交订单。'
          : selectedStoreCategory
            ? `当前分类为「${selectedStoreCategory}」，请选择对应餐厅。`
            : '先选择细分餐厅大类，再进入对应餐厅选购菜品。'
      }
    >
      <CustomerStoreBrowse {...props} />
      <CustomerCheckoutPanel {...props} />
    </Panel>
  )
}
