import { StoreReviewList } from '@/pages/customer/store/CustomerSelectedStorePanel'
import type { CustomerRoleProps } from '@/shared/app/role-props'
import { DisplayImageSlot } from '@/shared/components/primitives/DisplayImageSlot'
import { STORE_STATUS, type Store } from '@/shared/object/core/SharedObjects'
import type { CustomerStoreBrowseResultCardProps } from '@/pages/customer/object/CustomerPageObjects'

function getStoreBrowseHint(store: Store, isStoreCurrentlyOpen: CustomerRoleProps['isStoreCurrentlyOpen']) {
  if (store.status === STORE_STATUS.revoked) {
    return '当前店铺不可下单，详情进入店铺后可查看。'
  }
  if (!isStoreCurrentlyOpen(store)) {
    return '当前不在营业时间内，更多营业信息进入店铺后查看。'
  }
  if (store.menu.length === 0) {
    return '当前暂未上架菜品，详细信息进入店铺后查看。'
  }
  return '更多营业时间、商家信息和完整菜单需进入店铺后查看。'
}

function getStoreBrowseButtonLabel(store: Store, isStoreCurrentlyOpen: CustomerRoleProps['isStoreCurrentlyOpen']) {
  if (store.status === STORE_STATUS.revoked) return '当前不可下单'
  if (!isStoreCurrentlyOpen(store)) return '非营业时间'
  if (store.menu.length === 0) return '待上架菜品'
  return '进入店铺'
}

export function CustomerStoreResultCard({
  store,
  reviews,
  props,
}: CustomerStoreBrowseResultCardProps) {
  const {
    enterStore,
    formatAggregateRating,
    formatStoreAvailability,
    formatTime,
    isStoreCurrentlyOpen,
    monthlyOrdersByStore,
  } = props
  const disabled =
    store.status === STORE_STATUS.revoked || !isStoreCurrentlyOpen(store) || store.menu.length === 0

  return (
    <article className="store-card compact-store-card">
      <DisplayImageSlot
        alt={`${store.name} 展示图`}
        className="store-image compact-store-image"
        label="餐厅展示图"
        src={store.imageUrl}
      />
      <div className="compact-store-content">
        <div className="ticket-header">
          <div>
            <p className="ticket-kind">{store.category}</p>
            <h3>{store.name}</h3>
          </div>
          <span className={store.status === STORE_STATUS.revoked ? 'badge warning' : 'badge success'}>
            {formatStoreAvailability(store)}
          </span>
        </div>
        <div className="summary-bar compact-store-summary">
          <div>
            <p>店铺评分</p>
            <strong>{formatAggregateRating(store.averageRating, store.ratingCount)}</strong>
          </div>
          <div>
            <p>可点菜品</p>
            <strong>{store.menu.length} 道</strong>
          </div>
          <div>
            <p>近 30 天</p>
            <strong>{monthlyOrdersByStore[store.id] ?? 0} 单</strong>
          </div>
          <div>
            <p>出餐速度</p>
            <strong>{store.avgPrepMinutes} 分钟</strong>
          </div>
        </div>
        <div className="compact-store-reviews">
          <p className="ticket-kind">顾客评价</p>
          <StoreReviewList
            emptyText="暂无顾客评价。"
            formatTime={formatTime}
            reviews={reviews}
            variant="compact"
          />
        </div>
        <p className="meta-line compact-store-hint">
          {getStoreBrowseHint(store, isStoreCurrentlyOpen)}
        </p>
        <button
          className="primary-button"
          disabled={disabled}
          onClick={() => enterStore(store.id)}
          type="button"
        >
          {getStoreBrowseButtonLabel(store, isStoreCurrentlyOpen)}
        </button>
      </div>
    </article>
  )
}
