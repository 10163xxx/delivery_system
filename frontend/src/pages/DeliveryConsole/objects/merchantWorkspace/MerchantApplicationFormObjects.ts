export const MERCHANT_FORM_FIELD = {
  merchantName: 'merchantName',
  storeName: 'storeName',
  category: 'category',
  storeAddress: 'storeAddress',
  openTime: 'openTime',
  closeTime: 'closeTime',
  imageUrl: 'imageUrl',
} as const

export type MerchantFormField =
  (typeof MERCHANT_FORM_FIELD)[keyof typeof MERCHANT_FORM_FIELD]
