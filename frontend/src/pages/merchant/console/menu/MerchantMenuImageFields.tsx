import type { MerchantMenuImageFieldsProps } from '@/objects/merchant/page/MerchantConsoleObjects'
import { MENU_ITEM_FORM_FIELD } from '@/objects/page/DeliveryAppObjects'
import { DisplayImageSlot } from '@/components/primitives/DisplayImageSlot'

function MerchantMenuImageUploadField({ storeId, props }: MerchantMenuImageFieldsProps) {
  const { getMenuItemDraft, getMerchantFieldClassName, isMenuItemImageUploading, menuItemFormErrors, uploadStoreMenuImage } = props
  const menuItemDraft = getMenuItemDraft(storeId)
  const storeMenuItemErrors = menuItemFormErrors[storeId] ?? {}
  const storeMenuImageUploading = isMenuItemImageUploading(storeId)

  return (
    <div className="full upload-field">
      <span>本地图片上传</span>
      <input
        accept="image/png,image/jpeg,image/gif,image/webp"
        className="visually-hidden-file-input"
        id={`store-menu-image-upload-${storeId}`}
        type="file"
        onChange={(event) => {
          const file = event.target.files?.[0]
          void uploadStoreMenuImage(storeId, file)
          event.target.value = ''
        }}
      />
      <label
        className={`${getMerchantFieldClassName(Boolean(storeMenuItemErrors.imageUrl), `secondary-button upload-trigger${storeMenuImageUploading ? ' is-uploading' : ''}`)}`}
        htmlFor={`store-menu-image-upload-${storeId}`}
      >
        {storeMenuImageUploading ? '正在上传图片...' : '选择菜品图片'}
      </label>
      <input
        aria-invalid={Boolean(storeMenuItemErrors.imageUrl)}
        className={getMerchantFieldClassName(Boolean(storeMenuItemErrors.imageUrl), 'upload-file-name')}
        readOnly
        value={menuItemDraft.uploadedImageName || '尚未选择文件'}
      />
      {storeMenuItemErrors.imageUrl ? <small className="field-error-text">{storeMenuItemErrors.imageUrl}</small> : <small className="field-hint">支持 JPG、PNG、GIF、WebP，单张不超过 5MB。</small>}
    </div>
  )
}

function MerchantMenuImageUrlField({ storeId, props }: MerchantMenuImageFieldsProps) {
  const { getMenuItemDraft, getMenuItemFieldId, getMerchantFieldClassName, menuItemFormErrors, setMenuItemDrafts, setMenuItemFormErrors } = props
  const menuItemDraft = getMenuItemDraft(storeId)
  const storeMenuItemErrors = menuItemFormErrors[storeId] ?? {}

  return (
    <label className="full">
      <span>菜品图片 URL</span>
      <input
        aria-invalid={Boolean(storeMenuItemErrors.imageUrl)}
        className={getMerchantFieldClassName(Boolean(storeMenuItemErrors.imageUrl))}
        id={getMenuItemFieldId(storeId, MENU_ITEM_FORM_FIELD.imageUrl)}
        placeholder="可粘贴线上图片链接，或使用上方上传后自动回填"
        value={menuItemDraft.imageUrl}
        onChange={(event) => {
          setMenuItemDrafts((current) => ({
            ...current,
            [storeId]: {
              ...getMenuItemDraft(storeId),
              imageUrl: event.target.value,
              uploadedImageName: event.target.value === getMenuItemDraft(storeId).imageUrl ? getMenuItemDraft(storeId).uploadedImageName : '',
            },
          }))
          setMenuItemFormErrors((current) => ({ ...current, [storeId]: { ...(current[storeId] ?? {}), imageUrl: undefined } }))
        }}
      />
    </label>
  )
}

function MerchantMenuPreviewField({ storeId, storeName, props }: MerchantMenuImageFieldsProps) {
  const menuItemDraft = props.getMenuItemDraft(storeId)

  return (
    <div className="full merchant-menu-preview">
      <DisplayImageSlot
        alt={`${storeName} 菜品预览`}
        label="菜品图片预览"
        src={menuItemDraft.imageUrl.trim() || undefined}
        className="menu-image merchant-menu-preview-image"
      />
    </div>
  )
}

export function MerchantMenuImageFields(props: MerchantMenuImageFieldsProps) {
  return (
    <>
      <MerchantMenuImageUploadField {...props} />
      <MerchantMenuImageUrlField {...props} />
      <MerchantMenuPreviewField {...props} />
    </>
  )
}
