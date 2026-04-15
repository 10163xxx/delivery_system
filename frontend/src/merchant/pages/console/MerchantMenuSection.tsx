import type {
  MenuComposerOpenState,
  MerchantConsolePanelProps,
} from '@/merchant/app/MerchantConsoleState'
import { DisplayImageSlot } from '@/shared/components/DisplayImageSlot'
import type { MenuItem, Store } from '@/shared/object/SharedObjects'
import { DELIVERY_CONSOLE_MESSAGES } from '@/shared/delivery/DeliveryServices'

export function MerchantMenuSection({
  store,
  props,
}: {
  store: Store
  props: MerchantConsolePanelProps
}) {
  const {
    getMenuItemDraft,
    isMenuComposerExpanded,
    menuItemFormErrors,
    isMenuItemImageUploading,
    setMenuComposerOpen,
    getMerchantFieldClassName,
    getMenuItemFieldId,
    setMenuItemDrafts,
    setMenuItemFormErrors,
    uploadStoreMenuImage,
    submitStoreMenuItem,
    formatPrice,
    getMenuItemPriceError,
    getMenuItemPriceDraft,
    getMenuItemStockError,
    getMenuItemStockDraft,
    setMenuItemPriceDrafts,
    setMenuItemStockDrafts,
    submitMenuItemPrice,
    submitMenuItemStock,
    clearMenuItemStockLimit,
    runAction,
    removeStoreMenuItem,
  } = props
  const menuItemDraft = getMenuItemDraft(store.id)
  const isMenuComposerVisible = isMenuComposerExpanded(store.id)
  const storeMenuItemErrors = menuItemFormErrors[store.id] ?? {}
  const storeMenuImageUploading = isMenuItemImageUploading(store.id)

  return (
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
              setMenuComposerOpen((current: MenuComposerOpenState) => ({
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
                  setMenuItemDrafts((current) => ({
                    ...current,
                    [store.id]: { ...getMenuItemDraft(store.id), name: event.target.value },
                  }))
                  setMenuItemFormErrors((current) => ({
                    ...current,
                    [store.id]: { ...(current[store.id] ?? {}), name: undefined },
                  }))
                }}
              />
              {storeMenuItemErrors.name ? (
                <small className="field-error-text">{storeMenuItemErrors.name}</small>
              ) : null}
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
                  setMenuItemDrafts((current) => ({
                    ...current,
                    [store.id]: { ...getMenuItemDraft(store.id), priceYuan: event.target.value },
                  }))
                  setMenuItemFormErrors((current) => ({
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
                  setMenuItemDrafts((current) => ({
                    ...current,
                    [store.id]: {
                      ...getMenuItemDraft(store.id),
                      remainingQuantity: event.target.value,
                    },
                  }))
                  setMenuItemFormErrors((current) => ({
                    ...current,
                    [store.id]: { ...(current[store.id] ?? {}), remainingQuantity: undefined },
                  }))
                }}
              />
              {storeMenuItemErrors.remainingQuantity ? (
                <small className="field-error-text">{storeMenuItemErrors.remainingQuantity}</small>
              ) : (
                <small className="field-hint">{DELIVERY_CONSOLE_MESSAGES.remainingQuantityHint}</small>
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
                  setMenuItemDrafts((current) => ({
                    ...current,
                    [store.id]: { ...getMenuItemDraft(store.id), description: event.target.value },
                  }))
                  setMenuItemFormErrors((current) => ({
                    ...current,
                    [store.id]: { ...(current[store.id] ?? {}), description: undefined },
                  }))
                }}
              />
              {storeMenuItemErrors.description ? (
                <small className="field-error-text">{storeMenuItemErrors.description}</small>
              ) : null}
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
                  setMenuItemDrafts((current) => ({
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
                  setMenuItemFormErrors((current) => ({
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
                  setMenuComposerOpen((current: MenuComposerOpenState) => ({
                    ...current,
                    [store.id]: false,
                  }))
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
        {store.menu.map((item: MenuItem) => {
          const stockDraft = getMenuItemStockDraft(item)
          const stockError = getMenuItemStockError(stockDraft)
          const priceDraft = getMenuItemPriceDraft(item)
          const priceError = getMenuItemPriceError(priceDraft)

          return (
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
                    {item.remainingQuantity > 0 ? `限量剩余 ${item.remainingQuantity} 份` : '当前已售罄'}
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
                    className={getMerchantFieldClassName(Boolean(priceError))}
                    inputMode="decimal"
                    min={0.01}
                    placeholder="价格"
                    value={priceDraft}
                    onChange={(event) =>
                      setMenuItemPriceDrafts((current) => ({
                        ...current,
                        [item.id]: event.target.value,
                      }))
                    }
                  />
                  <button
                    className="secondary-button merchant-menu-stock-button"
                    disabled={Boolean(priceError)}
                    onClick={() => void submitMenuItemPrice(store.id, item)}
                    type="button"
                  >
                    改价格
                  </button>
                  <input
                    className={getMerchantFieldClassName(Boolean(stockError))}
                    inputMode="numeric"
                    max={10}
                    min={0}
                    placeholder="不限量"
                    value={stockDraft}
                    onChange={(event) =>
                      setMenuItemStockDrafts((current) => ({
                        ...current,
                        [item.id]: event.target.value,
                      }))
                    }
                  />
                  <button
                    className="secondary-button merchant-menu-stock-button"
                    disabled={Boolean(stockError)}
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
                    onClick={() => void runAction(() => removeStoreMenuItem(store.id, item.id))}
                    type="button"
                  >
                    下架商品
                  </button>
                </div>
              </div>
              {priceError ? <small className="field-error-text">{priceError}</small> : null}
              {stockError ? <small className="field-error-text">{stockError}</small> : null}
            </article>
          )
        })}
      </div>
    </section>
  )
}
