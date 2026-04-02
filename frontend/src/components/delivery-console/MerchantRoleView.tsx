import { DisplayImageSlot } from '@/components/delivery-console/DisplayImageSlot'
import { OrderChatPanel } from '@/components/delivery-console/OrderChatPanel'
import { OrderList } from '@/components/delivery-console/OrderList'
import { Panel } from '@/components/delivery-console/LayoutPrimitives'

export function MerchantRoleView(props: any) {
  const {
    buildEligibilityReviewPayload,
    buildReviewAppealPayload,
    changeMerchantApplicationView,
    deliveryApi,
    formatAggregateRating,
    formatPrice,
    formatTime,
    getMenuItemDraft,
    getMenuItemFieldId,
    getMerchantFieldClassName,
    getMerchantFieldId,
    isMenuComposerExpanded,
    isMenuItemImageUploading,
    isMerchantImageUploading,
    menuItemFormErrors,
    merchantAppealDrafts,
    merchantApplicationView,
    merchantDraft,
    merchantFormErrors,
    merchantPendingApplications,
    merchantReviewedApplications,
    merchantStores,
    merchantWorkspaceView,
    navigate,
    orderChatDrafts,
    partialRefundResolutionDrafts,
    role,
    resolvePartialRefundRequest,
    runAction,
    setEligibilityReviewDrafts,
    setMenuComposerOpen,
    setMenuItemDrafts,
    setMenuItemFormErrors,
    setMerchantAppealDrafts,
    setMerchantDraft,
    setMerchantFormErrors,
    setOrderChatDrafts,
    setPartialRefundResolutionDrafts,
    state,
    statusLabels,
    STORE_CATEGORIES,
    submitOrderChatMessage,
    submitMerchantApplication,
    submitStoreMenuItem,
    uploadMerchantImage,
    uploadStoreMenuImage,
    eligibilityReviewDrafts,
  } = props

  return (
    <section className="panel-stack">
      <div className="summary-bar">
        <div>
          <p>商家工作台</p>
          <strong>{merchantWorkspaceView === 'application' ? '店家申请' : '控制台'}</strong>
        </div>
        <div className="action-row">
          <button
            className={merchantWorkspaceView === 'application' ? 'primary-button' : 'secondary-button'}
            onClick={() => navigate('/merchant/application')}
            type="button"
          >
            店家申请
          </button>
          <button
            className={merchantWorkspaceView === 'console' ? 'primary-button' : 'secondary-button'}
            onClick={() => navigate('/merchant/console')}
            type="button"
          >
            控制台
          </button>
        </div>
      </div>

      {merchantWorkspaceView === 'application' ? (
        <Panel title="商家入驻申请" description="商家提交店铺资料后，需要管理员审核通过才能正式入驻。">
          <div className="action-row">
            <button
              className={merchantApplicationView === 'submit' ? 'primary-button' : 'secondary-button'}
              onClick={() => changeMerchantApplicationView('submit')}
              type="button"
            >
              提交入驻申请
            </button>
            <button
              className={merchantApplicationView === 'pending' ? 'primary-button' : 'secondary-button'}
              onClick={() => changeMerchantApplicationView('pending')}
              type="button"
            >
              待审核申请
            </button>
            <button
              className={merchantApplicationView === 'reviewed' ? 'primary-button' : 'secondary-button'}
              onClick={() => changeMerchantApplicationView('reviewed')}
              type="button"
            >
              已审核申请
            </button>
          </div>
          {merchantApplicationView === 'pending' ? (
            <div className="ticket-grid">
              {merchantPendingApplications.length === 0 ? (
                <div className="empty-card">当前没有待审核申请。</div>
              ) : (
                merchantPendingApplications.map((application: any) => (
                  <article key={application.id} className="ticket-card">
                    <div className="ticket-header">
                      <div>
                        <p className="ticket-kind">待审核</p>
                        <h3>{application.storeName}</h3>
                      </div>
                      <span className="badge warning">待审核</span>
                    </div>
                    <p>
                      商家 {application.merchantName} · {application.category} · 预计出餐 {application.avgPrepMinutes} 分钟
                    </p>
                    <p className="meta-line">
                      提交于 {formatTime(application.submittedAt)}
                      {application.note ? ` · ${application.note}` : ''}
                    </p>
                  </article>
                ))
              )}
            </div>
          ) : merchantApplicationView === 'reviewed' ? (
            <div className="ticket-grid">
              {merchantReviewedApplications.length === 0 ? (
                <div className="empty-card">当前没有已审核申请。</div>
              ) : (
                merchantReviewedApplications.map((application: any) => (
                  <article key={application.id} className="ticket-card">
                    <div className="ticket-header">
                      <div>
                        <p className="ticket-kind">审核记录</p>
                        <h3>{application.storeName}</h3>
                      </div>
                      <span className={application.status === 'Approved' ? 'badge success' : 'badge warning'}>
                        {application.status === 'Approved' ? '已通过' : '已驳回'}
                      </span>
                    </div>
                    <p>
                      商家 {application.merchantName} · {application.category} · 预计出餐 {application.avgPrepMinutes} 分钟
                    </p>
                    <p className="meta-line">
                      提交于 {formatTime(application.submittedAt)}
                      {application.reviewedAt ? ` · 审核于 ${formatTime(application.reviewedAt)}` : ''}
                    </p>
                    <p className="meta-line">审核说明：{application.reviewNote ?? '暂无审核说明'}</p>
                  </article>
                ))
              )}
            </div>
          ) : (
            <>
              <div className="form-grid">
                <label>
                  <span>商家姓名</span>
                  <input
                    aria-invalid={Boolean(merchantFormErrors.merchantName)}
                    className={getMerchantFieldClassName(Boolean(merchantFormErrors.merchantName))}
                    disabled={role === 'merchant'}
                    id={getMerchantFieldId('merchantName')}
                    value={merchantDraft.merchantName}
                    onChange={(event) => {
                      setMerchantDraft((current: any) => ({ ...current, merchantName: event.target.value }))
                      setMerchantFormErrors((current: any) => ({ ...current, merchantName: undefined }))
                    }}
                  />
                  {merchantFormErrors.merchantName ? <small className="field-error-text">{merchantFormErrors.merchantName}</small> : null}
                </label>
                <label>
                  <span>店铺名称</span>
                  <input
                    aria-invalid={Boolean(merchantFormErrors.storeName)}
                    className={getMerchantFieldClassName(Boolean(merchantFormErrors.storeName))}
                    id={getMerchantFieldId('storeName')}
                    value={merchantDraft.storeName}
                    onChange={(event) => {
                      setMerchantDraft((current: any) => ({ ...current, storeName: event.target.value }))
                      setMerchantFormErrors((current: any) => ({ ...current, storeName: undefined }))
                    }}
                  />
                  {merchantFormErrors.storeName ? <small className="field-error-text">{merchantFormErrors.storeName}</small> : null}
                </label>
                <label>
                  <span>店铺大类</span>
                  <select
                    aria-invalid={Boolean(merchantFormErrors.category)}
                    className={getMerchantFieldClassName(Boolean(merchantFormErrors.category))}
                    id={getMerchantFieldId('category')}
                    value={merchantDraft.category}
                    onChange={(event) => {
                      setMerchantDraft((current: any) => ({ ...current, category: event.target.value }))
                      setMerchantFormErrors((current: any) => ({ ...current, category: undefined }))
                    }}
                  >
                    <option value="">请选择店铺大类</option>
                    {STORE_CATEGORIES.map((category: string) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {merchantFormErrors.category ? <small className="field-error-text">{merchantFormErrors.category}</small> : null}
                </label>
                <label>
                  <span>预计出餐时间</span>
                  <input
                    min={1}
                    max={120}
                    type="number"
                    value={merchantDraft.avgPrepMinutes}
                    onChange={(event) =>
                      setMerchantDraft((current: any) => ({ ...current, avgPrepMinutes: Number(event.target.value) }))
                    }
                  />
                </label>
                <div className="full upload-field">
                  <span>本地图片上传</span>
                  <input
                    accept="image/png,image/jpeg,image/gif,image/webp"
                    className="visually-hidden-file-input"
                    id="merchant-store-image-upload"
                    type="file"
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      void uploadMerchantImage(file)
                      event.target.value = ''
                    }}
                  />
                  <label
                    className={`${getMerchantFieldClassName(Boolean(merchantFormErrors.imageUrl), `secondary-button upload-trigger${isMerchantImageUploading ? ' is-uploading' : ''}`)}`}
                    htmlFor="merchant-store-image-upload"
                    id={getMerchantFieldId('imageUrl')}
                  >
                    {isMerchantImageUploading ? '正在上传图片...' : '选择本地图片'}
                  </label>
                  <input
                    aria-invalid={Boolean(merchantFormErrors.imageUrl)}
                    className={getMerchantFieldClassName(Boolean(merchantFormErrors.imageUrl), 'upload-file-name')}
                    readOnly
                    value={merchantDraft.uploadedImageName || '尚未选择文件'}
                  />
                  {merchantFormErrors.imageUrl ? <small className="field-error-text">{merchantFormErrors.imageUrl}</small> : null}
                  <small className="field-hint">
                    支持 JPG、PNG、GIF、WebP，单张不超过 5MB。
                    {isMerchantImageUploading ? ' 当前正在上传图片...' : merchantDraft.uploadedImageName ? ' 上传完成。' : ''}
                  </small>
                </div>
                <label className="full">
                  <span>店铺展示图 URL</span>
                  <input
                    aria-invalid={Boolean(merchantFormErrors.imageUrl)}
                    className={getMerchantFieldClassName(Boolean(merchantFormErrors.imageUrl))}
                    placeholder="可直接粘贴线上图片链接，或使用上方上传后自动回填"
                    value={merchantDraft.imageUrl}
                    onChange={(event) => {
                      setMerchantDraft((current: any) => ({
                        ...current,
                        imageUrl: event.target.value,
                        uploadedImageName: event.target.value === current.imageUrl ? current.uploadedImageName : '',
                      }))
                      setMerchantFormErrors((current: any) => ({ ...current, imageUrl: undefined }))
                    }}
                  />
                  <small className="field-hint">店铺展示图为必填项；可上传本地图片，或填写可访问的图片 URL。</small>
                </label>
                <div className="full">
                  <DisplayImageSlot alt="店铺展示图预览" label="店铺展示图预览" src={merchantDraft.imageUrl.trim() || undefined} />
                </div>
                <label className="full">
                  <span>补充说明</span>
                  <input
                    value={merchantDraft.note}
                    onChange={(event) => setMerchantDraft((current: any) => ({ ...current, note: event.target.value }))}
                  />
                </label>
              </div>
              <div className="summary-bar">
                <div>
                  <p>审核说明</p>
                  <strong>提交后进入管理员待审列表</strong>
                </div>
                <button className="primary-button" disabled={isMerchantImageUploading} onClick={() => void submitMerchantApplication()} type="button">
                  {isMerchantImageUploading ? '图片上传中...' : '提交入驻申请'}
                </button>
              </div>
            </>
          )}
        </Panel>
      ) : (
        <Panel title="商家控制台" description="仅已审核通过的店铺可接单和推进出餐状态。">
          {merchantStores.length > 0 ? (
            <div className="panel-stack">
              {merchantStores.map((store: any) => {
                const storeOrders = state.orders.filter((order: any) => order.storeId === store.id) ?? []
                const menuItemDraft = getMenuItemDraft(store.id)
                const isMenuComposerVisible = isMenuComposerExpanded(store.id)
                const storeMenuItemErrors = menuItemFormErrors[store.id] ?? {}
                const storeMenuImageUploading = isMenuItemImageUploading(store.id)

                return (
                  <article key={store.id} className="ticket-card">
                    <div className="ticket-header">
                      <div>
                        <p className="ticket-kind">店铺</p>
                        <h3>{store.name}</h3>
                      </div>
                      <span className={store.status === 'Revoked' ? 'badge warning' : 'badge success'}>
                        {store.status === 'Revoked' ? '已取消' : '已通过'}
                      </span>
                    </div>

                    <div className="summary-bar">
                      <div>
                        <p>商家评分</p>
                        <strong>{formatAggregateRating(store.averageRating, store.ratingCount)}</strong>
                      </div>
                      <div>
                        <p>1 星差评数</p>
                        <strong>{store.oneStarRatingCount}</strong>
                      </div>
                      <div>
                        <p>营业额</p>
                        <strong>{formatPrice(store.revenueCents)}</strong>
                      </div>
                      <div>
                        <p>预计出餐</p>
                        <strong>{store.avgPrepMinutes} 分钟</strong>
                      </div>
                    </div>

                    <div className="merchant-menu-section">
                      <div className="ticket-header merchant-menu-header">
                        <div>
                          <p className="ticket-kind">菜品管理</p>
                          <h3>店铺菜品</h3>
                        </div>
                        <div className="merchant-menu-actions">
                          <span className="badge">{store.menu.length} 道菜</span>
                          <button
                            className={isMenuComposerVisible ? 'primary-button' : 'secondary-button'}
                            onClick={() =>
                              setMenuComposerOpen((current: any) => ({
                                ...current,
                                [store.id]: !isMenuComposerExpanded(store.id),
                              }))
                            }
                            type="button"
                          >
                            {isMenuComposerVisible ? '收起新增菜品' : '新增菜品'}
                          </button>
                        </div>
                      </div>
                      {isMenuComposerVisible ? (
                        <div className="merchant-menu-composer">
                          <div className="form-grid">
                            <label>
                              <span>菜品名称</span>
                              <input
                                aria-invalid={Boolean(storeMenuItemErrors.name)}
                                className={getMerchantFieldClassName(Boolean(storeMenuItemErrors.name))}
                                id={getMenuItemFieldId(store.id, 'name')}
                                value={menuItemDraft.name}
                                onChange={(event) => {
                                  setMenuItemDrafts((current: any) => ({
                                    ...current,
                                    [store.id]: { ...getMenuItemDraft(store.id), name: event.target.value },
                                  }))
                                  setMenuItemFormErrors((current: any) => ({
                                    ...current,
                                    [store.id]: { ...(current[store.id] ?? {}), name: undefined },
                                  }))
                                }}
                              />
                              {storeMenuItemErrors.name ? <small className="field-error-text">{storeMenuItemErrors.name}</small> : null}
                            </label>
                            <label>
                              <span>价格</span>
                              <input
                                aria-invalid={Boolean(storeMenuItemErrors.priceYuan)}
                                className={getMerchantFieldClassName(Boolean(storeMenuItemErrors.priceYuan))}
                                id={getMenuItemFieldId(store.id, 'priceYuan')}
                                inputMode="decimal"
                                placeholder="例如 18.80"
                                value={menuItemDraft.priceYuan}
                                onChange={(event) => {
                                  setMenuItemDrafts((current: any) => ({
                                    ...current,
                                    [store.id]: { ...getMenuItemDraft(store.id), priceYuan: event.target.value },
                                  }))
                                  setMenuItemFormErrors((current: any) => ({
                                    ...current,
                                    [store.id]: { ...(current[store.id] ?? {}), priceYuan: undefined },
                                  }))
                                }}
                              />
                              {storeMenuItemErrors.priceYuan ? (
                                <small className="field-error-text">{storeMenuItemErrors.priceYuan}</small>
                              ) : (
                                <small className="field-hint">按元填写，提交时会自动换算。</small>
                              )}
                            </label>
                            <label className="full">
                              <span>菜品说明</span>
                              <textarea
                                aria-invalid={Boolean(storeMenuItemErrors.description)}
                                className={getMerchantFieldClassName(Boolean(storeMenuItemErrors.description))}
                                id={getMenuItemFieldId(store.id, 'description')}
                                placeholder="例如：招牌红烧牛腩，含主食与配菜"
                                rows={3}
                                value={menuItemDraft.description}
                                onChange={(event) => {
                                  setMenuItemDrafts((current: any) => ({
                                    ...current,
                                    [store.id]: { ...getMenuItemDraft(store.id), description: event.target.value },
                                  }))
                                  setMenuItemFormErrors((current: any) => ({
                                    ...current,
                                    [store.id]: { ...(current[store.id] ?? {}), description: undefined },
                                  }))
                                }}
                              />
                              {storeMenuItemErrors.description ? <small className="field-error-text">{storeMenuItemErrors.description}</small> : null}
                            </label>
                            <div className="full upload-field">
                              <span>本地图片上传</span>
                              <input
                                accept="image/png,image/jpeg,image/gif,image/webp"
                                className="visually-hidden-file-input"
                                id={`store-menu-image-upload-${store.id}`}
                                type="file"
                                onChange={(event) => {
                                  const file = event.target.files?.[0]
                                  void uploadStoreMenuImage(store.id, file)
                                  event.target.value = ''
                                }}
                              />
                              <label
                                className={`${getMerchantFieldClassName(Boolean(storeMenuItemErrors.imageUrl), `secondary-button upload-trigger${storeMenuImageUploading ? ' is-uploading' : ''}`)}`}
                                htmlFor={`store-menu-image-upload-${store.id}`}
                              >
                                {storeMenuImageUploading ? '正在上传图片...' : '选择菜品图片'}
                              </label>
                              <input
                                aria-invalid={Boolean(storeMenuItemErrors.imageUrl)}
                                className={getMerchantFieldClassName(Boolean(storeMenuItemErrors.imageUrl), 'upload-file-name')}
                                readOnly
                                value={menuItemDraft.uploadedImageName || '尚未选择文件'}
                              />
                              {storeMenuItemErrors.imageUrl ? (
                                <small className="field-error-text">{storeMenuItemErrors.imageUrl}</small>
                              ) : (
                                <small className="field-hint">支持 JPG、PNG、GIF、WebP，单张不超过 5MB。</small>
                              )}
                            </div>
                            <label className="full">
                              <span>菜品图片 URL</span>
                              <input
                                aria-invalid={Boolean(storeMenuItemErrors.imageUrl)}
                                className={getMerchantFieldClassName(Boolean(storeMenuItemErrors.imageUrl))}
                                id={getMenuItemFieldId(store.id, 'imageUrl')}
                                placeholder="可粘贴线上图片链接，或使用上方上传后自动回填"
                                value={menuItemDraft.imageUrl}
                                onChange={(event) => {
                                  setMenuItemDrafts((current: any) => ({
                                    ...current,
                                    [store.id]: {
                                      ...getMenuItemDraft(store.id),
                                      imageUrl: event.target.value,
                                      uploadedImageName:
                                        event.target.value === getMenuItemDraft(store.id).imageUrl
                                          ? getMenuItemDraft(store.id).uploadedImageName
                                          : '',
                                    },
                                  }))
                                  setMenuItemFormErrors((current: any) => ({
                                    ...current,
                                    [store.id]: { ...(current[store.id] ?? {}), imageUrl: undefined },
                                  }))
                                }}
                              />
                            </label>
                            <div className="full merchant-menu-preview">
                              <DisplayImageSlot
                                alt={`${store.name} 菜品预览`}
                                label="菜品图片预览"
                                src={menuItemDraft.imageUrl.trim() || undefined}
                                className="menu-image merchant-menu-preview-image"
                              />
                            </div>
                          </div>
                          <div className="summary-bar merchant-menu-submit-bar">
                            <div>
                              <p>新增说明</p>
                              <strong>每道菜需包含图片、价格和说明</strong>
                            </div>
                            <div className="merchant-menu-submit-actions">
                              <button
                                className="secondary-button"
                                onClick={() =>
                                  setMenuComposerOpen((current: any) => ({ ...current, [store.id]: false }))
                                }
                                type="button"
                              >
                                取消
                              </button>
                              <button
                                className="primary-button"
                                disabled={storeMenuImageUploading}
                                onClick={() => void submitStoreMenuItem(store.id)}
                                type="button"
                              >
                                {storeMenuImageUploading ? '图片上传中...' : '确认新增'}
                              </button>
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
                            </div>
                            <div className="menu-footer">
                              <strong>{formatPrice(item.priceCents)}</strong>
                              <span className="badge">已上架</span>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>

                    {store.status === 'Revoked' ? (
                      <div className="ticket-actions">
                        <input
                          placeholder="店铺复核理由"
                          value={eligibilityReviewDrafts[store.id] ?? ''}
                          onChange={(event) =>
                            setEligibilityReviewDrafts((current: any) => ({ ...current, [store.id]: event.target.value }))
                          }
                        />
                        <button
                          className="primary-button"
                          onClick={() =>
                            void runAction(() =>
                              deliveryApi.submitEligibilityReview(
                                buildEligibilityReviewPayload('Store', store.id, eligibilityReviewDrafts[store.id] ?? ''),
                              ),
                            )
                          }
                          type="button"
                        >
                          发起营业资格复核
                        </button>
                      </div>
                    ) : null}

                    <OrderList
                      orders={storeOrders}
                      emptyText="当前店铺暂无订单。"
                      formatPrice={formatPrice}
                      formatTime={formatTime}
                      footer={(order) => {
                        const hasSubmittedStoreReview = order.storeRating != null
                        const hasPendingMerchantAppeal = state.reviewAppeals.some(
                          (appeal: any) =>
                            appeal.orderId === order.id &&
                            appeal.appellantRole === 'Merchant' &&
                            appeal.status === 'Pending',
                        )

                        return (
                          <>
                            {order.partialRefundRequests.length > 0 ? (
                              <div className="panel-stack">
                                {order.partialRefundRequests.map((refund: any) => (
                                  <div key={refund.id} className="ticket-actions">
                                    <span className="meta-line">
                                      缺货退款 · {refund.itemName} x {refund.quantity} ·
                                      {refund.status === 'Pending'
                                        ? ' 待处理'
                                        : refund.status === 'Approved'
                                          ? ' 已同意'
                                          : ' 已拒绝'}
                                    </span>
                                    <input
                                      disabled={refund.status !== 'Pending'}
                                      placeholder="处理说明"
                                      value={partialRefundResolutionDrafts[refund.id] ?? ''}
                                      onChange={(event) =>
                                        setPartialRefundResolutionDrafts((current: any) => ({
                                          ...current,
                                          [refund.id]: event.target.value,
                                        }))
                                      }
                                    />
                                    {refund.status === 'Pending' ? (
                                      <>
                                        <button
                                          className="primary-button"
                                          onClick={() => void resolvePartialRefundRequest(refund.id, true)}
                                          type="button"
                                        >
                                          同意退款
                                        </button>
                                        <button
                                          className="secondary-button"
                                          onClick={() => void resolvePartialRefundRequest(refund.id, false)}
                                          type="button"
                                        >
                                          拒绝退款
                                        </button>
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
                                <button className="primary-button" onClick={() => void runAction(() => deliveryApi.acceptOrder(order.id))} type="button">
                                  接单
                                </button>
                              ) : null}
                              {order.status === 'Preparing' ? (
                                <button className="secondary-button" onClick={() => void runAction(() => deliveryApi.readyOrder(order.id))} type="button">
                                  备餐完成
                                </button>
                              ) : null}
                              {order.reviewStatus === 'Active' && hasSubmittedStoreReview ? (
                                hasPendingMerchantAppeal ? (
                                  <span className="badge warning">申诉处理中</span>
                                ) : (
                                  <>
                                    <input
                                      placeholder="商家申诉理由"
                                      value={merchantAppealDrafts[order.id] ?? ''}
                                      onChange={(event) =>
                                        setMerchantAppealDrafts((current: any) => ({ ...current, [order.id]: event.target.value }))
                                      }
                                    />
                                    <button
                                      className="secondary-button"
                                      onClick={() =>
                                        void runAction(() =>
                                          deliveryApi.submitReviewAppeal(
                                            order.id,
                                            buildReviewAppealPayload('Merchant', merchantAppealDrafts[order.id] ?? ''),
                                          ),
                                        )
                                      }
                                      type="button"
                                    >
                                      提交申诉
                                    </button>
                                  </>
                                )
                              ) : null}
                            </div>
                            <OrderChatPanel
                              currentDisplayName={store.merchantName}
                              currentRole="merchant"
                              draft={orderChatDrafts[order.id] ?? ''}
                              disabled={false}
                              disabledReason={
                                order.riderId
                                  ? undefined
                                  : '骑手尚未接单，当前聊天主要用于和顾客确认订单细节。'
                              }
                              formatTime={formatTime}
                              order={order}
                              onChangeDraft={(value) =>
                                setOrderChatDrafts((current: Record<string, string>) => ({
                                  ...current,
                                  [order.id]: value,
                                }))
                              }
                              onSubmit={() => void submitOrderChatMessage(order.id)}
                            />
                          </>
                        )
                      }}
                      statusLabels={statusLabels}
                    />
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="empty-card">当前没有已审核通过的店铺。</div>
          )}
        </Panel>
      )}
    </section>
  )
}
