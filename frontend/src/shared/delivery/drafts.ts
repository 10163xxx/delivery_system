import { AFTER_SALES_REQUEST_TYPE, AFTER_SALES_RESOLUTION_MODE, PAYOUT_ACCOUNT_TYPE, type Store } from '@/shared/object'
import {
  DEFAULT_MERCHANT_PREP_MINUTES,
  DEFAULT_PARTIAL_REFUND_QUANTITY,
  DEFAULT_REVIEW_RATING,
  DEFAULT_STORE_CLOSE_TIME,
  DEFAULT_STORE_OPEN_TIME,
  AFTER_SALES_APPROVED_NOTE,
} from './constants'
import type {
  AfterSalesDraft,
  AfterSalesResolutionDraft,
  MenuItemDraft,
  MerchantDraft,
  MerchantProfileDraft,
  PartialRefundDraft,
  ReviewDraft,
} from '@/shared/delivery-app/object'

export function getInitialQuantities(store?: Store): Record<string, number> {
  return Object.fromEntries(store?.menu.map((item) => [item.id, 0]) ?? [])
}

export function createInitialMerchantDraft(merchantName = ''): MerchantDraft {
  return {
    merchantName,
    storeName: '',
    category: '',
    openTime: DEFAULT_STORE_OPEN_TIME,
    closeTime: DEFAULT_STORE_CLOSE_TIME,
    avgPrepMinutes: DEFAULT_MERCHANT_PREP_MINUTES,
    imageUrl: '',
    uploadedImageName: '',
    note: '',
  }
}

export function createInitialReviewDraft(): ReviewDraft {
  return { rating: DEFAULT_REVIEW_RATING, comment: '', extraNote: '' }
}

export function createInitialMenuItemDraft(): MenuItemDraft {
  return {
    name: '',
    description: '',
    priceYuan: '',
    remainingQuantity: '',
    imageUrl: '',
    uploadedImageName: '',
  }
}

export function createInitialPartialRefundDraft(): PartialRefundDraft {
  return { quantity: DEFAULT_PARTIAL_REFUND_QUANTITY, reason: '' }
}

export function createInitialAfterSalesDraft(): AfterSalesDraft {
  return {
    requestType: AFTER_SALES_REQUEST_TYPE.compensationRequest,
    reason: '',
    expectedCompensationYuan: '',
  }
}

export function createInitialAfterSalesResolutionDraft(): AfterSalesResolutionDraft {
  return {
    approved: true,
    resolutionNote: AFTER_SALES_APPROVED_NOTE,
    resolutionMode: AFTER_SALES_RESOLUTION_MODE.balance,
    actualCompensationYuan: '',
  }
}

export function createInitialMerchantProfileDraft(): MerchantProfileDraft {
  return {
    contactPhone: '',
    payoutAccountType: PAYOUT_ACCOUNT_TYPE.alipay,
    bankName: '',
    accountNumber: '',
    accountHolder: '',
  }
}
