export const MERCHANT_WORKSPACE_VIEW = {
  application: 'application',
  store: 'store',
  orders: 'orders',
  profile: 'profile',
} as const

export type MerchantWorkspaceView =
  (typeof MERCHANT_WORKSPACE_VIEW)[keyof typeof MERCHANT_WORKSPACE_VIEW]

export const MERCHANT_APPLICATION_VIEW = {
  pending: 'pending',
  reviewed: 'reviewed',
  submit: 'submit',
} as const

export type MerchantApplicationView =
  (typeof MERCHANT_APPLICATION_VIEW)[keyof typeof MERCHANT_APPLICATION_VIEW]
