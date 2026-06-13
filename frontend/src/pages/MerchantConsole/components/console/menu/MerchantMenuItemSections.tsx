import type {
  MerchantMenuSectionItemCardActionProps,
  MerchantMenuSectionItemCardInfoProps,
} from '@/pages/MerchantConsole/objects/MerchantConsoleObjects'

const MERCHANT_MENU_ITEM_PRICE_INPUT_MIN = 0.01
const MERCHANT_MENU_ITEM_STOCK_INPUT_MAX = 10

function MerchantMenuItemSelectionSummary({
  item,
}: Pick<MerchantMenuSectionItemCardInfoProps, 'item'>) {
  if (item.selectionGroups.length === 0) return null

  return (
    <p className="meta-line">
      {item.selectionGroups
        .map((group) => {
          const priceHint = group.options.some((option) => option.additionalPriceCents > 0)
            ? ' 含加价选项'
            : ''
          return `${group.name}${group.minSelections === 1 && group.maxSelections === 1 ? ' 必选1项' : ` ${group.minSelections}-${group.maxSelections}项`}${priceHint}`
        })
        .join(' · ')}
    </p>
  )
}

function MerchantMenuItemStockSummary({
  item,
}: Pick<MerchantMenuSectionItemCardInfoProps, 'item'>) {
  if (item.remainingQuantity == null) return null

  return (
    <p className="meta-line">
      {item.remainingQuantity > 0 ? `限量剩余 ${item.remainingQuantity} 份` : '当前已售罄'}
    </p>
  )
}

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
      <MerchantMenuItemSelectionSummary item={item} />
      <MerchantMenuItemStockSummary item={item} />
    </div>
  )
}

function MerchantMenuItemStockBadge({
  item,
}: Pick<MerchantMenuSectionItemCardActionProps, 'item'>) {
  return (
    <span className={item.remainingQuantity === 0 ? 'badge warning' : 'badge'}>
      {item.remainingQuantity == null
        ? '不限量'
        : item.remainingQuantity > 0
          ? `剩余 ${item.remainingQuantity} 份`
          : '已售罄'}
    </span>
  )
}

function MerchantMenuItemDraftField({
  buttonLabel,
  className,
  disabled,
  inputMode,
  max,
  min,
  onChange,
  onSubmit,
  placeholder,
  value,
}: {
  buttonLabel: string
  className: string
  disabled: boolean
  inputMode?: 'decimal' | 'numeric'
  max?: number
  min?: number
  onChange: (value: string) => void
  onSubmit: () => void
  placeholder: string
  value: string
}) {
  return (
    <>
      <input
        className={className}
        inputMode={inputMode}
        max={max}
        min={min}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <button
        className="secondary-button merchant-menu-stock-button"
        disabled={disabled}
        onClick={onSubmit}
        type="button"
      >
        {buttonLabel}
      </button>
    </>
  )
}

function MerchantMenuItemErrors({
  item,
  props,
}: MerchantMenuSectionItemCardActionProps) {
  const categoryError = props.getMenuItemCategoryError(props.getMenuItemCategoryDraft(item))
  const priceError = props.getMenuItemPriceError(props.getMenuItemPriceDraft(item))
  const stockError = props.getMenuItemStockError(props.getMenuItemStockDraft(item))

  return (
    <>
      {categoryError ? <small className="field-error-text">{categoryError}</small> : null}
      {priceError ? <small className="field-error-text">{priceError}</small> : null}
      {stockError ? <small className="field-error-text">{stockError}</small> : null}
    </>
  )
}

function MerchantMenuItemCategoryField({
  item,
  props,
  storeId,
}: MerchantMenuSectionItemCardActionProps) {
  const categoryDraft = props.getMenuItemCategoryDraft(item)
  const categoryError = props.getMenuItemCategoryError(categoryDraft)

  return (
    <MerchantMenuItemDraftField
      buttonLabel="改分类"
      className={props.getMerchantFieldClassName(Boolean(categoryError))}
      disabled={Boolean(categoryError)}
      placeholder="分类"
      value={categoryDraft}
      onChange={(value) =>
        props.setMenuItemCategoryDrafts((current) => ({
          ...current,
          [item.id]: value,
        }))
      }
      onSubmit={() => void props.submitMenuItemCategory(storeId, item)}
    />
  )
}

function MerchantMenuItemPriceField({
  item,
  props,
  storeId,
}: MerchantMenuSectionItemCardActionProps) {
  const priceDraft = props.getMenuItemPriceDraft(item)
  const priceError = props.getMenuItemPriceError(priceDraft)

  return (
    <MerchantMenuItemDraftField
      buttonLabel="改价格"
      className={props.getMerchantFieldClassName(Boolean(priceError))}
      disabled={Boolean(priceError)}
      inputMode="decimal"
      min={MERCHANT_MENU_ITEM_PRICE_INPUT_MIN}
      placeholder="价格"
      value={priceDraft}
      onChange={(value) =>
        props.setMenuItemPriceDrafts((current) => ({
          ...current,
          [item.id]: value,
        }))
      }
      onSubmit={() => void props.submitMenuItemPrice(storeId, item)}
    />
  )
}

function MerchantMenuItemStockField({
  item,
  props,
  storeId,
}: MerchantMenuSectionItemCardActionProps) {
  const stockDraft = props.getMenuItemStockDraft(item)
  const stockError = props.getMenuItemStockError(stockDraft)

  return (
    <MerchantMenuItemDraftField
      buttonLabel="改剩余份数"
      className={props.getMerchantFieldClassName(Boolean(stockError))}
      disabled={Boolean(stockError)}
      inputMode="numeric"
      max={MERCHANT_MENU_ITEM_STOCK_INPUT_MAX}
      min={0}
      placeholder="不限量"
      value={stockDraft}
      onChange={(value) =>
        props.setMenuItemStockDrafts((current) => ({
          ...current,
          [item.id]: value,
        }))
      }
      onSubmit={() => void props.submitMenuItemStock(storeId, item)}
    />
  )
}

function MerchantMenuItemExtraActions({
  item,
  props,
  storeId,
}: MerchantMenuSectionItemCardActionProps) {
  return (
    <>
      <button
        className="secondary-button merchant-menu-stock-button"
        onClick={() => void props.clearMenuItemStockLimit(storeId, item)}
        type="button"
      >
        设为不限量
      </button>
      <button
        className="secondary-button merchant-menu-remove-button"
        onClick={() => void props.runAction(() => props.removeMenuItem(storeId, item.id))}
        type="button"
      >
        下架商品
      </button>
    </>
  )
}

export function MerchantMenuSectionItemActions({
  item,
  props,
  storeId,
}: MerchantMenuSectionItemCardActionProps) {
  return (
    <>
      <div className="merchant-menu-item-actions">
        <MerchantMenuItemStockBadge item={item} />
        <MerchantMenuItemCategoryField item={item} props={props} storeId={storeId} />
        <MerchantMenuItemPriceField item={item} props={props} storeId={storeId} />
        <MerchantMenuItemStockField item={item} props={props} storeId={storeId} />
        <MerchantMenuItemExtraActions item={item} props={props} storeId={storeId} />
      </div>
      <MerchantMenuItemErrors item={item} props={props} storeId={storeId} />
    </>
  )
}
