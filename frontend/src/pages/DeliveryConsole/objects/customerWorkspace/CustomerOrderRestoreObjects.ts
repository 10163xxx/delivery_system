export const ORDER_RESTORE_MODE = {
  cart: 'cart',
  checkout: 'checkout',
} as const

export type OrderRestoreMode =
  (typeof ORDER_RESTORE_MODE)[keyof typeof ORDER_RESTORE_MODE]
