import { DisplayImageSlot } from '@/components/delivery-console/DisplayImageSlot'
import { OrderChatPanel } from '@/components/delivery-console/OrderChatPanel'
import { OrderList } from '@/components/delivery-console/OrderList'
import { Panel } from '@/components/delivery-console/LayoutPrimitives'
import { DELIVERY_CONSOLE_MESSAGES } from '@/features/delivery-console'

export function MerchantConsolePanel(props: any) {
  const {
    activeMerchantStore,
    storesToRender,
    merchantStores,
    leaveMerchantStore,
    state,
    getMenuItemDraft,
    isMenuComposerExpanded,
    menuItemFormErrors,
    isMenuItemImageUploading,
    formatAggregateRating,
    formatPrice,
    formatBusinessHours,
    storeOperationErrors,
    getStoreOperationDraft,
    setStoreOperationDrafts,
    setStoreOperationErrors,
    submitStoreOperationalInfo,
    eligibilityReviewDrafts,
    setEligibilityReviewDrafts,
    runAction,
    buildEligibilityReviewPayload,
    submitEligibilityReview,
    setMenuComposerOpen,
    getMerchantFieldClassName,
    getMenuItemFieldId,
    setMenuItemDrafts,
    setMenuItemFormErrors,
    uploadStoreMenuImage,
    submitStoreMenuItem,
    getMenuItemStockError,
    getMenuItemStockDraft,
    setMenuItemStockDrafts,
    submitMenuItemStock,
    clearMenuItemStockLimit,
    partialRefundResolutionDrafts,
    setPartialRefundResolutionDrafts,
    resolvePartialRefundRequest,
    getOrderRejectDraft,
    getOrderRejectError,
    setOrderRejectDrafts,
    setOrderRejectErrors,
    submitOrderReject,
    removeStoreMenuItem,
    acceptOrder,
    readyOrder,
    merchantAppealDrafts,
    setMerchantAppealDrafts,
    buildReviewAppealPayload,
    submitReviewAppeal,
    orderChatDrafts,
    orderChatErrors,
    setOrderChatDrafts,
    setOrderChatErrors,
    submitOrderChatMessage,
    formatTime,
    statusLabels,
    enterMerchantStore,
  } = props

  return (
    <Panel title="商家控制台" description="仅已审核通过的店铺可接单和推进出餐状态。">
      {merchantStores.length > 0 ? (
        <div className="merchant-store-list">
          {activeMerchantStore ? (
            <div className="summary-bar merchant-store-single-bar">
              <div><p>当前店铺</p><strong>{activeMerchantStore.name}</strong></div>
              <button className="secondary-button" onClick={() => leaveMerchantStore()} type="button">返回全部店铺</button>
            </div>
          ) : null}

          {storesToRender.map((store: any) => {
            const storeOrders = state.orders.filter((order: any) => order.storeId === store.id) ?? []
            const menuItemDraft = getMenuItemDraft(store.id)
            const isMenuComposerVisible = isMenuComposerExpanded(store.id)
            const storeMenuItemErrors = menuItemFormErrors[store.id] ?? {}
            const storeMenuImageUploading = isMenuItemImageUploading(store.id)

            if (!activeMerchantStore) {
              return (
                <article key={store.id} className="ticket-card merchant-store-module">
                  <div className="merchant-store-module__summary">
                    <div className="merchant-store-module__heading">
                      <div><p className="ticket-kind">店铺模块</p><h3>{store.name}</h3></div>
                      <p className="meta-line">{store.category}</p>
                    </div>
                    <div className="merchant-store-module__summary-actions">
                      <span className={store.status === 'Revoked' ? 'badge warning' : 'badge success'}>{store.status === 'Revoked' ? '已取消' : '已通过'}</span>
                      <span className="badge">{storeOrders.length} 笔订单</span>
                      <button className="merchant-store-module__summary-toggle" onClick={() => enterMerchantStore(store.id)} type="button">进入店铺</button>
                    </div>
                  </div>
                </article>
              )
            }

            return (
              <article key={store.id} className="ticket-card merchant-store-module">
                <div className="merchant-store-module__frame">
                  <div className="merchant-store-module__hero">
                    <div className="merchant-store-module__heading">
                      <div><p className="ticket-kind">店铺模块</p><h3>{store.name}</h3></div>
                      <p className="meta-line">{store.category}</p>
                    </div>
                    <div className="merchant-store-module__summary-actions">
                      <span className={store.status === 'Revoked' ? 'badge warning' : 'badge success'}>{store.status === 'Revoked' ? '已取消' : '已通过'}</span>
                      <span className="badge">{storeOrders.length} 笔订单</span>
                    </div>
                  </div>

                  <div className="merchant-store-module__layout">
                    <aside className="merchant-store-sidebar">
                      <div className="merchant-section-card">
                        <p className="ticket-kind">概览</p>
                        <div className="merchant-metric-list">
                          <div><p>商家评分</p><strong>{formatAggregateRating(store.averageRating, store.ratingCount)}</strong></div>
                          <div><p>营业额</p><strong>{formatPrice(store.revenueCents)}</strong></div>
                          <div><p>营业时间</p><strong>{formatBusinessHours(store.businessHours)}</strong></div>
                          <div><p>预计出餐</p><strong>{store.avgPrepMinutes} 分钟</strong></div>
                        </div>
                      </div>

                      <div className="merchant-section-card">
                        <p className="ticket-kind">营业设置</p>
                        <div className="form-grid">
                          <label>
                            <span>开业时间</span>
                            <input className={storeOperationErrors[store.id]?.openTime ? 'field-error' : undefined} type="time" value={getStoreOperationDraft(store).openTime} onChange={(event) => { const value = event.target.value; setStoreOperationDrafts((current: any) => ({ ...current, [store.id]: { ...getStoreOperationDraft(store), openTime: value } })); setStoreOperationErrors((current: any) => ({ ...current, [store.id]: { ...(current[store.id] ?? {}), openTime: undefined, closeTime: undefined } })) }} />
                            {storeOperationErrors[store.id]?.openTime ? <small className="field-error-text">{storeOperationErrors[store.id].openTime}</small> : null}
                          </label>
                          <label>
                            <span>打烊时间</span>
                            <input className={storeOperationErrors[store.id]?.closeTime ? 'field-error' : undefined} type="time" value={getStoreOperationDraft(store).closeTime} onChange={(event) => { const value = event.target.value; setStoreOperationDrafts((current: any) => ({ ...current, [store.id]: { ...getStoreOperationDraft(store), closeTime: value } })); setStoreOperationErrors((current: any) => ({ ...current, [store.id]: { ...(current[store.id] ?? {}), openTime: undefined, closeTime: undefined } })) }} />
                            {storeOperationErrors[store.id]?.closeTime ? <small className="field-error-text">{storeOperationErrors[store.id].closeTime}</small> : null}
                          </label>
                          <label className="full">
                            <span>预计出餐时间</span>
                            <input className={storeOperationErrors[store.id]?.avgPrepMinutes ? 'field-error' : undefined} inputMode="numeric" max={120} min={1} value={getStoreOperationDraft(store).avgPrepMinutes} onChange={(event) => { const value = event.target.value; setStoreOperationDrafts((current: any) => ({ ...current, [store.id]: { ...getStoreOperationDraft(store), avgPrepMinutes: value } })); setStoreOperationErrors((current: any) => ({ ...current, [store.id]: { ...(current[store.id] ?? {}), avgPrepMinutes: undefined } })) }} />
                            {storeOperationErrors[store.id]?.avgPrepMinutes ? <small className="field-error-text">{storeOperationErrors[store.id].avgPrepMinutes}</small> : <small className="field-hint">填写 1 到 120 的整数，单位为分钟。</small>}
                          </label>
                        </div>
                        <div className="summary-bar">
                          <div><p>当前设置</p><strong>{getStoreOperationDraft(store).openTime} - {getStoreOperationDraft(store).closeTime} · {getStoreOperationDraft(store).avgPrepMinutes} 分钟</strong></div>
                          <button className="primary-button" onClick={() => void submitStoreOperationalInfo(store)} type="button">保存营业设置</button>
                        </div>
                      </div>

                      {store.status === 'Revoked' ? (
                        <div className="merchant-section-card">
                          <p className="ticket-kind">资格处理</p>
                          <div className="ticket-actions merchant-module-actions">
                            <input placeholder="店铺复核理由" value={eligibilityReviewDrafts[store.id] ?? ''} onChange={(event) => setEligibilityReviewDrafts((current: any) => ({ ...current, [store.id]: event.target.value }))} />
                            <button className="primary-button" onClick={() => void runAction(() => submitEligibilityReview(buildEligibilityReviewPayload('Store', store.id, eligibilityReviewDrafts[store.id] ?? '')))} type="button">发起营业资格复核</button>
                          </div>
                        </div>
                      ) : null}
                    </aside>

                    <div className="merchant-store-content">
                      <section className="merchant-section-card">
                        <div className="ticket-header merchant-menu-header">
                          <div><p className="ticket-kind">菜品管理</p><h3>店铺菜品</h3></div>
                          <div className="merchant-menu-actions">
                            <button className={isMenuComposerVisible ? 'primary-button' : 'secondary-button'} onClick={() => setMenuComposerOpen((current: any) => ({ ...current, [store.id]: !isMenuComposerExpanded(store.id) }))} type="button">{isMenuComposerVisible ? '收起新增菜品' : '新增菜品'}</button>
                          </div>
                        </div>
                        {isMenuComposerVisible ? (
                          <div className="merchant-menu-composer">
                            <div className="form-grid">
                              <label>
                                <span>菜品名称</span>
                                <input aria-invalid={Boolean(storeMenuItemErrors.name)} className={getMerchantFieldClassName(Boolean(storeMenuItemErrors.name))} id={getMenuItemFieldId(store.id, 'name')} value={menuItemDraft.name} onChange={(event) => { setMenuItemDrafts((current: any) => ({ ...current, [store.id]: { ...getMenuItemDraft(store.id), name: event.target.value } })); setMenuItemFormErrors((current: any) => ({ ...current, [store.id]: { ...(current[store.id] ?? {}), name: undefined } })) }} />
                                {storeMenuItemErrors.name ? <small className="field-error-text">{storeMenuItemErrors.name}</small> : null}
                              </label>
                              <label>
                                <span>价格</span>
                                <input aria-invalid={Boolean(storeMenuItemErrors.priceYuan)} className={getMerchantFieldClassName(Boolean(storeMenuItemErrors.priceYuan))} id={getMenuItemFieldId(store.id, 'priceYuan')} inputMode="decimal" placeholder="例如 18.80" value={menuItemDraft.priceYuan} onChange={(event) => { setMenuItemDrafts((current: any) => ({ ...current, [store.id]: { ...getMenuItemDraft(store.id), priceYuan: event.target.value } })); setMenuItemFormErrors((current: any) => ({ ...current, [store.id]: { ...(current[store.id] ?? {}), priceYuan: undefined } })) }} />
                                {storeMenuItemErrors.priceYuan ? <small className="field-error-text">{storeMenuItemErrors.priceYuan}</small> : <small className="field-hint">按元填写，提交时会自动换算。</small>}
                              </label>
                              <label>
                                <span>限量库存</span>
                                <input aria-invalid={Boolean(storeMenuItemErrors.remainingQuantity)} className={getMerchantFieldClassName(Boolean(storeMenuItemErrors.remainingQuantity))} id={getMenuItemFieldId(store.id, 'remainingQuantity')} inputMode="numeric" max={10} min={1} placeholder="留空表示不限量" value={menuItemDraft.remainingQuantity} onChange={(event) => { setMenuItemDrafts((current: any) => ({ ...current, [store.id]: { ...getMenuItemDraft(store.id), remainingQuantity: event.target.value } })); setMenuItemFormErrors((current: any) => ({ ...current, [store.id]: { ...(current[store.id] ?? {}), remainingQuantity: undefined } })) }} />
                                {storeMenuItemErrors.remainingQuantity ? <small className="field-error-text">{storeMenuItemErrors.remainingQuantity}</small> : <small className="field-hint">{DELIVERY_CONSOLE_MESSAGES.remainingQuantityHint}</small>}
                              </label>
                              <label className="full">
                                <span>菜品说明</span>
                                <textarea aria-invalid={Boolean(storeMenuItemErrors.description)} className={getMerchantFieldClassName(Boolean(storeMenuItemErrors.description))} id={getMenuItemFieldId(store.id, 'description')} placeholder="例如：招牌红烧牛腩，含主食与配菜" rows={3} value={menuItemDraft.description} onChange={(event) => { setMenuItemDrafts((current: any) => ({ ...current, [store.id]: { ...getMenuItemDraft(store.id), description: event.target.value } })); setMenuItemFormErrors((current: any) => ({ ...current, [store.id]: { ...(current[store.id] ?? {}), description: undefined } })) }} />
                                {storeMenuItemErrors.description ? <small className="field-error-text">{storeMenuItemErrors.description}</small> : null}
                              </label>
                              <div className="full upload-field">
                                <span>本地图片上传</span>
                                <input accept="image/png,image/jpeg,image/gif,image/webp" className="visually-hidden-file-input" id={`store-menu-image-upload-${store.id}`} type="file" onChange={(event) => { const file = event.target.files?.[0]; void uploadStoreMenuImage(store.id, file); event.target.value = '' }} />
                                <label className={`${getMerchantFieldClassName(Boolean(storeMenuItemErrors.imageUrl), `secondary-button upload-trigger${storeMenuImageUploading ? ' is-uploading' : ''}`)}`} htmlFor={`store-menu-image-upload-${store.id}`}>{storeMenuImageUploading ? '正在上传图片...' : '选择菜品图片'}</label>
                                <input aria-invalid={Boolean(storeMenuItemErrors.imageUrl)} className={getMerchantFieldClassName(Boolean(storeMenuItemErrors.imageUrl), 'upload-file-name')} readOnly value={menuItemDraft.uploadedImageName || '尚未选择文件'} />
                                {storeMenuItemErrors.imageUrl ? <small className="field-error-text">{storeMenuItemErrors.imageUrl}</small> : <small className="field-hint">支持 JPG、PNG、GIF、WebP，单张不超过 5MB。</small>}
                              </div>
                              <label className="full">
                                <span>菜品图片 URL</span>
                                <input aria-invalid={Boolean(storeMenuItemErrors.imageUrl)} className={getMerchantFieldClassName(Boolean(storeMenuItemErrors.imageUrl))} id={getMenuItemFieldId(store.id, 'imageUrl')} placeholder="可粘贴线上图片链接，或使用上方上传后自动回填" value={menuItemDraft.imageUrl} onChange={(event) => { setMenuItemDrafts((current: any) => ({ ...current, [store.id]: { ...getMenuItemDraft(store.id), imageUrl: event.target.value, uploadedImageName: event.target.value === getMenuItemDraft(store.id).imageUrl ? getMenuItemDraft(store.id).uploadedImageName : '' } })); setMenuItemFormErrors((current: any) => ({ ...current, [store.id]: { ...(current[store.id] ?? {}), imageUrl: undefined } })) }} />
                              </label>
                              <div className="full merchant-menu-preview">
                                <DisplayImageSlot alt={`${store.name} 菜品预览`} label="菜品图片预览" src={menuItemDraft.imageUrl.trim() || undefined} className="menu-image merchant-menu-preview-image" />
                              </div>
                            </div>
                            <div className="summary-bar merchant-menu-submit-bar">
                              <div><p>新增说明</p><strong>每道菜需包含图片、价格和说明</strong></div>
                              <div className="merchant-menu-submit-actions">
                                <button className="secondary-button" onClick={() => setMenuComposerOpen((current: any) => ({ ...current, [store.id]: false }))} type="button">取消</button>
                                <button className="primary-button" disabled={storeMenuImageUploading} onClick={() => void submitStoreMenuItem(store.id)} type="button">{storeMenuImageUploading ? '图片上传中...' : '确认新增'}</button>
                              </div>
                            </div>
                          </div>
                        ) : null}
                        <div className="menu-grid merchant-menu-grid">
                          {store.menu.map((item: any) => (
                            <article key={item.id} className="menu-card">
                              <DisplayImageSlot alt={`${item.name} 展示图`} className="menu-image" label="菜品展示图" src={item.imageUrl} />
                              <div>
                                <h3>{item.name}</h3>
                                <p>{item.description}</p>
                                {item.remainingQuantity != null ? <p className="meta-line">{item.remainingQuantity > 0 ? `限量剩余 ${item.remainingQuantity} 份` : '当前已售罄'}</p> : null}
                              </div>
                              <div className="menu-footer">
                                <strong>{formatPrice(item.priceCents)}</strong>
                                <div className="merchant-menu-item-actions">
                                  <span className={item.remainingQuantity === 0 ? 'badge warning' : 'badge'}>{item.remainingQuantity == null ? '不限量' : item.remainingQuantity > 0 ? `剩余 ${item.remainingQuantity} 份` : '已售罄'}</span>
                                  <input className={getMerchantFieldClassName(Boolean(getMenuItemStockError(getMenuItemStockDraft(item))))} inputMode="numeric" max={10} min={0} placeholder="不限量" value={getMenuItemStockDraft(item)} onChange={(event) => setMenuItemStockDrafts((current: any) => ({ ...current, [item.id]: event.target.value }))} />
                                  <button className="secondary-button merchant-menu-stock-button" disabled={Boolean(getMenuItemStockError(getMenuItemStockDraft(item)))} onClick={() => void submitMenuItemStock(store.id, item)} type="button">改剩余份数</button>
                                  <button className="secondary-button merchant-menu-stock-button" onClick={() => void clearMenuItemStockLimit(store.id, item)} type="button">设为不限量</button>
                                  <button className="secondary-button merchant-menu-remove-button" onClick={() => void runAction(() => removeStoreMenuItem(store.id, item.id))} type="button">下架商品</button>
                                </div>
                              </div>
                              {getMenuItemStockError(getMenuItemStockDraft(item)) ? <small className="field-error-text">{getMenuItemStockError(getMenuItemStockDraft(item))}</small> : null}
                            </article>
                          ))}
                        </div>
                      </section>

                      <section className="merchant-section-card">
                        <div className="ticket-header merchant-orders-header">
                          <div><p className="ticket-kind">订单管理</p><h3>当前店铺订单</h3></div>
                          <span className="badge">{storeOrders.length} 笔</span>
                        </div>
                        <OrderList
                          orders={storeOrders}
                          emptyText="当前店铺暂无订单。"
                          formatPrice={formatPrice}
                          formatTime={formatTime}
                          footer={(order) => {
                            const hasSubmittedStoreReview = order.storeRating != null
                            const hasPendingMerchantAppeal = state.reviewAppeals.some((appeal: any) => appeal.orderId === order.id && appeal.appellantRole === 'Merchant' && appeal.status === 'Pending')
                            return (
                              <>
                                {order.partialRefundRequests.length > 0 ? (
                                  <div className="panel-stack">
                                    {order.partialRefundRequests.map((refund: any) => (
                                      <div key={refund.id} className="ticket-actions">
                                        <span className="meta-line">缺货退款 · {refund.itemName} x {refund.quantity} ·{refund.status === 'Pending' ? ' 待处理' : refund.status === 'Approved' ? ' 已同意' : ' 已拒绝'}</span>
                                        <input disabled={refund.status !== 'Pending'} placeholder="处理说明" value={partialRefundResolutionDrafts[refund.id] ?? ''} onChange={(event) => setPartialRefundResolutionDrafts((current: any) => ({ ...current, [refund.id]: event.target.value }))} />
                                        {refund.status === 'Pending' ? (
                                          <>
                                            <button className="primary-button" onClick={() => void resolvePartialRefundRequest(refund.id, true)} type="button">同意退款</button>
                                            <button className="secondary-button" onClick={() => void resolvePartialRefundRequest(refund.id, false)} type="button">拒绝退款</button>
                                          </>
                                        ) : (
                                          <span className="badge">{refund.resolutionNote ?? '已处理'}</span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                ) : null}
                                <div className="action-row">
                                  {order.status === 'PendingMerchantAcceptance' ? (
                                    <>
                                      <button className="primary-button" onClick={() => void runAction(() => acceptOrder(order.id))} type="button">接单</button>
                                      <input className={getOrderRejectError(order.id) ? 'field-error' : undefined} maxLength={160} placeholder="拒单理由（必填）" value={getOrderRejectDraft(order.id)} onChange={(event) => { const value = event.target.value; setOrderRejectDrafts((current: any) => ({ ...current, [order.id]: value })); if (value.trim()) { setOrderRejectErrors((current: any) => { if (!current[order.id]) return current; const next = { ...current }; delete next[order.id]; return next }) } }} />
                                      <button className="secondary-button" onClick={() => void submitOrderReject(order.id)} type="button">拒绝接单</button>
                                      {getOrderRejectError(order.id) ? <small className="field-error-text">{getOrderRejectError(order.id)}</small> : null}
                                    </>
                                  ) : null}
                                  {order.status === 'Preparing' ? <button className="secondary-button" onClick={() => void runAction(() => readyOrder(order.id))} type="button">备餐完成</button> : null}
                                  {order.reviewStatus === 'Active' && hasSubmittedStoreReview ? hasPendingMerchantAppeal ? <span className="badge warning">申诉处理中</span> : (
                                    <>
                                      <input placeholder="商家申诉理由" value={merchantAppealDrafts[order.id] ?? ''} onChange={(event) => setMerchantAppealDrafts((current: any) => ({ ...current, [order.id]: event.target.value }))} />
                                      <button className="secondary-button" onClick={() => void runAction(() => submitReviewAppeal(order.id, buildReviewAppealPayload('Merchant', merchantAppealDrafts[order.id] ?? '')))} type="button">提交申诉</button>
                                    </>
                                  ) : null}
                                </div>
                                <OrderChatPanel
                                  currentDisplayName={store.merchantName}
                                  currentRole="merchant"
                                  draft={orderChatDrafts[order.id] ?? ''}
                                  errorText={orderChatErrors[order.id]}
                                  disabled={false}
                                  disabledReason={order.riderId ? undefined : '骑手尚未接单，当前聊天主要用于和顾客确认订单细节。'}
                                  formatTime={formatTime}
                                  order={order}
                                  onChangeDraft={(value) => {
                                    setOrderChatDrafts((current: Record<string, string>) => ({ ...current, [order.id]: value }))
                                    setOrderChatErrors((current: Record<string, string>) => {
                                      if (!current[order.id]) return current
                                      const next = { ...current }
                                      delete next[order.id]
                                      return next
                                    })
                                  }}
                                  onSubmit={() => void submitOrderChatMessage(order.id)}
                                />
                              </>
                            )
                          }}
                          statusLabels={statusLabels}
                        />
                      </section>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="empty-card">当前没有已审核通过的店铺。</div>
      )}
    </Panel>
  )
}
