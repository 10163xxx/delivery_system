import { useEffect, useState } from 'react'
import type { CustomerRoleProps } from '@/pages/delivery/app/roleProps'
import { Panel } from '@/components/primitives/LayoutPrimitives'
import { CustomerStoreBrowse } from '@/pages/customer/store/CustomerStoreBrowse'
import { CUSTOMER_STORE_TAB, type CustomerStoreTab } from '@/objects/customer/page/CustomerPageObjects'
import { ORDER_PAGE_COPY } from '@/pages/order/OrderPageCopy'

export function CustomerOrderWorkspace(props: CustomerRoleProps) {
  const {
    selectedStore,
    selectedStoreCategory,
  } = props
  const [selectedStoreTab, setSelectedStoreTab] = useState<CustomerStoreTab>(CUSTOMER_STORE_TAB.menu)

  useEffect(() => {
    setSelectedStoreTab(CUSTOMER_STORE_TAB.menu)
  }, [selectedStore?.id])

  return (
    <Panel
      title={
        selectedStore
          ? ORDER_PAGE_COPY.workspace.selectedStoreTitle(selectedStore.name)
          : ORDER_PAGE_COPY.workspace.orderPanelTitle
      }
      description={
        selectedStore
          ? ORDER_PAGE_COPY.workspace.selectedStoreDescription
          : selectedStoreCategory
            ? ORDER_PAGE_COPY.workspace.selectedCategoryDescription(selectedStoreCategory)
            : ORDER_PAGE_COPY.workspace.orderPanelDescription
      }
    >
      <CustomerStoreBrowse
        {...props}
        selectedStoreTab={selectedStoreTab}
        setSelectedStoreTab={setSelectedStoreTab}
      />
    </Panel>
  )
}
