import type { Dispatch, SetStateAction } from 'react'
import type { CustomerRoleProps } from '@/shared/app/role-props'
import type { MenuItem } from '@/shared/object/core/SharedObjects'
import { CUSTOMER_STORE_TAB, type CustomerStoreTab } from '@/pages/customer/object/CustomerPageObjects'
import { StoreReviewList } from '@/pages/customer/store/CustomerSelectedStorePanel'

export function SelectedStoreToolbar({ props }: { props: CustomerRoleProps }) {
  const { selectedStore, formatStoreAvailability, formatBusinessHours, formatAggregateRating, leaveStore, resetStoreCategory, quantities } = props
  if (!selectedStore) return null

  return (
    <div className="store-toolbar">
      <div>
        <p className="ticket-kind">当前店铺</p>
        <strong>{selectedStore.name}</strong>
        <p className="meta-line">{selectedStore.category} · {formatStoreAvailability(selectedStore)}</p>
        <p className="meta-line">营业时间 {formatBusinessHours(selectedStore.businessHours)}</p>
      </div>
      <div>
        <p>店铺评分</p>
        <strong>{formatAggregateRating(selectedStore.averageRating, selectedStore.ratingCount)}</strong>
      </div>
      <div>
        <p>已选菜品</p>
        <strong>{selectedStore.menu.reduce((sum: number, item: MenuItem) => sum + (quantities[item.id] ?? 0), 0)}</strong>
      </div>
      <button className="secondary-button store-back-button" onClick={() => leaveStore()} style={{ minWidth: '220px', minHeight: '64px', fontSize: '1.1rem' }} type="button">返回当前分类</button>
      <button className="primary-button store-reset-button" onClick={() => resetStoreCategory()} style={{ minWidth: '220px', minHeight: '64px', fontSize: '1.1rem' }} type="button">重新选择分类</button>
    </div>
  )
}

export function SelectedStoreTabs({
  selectedStoreName,
  selectedStoreTab,
  setSelectedStoreTab,
}: {
  selectedStoreName: string
  selectedStoreTab: CustomerStoreTab
  setSelectedStoreTab: Dispatch<SetStateAction<CustomerStoreTab>>
}) {
  return (
    <div className="store-detail-tabs" role="tablist" aria-label={`${selectedStoreName} 页面切换`}>
      <button aria-selected={selectedStoreTab === CUSTOMER_STORE_TAB.menu} className={`store-detail-tab ${selectedStoreTab === CUSTOMER_STORE_TAB.menu ? 'is-active' : ''}`} onClick={() => setSelectedStoreTab(CUSTOMER_STORE_TAB.menu)} role="tab" type="button">点餐</button>
      <button aria-selected={selectedStoreTab === CUSTOMER_STORE_TAB.reviews} className={`store-detail-tab ${selectedStoreTab === CUSTOMER_STORE_TAB.reviews ? 'is-active' : ''}`} onClick={() => setSelectedStoreTab(CUSTOMER_STORE_TAB.reviews)} role="tab" type="button">评价</button>
    </div>
  )
}

export function SelectedStoreReviewSection({ props }: { props: CustomerRoleProps }) {
  const { selectedStore, formatTime, storeCustomerReviews } = props
  if (!selectedStore) return null
  const reviews = storeCustomerReviews[selectedStore.id] ?? []

  return (
    <section className="store-review-panel">
      <div className="panel-header">
        <div>
          <p className="ticket-kind">商家评价</p>
          <h3>{selectedStore.name}</h3>
          <p className="meta-line">来自已完成订单的全部顾客评价。</p>
        </div>
        <span className="badge">{reviews.length} 条</span>
      </div>
      <StoreReviewList emptyText="当前还没有顾客评价。" formatTime={formatTime} reviews={reviews} />
    </section>
  )
}
