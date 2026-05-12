import type { MerchantMenuBasicFieldsProps } from '@/merchant/object/console/MerchantConsoleObjects'
import { MENU_ITEM_FORM_FIELD } from '@/shared/object/core/DeliveryAppObjects'
import { DELIVERY_CONSOLE_MESSAGES } from '@/shared/delivery/DeliveryServices'

function MerchantMenuNameField({ storeId, props }: MerchantMenuBasicFieldsProps) {
  const { getMenuItemDraft, getMenuItemFieldId, getMerchantFieldClassName, menuItemFormErrors, setMenuItemDrafts, setMenuItemFormErrors } = props
  const menuItemDraft = getMenuItemDraft(storeId)
  const storeMenuItemErrors = menuItemFormErrors[storeId] ?? {}

  return (
    <label>
      <span>菜品名称</span>
      <input
        aria-invalid={Boolean(storeMenuItemErrors.name)}
        className={getMerchantFieldClassName(Boolean(storeMenuItemErrors.name))}
        id={getMenuItemFieldId(storeId, MENU_ITEM_FORM_FIELD.name)}
        value={menuItemDraft.name}
        onChange={(event) => {
          setMenuItemDrafts((current) => ({ ...current, [storeId]: { ...getMenuItemDraft(storeId), name: event.target.value } }))
          setMenuItemFormErrors((current) => ({ ...current, [storeId]: { ...(current[storeId] ?? {}), name: undefined } }))
        }}
      />
      {storeMenuItemErrors.name ? <small className="field-error-text">{storeMenuItemErrors.name}</small> : null}
    </label>
  )
}

function MerchantMenuPriceField({ storeId, props }: MerchantMenuBasicFieldsProps) {
  const { getMenuItemDraft, getMenuItemFieldId, getMerchantFieldClassName, menuItemFormErrors, setMenuItemDrafts, setMenuItemFormErrors } = props
  const menuItemDraft = getMenuItemDraft(storeId)
  const storeMenuItemErrors = menuItemFormErrors[storeId] ?? {}

  return (
    <label>
      <span>价格</span>
      <input
        aria-invalid={Boolean(storeMenuItemErrors.priceYuan)}
        className={getMerchantFieldClassName(Boolean(storeMenuItemErrors.priceYuan))}
        id={getMenuItemFieldId(storeId, MENU_ITEM_FORM_FIELD.priceYuan)}
        inputMode="decimal"
        placeholder="例如 18.80"
        value={menuItemDraft.priceYuan}
        onChange={(event) => {
          setMenuItemDrafts((current) => ({ ...current, [storeId]: { ...getMenuItemDraft(storeId), priceYuan: event.target.value } }))
          setMenuItemFormErrors((current) => ({ ...current, [storeId]: { ...(current[storeId] ?? {}), priceYuan: undefined } }))
        }}
      />
      {storeMenuItemErrors.priceYuan ? <small className="field-error-text">{storeMenuItemErrors.priceYuan}</small> : <small className="field-hint">按元填写，提交时会自动换算。</small>}
    </label>
  )
}

function MerchantMenuStockField({ storeId, props }: MerchantMenuBasicFieldsProps) {
  const { getMenuItemDraft, getMenuItemFieldId, getMerchantFieldClassName, menuItemFormErrors, setMenuItemDrafts, setMenuItemFormErrors } = props
  const menuItemDraft = getMenuItemDraft(storeId)
  const storeMenuItemErrors = menuItemFormErrors[storeId] ?? {}

  return (
    <label>
      <span>限量库存</span>
      <input
        aria-invalid={Boolean(storeMenuItemErrors.remainingQuantity)}
        className={getMerchantFieldClassName(Boolean(storeMenuItemErrors.remainingQuantity))}
        id={getMenuItemFieldId(storeId, MENU_ITEM_FORM_FIELD.remainingQuantity)}
        inputMode="numeric"
        max={10}
        min={1}
        placeholder="留空表示不限量"
        value={menuItemDraft.remainingQuantity}
        onChange={(event) => {
          setMenuItemDrafts((current) => ({ ...current, [storeId]: { ...getMenuItemDraft(storeId), remainingQuantity: event.target.value } }))
          setMenuItemFormErrors((current) => ({ ...current, [storeId]: { ...(current[storeId] ?? {}), remainingQuantity: undefined } }))
        }}
      />
      {storeMenuItemErrors.remainingQuantity ? <small className="field-error-text">{storeMenuItemErrors.remainingQuantity}</small> : <small className="field-hint">{DELIVERY_CONSOLE_MESSAGES.merchant.remainingQuantityHint}</small>}
    </label>
  )
}

function MerchantMenuDescriptionField({ storeId, props }: MerchantMenuBasicFieldsProps) {
  const { getMenuItemDraft, getMenuItemFieldId, getMerchantFieldClassName, menuItemFormErrors, setMenuItemDrafts, setMenuItemFormErrors } = props
  const menuItemDraft = getMenuItemDraft(storeId)
  const storeMenuItemErrors = menuItemFormErrors[storeId] ?? {}

  return (
    <label className="full">
      <span>菜品说明</span>
      <textarea
        aria-invalid={Boolean(storeMenuItemErrors.description)}
        className={getMerchantFieldClassName(Boolean(storeMenuItemErrors.description))}
        id={getMenuItemFieldId(storeId, MENU_ITEM_FORM_FIELD.description)}
        placeholder="例如：招牌红烧牛腩，含主食与配菜"
        rows={3}
        value={menuItemDraft.description}
        onChange={(event) => {
          setMenuItemDrafts((current) => ({ ...current, [storeId]: { ...getMenuItemDraft(storeId), description: event.target.value } }))
          setMenuItemFormErrors((current) => ({ ...current, [storeId]: { ...(current[storeId] ?? {}), description: undefined } }))
        }}
      />
      {storeMenuItemErrors.description ? <small className="field-error-text">{storeMenuItemErrors.description}</small> : null}
    </label>
  )
}

export function MerchantMenuBasicFields(props: MerchantMenuBasicFieldsProps) {
  return (
    <>
      <MerchantMenuNameField {...props} />
      <MerchantMenuPriceField {...props} />
      <MerchantMenuStockField {...props} />
      <MerchantMenuDescriptionField {...props} />
    </>
  )
}
