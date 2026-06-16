import type { MerchantRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import { DisplayImageSlot } from '@/pages/DeliveryConsole/components/primitives/DisplayImageSlot'
import type {
  AddressText,
  DisplayText,
  ImageUrl,
  Minutes,
  NoteText,
  PersonName,
  TimeOfDay,
  MerchantApplication,
} from '@/objects/core/SharedObjects'
import { APPLICATION_STATUS, ROLE } from '@/objects/core/SharedObjects'
import { asDomainNumber, asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import {
  buildMerchantApplicationSubmitRoute,
  MERCHANT_APPLICATION_VIEW,
  MERCHANT_FORM_FIELD,
  type MerchantRoutePath,
} from '@/pages/DeliveryConsole/objects/MerchantWorkspaceObjects'

type MerchantApplicationView = MerchantRoleProps['merchantApplicationView']
type MerchantApplicationFormProps = Pick<
  MerchantRoleProps,
  | 'STORE_CATEGORIES'
  | 'getMerchantFieldClassName'
  | 'getMerchantFieldId'
  | 'isMerchantImageUploading'
  | 'merchantDraft'
  | 'merchantFormErrors'
  | 'role'
  | 'setMerchantDraft'
  | 'setMerchantFormErrors'
  | 'submitMerchantApplication'
  | 'uploadMerchantImage'
>

function getMerchantApplicationPath(view: MerchantApplicationView) {
  if (view === MERCHANT_APPLICATION_VIEW.submit) return buildMerchantApplicationSubmitRoute()
  return `/merchant/application?merchantView=${view}` as MerchantRoutePath
}

export function MerchantApplicationTabs({
  merchantApplicationView,
  navigate,
  setMerchantApplicationViewState,
}: Pick<MerchantRoleProps, 'merchantApplicationView' | 'navigate' | 'setMerchantApplicationViewState'>) {
  function openView(view: MerchantApplicationView) {
    setMerchantApplicationViewState(view)
    navigate(getMerchantApplicationPath(view))
  }

  return (
    <div className="action-row">
      <button className={merchantApplicationView === MERCHANT_APPLICATION_VIEW.submit ? 'primary-button' : 'secondary-button'} onClick={() => openView(MERCHANT_APPLICATION_VIEW.submit)} type="button">提交入驻申请</button>
      <button className={merchantApplicationView === MERCHANT_APPLICATION_VIEW.pending ? 'primary-button' : 'secondary-button'} onClick={() => openView(MERCHANT_APPLICATION_VIEW.pending)} type="button">待审核申请</button>
      <button className={merchantApplicationView === MERCHANT_APPLICATION_VIEW.reviewed ? 'primary-button' : 'secondary-button'} onClick={() => openView(MERCHANT_APPLICATION_VIEW.reviewed)} type="button">已审核申请</button>
    </div>
  )
}

function MerchantApplicationRecord({
  application,
  badgeClassName,
  badgeText,
  formatBusinessHours,
  formatTime,
  reviewed,
}: {
  application: MerchantApplication
  badgeClassName: string
  badgeText: string
  formatBusinessHours: MerchantRoleProps['formatBusinessHours']
  formatTime: MerchantRoleProps['formatTime']
  reviewed: boolean
}) {
  return (
    <article key={application.id} className="ticket-card">
      <div className="ticket-header">
        <div><p className="ticket-kind">{reviewed ? '审核记录' : '待审核'}</p><h3>{application.storeName}</h3></div>
        <span className={badgeClassName}>{badgeText}</span>
      </div>
      <p>商家 {application.merchantName} · {application.category} · 预计出餐 {application.avgPrepMinutes} 分钟</p>
      <p className="meta-line">店铺地址 {application.storeAddress}</p>
      <p className="meta-line">营业时间 {formatBusinessHours(application.businessHours)}</p>
      <p className="meta-line">
        提交于 {formatTime(application.submittedAt)}
        {reviewed && application.reviewedAt ? ` · 审核于 ${formatTime(application.reviewedAt)}` : ''}
        {!reviewed && application.note ? ` · ${application.note}` : ''}
      </p>
      {reviewed ? <p className="meta-line">审核说明：{application.reviewNote ?? '暂无审核说明'}</p> : null}
    </article>
  )
}

export function MerchantPendingApplicationsPanel(props: Pick<MerchantRoleProps, 'formatBusinessHours' | 'formatTime' | 'merchantPendingApplications'>) {
  if (props.merchantPendingApplications.length === 0) return <div className="empty-card">当前没有待审核申请。</div>
  return (
    <div className="ticket-grid">
      {props.merchantPendingApplications.map((application) => (
        <MerchantApplicationRecord
          key={application.id}
          application={application}
          badgeClassName="badge warning"
          badgeText="待审核"
          formatBusinessHours={props.formatBusinessHours}
          formatTime={props.formatTime}
          reviewed={false}
        />
      ))}
    </div>
  )
}

export function MerchantReviewedApplicationsPanel(props: Pick<MerchantRoleProps, 'formatBusinessHours' | 'formatTime' | 'merchantReviewedApplications'>) {
  if (props.merchantReviewedApplications.length === 0) return <div className="empty-card">当前没有已审核申请。</div>
  return (
    <div className="ticket-grid">
      {props.merchantReviewedApplications.map((application) => (
        <MerchantApplicationRecord
          key={application.id}
          application={application}
          badgeClassName={application.status === APPLICATION_STATUS.approved ? 'badge success' : 'badge warning'}
          badgeText={application.status === APPLICATION_STATUS.approved ? '已通过' : '已驳回'}
          formatBusinessHours={props.formatBusinessHours}
          formatTime={props.formatTime}
          reviewed
        />
      ))}
    </div>
  )
}

function MerchantApplicationBasicFields(props: MerchantApplicationFormProps) {
  const {
    STORE_CATEGORIES,
    getMerchantFieldClassName,
    getMerchantFieldId,
    merchantDraft,
    merchantFormErrors,
    role,
    setMerchantDraft,
    setMerchantFormErrors,
  } = props

  return (
    <>
      <label>
        <span>商家姓名</span>
        <input aria-invalid={Boolean(merchantFormErrors.merchantName)} className={getMerchantFieldClassName(Boolean(merchantFormErrors.merchantName))} disabled={role === ROLE.merchant} id={getMerchantFieldId(MERCHANT_FORM_FIELD.merchantName)} value={merchantDraft.merchantName} onChange={(event) => { setMerchantDraft((current) => ({ ...current, merchantName: asDomainText<PersonName>(event.target.value) })); setMerchantFormErrors((current) => ({ ...current, merchantName: undefined })) }} />
        {merchantFormErrors.merchantName ? <small className="field-error-text">{merchantFormErrors.merchantName}</small> : null}
      </label>
      <label>
        <span>店铺名称</span>
        <input aria-invalid={Boolean(merchantFormErrors.storeName)} className={getMerchantFieldClassName(Boolean(merchantFormErrors.storeName))} id={getMerchantFieldId(MERCHANT_FORM_FIELD.storeName)} value={merchantDraft.storeName} onChange={(event) => { setMerchantDraft((current) => ({ ...current, storeName: asDomainText<DisplayText>(event.target.value) })); setMerchantFormErrors((current) => ({ ...current, storeName: undefined })) }} />
        {merchantFormErrors.storeName ? <small className="field-error-text">{merchantFormErrors.storeName}</small> : null}
      </label>
      <label>
        <span>店铺大类</span>
        <select aria-invalid={Boolean(merchantFormErrors.category)} className={getMerchantFieldClassName(Boolean(merchantFormErrors.category))} id={getMerchantFieldId(MERCHANT_FORM_FIELD.category)} value={merchantDraft.category} onChange={(event) => { setMerchantDraft((current) => ({ ...current, category: event.target.value as typeof current.category })); setMerchantFormErrors((current) => ({ ...current, category: undefined })) }}>
          <option value="">请选择店铺大类</option>
          {STORE_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
        {merchantFormErrors.category ? <small className="field-error-text">{merchantFormErrors.category}</small> : null}
      </label>
      <label className="full">
        <span>店铺地址</span>
        <input aria-invalid={Boolean(merchantFormErrors.storeAddress)} className={getMerchantFieldClassName(Boolean(merchantFormErrors.storeAddress))} id={getMerchantFieldId(MERCHANT_FORM_FIELD.storeAddress)} value={merchantDraft.storeAddress} onChange={(event) => { setMerchantDraft((current) => ({ ...current, storeAddress: asDomainText<AddressText>(event.target.value) })); setMerchantFormErrors((current) => ({ ...current, storeAddress: undefined })) }} />
        {merchantFormErrors.storeAddress ? <small className="field-error-text">{merchantFormErrors.storeAddress}</small> : <small className="field-hint">填写真实门牌地址，后续地图与路线能力将基于这里定位。</small>}
      </label>
    </>
  )
}

function MerchantApplicationHoursFields(props: MerchantApplicationFormProps) {
  const { getMerchantFieldClassName, getMerchantFieldId, merchantDraft, merchantFormErrors, setMerchantDraft, setMerchantFormErrors } = props

  return (
    <>
      <label>
        <span>预计出餐时间</span>
        <input min={1} max={120} type="number" value={merchantDraft.avgPrepMinutes} onChange={(event) => setMerchantDraft((current) => ({ ...current, avgPrepMinutes: asDomainNumber<Minutes>(Number(event.target.value)) }))} />
      </label>
      <label>
        <span>开业时间</span>
        <input aria-invalid={Boolean(merchantFormErrors.openTime)} className={getMerchantFieldClassName(Boolean(merchantFormErrors.openTime))} id={getMerchantFieldId(MERCHANT_FORM_FIELD.openTime)} type="time" value={merchantDraft.openTime} onChange={(event) => { setMerchantDraft((current) => ({ ...current, openTime: asDomainText<TimeOfDay>(event.target.value) })); setMerchantFormErrors((current) => ({ ...current, openTime: undefined, closeTime: undefined })) }} />
        {merchantFormErrors.openTime ? <small className="field-error-text">{merchantFormErrors.openTime}</small> : null}
      </label>
      <label>
        <span>打烊时间</span>
        <input aria-invalid={Boolean(merchantFormErrors.closeTime)} className={getMerchantFieldClassName(Boolean(merchantFormErrors.closeTime))} id={getMerchantFieldId(MERCHANT_FORM_FIELD.closeTime)} type="time" value={merchantDraft.closeTime} onChange={(event) => { setMerchantDraft((current) => ({ ...current, closeTime: asDomainText<TimeOfDay>(event.target.value) })); setMerchantFormErrors((current) => ({ ...current, openTime: undefined, closeTime: undefined })) }} />
        {merchantFormErrors.closeTime ? <small className="field-error-text">{merchantFormErrors.closeTime}</small> : null}
      </label>
    </>
  )
}

function MerchantApplicationImageFields(props: MerchantApplicationFormProps) {
  const {
    getMerchantFieldClassName,
    getMerchantFieldId,
    isMerchantImageUploading,
    merchantDraft,
    merchantFormErrors,
    setMerchantDraft,
    setMerchantFormErrors,
    uploadMerchantImage,
  } = props

  return (
    <>
      <div className="full upload-field">
        <span>本地图片上传</span>
        <input accept="image/png,image/jpeg,image/gif,image/webp" className="visually-hidden-file-input" id="merchant-store-image-upload" type="file" onChange={(event) => { const file = event.target.files?.[0]; void uploadMerchantImage(file); event.target.value = '' }} />
        <label className={`${getMerchantFieldClassName(Boolean(merchantFormErrors.imageUrl), `secondary-button upload-trigger${isMerchantImageUploading ? ' is-uploading' : ''}`)}`} htmlFor="merchant-store-image-upload" id={getMerchantFieldId(MERCHANT_FORM_FIELD.imageUrl)}>
          {isMerchantImageUploading ? '正在上传图片...' : '选择本地图片'}
        </label>
        <input aria-invalid={Boolean(merchantFormErrors.imageUrl)} className={getMerchantFieldClassName(Boolean(merchantFormErrors.imageUrl), 'upload-file-name')} readOnly value={merchantDraft.uploadedImageName || '尚未选择文件'} />
        {merchantFormErrors.imageUrl ? <small className="field-error-text">{merchantFormErrors.imageUrl}</small> : null}
        <small className="field-hint">支持 JPG、PNG、GIF、WebP，单张不超过 5MB。{isMerchantImageUploading ? ' 当前正在上传图片...' : merchantDraft.uploadedImageName ? ' 上传完成。' : ''}</small>
      </div>
      <label className="full">
        <span>店铺展示图 URL</span>
        <input aria-invalid={Boolean(merchantFormErrors.imageUrl)} className={getMerchantFieldClassName(Boolean(merchantFormErrors.imageUrl))} placeholder="可直接粘贴线上图片链接，或使用上方上传后自动回填" value={merchantDraft.imageUrl} onChange={(event) => { setMerchantDraft((current) => ({ ...current, imageUrl: asDomainText<ImageUrl>(event.target.value), uploadedImageName: event.target.value === current.imageUrl ? current.uploadedImageName : asDomainText<DisplayText>('') })); setMerchantFormErrors((current) => ({ ...current, imageUrl: undefined })) }} />
        <small className="field-hint">店铺展示图为必填项；可上传本地图片，或填写可访问的图片 URL。</small>
      </label>
      <div className="full">
        <DisplayImageSlot alt="店铺展示图预览" label="店铺展示图预览" src={merchantDraft.imageUrl.trim() || undefined} />
      </div>
    </>
  )
}

function MerchantApplicationNoteField({ merchantDraft, setMerchantDraft }: MerchantApplicationFormProps) {
  return (
    <label className="full">
      <span>补充说明</span>
      <input value={merchantDraft.note} onChange={(event) => setMerchantDraft((current) => ({ ...current, note: asDomainText<NoteText>(event.target.value) }))} />
    </label>
  )
}

function MerchantApplicationSubmitBar({
  isMerchantImageUploading,
  merchantDraft,
  submitMerchantApplication,
}: MerchantApplicationFormProps) {
  return (
    <div className="summary-bar">
      <div><p>审核说明</p><strong>提交后进入管理员待审列表</strong></div>
      <div><p>营业时间</p><strong>{merchantDraft.openTime} - {merchantDraft.closeTime}</strong></div>
      <button className="primary-button" disabled={isMerchantImageUploading} onClick={() => void submitMerchantApplication()} type="button">
        {isMerchantImageUploading ? '图片上传中...' : '提交入驻申请'}
      </button>
    </div>
  )
}

export function MerchantApplicationForm(props: MerchantApplicationFormProps) {
  return (
    <>
      <div className="form-grid">
        <MerchantApplicationBasicFields {...props} />
        <MerchantApplicationHoursFields {...props} />
        <MerchantApplicationImageFields {...props} />
        <MerchantApplicationNoteField {...props} />
      </div>
      <MerchantApplicationSubmitBar {...props} />
    </>
  )
}
