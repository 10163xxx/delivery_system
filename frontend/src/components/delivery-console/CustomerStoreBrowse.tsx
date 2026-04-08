import { DisplayImageSlot } from '@/components/delivery-console/DisplayImageSlot'

export function CustomerStoreBrowse(props: any) {
  const {
    selectedStore,
    selectedStoreCategory,
    customerStoreSearchDraft,
    customerStoreSearch,
    setCustomerStoreSearchDraft,
    setCustomerStoreSearch,
    submitCustomerStoreSearch,
    customerStoreSearchHistory,
    removeCustomerStoreSearchHistoryItem,
    clearCustomerStoreSearchHistory,
    selectedCustomer,
    categoryStores,
    visibleStores,
    formatStoreAvailability,
    formatBusinessHours,
    formatAggregateRating,
    chooseStoreCategory,
    enterStore,
    leaveStore,
    resetStoreCategory,
    getCategoryMeta,
    isStoreCurrentlyOpen,
    quantities,
  } = props
  const hasStoreSearch = customerStoreSearch.trim().length > 0
  const storesToBrowse = selectedStoreCategory ? categoryStores : visibleStores

  if (selectedStore) {
    return (
      <>
        <div className="store-toolbar">
          <div>
            <p className="ticket-kind">当前店铺</p>
            <strong>{selectedStore.name}</strong>
            <p className="meta-line">
              {selectedStore.category} · {selectedStore.merchantName} · {formatStoreAvailability(selectedStore)}
            </p>
            <p className="meta-line">营业时间 {formatBusinessHours(selectedStore.businessHours)}</p>
          </div>
          <div>
            <p>店铺评分</p>
            <strong>{formatAggregateRating(selectedStore.averageRating, selectedStore.ratingCount)}</strong>
          </div>
          <div>
            <p>已选菜品</p>
            <strong>{selectedStore.menu.reduce((sum: number, item: any) => sum + (quantities[item.id] ?? 0), 0)}</strong>
          </div>
          <button
            className="secondary-button store-back-button"
            onClick={() => leaveStore()}
            style={{ minWidth: '220px', minHeight: '64px', fontSize: '1.1rem' }}
            type="button"
          >
            返回当前分类
          </button>
          <button
            className="primary-button store-reset-button"
            onClick={() => resetStoreCategory()}
            style={{ minWidth: '220px', minHeight: '64px', fontSize: '1.1rem' }}
            type="button"
          >
            重新选择分类
          </button>
        </div>

        {!isStoreCurrentlyOpen(selectedStore) ? (
          <div className="banner warning">当前不在营业时间内，店铺营业时间为 {formatBusinessHours(selectedStore.businessHours)}。</div>
        ) : null}
      </>
    )
  }

  return (
    <>
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

      {customerStoreSearchHistory.length > 0 ? (
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
          <button className="secondary-button" onClick={() => clearCustomerStoreSearchHistory()} type="button">
            清空记录
          </button>
        </div>
      ) : null}

      {selectedCustomer ? (
        <div className="summary-bar">
          <div>
            <p>顾客状态</p>
            <strong>{selectedCustomer.accountStatus === 'Suspended' ? '已封号' : '正常'}</strong>
          </div>
          <div>
            <p>评价撤销次数</p>
            <strong>{selectedCustomer.revokedReviewCount}</strong>
          </div>
        </div>
      ) : null}

      {!selectedStoreCategory && !hasStoreSearch && props.storeCategories.length > 0 ? (
        <div className="store-grid">
          {props.storeCategories.map((category: string) => {
            const storesInCategory = visibleStores.filter((store: any) => store.category === category)
            const openStoreCount = storesInCategory.filter((store: any) => isStoreCurrentlyOpen(store) && store.menu.length > 0).length

            return (
              <article key={category} className="store-card category-card">
                <img alt={`${category} 分类插图`} className="category-image" src={getCategoryMeta(category).imageSrc} />
                <div className="ticket-header">
                  <div>
                    <p className="ticket-kind">餐厅大类</p>
                    <h3 className="category-title">{category}</h3>
                  </div>
                  <span className="badge">{storesInCategory.length} 家</span>
                </div>
                <p className="category-description">{getCategoryMeta(category).subtitle}</p>
                <p className="meta-line">可下单 {openStoreCount} 家 · 覆盖 {storesInCategory.length} 家餐厅</p>
                <button className="primary-button" onClick={() => chooseStoreCategory(category)} type="button">
                  选择此分类
                </button>
              </article>
            )
          })}
        </div>
      ) : storesToBrowse.length > 0 ? (
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
            {storesToBrowse.map((store: any) => (
              <article key={store.id} className="store-card compact-store-card">
                <DisplayImageSlot alt={`${store.name} 展示图`} className="store-image compact-store-image" label="餐厅展示图" src={store.imageUrl} />
                <div className="compact-store-content">
                  <div className="ticket-header">
                    <div>
                      <p className="ticket-kind">{store.category}</p>
                      <h3>{store.name}</h3>
                    </div>
                    <span className={store.status === 'Revoked' ? 'badge warning' : 'badge success'}>
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
                  <p className="meta-line compact-store-hint">
                    {store.status === 'Revoked'
                      ? '当前店铺不可下单，详情进入店铺后可查看。'
                      : !isStoreCurrentlyOpen(store)
                        ? '当前不在营业时间内，更多营业信息进入店铺后查看。'
                        : store.menu.length === 0
                          ? '当前暂未上架菜品，详细信息进入店铺后查看。'
                          : '更多营业时间、商家信息和完整菜单需进入店铺后查看。'}
                  </p>
                  <button
                    className="primary-button"
                    disabled={store.status === 'Revoked' || !isStoreCurrentlyOpen(store) || store.menu.length === 0}
                    onClick={() => enterStore(store.id)}
                    type="button"
                  >
                    {store.status === 'Revoked'
                      ? '当前不可下单'
                      : !isStoreCurrentlyOpen(store)
                        ? '非营业时间'
                        : store.menu.length === 0
                          ? '待上架菜品'
                          : '进入店铺'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="empty-card">
          {customerStoreSearch.trim() ? '没有找到匹配的店铺，请换个关键词试试。' : '当前分类下没有可浏览的店铺。'}
          <button className="secondary-button" onClick={() => resetStoreCategory()} type="button">
            返回分类列表
          </button>
        </div>
      )}
    </>
  )
}
