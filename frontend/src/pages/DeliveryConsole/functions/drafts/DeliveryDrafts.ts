import { AFTER_SALES_REQUEST_TYPE, AFTER_SALES_RESOLUTION_MODE, PAYOUT_ACCOUNT_TYPE, type Store } from '@/objects/core/SharedObjects'
import type {
  ApprovalFlag,
  AccountHolderName,
  AccountNumber,
  AddressText,
  BankName,
  DescriptionText,
  DisplayText,
  ImageUrl,
  NoteText,
  PersonName,
  PhoneNumber,
  ReasonText,
} from '@/objects/core/SharedObjects'
import {
  DEFAULT_MERCHANT_PREP_MINUTES,
  DEFAULT_PARTIAL_REFUND_QUANTITY,
  DEFAULT_REVIEW_RATING,
  DEFAULT_STORE_CLOSE_TIME,
  DEFAULT_STORE_OPEN_TIME,
  AFTER_SALES_APPROVED_NOTE,
} from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import type {
  AfterSalesDraft,
  AfterSalesResolutionDraft,
  MenuItemDraft,
  MerchantDraft,
  PartialRefundDraft,
  ReviewDraft,
} from '@/pages/DeliveryConsole/objects/DeliveryDraftObjects'
import type { MerchantProfileDraft } from '@/pages/DeliveryConsole/objects/MerchantWorkspaceObjects'
import { asDomainBoolean, asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'

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
  return {
    rating: DEFAULT_REVIEW_RATING,
    comment: asDomainText<ReasonText>(''),
    extraNote: asDomainText<NoteText>(''),
  }
}

export function createInitialMenuItemDraft(): MenuItemDraft {
  return {
    ...createInitialMenuItemContentDraft(),
    ...createInitialMenuItemPricingDraft(),
    ...createInitialMenuItemAssetDraft(),
  }
}

export function createInitialPartialRefundDraft(): PartialRefundDraft {
  return {
    quantity: DEFAULT_PARTIAL_REFUND_QUANTITY,
    reason: asDomainText<ReasonText>(''),
  }
}

export function createInitialAfterSalesDraft(): AfterSalesDraft {
  return {
    requestType: AFTER_SALES_REQUEST_TYPE.compensationRequest,
    reason: asDomainText<ReasonText>(''),
    expectedCompensationYuan: asDomainText<DisplayText>(''),
  }
}

export function createInitialAfterSalesResolutionDraft(): AfterSalesResolutionDraft {
  return {
    approved: asDomainBoolean<ApprovalFlag>(true),
    resolutionNote: AFTER_SALES_APPROVED_NOTE,
    resolutionMode: AFTER_SALES_RESOLUTION_MODE.balance,
    actualCompensationYuan: asDomainText<DisplayText>(''),
  }
}

export function createInitialMerchantProfileDraft(): MerchantProfileDraft {
  return {
    contactPhone: asDomainText<PhoneNumber>(''),
    payoutAccountType: PAYOUT_ACCOUNT_TYPE.alipay,
    bankName: asDomainText<BankName>(''),
    accountNumber: asDomainText<AccountNumber>(''),
    accountHolder: asDomainText<AccountHolderName>(''),
  }
}

function createInitialMerchantIdentityDraft(merchantName = '') {
  return {
    merchantName: asDomainText<PersonName>(merchantName),
    storeName: asDomainText<DisplayText>(''),
    category: asDomainText<import('@/pages/DeliveryConsole/objects/DeliveryDraftObjects').EmptySelection>(''),
    storeAddress: asDomainText<AddressText>(''),
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
    imageUrl: asDomainText<ImageUrl>(''),
    uploadedImageName: asDomainText<DisplayText>(''),
    note: asDomainText<NoteText>(''),
  }
}

function createInitialMenuItemContentDraft() {
  return {
    name: asDomainText<DisplayText>(''),
    category: asDomainText<DisplayText>(''),
    description: asDomainText<DescriptionText>(''),
  }
}

function createInitialMenuItemPricingDraft() {
  return {
    priceYuan: asDomainText<DisplayText>(''),
    remainingQuantity: asDomainText<DisplayText>(''),
  }
}

function createInitialMenuItemAssetDraft() {
  return {
    imageUrl: asDomainText<ImageUrl>(''),
    uploadedImageName: asDomainText<DisplayText>(''),
    selectionGroupsText: asDomainText<DisplayText>(''),
  }
}
