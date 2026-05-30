import { AFTER_SALES_REQUEST_TYPE, AFTER_SALES_RESOLUTION_MODE, PAYOUT_ACCOUNT_TYPE, type Store } from '@/objects/core/SharedObjects'
import {
  DEFAULT_MERCHANT_PREP_MINUTES,
  DEFAULT_PARTIAL_REFUND_QUANTITY,
  DEFAULT_REVIEW_RATING,
  DEFAULT_STORE_CLOSE_TIME,
  DEFAULT_STORE_OPEN_TIME,
  AFTER_SALES_APPROVED_NOTE,
} from './DeliveryConstants'
import type {
  AfterSalesDraft,
  AfterSalesResolutionDraft,
  MenuItemDraft,
  MerchantDraft,
  MerchantProfileDraft,
  PartialRefundDraft,
  ReviewDraft,
} from '@/objects/page/DeliveryAppObjects'

export function getInitialQuantities(store?: Store): Record<string, number> {
  return Object.fromEntries(store?.menu.map((item) => [item.id, 0]) ?? [])
}

export function createInitialMerchantDraft(merchantName = ''): MerchantDraft {
  return {
    ...createInitialMerchantIdentityDraft(merchantName),
    ...createInitialMerchantScheduleDraft(),
    ...createInitialMerchantAssetDraft(),
  }
}

export function createInitialReviewDraft(): ReviewDraft {
  return { rating: DEFAULT_REVIEW_RATING, comment: '', extraNote: '' }
}

export function createInitialMenuItemDraft(): MenuItemDraft {
  return {
    ...createInitialMenuItemContentDraft(),
    ...createInitialMenuItemPricingDraft(),
    ...createInitialMenuItemAssetDraft(),
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

function createInitialMerchantIdentityDraft(merchantName = '') {
  return {
    merchantName,
    storeName: '',
    category: '',
    storeAddress: '',
  }
}

function createInitialMerchantScheduleDraft() {
  return {
    openTime: DEFAULT_STORE_OPEN_TIME,
    closeTime: DEFAULT_STORE_CLOSE_TIME,
    avgPrepMinutes: DEFAULT_MERCHANT_PREP_MINUTES,
  }
}

function createInitialMerchantAssetDraft() {
  return {
    imageUrl: '',
    uploadedImageName: '',
    note: '',
  }
}

function createInitialMenuItemContentDraft() {
  return {
    name: '',
    category: '',
    description: '',
  }
}

function createInitialMenuItemPricingDraft() {
  return {
    priceYuan: '',
    remainingQuantity: '',
  }
}

function createInitialMenuItemAssetDraft() {
  return {
    imageUrl: '',
    uploadedImageName: '',
    selectionGroupsText: '',
  }
}
