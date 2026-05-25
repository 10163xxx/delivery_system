import type {
  MerchantMenuSectionItemCardActionProps,
  MerchantMenuSectionItemCardInfoProps,
} from '@/pages/merchant/object/MerchantConsoleObjects'

const MERCHANT_MENU_ITEM_PRICE_INPUT_MIN = 0.01
const MERCHANT_MENU_ITEM_STOCK_INPUT_MAX = 10

export function MerchantMenuSectionItemInfo({
  item,
  monthlySales,
}: MerchantMenuSectionItemCardInfoProps) {
  return (
    <div>
      <h3>{item.name}</h3>
      <p className="meta-line merchant-menu-item-category">{item.category?.trim() || '未分类'}</p>
      <p className="meta-line menu-sales-text">月售 {monthlySales}</p>
      <p>{item.description}</p>
      {item.selectionGroups.length > 0 ? (
        <p className="meta-line">
          {item.selectionGroups.map((group) => `${group.name}${group.minSelections === 1 && group.maxSelections === 1 ? ' 必选1项' : ` ${group.minSelections}-${group.maxSelections}项`}`).join(' · ')}
        </p>
      ) : null}
      {item.remainingQuantity != null ? (
        <p className="meta-line">
          {item.remainingQuantity > 0 ? `限量剩余 ${item.remainingQuantity} 份` : '当前已售罄'}
        </p>
      ) : null}
    </div>
  )
}

export function MerchantMenuSectionItemActions({
  item,
  props,
  storeId,
}: MerchantMenuSectionItemCardActionProps) {
  const {
    clearMenuItemStockLimit,
    getMenuItemCategoryDraft,
    getMenuItemCategoryError,
    getMenuItemPriceDraft,
    getMenuItemPriceError,
    getMenuItemStockDraft,
    getMenuItemStockError,
    getMerchantFieldClassName,
    removeMenuItem,
    runAction,
    setMenuItemCategoryDrafts,
    setMenuItemPriceDrafts,
    setMenuItemStockDrafts,
    submitMenuItemCategory,
    submitMenuItemPrice,
    submitMenuItemStock,
  } = props
  const categoryDraft = getMenuItemCategoryDraft(item)
  const categoryError = getMenuItemCategoryError(categoryDraft)
  const stockDraft = getMenuItemStockDraft(item)
  const stockError = getMenuItemStockError(stockDraft)
  const priceDraft = getMenuItemPriceDraft(item)
  const priceError = getMenuItemPriceError(priceDraft)

  return (
    <>
      <div className="merchant-menu-item-actions">
        <span className={item.remainingQuantity === 0 ? 'badge warning' : 'badge'}>
          {item.remainingQuantity == null
            ? '不限量'
            : item.remainingQuantity > 0
              ? `剩余 ${item.remainingQuantity} 份`
              : '已售罄'}
        </span>
        <input
          className={getMerchantFieldClassName(Boolean(categoryError))}
          placeholder="分类"
          value={categoryDraft}
          onChange={(event) =>
            setMenuItemCategoryDrafts((current) => ({
              ...current,
              [item.id]: event.target.value,
            }))
          }
        />
        <button
          className="secondary-button merchant-menu-stock-button"
          disabled={Boolean(categoryError)}
          onClick={() => void submitMenuItemCategory(storeId, item)}
          type="button"
        >
          改分类
        </button>
        <input
          className={getMerchantFieldClassName(Boolean(priceError))}
          inputMode="decimal"
          min={MERCHANT_MENU_ITEM_PRICE_INPUT_MIN}
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
          onClick={() => void submitMenuItemPrice(storeId, item)}
          type="button"
        >
          改价格
        </button>
        <input
          className={getMerchantFieldClassName(Boolean(stockError))}
          inputMode="numeric"
          max={MERCHANT_MENU_ITEM_STOCK_INPUT_MAX}
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
          onClick={() => void submitMenuItemStock(storeId, item)}
          type="button"
        >
          改剩余份数
        </button>
        <button
          className="secondary-button merchant-menu-stock-button"
          onClick={() => void clearMenuItemStockLimit(storeId, item)}
          type="button"
        >
          设为不限量
        </button>
        <button
          className="secondary-button merchant-menu-remove-button"
          onClick={() => void runAction(() => removeMenuItem(storeId, item.id))}
          type="button"
        >
          下架商品
        </button>
      </div>
      {categoryError ? <small className="field-error-text">{categoryError}</small> : null}
      {priceError ? <small className="field-error-text">{priceError}</small> : null}
      {stockError ? <small className="field-error-text">{stockError}</small> : null}
    </>
  )
}
