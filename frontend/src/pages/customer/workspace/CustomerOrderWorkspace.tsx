import { useEffect, useState } from 'react'
import type { CustomerRoleProps } from '@/pages/delivery/app/roleProps'
import { Panel } from '@/components/primitives/LayoutPrimitives'
import { CustomerStoreBrowse } from '@/pages/customer/store/CustomerStoreBrowse'
import { CUSTOMER_STORE_TAB, type CustomerStoreTab } from '@/pages/customer/objects/CustomerPageObjects'
import { ORDER_PAGE_COPY } from '@/pages/order/OrderPageCopy'

function scrollSelectedStoreToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  document.querySelector('.role-stage')?.scrollTo({ top: 0, left: 0, behavior: 'auto' })
}

export function CustomerOrderWorkspace(props: CustomerRoleProps) {
  const {
    selectedStore,
    selectedStoreCategory,
  } = props
  const [selectedStoreTab, setSelectedStoreTab] = useState<CustomerStoreTab>(CUSTOMER_STORE_TAB.menu)

  useEffect(() => {
    setSelectedStoreTab(CUSTOMER_STORE_TAB.menu)
    if (!selectedStore) return
    const frameId = window.requestAnimationFrame(scrollSelectedStoreToTop)
    return () => window.cancelAnimationFrame(frameId)
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
