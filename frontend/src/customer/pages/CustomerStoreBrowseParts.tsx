import type { CustomerRoleProps } from '@/shared/AppBuildRoleProps'
import { DisplayImageSlot } from '@/shared/components/DisplayImageSlot'
import { ACCOUNT_STATUS, STORE_STATUS, type Store } from '@/shared/object/SharedObjects'
import { StoreReviewList } from '@/customer/pages/CustomerSelectedStorePanel'

export function StoreSearchBar({ props }: { props: CustomerRoleProps }) {
  const {
    customerStoreSearchDraft,
    customerStoreSearch,
    setCustomerStoreSearchDraft,
    setCustomerStoreSearch,
    submitCustomerStoreSearch,
  } = props

  return (
    <div className="summary-bar">
      <label style={{ flex: 1, minWidth: '280px' }}>
        <span>搜索店家</span>
        <input
          placeholder="输入店铺名或商家名"
          value={customerStoreSearchDraft}
          onChange={(event) => setCustomerStoreSearchDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              submitCustomerStoreSearch()
            }
          }}
        />
      </label>
      <button className="primary-button" onClick={() => submitCustomerStoreSearch()} type="button">
        搜索
      </button>
      {customerStoreSearchDraft.trim() || customerStoreSearch.trim() ? (
        <button
          className="secondary-button"
          onClick={() => {
            setCustomerStoreSearchDraft('')
            setCustomerStoreSearch('')
          }}
          type="button"
        >
          清空搜索
        </button>
      ) : null}
    </div>
  )
}

export function SearchHistoryPanel({ props }: { props: CustomerRoleProps }) {
  const {
    customerStoreSearchHistory,
    removeCustomerStoreSearchHistoryItem,
    clearCustomerStoreSearchHistory,
    submitCustomerStoreSearch,
  } = props

  if (customerStoreSearchHistory.length === 0) return null

  return (
    <div className="summary-bar">
      <div style={{ flex: 1 }}>
        <p>搜索记录</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {customerStoreSearchHistory.map((keyword: string) => (
            <div
              key={keyword}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '18px',
                background: 'rgba(15, 23, 42, 0.04)',
                border: '1px solid rgba(15, 23, 42, 0.08)',
              }}
            >
              <button
                type="button"
                onClick={() => submitCustomerStoreSearch(keyword)}
                style={{
                  flex: 1,
                  textAlign: 'left',
                  border: 'none',
                  background: 'transparent',
                  padding: 0,
                  font: 'inherit',
                  color: 'inherit',
                  cursor: 'pointer',
                }}
              >
                {keyword}
              </button>
              <button
                onClick={() => removeCustomerStoreSearchHistoryItem(keyword)}
                aria-label={`删除搜索记录 ${keyword}`}
                type="button"
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: 0,
                  fontSize: '1rem',
                  lineHeight: 1,
                  color: 'rgba(15, 23, 42, 0.6)',
                  cursor: 'pointer',
                }}
              >
                x
              </button>
            </div>
          ))}
        </div>
      </div>
      <button
        className="secondary-button"
        onClick={() => clearCustomerStoreSearchHistory()}
        type="button"
      >
        清空记录
      </button>
    </div>
  )
}

export function CustomerStatusBar({ props }: { props: CustomerRoleProps }) {
  const { selectedCustomer } = props

  if (!selectedCustomer) return null

  return (
    <div className="summary-bar">
      <div>
        <p>顾客状态</p>
        <strong>{selectedCustomer.accountStatus === ACCOUNT_STATUS.suspended ? '已封号' : '正常'}</strong>
      </div>
      <div>
        <p>评价撤销次数</p>
        <strong>{selectedCustomer.revokedReviewCount}</strong>
      </div>
    </div>
  )
}

export function StoreCategoryGrid({ props }: { props: CustomerRoleProps }) {
  const { storeCategories, visibleStores, getCategoryMeta, chooseStoreCategory, isStoreCurrentlyOpen } =
    props

  return (
    <div className="store-grid">
      {storeCategories.map((category) => {
        const storesInCategory = visibleStores.filter((store) => store.category === category)
        const openStoreCount = storesInCategory.filter(
          (store) => isStoreCurrentlyOpen(store) && store.menu.length > 0,
        ).length

        return (
          <article key={category} className="store-card category-card">
            <img
              alt={`${category} 分类插图`}
              className="category-image"
              src={getCategoryMeta(category).imageSrc}
            />
            <div className="ticket-header">
              <div>
                <p className="ticket-kind">餐厅大类</p>
                <h3 className="category-title">{category}</h3>
              </div>
              <span className="badge">{storesInCategory.length} 家</span>
            </div>
            <p className="category-description">{getCategoryMeta(category).subtitle}</p>
            <p className="meta-line">
              可下单 {openStoreCount} 家 · 覆盖 {storesInCategory.length} 家餐厅
            </p>
            <button
              className="primary-button"
              onClick={() => chooseStoreCategory(category)}
              type="button"
            >
              选择此分类
            </button>
          </article>
        )
      })}
    </div>
  )
}

export function StoreResultsGrid({
  props,
  storesToBrowse,
}: {
  props: CustomerRoleProps
  storesToBrowse: Store[]
}) {
  const {
    selectedStoreCategory,
    customerStoreSearch,
    setCustomerStoreSearch,
    resetStoreCategory,
    formatStoreAvailability,
    formatAggregateRating,
    formatTime,
    isStoreCurrentlyOpen,
    enterStore,
    storeCustomerReviews,
  } = props

  return (
    <>
      <div className="category-toolbar">
        <div>
          <p className="ticket-kind">{selectedStoreCategory ? '当前分类' : '搜索结果'}</p>
          <strong>{selectedStoreCategory || `“${customerStoreSearch.trim()}”`}</strong>
          <p className="meta-line">共 {storesToBrowse.length} 家餐厅，请选择已有菜品的店铺进入点餐。</p>
        </div>
        <button
          className="primary-button category-back-button"
          onClick={() => {
            if (selectedStoreCategory) {
              resetStoreCategory()
            } else {
              setCustomerStoreSearch('')
            }
          }}
          style={{ minWidth: '240px', minHeight: '64px', fontSize: '1.1rem' }}
          type="button"
        >
          {selectedStoreCategory ? '返回全部分类' : '清空搜索'}
        </button>
      </div>

      <div className="store-grid compact-store-grid">
        {storesToBrowse.map((store: Store) => {
          const reviews = storeCustomerReviews[store.id] ?? []
          return (
            <article key={store.id} className="store-card compact-store-card">
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
                    <p>出餐速度</p>
                    <strong>{store.avgPrepMinutes} 分钟</strong>
                  </div>
                </div>
                <div className="compact-store-reviews">
                  <p className="ticket-kind">顾客评价</p>
                  <StoreReviewList
                    emptyText="暂无顾客评价。"
                    formatTime={formatTime}
                    reviews={reviews.slice(0, 2)}
                    variant="compact"
                  />
                </div>
                <p className="meta-line compact-store-hint">
                  {store.status === STORE_STATUS.revoked
                    ? '当前店铺不可下单，详情进入店铺后可查看。'
                    : !isStoreCurrentlyOpen(store)
                      ? '当前不在营业时间内，更多营业信息进入店铺后查看。'
                      : store.menu.length === 0
                        ? '当前暂未上架菜品，详细信息进入店铺后查看。'
                        : '更多营业时间、商家信息和完整菜单需进入店铺后查看。'}
                </p>
                <button
                  className="primary-button"
                  disabled={
                    store.status === STORE_STATUS.revoked || !isStoreCurrentlyOpen(store) || store.menu.length === 0
                  }
                  onClick={() => enterStore(store.id)}
                  type="button"
                >
                  {store.status === STORE_STATUS.revoked
                    ? '当前不可下单'
                    : !isStoreCurrentlyOpen(store)
                      ? '非营业时间'
                      : store.menu.length === 0
                        ? '待上架菜品'
                        : '进入店铺'}
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </>
  )
}

export function StoreBrowseEmptyState({ props }: { props: CustomerRoleProps }) {
  const { customerStoreSearch, resetStoreCategory } = props

  return (
    <div className="empty-card">
      {customerStoreSearch.trim() ? '没有找到匹配的店铺，请换个关键词试试。' : '当前分类下没有可浏览的店铺。'}
      <button className="secondary-button" onClick={() => resetStoreCategory()} type="button">
        返回分类列表
      </button>
    </div>
  )
}
