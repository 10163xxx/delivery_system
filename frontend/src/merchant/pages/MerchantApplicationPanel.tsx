import type { MerchantRoleProps } from '@/shared/AppBuildRoleProps'
import { DisplayImageSlot } from '@/shared/components/DisplayImageSlot'
import { Panel } from '@/shared/components/LayoutPrimitives'
import { APPLICATION_STATUS, ROLE } from '@/shared/object/SharedObjects'

export function MerchantApplicationPanel(props: MerchantRoleProps) {
  const {
    merchantApplicationView,
    setMerchantApplicationViewState,
    navigate,
    formatBusinessHours,
    formatTime,
    merchantPendingApplications,
    merchantReviewedApplications,
    getMerchantFieldClassName,
    getMerchantFieldId,
    merchantFormErrors,
    merchantDraft,
    setMerchantDraft,
    setMerchantFormErrors,
    STORE_CATEGORIES,
    isMerchantImageUploading,
    uploadMerchantImage,
    role,
    submitMerchantApplication,
  } = props

  function getMerchantApplicationPath(view: 'submit' | 'pending' | 'reviewed') {
    return `/merchant/application?merchantView=${view}`
  }

  function goToPath(path: string) {
    navigate(path)
  }

  return (
    <Panel title="商家入驻申请" description="商家提交店铺资料后，需要管理员审核通过才能正式入驻。">
      <div className="action-row">
        <button className={merchantApplicationView === 'submit' ? 'primary-button' : 'secondary-button'} onClick={() => { setMerchantApplicationViewState('submit'); goToPath(getMerchantApplicationPath('submit')) }} type="button">提交入驻申请</button>
        <button className={merchantApplicationView === 'pending' ? 'primary-button' : 'secondary-button'} onClick={() => { setMerchantApplicationViewState('pending'); goToPath(getMerchantApplicationPath('pending')) }} type="button">待审核申请</button>
        <button className={merchantApplicationView === 'reviewed' ? 'primary-button' : 'secondary-button'} onClick={() => { setMerchantApplicationViewState('reviewed'); goToPath(getMerchantApplicationPath('reviewed')) }} type="button">已审核申请</button>
      </div>
      {merchantApplicationView === 'pending' ? (
        <div className="ticket-grid">
          {merchantPendingApplications.length === 0 ? <div className="empty-card">当前没有待审核申请。</div> : merchantPendingApplications.map((application) => (
            <article key={application.id} className="ticket-card">
              <div className="ticket-header">
                <div><p className="ticket-kind">待审核</p><h3>{application.storeName}</h3></div>
                <span className="badge warning">待审核</span>
              </div>
              <p>商家 {application.merchantName} · {application.category} · 预计出餐 {application.avgPrepMinutes} 分钟</p>
              <p className="meta-line">营业时间 {formatBusinessHours(application.businessHours)}</p>
              <p className="meta-line">提交于 {formatTime(application.submittedAt)}{application.note ? ` · ${application.note}` : ''}</p>
            </article>
          ))}
        </div>
      ) : merchantApplicationView === 'reviewed' ? (
        <div className="ticket-grid">
          {merchantReviewedApplications.length === 0 ? <div className="empty-card">当前没有已审核申请。</div> : merchantReviewedApplications.map((application) => (
            <article key={application.id} className="ticket-card">
              <div className="ticket-header">
                <div><p className="ticket-kind">审核记录</p><h3>{application.storeName}</h3></div>
                <span className={application.status === APPLICATION_STATUS.approved ? 'badge success' : 'badge warning'}>{application.status === APPLICATION_STATUS.approved ? '已通过' : '已驳回'}</span>
              </div>
              <p>商家 {application.merchantName} · {application.category} · 预计出餐 {application.avgPrepMinutes} 分钟</p>
              <p className="meta-line">营业时间 {formatBusinessHours(application.businessHours)}</p>
              <p className="meta-line">提交于 {formatTime(application.submittedAt)}{application.reviewedAt ? ` · 审核于 ${formatTime(application.reviewedAt)}` : ''}</p>
              <p className="meta-line">审核说明：{application.reviewNote ?? '暂无审核说明'}</p>
            </article>
          ))}
        </div>
      ) : (
        <>
          <div className="form-grid">
            <label>
              <span>商家姓名</span>
              <input aria-invalid={Boolean(merchantFormErrors.merchantName)} className={getMerchantFieldClassName(Boolean(merchantFormErrors.merchantName))} disabled={role === ROLE.merchant} id={getMerchantFieldId('merchantName')} value={merchantDraft.merchantName} onChange={(event) => { setMerchantDraft((current) => ({ ...current, merchantName: event.target.value })); setMerchantFormErrors((current) => ({ ...current, merchantName: undefined })) }} />
              {merchantFormErrors.merchantName ? <small className="field-error-text">{merchantFormErrors.merchantName}</small> : null}
            </label>
            <label>
              <span>店铺名称</span>
              <input aria-invalid={Boolean(merchantFormErrors.storeName)} className={getMerchantFieldClassName(Boolean(merchantFormErrors.storeName))} id={getMerchantFieldId('storeName')} value={merchantDraft.storeName} onChange={(event) => { setMerchantDraft((current) => ({ ...current, storeName: event.target.value })); setMerchantFormErrors((current) => ({ ...current, storeName: undefined })) }} />
              {merchantFormErrors.storeName ? <small className="field-error-text">{merchantFormErrors.storeName}</small> : null}
            </label>
            <label>
              <span>店铺大类</span>
              <select aria-invalid={Boolean(merchantFormErrors.category)} className={getMerchantFieldClassName(Boolean(merchantFormErrors.category))} id={getMerchantFieldId('category')} value={merchantDraft.category} onChange={(event) => { setMerchantDraft((current) => ({ ...current, category: event.target.value as typeof current.category })); setMerchantFormErrors((current) => ({ ...current, category: undefined })) }}>
                <option value="">请选择店铺大类</option>
                {STORE_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
              {merchantFormErrors.category ? <small className="field-error-text">{merchantFormErrors.category}</small> : null}
            </label>
            <label>
              <span>预计出餐时间</span>
              <input min={1} max={120} type="number" value={merchantDraft.avgPrepMinutes} onChange={(event) => setMerchantDraft((current) => ({ ...current, avgPrepMinutes: Number(event.target.value) }))} />
            </label>
            <label>
              <span>开业时间</span>
              <input aria-invalid={Boolean(merchantFormErrors.openTime)} className={getMerchantFieldClassName(Boolean(merchantFormErrors.openTime))} id={getMerchantFieldId('openTime')} type="time" value={merchantDraft.openTime} onChange={(event) => { setMerchantDraft((current) => ({ ...current, openTime: event.target.value })); setMerchantFormErrors((current) => ({ ...current, openTime: undefined, closeTime: undefined })) }} />
              {merchantFormErrors.openTime ? <small className="field-error-text">{merchantFormErrors.openTime}</small> : null}
            </label>
            <label>
              <span>打烊时间</span>
              <input aria-invalid={Boolean(merchantFormErrors.closeTime)} className={getMerchantFieldClassName(Boolean(merchantFormErrors.closeTime))} id={getMerchantFieldId('closeTime')} type="time" value={merchantDraft.closeTime} onChange={(event) => { setMerchantDraft((current) => ({ ...current, closeTime: event.target.value })); setMerchantFormErrors((current) => ({ ...current, openTime: undefined, closeTime: undefined })) }} />
              {merchantFormErrors.closeTime ? <small className="field-error-text">{merchantFormErrors.closeTime}</small> : null}
            </label>
            <div className="full upload-field">
              <span>本地图片上传</span>
              <input accept="image/png,image/jpeg,image/gif,image/webp" className="visually-hidden-file-input" id="merchant-store-image-upload" type="file" onChange={(event) => { const file = event.target.files?.[0]; void uploadMerchantImage(file); event.target.value = '' }} />
              <label className={`${getMerchantFieldClassName(Boolean(merchantFormErrors.imageUrl), `secondary-button upload-trigger${isMerchantImageUploading ? ' is-uploading' : ''}`)}`} htmlFor="merchant-store-image-upload" id={getMerchantFieldId('imageUrl')}>
                {isMerchantImageUploading ? '正在上传图片...' : '选择本地图片'}
              </label>
              <input aria-invalid={Boolean(merchantFormErrors.imageUrl)} className={getMerchantFieldClassName(Boolean(merchantFormErrors.imageUrl), 'upload-file-name')} readOnly value={merchantDraft.uploadedImageName || '尚未选择文件'} />
              {merchantFormErrors.imageUrl ? <small className="field-error-text">{merchantFormErrors.imageUrl}</small> : null}
              <small className="field-hint">支持 JPG、PNG、GIF、WebP，单张不超过 5MB。{isMerchantImageUploading ? ' 当前正在上传图片...' : merchantDraft.uploadedImageName ? ' 上传完成。' : ''}</small>
            </div>
            <label className="full">
              <span>店铺展示图 URL</span>
              <input aria-invalid={Boolean(merchantFormErrors.imageUrl)} className={getMerchantFieldClassName(Boolean(merchantFormErrors.imageUrl))} placeholder="可直接粘贴线上图片链接，或使用上方上传后自动回填" value={merchantDraft.imageUrl} onChange={(event) => { setMerchantDraft((current) => ({ ...current, imageUrl: event.target.value, uploadedImageName: event.target.value === current.imageUrl ? current.uploadedImageName : '' })); setMerchantFormErrors((current) => ({ ...current, imageUrl: undefined })) }} />
              <small className="field-hint">店铺展示图为必填项；可上传本地图片，或填写可访问的图片 URL。</small>
            </label>
            <div className="full">
              <DisplayImageSlot alt="店铺展示图预览" label="店铺展示图预览" src={merchantDraft.imageUrl.trim() || undefined} />
            </div>
            <label className="full">
              <span>补充说明</span>
              <input value={merchantDraft.note} onChange={(event) => setMerchantDraft((current) => ({ ...current, note: event.target.value }))} />
            </label>
          </div>
          <div className="summary-bar">
            <div><p>审核说明</p><strong>提交后进入管理员待审列表</strong></div>
            <div><p>营业时间</p><strong>{merchantDraft.openTime} - {merchantDraft.closeTime}</strong></div>
            <button className="primary-button" disabled={isMerchantImageUploading} onClick={() => void submitMerchantApplication()} type="button">
              {isMerchantImageUploading ? '图片上传中...' : '提交入驻申请'}
            </button>
          </div>
        </>
      )}
    </Panel>
  )
}
