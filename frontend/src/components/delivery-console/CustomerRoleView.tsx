import { DisplayImageSlot } from '@/components/delivery-console/DisplayImageSlot'
import { OrderChatPanel } from '@/components/delivery-console/OrderChatPanel'
import { OrderList } from '@/components/delivery-console/OrderList'
import { Panel } from '@/components/delivery-console/LayoutPrimitives'
import { StarRatingField } from '@/components/delivery-console/StarRatingField'

export function CustomerRoleView(props: any) {
  const {
    activeReviewOrder,
    addCustomerAddress,
    addressDraft,
    addressFormErrors,
    canReviewOrder,
    cartSubtotal,
    cartTotal,
    categoryStores,
    chooseStoreCategory,
    completedCustomerOrders,
    customerStoreSearch,
    customerStoreSearchDraft,
    customerStoreSearchHistory,
    customRechargeAmount,
    customerOrders,
    customerWorkspaceView,
    DELIVERY_FEE_CENTS,
    deliveryAddress,
    deliveryAddressError,
    enterStore,
    formatAggregateRating,
    formatBusinessHours,
    formatPrice,
    formatStoreAvailability,
    formatTime,
    getCategoryMeta,
    getRemainingReviewDays,
    hasPendingRiderReview,
    hasPendingStoreReview,
    isStoreCurrentlyOpen,
    isCheckoutExpanded,
    leaveStore,
    navigate,
    openCheckout,
    openRechargePage,
    orderChatDrafts,
    orderChatErrors,
    partialRefundDrafts,
    partialRefundErrors,
    parsedRechargeAmount,
    pendingCustomerReviewOrders,
    quantities,
    rechargeAmountError,
    rechargeAmountPreview,
    RECHARGE_PRESET_AMOUNTS,
    remainingBalanceAfterCheckout,
    removeCustomerAddress,
    scheduledDeliveryError,
    setDefaultCustomerAddress,
    remark,
    scheduledDeliveryTime,
    resetStoreCategory,
    REVIEW_WINDOW_DAYS,
    reviewDrafts,
    reviewErrors,
    RIDER_REVIEW_REASON_OPTIONS,
    selectedCustomer,
    selectedRechargeAmount,
    selectedStore,
    selectedStoreCategory,
    selectedStoreCanOrder,
    selectedStoreHasMenu,
    selectRechargeAmount,
    setAddressDraft,
    setAddressFormErrors,
    setCustomRechargeAmount,
    setCustomerStoreSearch,
    setCustomerStoreSearchDraft,
    setDeliveryAddress,
    setDeliveryAddressError,
    setError,
    setIsCheckoutExpanded,
    setOrderChatDrafts,
    setOrderChatErrors,
    setPartialRefundDrafts,
    setPartialRefundErrors,
    setRemark,
    setScheduledDeliveryTime,
    setScheduledDeliveryError,
    setScheduledDeliveryTouched,
    setSelectedRechargeAmount,
    statusLabels,
    STORE_REVIEW_REASON_OPTIONS,
    storeCategories,
    suggestedDeliveryTime,
    submitCustomerStoreSearch,
    submitPartialRefundRequest,
    submitOrderChatMessage,
    submitOrder,
    todayDeliveryCutoff,
    submitRechargeFromPage,
    submitReview,
    getRemainingRefundableQuantity,
    canSubmitPartialRefund,
    clearCustomerStoreSearchHistory,
    removeCustomerStoreSearchHistoryItem,
    updateQuantity,
    updateReviewDraft,
    visibleStores,
  } = props
  const hasStoreSearch = customerStoreSearch.trim().length > 0
  const storesToBrowse = selectedStoreCategory ? categoryStores : visibleStores

  return (
    <section className="panel-stack">
      <div className="summary-bar">
        <div>
          <p>顾客工作台</p>
          <strong>
            {customerWorkspaceView === 'order'
              ? '点餐'
              : customerWorkspaceView === 'orders'
                ? '订单'
                : customerWorkspaceView === 'coupons'
                  ? '优惠券'
                : customerWorkspaceView === 'addresses'
                  ? '地址管理'
                : customerWorkspaceView === 'recharge'
                  ? '充值'
                : '个人信息'}
          </strong>
        </div>
        <div className="action-row">
          <button
            className={customerWorkspaceView === 'order' ? 'primary-button' : 'secondary-button'}
            onClick={() => navigate('/customer/order')}
            type="button"
          >
            点餐
          </button>
          <button
            className={customerWorkspaceView === 'orders' ? 'primary-button' : 'secondary-button'}
            onClick={() => navigate('/customer/orders')}
            type="button"
          >
            订单
          </button>
          <button
            className={
              customerWorkspaceView === 'profile' ||
              customerWorkspaceView === 'addresses' ||
              customerWorkspaceView === 'coupons' ||
              customerWorkspaceView === 'recharge'
                ? 'primary-button'
                : 'secondary-button'
            }
            onClick={() => navigate('/customer/profile')}
            type="button"
          >
            个人信息
          </button>
        </div>
      </div>

      {customerWorkspaceView === 'order' ? (
        <>
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
          {!selectedStore ? (
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
              <button
                className="primary-button"
                onClick={() => submitCustomerStoreSearch()}
                type="button"
              >
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
          ) : null}

          {!selectedStore && customerStoreSearchHistory.length > 0 ? (
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

            {selectedStore ? (
              <>
                <div className="store-toolbar">
                  <div>
                    <p className="ticket-kind">当前店铺</p>
                    <strong>{selectedStore.name}</strong>
                    <p className="meta-line">
                      {selectedStore.category} · {selectedStore.merchantName} ·{' '}
                      {formatStoreAvailability(selectedStore)}
                    </p>
                    <p className="meta-line">营业时间 {formatBusinessHours(selectedStore.businessHours)}</p>
                  </div>
                  <div>
                    <p>店铺评分</p>
                    <strong>
                      {formatAggregateRating(selectedStore.averageRating, selectedStore.ratingCount)}
                    </strong>
                  </div>
                  <div>
                    <p>已选菜品</p>
                    <strong>
                      {selectedStore.menu.reduce(
                        (sum: number, item: any) => sum + (quantities[item.id] ?? 0),
                        0,
                      )}
                    </strong>
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
                  <div className="banner warning">
                    当前不在营业时间内，店铺营业时间为 {formatBusinessHours(selectedStore.businessHours)}。
                  </div>
                ) : null}

                {selectedStore.menu.length > 0 ? (
                  <div className="menu-grid">
                    {selectedStore.menu.map((item: any) => (
                      <article key={item.id} className="menu-card">
                        <DisplayImageSlot
                          alt={`${item.name} 展示图`}
                          className="menu-image"
                          label="菜品展示图"
                          src={item.imageUrl}
                        />
                        <div>
                          <h3>{item.name}</h3>
                          <p>{item.description}</p>
                          {item.remainingQuantity != null ? (
                            <p className="meta-line">
                              {item.remainingQuantity > 0
                                ? `限量供应，剩余 ${item.remainingQuantity} 份`
                                : '当前已售罄'}
                            </p>
                          ) : null}
                        </div>
                        <div className="menu-footer">
                          <strong>{formatPrice(item.priceCents)}</strong>
                          <div className="stepper">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item, (quantities[item.id] ?? 0) - 1)}
                            >
                              -
                            </button>
                            <span>{quantities[item.id] ?? 0}</span>
                            <button
                              type="button"
                              disabled={item.remainingQuantity != null && (quantities[item.id] ?? 0) >= item.remainingQuantity}
                              onClick={() => updateQuantity(item, (quantities[item.id] ?? 0) + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : null}

                <div className="summary-bar">
                  <div>
                    <p>餐品金额</p>
                    <strong>{formatPrice(cartSubtotal)}</strong>
                  </div>
                  <div>
                    <p>配送费</p>
                    <strong>{cartSubtotal > 0 ? formatPrice(DELIVERY_FEE_CENTS) : '--'}</strong>
                  </div>
                  <div>
                    <p>订单金额</p>
                    <strong>{formatPrice(cartTotal)}</strong>
                  </div>
                  <div>
                    <p>账户余额</p>
                    <strong>{formatPrice(selectedCustomer?.balanceCents ?? 0)}</strong>
                  </div>
                  <button
                    className="primary-button"
                    disabled={!selectedStoreCanOrder}
                    onClick={() => openCheckout()}
                    type="button"
                  >
                    {selectedStore.status === 'Revoked'
                      ? '当前不可下单'
                      : !isStoreCurrentlyOpen(selectedStore)
                        ? '非营业时间'
                        : selectedStoreHasMenu
                          ? '提交订单'
                          : '暂无菜品可下单'}
                  </button>
                </div>

                {isCheckoutExpanded ? (
                  <section className="checkout-panel">
                    <div className="checkout-panel-header">
                      <div>
                        <p className="ticket-kind">结算台</p>
                        <h3>确认订单并完成余额支付</h3>
                        <p className="meta-line">不离开当前页面，直接填写配送信息并确认支付。</p>
                      </div>
                      <button
                        className="secondary-button"
                        onClick={() => setIsCheckoutExpanded(false)}
                        type="button"
                      >
                        收起
                      </button>
                    </div>

                    <div className="form-grid">
                      <label className="full">
                        <span>配送地址</span>
                        <input
                          className={deliveryAddressError ? 'field-error' : undefined}
                          list="customer-address-options"
                          value={deliveryAddress}
                          onChange={(event) => {
                            setDeliveryAddress(event.target.value)
                            if (deliveryAddressError) {
                              setDeliveryAddressError(null)
                            }
                          }}
                        />
                        {deliveryAddressError ? (
                          <span className="field-error-text">{deliveryAddressError}</span>
                        ) : null}
                        <datalist id="customer-address-options">
                          {selectedCustomer?.addresses.map((address: any) => (
                            <option
                              key={`${address.label}-${address.address}`}
                              value={address.address}
                            >
                              {address.label}
                            </option>
                          ))}
                        </datalist>
                      </label>
                      <label className="full">
                        <span>配送时间</span>
                        <input
                          className={scheduledDeliveryError ? 'field-error' : undefined}
                          max={todayDeliveryCutoff}
                          min={suggestedDeliveryTime}
                          type="datetime-local"
                          value={scheduledDeliveryTime}
                          onChange={(event) => {
                            setScheduledDeliveryTime(event.target.value)
                            setScheduledDeliveryTouched(true)
                            if (scheduledDeliveryError) {
                              setScheduledDeliveryError(null)
                              setError(null)
                            }
                          }}
                        />
                        {scheduledDeliveryError ? (
                          <span className="field-error-text">{scheduledDeliveryError}</span>
                        ) : (
                          <p className="meta-line">
                            仅可预约今天内的配送时间，且不得早于下单后 30 分钟。
                          </p>
                        )}
                      </label>
                      <label className="full">
                        <span>订单备注</span>
                        <input
                          placeholder="比如少辣、放门口"
                          value={remark}
                          onChange={(event) => setRemark(event.target.value)}
                        />
                      </label>
                      <div className="full summary-bar checkout-summary">
                        <div>
                          <p>店铺</p>
                          <strong>{selectedStore.name}</strong>
                        </div>
                        <div>
                          <p>餐品金额</p>
                          <strong>{formatPrice(cartSubtotal)}</strong>
                        </div>
                        <div>
                          <p>配送费</p>
                          <strong>{cartSubtotal > 0 ? formatPrice(DELIVERY_FEE_CENTS) : '--'}</strong>
                        </div>
                        <div>
                          <p>实付金额</p>
                          <strong>{formatPrice(cartTotal)}</strong>
                        </div>
                        <div>
                          <p>账户余额</p>
                          <strong>{formatPrice(selectedCustomer?.balanceCents ?? 0)}</strong>
                        </div>
                        <div>
                          <p>支付后余额</p>
                          <strong>
                            {remainingBalanceAfterCheckout !== null
                              ? formatPrice(Math.max(remainingBalanceAfterCheckout, 0))
                              : '--'}
                          </strong>
                        </div>
                      </div>
                      <div className="full summary-bar checkout-summary">
                        <div>
                          <p>付款方式</p>
                          <strong>账户余额支付</strong>
                        </div>
                        <div>
                          <p>支付状态</p>
                          <strong>
                            {selectedCustomer && selectedCustomer.balanceCents >= cartTotal
                              ? '余额充足'
                              : '余额不足'}
                          </strong>
                        </div>
                      </div>
                      {selectedCustomer && selectedCustomer.balanceCents < cartTotal ? (
                        <div className="banner error">当前余额不足，先到“顾客信息”页充值后再提交订单。</div>
                      ) : null}
                      <div className="checkout-actions">
                        <button className="secondary-button" onClick={() => openRechargePage()} type="button">
                          去充值
                        </button>
                        <button
                          className="primary-button"
                          disabled={
                            !selectedCustomer ||
                            !selectedStoreCanOrder ||
                            selectedCustomer.balanceCents < cartTotal
                          }
                          onClick={() => void submitOrder()}
                          type="button"
                        >
                          余额支付并提交
                        </button>
                      </div>
                    </div>
                  </section>
                ) : null}
              </>
            ) : !selectedStoreCategory && !hasStoreSearch && storeCategories.length > 0 ? (
              <div className="store-grid">
                {storeCategories.map((category: string) => {
                  const storesInCategory = visibleStores.filter((store: any) => store.category === category)
                  const openStoreCount = storesInCategory.filter(
                    (store: any) => isStoreCurrentlyOpen(store) && store.menu.length > 0,
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
                    <p className="ticket-kind">
                      {selectedStoreCategory ? '当前分类' : '搜索结果'}
                    </p>
                    <strong>{selectedStoreCategory || `“${customerStoreSearch.trim()}”`}</strong>
                    <p className="meta-line">
                      共 {storesToBrowse.length} 家餐厅，请选择已有菜品的店铺进入点餐。
                    </p>
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
                      <DisplayImageSlot
                        alt={`${store.name} 展示图`}
                        className="store-image compact-store-image"
                        label="餐厅展示图"
                        src={store.imageUrl}
                      />
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
                    </article>
                  ))}
                </div>
              </>
            ) : (
              <div className="empty-card">
                {customerStoreSearch.trim()
                  ? '没有找到匹配的店铺，请换个关键词试试。'
                  : '当前分类下没有可浏览的店铺。'}
                <button className="secondary-button" onClick={() => resetStoreCategory()} type="button">
                  返回分类列表
                </button>
              </div>
            )}
          </Panel>
        </>
      ) : customerWorkspaceView === 'orders' ? (
        <Panel
          title="顾客订单视图"
          description={`查看历史订单；仅最近 ${REVIEW_WINDOW_DAYS} 天内完成的订单可评价商家和骑手，并补充额外文字说明。`}
        >
          <div className={pendingCustomerReviewOrders.length > 0 ? 'banner info' : 'banner'}>
            {pendingCustomerReviewOrders.length > 0
              ? `当前有 ${pendingCustomerReviewOrders.length} 个最近 ${REVIEW_WINDOW_DAYS} 天内完成且未评价的订单，可在对应订单卡片中点击“去评价”。`
              : `当前没有待评价订单。仅最近 ${REVIEW_WINDOW_DAYS} 天内完成的订单支持评价；若订单刚送达，请等待几秒自动同步或点击“刷新状态”。`}
          </div>
          <div className="summary-bar">
            <div>
              <p>历史订单数</p>
              <strong>{customerOrders.length}</strong>
            </div>
            <div>
              <p>已完成订单</p>
              <strong>{completedCustomerOrders.length}</strong>
            </div>
          </div>
          <OrderList
            orders={customerOrders}
            emptyText="当前顾客还没有订单。"
            formatPrice={formatPrice}
            formatTime={formatTime}
            footer={(order) => {
              if (canReviewOrder(order)) {
                const remainingDays = getRemainingReviewDays(order)
                return (
                  <>
                    {canSubmitPartialRefund(order) ? (
                      <div className="panel-stack">
                        {order.items.map((item: any) => {
                          const draftKey = `${order.id}-${item.menuItemId}`
                          const draft = partialRefundDrafts[draftKey] ?? { quantity: 1, reason: '' }
                          const refundError = partialRefundErrors[draftKey]
                          const remainingRefundableQuantity = getRemainingRefundableQuantity(order, item.menuItemId)
                          const hasPendingRefund = order.partialRefundRequests.some(
                            (refund: any) => refund.menuItemId === item.menuItemId && refund.status === 'Pending',
                          )

                          if (remainingRefundableQuantity <= 0 && !hasPendingRefund) {
                            return null
                          }

                          return (
                            <div key={item.menuItemId} className={`ticket-actions refund-request-row${refundError ? ' has-error' : ''}`}>
                              <span className="meta-line">
                                {item.name} 可退 {remainingRefundableQuantity} 份
                              </span>
                              <input
                                max={Math.max(1, remainingRefundableQuantity)}
                                min={1}
                                type="number"
                                value={draft.quantity}
                                onChange={(event) =>
                                  setPartialRefundDrafts((current: Record<string, any>) => ({
                                    ...current,
                                    [draftKey]: {
                                      quantity: Number(event.target.value) || 1,
                                      reason: current[draftKey]?.reason ?? '',
                                    },
                                  }))
                                }
                              />
                              <input
                                className={refundError ? 'field-error' : undefined}
                                placeholder="例如：这个菜没货就退掉"
                                value={draft.reason}
                                onChange={(event) => {
                                  setPartialRefundDrafts((current: Record<string, any>) => ({
                                    ...current,
                                    [draftKey]: {
                                      quantity: current[draftKey]?.quantity ?? 1,
                                      reason: event.target.value,
                                    },
                                  }))
                                  setPartialRefundErrors((current: Record<string, string>) => {
                                    if (!current[draftKey]) return current
                                    const next = { ...current }
                                    delete next[draftKey]
                                    return next
                                  })
                                }}
                              />
                              <button
                                className="secondary-button"
                                disabled={remainingRefundableQuantity <= 0 || hasPendingRefund}
                                onClick={() => void submitPartialRefundRequest(order.id, item.menuItemId)}
                                type="button"
                              >
                                {hasPendingRefund ? '退款申请处理中' : '申请退这件商品'}
                              </button>
                              {refundError ? <span className="field-error-text refund-error-text">{refundError}</span> : null}
                            </div>
                          )
                        })}
                      </div>
                    ) : null}
                    <div className="inline-form">
                      <p className="meta-line">该订单仍在评价时限内，还剩 {remainingDays} 天可评价商家和骑手。</p>
                      <button className="secondary-button" onClick={() => navigate(`/customer/review/${order.id}`)} type="button">
                        去评价
                      </button>
                    </div>
                    <OrderChatPanel
                      currentDisplayName={selectedCustomer?.name ?? '顾客'}
                      currentRole="customer"
                      draft={orderChatDrafts[order.id] ?? ''}
                      errorText={orderChatErrors[order.id]}
                      disabled={false}
                      disabledReason={
                        order.riderId
                          ? undefined
                          : '骑手尚未接单，当前聊天将先发送给商家；骑手接单后也能看到历史消息。'
                      }
                      formatTime={formatTime}
                      order={order}
                      onChangeDraft={(value) =>
                        {
                          setOrderChatDrafts((current: Record<string, string>) => ({
                            ...current,
                            [order.id]: value,
                          }))
                          setOrderChatErrors((current: Record<string, string>) => {
                            if (!current[order.id]) return current
                            const next = { ...current }
                            delete next[order.id]
                            return next
                          })
                        }
                      }
                      onSubmit={() => void submitOrderChatMessage(order.id)}
                    />
                  </>
                )
              }

              return (
                <>
                  {canSubmitPartialRefund(order) ? (
                    <div className="panel-stack">
                      {order.items.map((item: any) => {
                        const draftKey = `${order.id}-${item.menuItemId}`
                        const draft = partialRefundDrafts[draftKey] ?? { quantity: 1, reason: '' }
                        const refundError = partialRefundErrors[draftKey]
                        const remainingRefundableQuantity = getRemainingRefundableQuantity(order, item.menuItemId)
                        const hasPendingRefund = order.partialRefundRequests.some(
                          (refund: any) => refund.menuItemId === item.menuItemId && refund.status === 'Pending',
                        )

                        if (remainingRefundableQuantity <= 0 && !hasPendingRefund) {
                          return null
                        }

                        return (
                          <div key={item.menuItemId} className={`ticket-actions refund-request-row${refundError ? ' has-error' : ''}`}>
                            <span className="meta-line">
                              {item.name} 可退 {remainingRefundableQuantity} 份
                            </span>
                            <input
                              max={Math.max(1, remainingRefundableQuantity)}
                              min={1}
                              type="number"
                              value={draft.quantity}
                              onChange={(event) =>
                                setPartialRefundDrafts((current: Record<string, any>) => ({
                                  ...current,
                                  [draftKey]: {
                                    quantity: Number(event.target.value) || 1,
                                    reason: current[draftKey]?.reason ?? '',
                                  },
                                }))
                              }
                            />
                            <input
                              className={refundError ? 'field-error' : undefined}
                              placeholder="例如：这个菜没货就退掉"
                              value={draft.reason}
                              onChange={(event) => {
                                setPartialRefundDrafts((current: Record<string, any>) => ({
                                  ...current,
                                  [draftKey]: {
                                    quantity: current[draftKey]?.quantity ?? 1,
                                    reason: event.target.value,
                                  },
                                }))
                                setPartialRefundErrors((current: Record<string, string>) => {
                                  if (!current[draftKey]) return current
                                  const next = { ...current }
                                  delete next[draftKey]
                                  return next
                                })
                              }}
                            />
                            <button
                              className="secondary-button"
                              disabled={remainingRefundableQuantity <= 0 || hasPendingRefund}
                              onClick={() => void submitPartialRefundRequest(order.id, item.menuItemId)}
                              type="button"
                            >
                              {hasPendingRefund ? '退款申请处理中' : '申请退这件商品'}
                            </button>
                            {refundError ? <span className="field-error-text refund-error-text">{refundError}</span> : null}
                          </div>
                        )
                      })}
                    </div>
                  ) : null}
                  <OrderChatPanel
                      currentDisplayName={selectedCustomer?.name ?? '顾客'}
                      currentRole="customer"
                      draft={orderChatDrafts[order.id] ?? ''}
                      errorText={orderChatErrors[order.id]}
                      disabled={false}
                    disabledReason={
                      order.riderId
                        ? undefined
                        : '骑手尚未接单，当前聊天将先发送给商家；骑手接单后也能看到历史消息。'
                    }
                    formatTime={formatTime}
                    order={order}
                    onChangeDraft={(value) =>
                      {
                        setOrderChatDrafts((current: Record<string, string>) => ({
                          ...current,
                          [order.id]: value,
                        }))
                        setOrderChatErrors((current: Record<string, string>) => {
                          if (!current[order.id]) return current
                          const next = { ...current }
                          delete next[order.id]
                          return next
                        })
                      }
                    }
                    onSubmit={() => void submitOrderChatMessage(order.id)}
                  />
                </>
              )
            }}
            statusLabels={statusLabels}
          />
        </Panel>
      ) : customerWorkspaceView === 'review' ? (
        <Panel
          title="订单评价"
          description={`商家与骑手评价现在分开提交。5 星可直接提交，非 5 星必须填写理由；评价入口仅保留到订单完成后 ${REVIEW_WINDOW_DAYS} 天内。`}
        >
          {activeReviewOrder ? (
            <section className="review-page-panel">
              <div className="panel-header">
                <div>
                  <h3>{activeReviewOrder.storeName}</h3>
                  <p>
                    {activeReviewOrder.id} · {activeReviewOrder.riderName ?? '待分配骑手'}
                  </p>
                </div>
              </div>
              <div className="review-dialog-form">
                <section className="review-rating-field">
                  {reviewErrors[`${activeReviewOrder.id}-store`] ? (
                    <div className="banner error review-inline-error">
                      {reviewErrors[`${activeReviewOrder.id}-store`]}
                    </div>
                  ) : null}
                  <div className="review-rating-header">
                    <span>商家评价</span>
                    <strong>
                      {activeReviewOrder.storeRating != null ? `已提交 ${activeReviewOrder.storeRating} 星` : '待提交'}
                    </strong>
                  </div>
                  <StarRatingField
                    label="商家评分"
                    rating={reviewDrafts[`${activeReviewOrder.id}-store`]?.rating ?? 5}
                    onChange={(rating) => updateReviewDraft(`${activeReviewOrder.id}-store`, { rating })}
                  />
                  <input
                    className={reviewErrors[`${activeReviewOrder.id}-store`] ? 'field-error' : undefined}
                    placeholder="非 5 星时必须填写理由"
                    value={reviewDrafts[`${activeReviewOrder.id}-store`]?.comment ?? ''}
                    onChange={(event) =>
                      updateReviewDraft(`${activeReviewOrder.id}-store`, { comment: event.target.value })
                    }
                  />
                  <div className="review-reason-options">
                    {STORE_REVIEW_REASON_OPTIONS.map((reason: string) => (
                      <button
                        key={reason}
                        className="secondary-button review-reason-chip"
                        onClick={() => updateReviewDraft(`${activeReviewOrder.id}-store`, { comment: reason })}
                        type="button"
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                  {reviewErrors[`${activeReviewOrder.id}-store`] ? (
                    <small className="field-error-text">{reviewErrors[`${activeReviewOrder.id}-store`]}</small>
                  ) : (
                    <small className="field-hint">可以点击下方预设理由快速填写。</small>
                  )}
                  <input
                    placeholder="商家补充说明（可选）"
                    value={reviewDrafts[`${activeReviewOrder.id}-store`]?.extraNote ?? ''}
                    onChange={(event) =>
                      updateReviewDraft(`${activeReviewOrder.id}-store`, { extraNote: event.target.value })
                    }
                  />
                  <div className="action-row">
                    <p className="meta-line">5 星可直接提交，1 到 4 星必须填写理由。</p>
                    <button
                      className="primary-button"
                      disabled={!hasPendingStoreReview(activeReviewOrder)}
                      onClick={() => void submitReview(activeReviewOrder.id, 'store')}
                      type="button"
                    >
                      {hasPendingStoreReview(activeReviewOrder) ? '提交商家评价' : '商家已评价'}
                    </button>
                  </div>
                </section>
                {activeReviewOrder.riderId ? (
                  <section className="review-rating-field">
                    {reviewErrors[`${activeReviewOrder.id}-rider`] ? (
                      <div className="banner error review-inline-error">
                        {reviewErrors[`${activeReviewOrder.id}-rider`]}
                      </div>
                    ) : null}
                    <div className="review-rating-header">
                      <span>骑手评价</span>
                      <strong>
                        {activeReviewOrder.riderRating != null ? `已提交 ${activeReviewOrder.riderRating} 星` : '待提交'}
                      </strong>
                    </div>
                    <StarRatingField
                      label="骑手评分"
                      rating={reviewDrafts[`${activeReviewOrder.id}-rider`]?.rating ?? 5}
                      onChange={(rating) => updateReviewDraft(`${activeReviewOrder.id}-rider`, { rating })}
                    />
                    <input
                      className={reviewErrors[`${activeReviewOrder.id}-rider`] ? 'field-error' : undefined}
                      placeholder="非 5 星时必须填写理由"
                      value={reviewDrafts[`${activeReviewOrder.id}-rider`]?.comment ?? ''}
                      onChange={(event) =>
                        updateReviewDraft(`${activeReviewOrder.id}-rider`, { comment: event.target.value })
                      }
                    />
                    <div className="review-reason-options">
                      {RIDER_REVIEW_REASON_OPTIONS.map((reason: string) => (
                        <button
                          key={reason}
                          className="secondary-button review-reason-chip"
                          onClick={() => updateReviewDraft(`${activeReviewOrder.id}-rider`, { comment: reason })}
                          type="button"
                        >
                          {reason}
                        </button>
                      ))}
                    </div>
                    {reviewErrors[`${activeReviewOrder.id}-rider`] ? (
                      <small className="field-error-text">{reviewErrors[`${activeReviewOrder.id}-rider`]}</small>
                    ) : (
                      <small className="field-hint">可以先选预设理由，再补充自己的描述。</small>
                    )}
                    <input
                      placeholder="骑手补充说明（可选）"
                      value={reviewDrafts[`${activeReviewOrder.id}-rider`]?.extraNote ?? ''}
                      onChange={(event) =>
                        updateReviewDraft(`${activeReviewOrder.id}-rider`, { extraNote: event.target.value })
                      }
                    />
                    <div className="action-row">
                      <p className="meta-line">你不需要和商家评价一起提交，可以分开完成。</p>
                      <button
                        className="primary-button"
                        disabled={!hasPendingRiderReview(activeReviewOrder)}
                        onClick={() => void submitReview(activeReviewOrder.id, 'rider')}
                        type="button"
                      >
                        {hasPendingRiderReview(activeReviewOrder) ? '提交骑手评价' : '骑手已评价'}
                      </button>
                    </div>
                  </section>
                ) : null}
                <div className="action-row">
                  <button className="secondary-button" onClick={() => navigate('/customer/orders')} type="button">
                    返回订单
                  </button>
                </div>
              </div>
            </section>
          ) : null}
        </Panel>
      ) : customerWorkspaceView === 'recharge' ? (
        <Panel title="账户充值" description="选择快捷金额或输入自定义金额，充值成功后将返回顾客信息页。">
          {selectedCustomer ? (
            <section className="review-page-panel">
              <div className="summary-bar">
                <div>
                  <p>当前余额</p>
                  <strong>{formatPrice(selectedCustomer.balanceCents)}</strong>
                </div>
                <div>
                  <p>快捷金额</p>
                  <strong>{RECHARGE_PRESET_AMOUNTS.join(' / ')} 元</strong>
                </div>
              </div>

              <div className="action-row" style={{ marginTop: '20px', flexWrap: 'wrap' }}>
                {RECHARGE_PRESET_AMOUNTS.map((amount: number) => (
                  <button
                    key={amount}
                    className={selectedRechargeAmount === amount ? 'primary-button' : 'secondary-button'}
                    onClick={() => selectRechargeAmount(amount)}
                    type="button"
                  >
                    {selectedRechargeAmount === amount ? '已选' : '选择'} {amount} 元
                  </button>
                ))}
              </div>

              <div className="form-grid" style={{ marginTop: '20px' }}>
                <label className="full">
                  <span>自定义金额</span>
                  <input
                    className={rechargeAmountError ? 'field-error' : undefined}
                    inputMode="decimal"
                    placeholder="输入充值金额，例如 88.8"
                    value={customRechargeAmount}
                    onChange={(event) => {
                      setCustomRechargeAmount(event.target.value)
                      setSelectedRechargeAmount(null)
                      setError(null)
                    }}
                  />
                  {rechargeAmountError ? <span className="field-error-text">{rechargeAmountError}</span> : null}
                </label>
              </div>

              <p className="meta-line" style={{ marginTop: '16px' }}>
                本次将充值{' '}
                <strong>{rechargeAmountPreview !== null ? formatPrice(Math.round(rechargeAmountPreview * 100)) : '--'}</strong>
                ，充值后余额预计为{' '}
                <strong>
                  {rechargeAmountPreview !== null
                    ? formatPrice(selectedCustomer.balanceCents + Math.round(rechargeAmountPreview * 100))
                    : '--'}
                </strong>
                。
              </p>

              <div className="action-row" style={{ marginTop: '20px' }}>
                <button className="secondary-button" onClick={() => navigate('/customer/profile')} type="button">
                  返回个人信息
                </button>
                <button
                  className="primary-button"
                  disabled={parsedRechargeAmount === null || rechargeAmountError !== null}
                  onClick={() => void submitRechargeFromPage()}
                  type="button"
                >
                  确认充值
                </button>
              </div>
            </section>
          ) : null}
        </Panel>
      ) : customerWorkspaceView === 'coupons' ? (
        <Panel title="我的优惠券" description="在个人信息内查看可用优惠券与使用门槛。">
          {selectedCustomer ? (
            <>
              <div className="summary-bar">
                <div>
                  <p>当前账号</p>
                  <strong>{selectedCustomer.name}</strong>
                </div>
                <div>
                  <p>优惠券数量</p>
                  <strong>{selectedCustomer.coupons.length}</strong>
                </div>
                <div>
                  <p>账户余额</p>
                  <strong>{formatPrice(selectedCustomer.balanceCents)}</strong>
                </div>
                <button className="secondary-button" onClick={() => navigate('/customer/profile')} type="button">
                  返回个人信息
                </button>
              </div>
              <div className="ticket-grid">
                {selectedCustomer.coupons.length === 0 ? (
                  <div className="empty-card">当前没有可用优惠券。</div>
                ) : (
                  selectedCustomer.coupons.map((coupon: any) => (
                    <article key={coupon.id} className="ticket-card">
                      <div className="ticket-header">
                        <div>
                          <p className="ticket-kind">优惠券</p>
                          <h3>{coupon.title}</h3>
                        </div>
                        <span className="badge success">{formatPrice(coupon.discountCents)}</span>
                      </div>
                      <p>{coupon.description}</p>
                      <p className="meta-line">
                        满 {formatPrice(coupon.minimumSpendCents)} 可用 · 到期 {formatTime(coupon.expiresAt)}
                      </p>
                    </article>
                  ))
                )}
              </div>
            </>
          ) : null}
        </Panel>
      ) : customerWorkspaceView === 'addresses' ? (
        <Panel title="地址管理" description="把常用地址维护独立出来，个人信息页只保留摘要。">
          {selectedCustomer ? (
            <>
              <div className="summary-bar">
                <div>
                  <p>默认地址</p>
                  <strong>{selectedCustomer.defaultAddress}</strong>
                </div>
                <div>
                  <p>地址数量</p>
                  <strong>{selectedCustomer.addresses.length}</strong>
                </div>
                <button className="secondary-button" onClick={() => navigate('/customer/profile')} type="button">
                  返回个人信息
                </button>
              </div>
              <div className="form-grid">
                <label>
                  <span>地址标签</span>
                  <input
                    className={addressFormErrors.label ? 'field-error' : undefined}
                    value={addressDraft.label}
                    onChange={(event) => {
                      setAddressDraft((current: any) => ({ ...current, label: event.target.value }))
                      setAddressFormErrors((current: any) => ({ ...current, label: undefined }))
                    }}
                  />
                  {addressFormErrors.label ? (
                    <span className="field-error-text">{addressFormErrors.label}</span>
                  ) : null}
                </label>
                <label className="full">
                  <span>新增地址</span>
                  <input
                    className={addressFormErrors.address ? 'field-error' : undefined}
                    value={addressDraft.address}
                    onChange={(event) => {
                      setAddressDraft((current: any) => ({ ...current, address: event.target.value }))
                      setAddressFormErrors((current: any) => ({ ...current, address: undefined }))
                    }}
                  />
                  {addressFormErrors.address ? (
                    <span className="field-error-text">{addressFormErrors.address}</span>
                  ) : null}
                </label>
              </div>
              <div className="summary-bar">
                <button className="secondary-button" onClick={() => void addCustomerAddress()} type="button">
                  添加地址
                </button>
              </div>
              <div className="ticket-grid">
                {selectedCustomer.addresses.map((address: any) => (
                  <article key={`${address.label}-${address.address}`} className="ticket-card">
                    <div className="ticket-header">
                      <div>
                        <p className="ticket-kind">地址簿</p>
                        <h3>{address.label}</h3>
                      </div>
                      <span className="badge">
                        {address.address === selectedCustomer.defaultAddress ? '默认' : '已保存'}
                      </span>
                    </div>
                    <p>{address.address}</p>
                    <div className="action-row" style={{ marginTop: '16px' }}>
                      {address.address !== selectedCustomer.defaultAddress ? (
                        <button
                          className="secondary-button"
                          onClick={() => void setDefaultCustomerAddress(address.address)}
                          type="button"
                        >
                          设为默认
                        </button>
                      ) : null}
                      <button
                        className="secondary-button"
                        disabled={address.address === selectedCustomer.defaultAddress}
                        onClick={() => void removeCustomerAddress(address.address)}
                        type="button"
                      >
                        删除地址
                      </button>
                    </div>
                    {address.address === selectedCustomer.defaultAddress ? (
                      <p className="meta-line" style={{ marginTop: '12px' }}>
                        如需删除当前默认地址，请先把其他地址设为默认。
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            </>
          ) : null}
        </Panel>
      ) : (
        <Panel title="顾客信息" description="查看个人资料、会员状态、优惠券和地址簿。">
          {selectedCustomer ? (
            <>
              <div className="form-grid">
                <label>
                  <span>匿名编号</span>
                  <input value={selectedCustomer.name} disabled />
                </label>
                <label>
                  <span>手机号</span>
                  <input value={selectedCustomer.phone} disabled />
                </label>
              </div>
              <div className="summary-bar">
                <div>
                  <p>账户余额</p>
                  <strong>{formatPrice(selectedCustomer.balanceCents)}</strong>
                </div>
                <div>
                  <p>会员等级</p>
                  <strong>{selectedCustomer.membershipTier === 'Member' ? '会员' : '普通'}</strong>
                </div>
                <div>
                  <p>近 30 天消费</p>
                  <strong>{formatPrice(selectedCustomer.monthlySpendCents)}</strong>
                </div>
                <div>
                  <p>自动派单时限</p>
                  <strong>{selectedCustomer.membershipTier === 'Member' ? '8 分钟' : '15 分钟'}</strong>
                </div>
                <button className="secondary-button" onClick={() => openRechargePage()} type="button">
                  充值
                </button>
                <button className="secondary-button" onClick={() => navigate('/customer/profile/coupons')} type="button">
                  优惠券
                </button>
                <button className="secondary-button" onClick={() => navigate('/customer/profile/addresses')} type="button">
                  地址管理
                </button>
              </div>
              <div className="summary-bar">
                <div>
                  <p>地址数量</p>
                  <strong>{selectedCustomer.addresses.length}</strong>
                </div>
                <div>
                  <p>默认地址</p>
                  <strong>{selectedCustomer.defaultAddress}</strong>
                </div>
                <button className="secondary-button" onClick={() => navigate('/customer/profile/addresses')} type="button">
                  管理地址
                </button>
              </div>
            </>
          ) : null}
        </Panel>
      )}
    </section>
  )
}
