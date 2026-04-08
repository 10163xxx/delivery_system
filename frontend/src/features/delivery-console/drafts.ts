import type { Store } from '@/domain'
import {
  DEFAULT_MERCHANT_PREP_MINUTES,
  DEFAULT_PARTIAL_REFUND_QUANTITY,
  DEFAULT_REVIEW_RATING,
} from './constants'
import type {
  AfterSalesDraft,
  AfterSalesResolutionDraft,
  MenuItemDraft,
  MerchantDraft,
  MerchantProfileDraft,
  PartialRefundDraft,
  ReviewDraft,
} from './types'

export function getInitialQuantities(store?: Store): Record<string, number> {
  return Object.fromEntries(store?.menu.map((item) => [item.id, 0]) ?? [])
}

export function createInitialMerchantDraft(merchantName = ''): MerchantDraft {
  return {
    merchantName,
    storeName: '',
    category: '',
    openTime: '09:00',
    closeTime: '21:00',
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
    requestType: 'CompensationRequest',
    reason: '',
    expectedCompensationYuan: '',
  }
}

export function createInitialAfterSalesResolutionDraft(): AfterSalesResolutionDraft {
  return {
    approved: true,
    resolutionNote: '售后申请核实通过',
    resolutionMode: 'Balance',
    actualCompensationYuan: '',
  }
}

export function createInitialMerchantProfileDraft(): MerchantProfileDraft {
  return {
    contactPhone: '',
    payoutAccountType: 'alipay',
    bankName: '',
    accountNumber: '',
    accountHolder: '',
  }
}
