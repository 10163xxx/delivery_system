import { useEffect, useState } from 'react'
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
    eligibilityReviewDrafts,
    formatAggregateRating,
    formatBusinessHours,
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
    merchantProfile,
    merchantProfileDraft,
    merchantProfileFormErrors,
    merchantReviewedApplications,
    merchantStores,
    merchantWithdrawAmount,
    merchantWithdrawError,
    merchantWorkspaceView,
    BANK_OPTIONS,
    enterMerchantStore,
    leaveMerchantStore,
    navigate,
    orderChatDrafts,
    orderChatErrors,
    partialRefundResolutionDrafts,
    role,
    resolvePartialRefundRequest,
    runAction,
    selectedMerchantStoreId,
    setEligibilityReviewDrafts,
    setMenuComposerOpen,
    setMenuItemDrafts,
    setMenuItemFormErrors,
    setMerchantAppealDrafts,
    setMerchantDraft,
    setMerchantFormErrors,
    setMerchantProfileDraft,
    setMerchantProfileFormErrors,
    setMerchantWithdrawFieldError,
    setMerchantWithdrawAmount,
    setOrderChatDrafts,
    setOrderChatErrors,
    setPartialRefundResolutionDrafts,
    saveMerchantProfile,
    state,
    statusLabels,
    STORE_CATEGORIES,
    submitMerchantApplication,
    submitOrderChatMessage,
    submitStoreMenuItem,
    uploadMerchantImage,
    uploadStoreMenuImage,
    withdrawMerchantIncome,
  } = props

  const activeMerchantStore = merchantStores.find((store: any) => store.id === selectedMerchantStoreId)
  const storesToRender = activeMerchantStore ? [activeMerchantStore] : merchantStores
  const [menuItemStockDrafts, setMenuItemStockDrafts] = useState<Record<string, string>>({})
  const [orderRejectDrafts, setOrderRejectDrafts] = useState<Record<string, string>>({})
  const [orderRejectErrors, setOrderRejectErrors] = useState<Record<string, string>>({})
  const [storeOperationDrafts, setStoreOperationDrafts] = useState<Record<string, { openTime: string; closeTime: string; avgPrepMinutes: string }>>({})
  const [storeOperationErrors, setStoreOperationErrors] = useState<
    Record<string, { openTime?: string; closeTime?: string; avgPrepMinutes?: string }>
  >({})

  useEffect(() => {
    const validItemIds = new Set(
      storesToRender.flatMap((store: any) => store.menu.map((item: any) => item.id)),
    )

    setMenuItemStockDrafts((current) => {
      const nextDrafts: Record<string, string> = {}

      storesToRender.forEach((store: any) => {
        store.menu.forEach((item: any) => {
          nextDrafts[item.id] =
            current[item.id] ?? (item.remainingQuantity == null ? '' : String(item.remainingQuantity))
        })
      })

      Object.keys(nextDrafts).forEach((itemId) => {
        if (!validItemIds.has(itemId)) {
          delete nextDrafts[itemId]
        }
      })

      return nextDrafts
    })
  }, [storesToRender])

  useEffect(() => {
    setStoreOperationDrafts((current) => {
      const nextDrafts: Record<string, { openTime: string; closeTime: string; avgPrepMinutes: string }> = {}

      storesToRender.forEach((store: any) => {
        nextDrafts[store.id] = current[store.id] ?? {
          openTime: store.businessHours.openTime,
          closeTime: store.businessHours.closeTime,
          avgPrepMinutes: String(store.avgPrepMinutes),
        }
      })

      return nextDrafts
    })
  }, [storesToRender])

  function getMenuItemStockDraft(item: any) {
    return menuItemStockDrafts[item.id] ?? (item.remainingQuantity == null ? '' : String(item.remainingQuantity))
  }

  function getOrderRejectDraft(orderId: string) {
    return orderRejectDrafts[orderId] ?? ''
  }

  function getOrderRejectError(orderId: string) {
    return orderRejectErrors[orderId] ?? ''
  }

  function getStoreOperationDraft(store: any) {
    return (
      storeOperationDrafts[store.id] ?? {
        openTime: store.businessHours.openTime,
        closeTime: store.businessHours.closeTime,
        avgPrepMinutes: String(store.avgPrepMinutes),
      }
    )
  }

  function isValidBusinessTime(value: string) {
    return /^([01]\d|2[0-3]):[0-5]\d$/.test(value)
  }

  function businessTimeToMinutes(value: string) {
    if (!isValidBusinessTime(value)) return Number.NaN
    const [hours, minutes] = value.split(':').map(Number)
    return hours * 60 + minutes
  }

  function validateStoreOperationDraft(store: any) {
    const draft = getStoreOperationDraft(store)
    const avgPrepMinutes = Number(draft.avgPrepMinutes.trim())
    const businessHoursError =
      !isValidBusinessTime(draft.openTime) || !isValidBusinessTime(draft.closeTime)
        ? '请填写有效的营业时间'
        : businessTimeToMinutes(draft.openTime) >= businessTimeToMinutes(draft.closeTime)
          ? '打烊时间需晚于开业时间'
          : undefined

    return {
      openTime: businessHoursError,
      closeTime: businessHoursError,
      avgPrepMinutes:
        Number.isInteger(avgPrepMinutes) && avgPrepMinutes >= 1 && avgPrepMinutes <= 120
          ? undefined
          : '预计出餐时间需在 1 到 120 分钟之间',
    }
  }

  function getMenuItemStockError(value: string) {
    const trimmed = value.trim()
    if (trimmed === '') return null
    const parsed = Number(trimmed)
    if (!Number.isInteger(parsed) || parsed < 0 || parsed > 10) {
      return '库存需为 0 到 10，留空表示不限量'
    }
    return null
  }

  async function submitMenuItemStock(storeId: string, item: any) {
    const draft = getMenuItemStockDraft(item)
    const stockError = getMenuItemStockError(draft)
    if (stockError) {
      return
    }

    const trimmed = draft.trim()
    const success = await runAction(() =>
      deliveryApi.updateStoreMenuItemStock(storeId, item.id, {
        remainingQuantity: trimmed === '' ? undefined : Number(trimmed),
      }),
    )

    if (!success) return

    setMenuItemStockDrafts((current) => ({
      ...current,
      [item.id]: trimmed,
    }))
  }

  async function submitOrderReject(orderId: string) {
    const reason = getOrderRejectDraft(orderId).replace(/\s+/g, ' ').trim().slice(0, 160)
    if (!reason) {
      setOrderRejectErrors((current) => ({
        ...current,
        [orderId]: '请填写拒单理由',
      }))
      return
    }

    setOrderRejectErrors((current) => {
      const next = { ...current }
      delete next[orderId]
      return next
    })

    const success = await runAction(() => deliveryApi.rejectOrder(orderId, { reason }))
    if (!success) return

    setOrderRejectDrafts((current) => ({
      ...current,
      [orderId]: '',
    }))
  }

  async function submitStoreOperationalInfo(store: any) {
    const draft = getStoreOperationDraft(store)
    const errors = validateStoreOperationDraft(store)
    if (errors.openTime || errors.closeTime || errors.avgPrepMinutes) {
      setStoreOperationErrors((current) => ({
        ...current,
        [store.id]: errors,
      }))
      return
    }

    const success = await runAction(() =>
      deliveryApi.updateStoreOperationalInfo(store.id, {
        businessHours: {
          openTime: draft.openTime,
          closeTime: draft.closeTime,
        },
        avgPrepMinutes: Number(draft.avgPrepMinutes.trim()),
      }),
    )

    if (!success) return

    setStoreOperationErrors((current) => {
      const next = { ...current }
      delete next[store.id]
      return next
    })
  }

  async function clearMenuItemStockLimit(storeId: string, item: any) {
    const success = await runAction(() =>
      deliveryApi.updateStoreMenuItemStock(storeId, item.id, {
        remainingQuantity: undefined,
      }),
    )

    if (!success) return

    setMenuItemStockDrafts((current) => ({
      ...current,
      [item.id]: '',
    }))
  }

  function navigateMerchantWorkspace(view: 'application' | 'console' | 'profile') {
    if (view !== 'console') {
      leaveMerchantStore()
    }

    navigate(
      view === 'application'
        ? '/merchant/application?merchantView=submit'
        : view === 'profile'
          ? '/merchant/profile'
          : '/merchant/console',
    )
  }

  return (
    <section className="panel-stack">
      <div className="summary-bar">
        <div>
          <p>商家工作台</p>
          <strong>
            {merchantWorkspaceView === 'application'
              ? '店家申请'
              : merchantWorkspaceView === 'profile'
                ? '个人信息'
                : '控制台'}
          </strong>
        </div>
        <div className="action-row">
          <button
            className={merchantWorkspaceView === 'application' ? 'primary-button' : 'secondary-button'}
            onClick={() => navigateMerchantWorkspace('application')}
            type="button"
          >
            店家申请
          </button>
          <button
            className={merchantWorkspaceView === 'console' ? 'primary-button' : 'secondary-button'}
            onClick={() => navigateMerchantWorkspace('console')}
            type="button"
          >
            控制台
          </button>
          <button
            className={merchantWorkspaceView === 'profile' ? 'primary-button' : 'secondary-button'}
            onClick={() => navigateMerchantWorkspace('profile')}
            type="button"
          >
            个人信息
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
                    <p className="meta-line">营业时间 {formatBusinessHours(application.businessHours)}</p>
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
                    <p className="meta-line">营业时间 {formatBusinessHours(application.businessHours)}</p>
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
                <label>
                  <span>开业时间</span>
                  <input
                    aria-invalid={Boolean(merchantFormErrors.openTime)}
                    className={getMerchantFieldClassName(Boolean(merchantFormErrors.openTime))}
                    id={getMerchantFieldId('openTime')}
                    type="time"
                    value={merchantDraft.openTime}
                    onChange={(event) => {
                      setMerchantDraft((current: any) => ({ ...current, openTime: event.target.value }))
                      setMerchantFormErrors((current: any) => ({
                        ...current,
                        openTime: undefined,
                        closeTime: undefined,
                      }))
                    }}
                  />
                  {merchantFormErrors.openTime ? <small className="field-error-text">{merchantFormErrors.openTime}</small> : null}
                </label>
                <label>
                  <span>打烊时间</span>
                  <input
                    aria-invalid={Boolean(merchantFormErrors.closeTime)}
                    className={getMerchantFieldClassName(Boolean(merchantFormErrors.closeTime))}
                    id={getMerchantFieldId('closeTime')}
                    type="time"
                    value={merchantDraft.closeTime}
                    onChange={(event) => {
                      setMerchantDraft((current: any) => ({ ...current, closeTime: event.target.value }))
                      setMerchantFormErrors((current: any) => ({
                        ...current,
                        openTime: undefined,
                        closeTime: undefined,
                      }))
                    }}
                  />
                  {merchantFormErrors.closeTime ? <small className="field-error-text">{merchantFormErrors.closeTime}</small> : null}
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
                <div>
                  <p>营业时间</p>
                  <strong>{merchantDraft.openTime} - {merchantDraft.closeTime}</strong>
                </div>
                <button className="primary-button" disabled={isMerchantImageUploading} onClick={() => void submitMerchantApplication()} type="button">
                  {isMerchantImageUploading ? '图片上传中...' : '提交入驻申请'}
                </button>
              </div>
            </>
          )}
        </Panel>
      ) : merchantWorkspaceView === 'profile' ? (
        <Panel title="商家个人信息" description="维护提现信息，查看累计收入、已提现金额和可提现余额。">
          <div className="metrics-grid">
            <div className="metric-card">
              <span>累计收入</span>
              <strong>{formatPrice(merchantProfile?.settledIncomeCents ?? 0)}</strong>
            </div>
            <div className="metric-card">
              <span>已提现</span>
              <strong>{formatPrice(merchantProfile?.withdrawnCents ?? 0)}</strong>
            </div>
            <div className="metric-card">
              <span>可提现余额</span>
              <strong>{formatPrice(merchantProfile?.availableToWithdrawCents ?? 0)}</strong>
            </div>
            <div className="metric-card">
              <span>店铺数</span>
              <strong>{merchantStores.length}</strong>
            </div>
          </div>

          <div className="merchant-store-module__layout">
            <aside className="merchant-store-sidebar">
              <section className="merchant-section-card">
                <p className="ticket-kind">基础信息</p>
                <div className="merchant-metric-list">
                  <div>
                    <p>商家名称</p>
                    <strong>{merchantProfile?.merchantName ?? '未配置'}</strong>
                  </div>
                  <div>
                    <p>入驻申请</p>
                    <strong>{merchantPendingApplications.length + merchantReviewedApplications.length} 条</strong>
                  </div>
                  <div>
                    <p>已通过店铺</p>
                    <strong>{merchantStores.length} 家</strong>
                  </div>
                </div>
              </section>
            </aside>

            <div className="merchant-store-content">
              <section className="merchant-section-card">
                <div className="ticket-header">
                  <div>
                    <p className="ticket-kind">账户资料</p>
                    <h3>提现账户与联系信息</h3>
                  </div>
                </div>
                <div className="form-grid">
                  <label>
                    <span>联系电话</span>
                    <input
                      className={merchantProfileFormErrors.contactPhone ? 'field-error' : undefined}
                      placeholder="例如 13800138000"
                      value={merchantProfileDraft.contactPhone}
                      onChange={(event) => {
                        setMerchantProfileDraft((current: any) => ({
                          ...current,
                          contactPhone: event.target.value,
                        }))
                        setMerchantProfileFormErrors((current: any) => ({ ...current, contactPhone: undefined }))
                      }}
                    />
                    {merchantProfileFormErrors.contactPhone ? <small className="field-error-text">{merchantProfileFormErrors.contactPhone}</small> : null}
                  </label>
                  <label>
                    <span>提现方式</span>
                    <select
                      value={merchantProfileDraft.payoutAccountType}
                      onChange={(event) => {
                        setMerchantProfileDraft((current: any) => ({
                          ...current,
                          payoutAccountType: event.target.value,
                          bankName: event.target.value === 'bank' ? current.bankName : '',
                        }))
                        setMerchantProfileFormErrors((current: any) => ({
                          ...current,
                          bankName: undefined,
                          accountNumber: undefined,
                          accountHolder: undefined,
                        }))
                      }}
                    >
                      <option value="alipay">支付宝</option>
                      <option value="bank">银行卡</option>
                    </select>
                  </label>
                  {merchantProfileDraft.payoutAccountType === 'bank' ? (
                    <label>
                      <span>开户银行</span>
                      <select
                        className={merchantProfileFormErrors.bankName ? 'field-error' : undefined}
                        value={merchantProfileDraft.bankName}
                        onChange={(event) => {
                          setMerchantProfileDraft((current: any) => ({
                            ...current,
                            bankName: event.target.value,
                          }))
                          setMerchantProfileFormErrors((current: any) => ({ ...current, bankName: undefined }))
                        }}
                      >
                        <option value="">请选择银行</option>
                        {BANK_OPTIONS.map((bank: string) => (
                          <option key={bank} value={bank}>
                            {bank}
                          </option>
                        ))}
                      </select>
                      {merchantProfileFormErrors.bankName ? <small className="field-error-text">{merchantProfileFormErrors.bankName}</small> : null}
                    </label>
                  ) : null}
                  <label>
                    <span>{merchantProfileDraft.payoutAccountType === 'bank' ? '银行卡号' : '支付宝账号'}</span>
                    <input
                      className={merchantProfileFormErrors.accountNumber ? 'field-error' : undefined}
                      placeholder={merchantProfileDraft.payoutAccountType === 'bank' ? '输入银行卡号' : '输入支付宝账号'}
                      value={merchantProfileDraft.accountNumber}
                      onChange={(event) => {
                        setMerchantProfileDraft((current: any) => ({
                          ...current,
                          accountNumber: event.target.value,
                        }))
                        setMerchantProfileFormErrors((current: any) => ({ ...current, accountNumber: undefined }))
                      }}
                    />
                    {merchantProfileFormErrors.accountNumber ? <small className="field-error-text">{merchantProfileFormErrors.accountNumber}</small> : null}
                  </label>
                  <label>
                    <span>{merchantProfileDraft.payoutAccountType === 'bank' ? '持卡人姓名' : '账户姓名'}</span>
                    <input
                      className={merchantProfileFormErrors.accountHolder ? 'field-error' : undefined}
                      placeholder="输入姓名"
                      value={merchantProfileDraft.accountHolder}
                      onChange={(event) => {
                        setMerchantProfileDraft((current: any) => ({
                          ...current,
                          accountHolder: event.target.value,
                        }))
                        setMerchantProfileFormErrors((current: any) => ({ ...current, accountHolder: undefined }))
                      }}
                    />
                    {merchantProfileFormErrors.accountHolder ? <small className="field-error-text">{merchantProfileFormErrors.accountHolder}</small> : null}
                  </label>
                </div>
                <div className="summary-bar">
                  <div>
                    <p>当前到账账户</p>
                    <strong>
                      {merchantProfile?.payoutAccount
                        ? merchantProfile.payoutAccount.accountType === 'bank'
                          ? `${merchantProfile.payoutAccount.bankName ?? '银行卡'} ${merchantProfile.payoutAccount.accountHolder} / ${merchantProfile.payoutAccount.accountNumber}`
                          : `支付宝 ${merchantProfile.payoutAccount.accountHolder} / ${merchantProfile.payoutAccount.accountNumber}`
                        : '尚未设置'}
                    </strong>
                  </div>
                  <button className="primary-button" onClick={() => void saveMerchantProfile()} type="button">
                    保存资料
                  </button>
                </div>
              </section>

              <section className="merchant-section-card">
                <div className="ticket-header">
                  <div>
                    <p className="ticket-kind">收入提现</p>
                    <h3>发起提现</h3>
                  </div>
                  <span className="badge">可提 {formatPrice(merchantProfile?.availableToWithdrawCents ?? 0)}</span>
                </div>
                <div className="action-row">
                  <input
                    inputMode="decimal"
                    placeholder="输入提现金额，例如 200"
                    value={merchantWithdrawAmount}
                    onChange={(event) => {
                      setMerchantWithdrawAmount(event.target.value)
                      setMerchantWithdrawFieldError(null)
                    }}
                  />
                  <button
                    className="primary-button"
                    disabled={Boolean(merchantWithdrawError) || (merchantProfile?.availableToWithdrawCents ?? 0) <= 0}
                    onClick={() => void withdrawMerchantIncome()}
                    type="button"
                  >
                    申请提现
                  </button>
                </div>
                {merchantWithdrawError ? <small className="field-error-text">{merchantWithdrawError}</small> : null}
                <div className="ticket-grid">
                  {merchantProfile?.withdrawalHistory?.length ? (
                    merchantProfile.withdrawalHistory.map((entry: any) => (
                      <article key={entry.id} className="ticket-card">
                        <div className="ticket-header">
                          <div>
                            <p className="ticket-kind">提现记录</p>
                            <h3>{formatPrice(entry.amountCents)}</h3>
                          </div>
                          <span className="badge success">已提交</span>
                        </div>
                        <p className="meta-line">到账账户 {entry.accountLabel}</p>
                        <p className="meta-line">申请时间 {formatTime(entry.requestedAt)}</p>
                      </article>
                    ))
                  ) : (
                    <div className="empty-card">当前还没有提现记录。</div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </Panel>
      ) : (
        <Panel title="商家控制台" description="仅已审核通过的店铺可接单和推进出餐状态。">
          {merchantStores.length > 0 ? (
            <div className="merchant-store-list">
              {activeMerchantStore ? (
                <div className="summary-bar merchant-store-single-bar">
                  <div>
                    <p>当前店铺</p>
                    <strong>{activeMerchantStore.name}</strong>
                  </div>
                  <button className="secondary-button" onClick={() => leaveMerchantStore()} type="button">
                    返回全部店铺
                  </button>
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
                          <div>
                            <p className="ticket-kind">店铺模块</p>
                            <h3>{store.name}</h3>
                          </div>
                          <p className="meta-line">{store.category}</p>
                        </div>
                        <div className="merchant-store-module__summary-actions">
                          <span className={store.status === 'Revoked' ? 'badge warning' : 'badge success'}>
                            {store.status === 'Revoked' ? '已取消' : '已通过'}
                          </span>
                          <span className="badge">{storeOrders.length} 笔订单</span>
                          <button
                            className="merchant-store-module__summary-toggle"
                            onClick={() => enterMerchantStore(store.id)}
                            type="button"
                          >
                            进入店铺
                          </button>
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
                          <div>
                            <p className="ticket-kind">店铺模块</p>
                            <h3>{store.name}</h3>
                          </div>
                          <p className="meta-line">{store.category}</p>
                        </div>
                        <div className="merchant-store-module__summary-actions">
                          <span className={store.status === 'Revoked' ? 'badge warning' : 'badge success'}>
                            {store.status === 'Revoked' ? '已取消' : '已通过'}
                          </span>
                          <span className="badge">{storeOrders.length} 笔订单</span>
                        </div>
                      </div>

                      <div className="merchant-store-module__layout">
                        <aside className="merchant-store-sidebar">
                          <div className="merchant-section-card">
                            <p className="ticket-kind">概览</p>
                            <div className="merchant-metric-list">
                              <div>
                                <p>商家评分</p>
                                <strong>{formatAggregateRating(store.averageRating, store.ratingCount)}</strong>
                              </div>
                              <div>
                                <p>营业额</p>
                                <strong>{formatPrice(store.revenueCents)}</strong>
                              </div>
                              <div>
                                <p>营业时间</p>
                                <strong>{formatBusinessHours(store.businessHours)}</strong>
                              </div>
                              <div>
                                <p>预计出餐</p>
                                <strong>{store.avgPrepMinutes} 分钟</strong>
                              </div>
                            </div>
                          </div>

                          <div className="merchant-section-card">
                            <p className="ticket-kind">营业设置</p>
                            <div className="form-grid">
                              <label>
                                <span>开业时间</span>
                                <input
                                  className={storeOperationErrors[store.id]?.openTime ? 'field-error' : undefined}
                                  type="time"
                                  value={getStoreOperationDraft(store).openTime}
                                  onChange={(event) => {
                                    const value = event.target.value
                                    setStoreOperationDrafts((current) => ({
                                      ...current,
                                      [store.id]: { ...getStoreOperationDraft(store), openTime: value },
                                    }))
                                    setStoreOperationErrors((current) => ({
                                      ...current,
                                      [store.id]: { ...(current[store.id] ?? {}), openTime: undefined, closeTime: undefined },
                                    }))
                                  }}
                                />
                                {storeOperationErrors[store.id]?.openTime ? (
                                  <small className="field-error-text">{storeOperationErrors[store.id].openTime}</small>
                                ) : null}
                              </label>
                              <label>
                                <span>打烊时间</span>
                                <input
                                  className={storeOperationErrors[store.id]?.closeTime ? 'field-error' : undefined}
                                  type="time"
                                  value={getStoreOperationDraft(store).closeTime}
                                  onChange={(event) => {
                                    const value = event.target.value
                                    setStoreOperationDrafts((current) => ({
                                      ...current,
                                      [store.id]: { ...getStoreOperationDraft(store), closeTime: value },
                                    }))
                                    setStoreOperationErrors((current) => ({
                                      ...current,
                                      [store.id]: { ...(current[store.id] ?? {}), openTime: undefined, closeTime: undefined },
                                    }))
                                  }}
                                />
                                {storeOperationErrors[store.id]?.closeTime ? (
                                  <small className="field-error-text">{storeOperationErrors[store.id].closeTime}</small>
                                ) : null}
                              </label>
                              <label className="full">
                                <span>预计出餐时间</span>
                                <input
                                  className={storeOperationErrors[store.id]?.avgPrepMinutes ? 'field-error' : undefined}
                                  inputMode="numeric"
                                  max={120}
                                  min={1}
                                  value={getStoreOperationDraft(store).avgPrepMinutes}
                                  onChange={(event) => {
                                    const value = event.target.value
                                    setStoreOperationDrafts((current) => ({
                                      ...current,
                                      [store.id]: { ...getStoreOperationDraft(store), avgPrepMinutes: value },
                                    }))
                                    setStoreOperationErrors((current) => ({
                                      ...current,
                                      [store.id]: { ...(current[store.id] ?? {}), avgPrepMinutes: undefined },
                                    }))
                                  }}
                                />
                                {storeOperationErrors[store.id]?.avgPrepMinutes ? (
                                  <small className="field-error-text">{storeOperationErrors[store.id].avgPrepMinutes}</small>
                                ) : (
                                  <small className="field-hint">填写 1 到 120 的整数，单位为分钟。</small>
                                )}
                              </label>
                            </div>
                            <div className="summary-bar">
                              <div>
                                <p>当前设置</p>
                                <strong>
                                  {getStoreOperationDraft(store).openTime} - {getStoreOperationDraft(store).closeTime} · {getStoreOperationDraft(store).avgPrepMinutes} 分钟
                                </strong>
                              </div>
                              <button className="primary-button" onClick={() => void submitStoreOperationalInfo(store)} type="button">
                                保存营业设置
                              </button>
                            </div>
                          </div>

                          {store.status === 'Revoked' ? (
                            <div className="merchant-section-card">
                              <p className="ticket-kind">资格处理</p>
                              <div className="ticket-actions merchant-module-actions">
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
                            </div>
                          ) : null}
                        </aside>

                        <div className="merchant-store-content">
                          <section className="merchant-section-card">
                            <div className="ticket-header merchant-menu-header">
                              <div>
                                <p className="ticket-kind">菜品管理</p>
                                <h3>店铺菜品</h3>
                              </div>
                              <div className="merchant-menu-actions">
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
                                  <label>
                                    <span>限量库存</span>
                                    <input
                                      aria-invalid={Boolean(storeMenuItemErrors.remainingQuantity)}
                                      className={getMerchantFieldClassName(Boolean(storeMenuItemErrors.remainingQuantity))}
                                      id={getMenuItemFieldId(store.id, 'remainingQuantity')}
                                      inputMode="numeric"
                                      max={10}
                                      min={1}
                                      placeholder="留空表示不限量"
                                      value={menuItemDraft.remainingQuantity}
                                      onChange={(event) => {
                                        setMenuItemDrafts((current: any) => ({
                                          ...current,
                                          [store.id]: { ...getMenuItemDraft(store.id), remainingQuantity: event.target.value },
                                        }))
                                        setMenuItemFormErrors((current: any) => ({
                                          ...current,
                                          [store.id]: { ...(current[store.id] ?? {}), remainingQuantity: undefined },
                                        }))
                                      }}
                                    />
                                    {storeMenuItemErrors.remainingQuantity ? (
                                      <small className="field-error-text">{storeMenuItemErrors.remainingQuantity}</small>
                                    ) : (
                                      <small className="field-hint">可选填写 1 到 10，表示当前仅剩这么多件。</small>
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
                                    {item.remainingQuantity != null ? (
                                      <p className="meta-line">
                                        {item.remainingQuantity > 0
                                          ? `限量剩余 ${item.remainingQuantity} 份`
                                          : '当前已售罄'}
                                      </p>
                                    ) : null}
                                  </div>
                                  <div className="menu-footer">
                                    <strong>{formatPrice(item.priceCents)}</strong>
                                    <div className="merchant-menu-item-actions">
                                      <span className={item.remainingQuantity === 0 ? 'badge warning' : 'badge'}>
                                        {item.remainingQuantity == null
                                          ? '不限量'
                                          : item.remainingQuantity > 0
                                            ? `剩余 ${item.remainingQuantity} 份`
                                            : '已售罄'}
                                      </span>
                                      <input
                                        className={getMerchantFieldClassName(Boolean(getMenuItemStockError(getMenuItemStockDraft(item))))}
                                        inputMode="numeric"
                                        max={10}
                                        min={0}
                                        placeholder="不限量"
                                        value={getMenuItemStockDraft(item)}
                                        onChange={(event) =>
                                          setMenuItemStockDrafts((current) => ({
                                            ...current,
                                            [item.id]: event.target.value,
                                          }))
                                        }
                                      />
                                      <button
                                        className="secondary-button merchant-menu-stock-button"
                                        disabled={Boolean(getMenuItemStockError(getMenuItemStockDraft(item)))}
                                        onClick={() => void submitMenuItemStock(store.id, item)}
                                        type="button"
                                      >
                                        改剩余份数
                                      </button>
                                      <button
                                        className="secondary-button merchant-menu-stock-button"
                                        onClick={() => void clearMenuItemStockLimit(store.id, item)}
                                        type="button"
                                      >
                                        设为不限量
                                      </button>
                                      <button
                                        className="secondary-button merchant-menu-remove-button"
                                        onClick={() =>
                                          void runAction(() => deliveryApi.removeStoreMenuItem(store.id, item.id))
                                        }
                                        type="button"
                                      >
                                        下架商品
                                      </button>
                                    </div>
                                  </div>
                                  {getMenuItemStockError(getMenuItemStockDraft(item)) ? (
                                    <small className="field-error-text">
                                      {getMenuItemStockError(getMenuItemStockDraft(item))}
                                    </small>
                                  ) : null}
                                </article>
                              ))}
                            </div>
                          </section>

                          <section className="merchant-section-card">
                            <div className="ticket-header merchant-orders-header">
                              <div>
                                <p className="ticket-kind">订单管理</p>
                                <h3>当前店铺订单</h3>
                              </div>
                              <span className="badge">{storeOrders.length} 笔</span>
                            </div>
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
                                        <>
                                          <button className="primary-button" onClick={() => void runAction(() => deliveryApi.acceptOrder(order.id))} type="button">
                                            接单
                                          </button>
                                          <input
                                            className={getOrderRejectError(order.id) ? 'field-error' : undefined}
                                            maxLength={160}
                                            placeholder="拒单理由（必填）"
                                            value={getOrderRejectDraft(order.id)}
                                            onChange={(event) => {
                                              const value = event.target.value
                                              setOrderRejectDrafts((current) => ({
                                                ...current,
                                                [order.id]: value,
                                              }))
                                              if (value.trim()) {
                                                setOrderRejectErrors((current) => {
                                                  if (!current[order.id]) return current
                                                  const next = { ...current }
                                                  delete next[order.id]
                                                  return next
                                                })
                                              }
                                            }}
                                          />
                                          <button
                                            className="secondary-button"
                                            onClick={() => void submitOrderReject(order.id)}
                                            type="button"
                                          >
                                            拒绝接单
                                          </button>
                                          {getOrderRejectError(order.id) ? (
                                            <small className="field-error-text">{getOrderRejectError(order.id)}</small>
                                          ) : null}
                                        </>
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
                                      errorText={orderChatErrors[order.id]}
                                      disabled={false}
                                      disabledReason={
                                        order.riderId
                                          ? undefined
                                          : '骑手尚未接单，当前聊天主要用于和顾客确认订单细节。'
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
      )}
    </section>
  )
}
