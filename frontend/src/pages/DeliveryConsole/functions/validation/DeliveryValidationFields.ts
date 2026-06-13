import type { MenuItemFormField, MerchantFormField } from '@/pages/DeliveryConsole/objects/MerchantWorkspaceObjects'

export function getMerchantFieldId(field: MerchantFormField) {
  return `merchant-application-${field}`
}

export function getMenuItemFieldId(storeId: string, field: MenuItemFormField) {
  return `store-menu-${storeId}-${field}`
}

export function getMerchantFieldClassName(hasError: boolean, className = '') {
  return [className, hasError ? 'field-error' : ''].filter(Boolean).join(' ')
}
