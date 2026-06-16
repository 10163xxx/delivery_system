import type {
  AddressText,
  DeliveryCoordinate,
  DisplayText,
  ImageUrl,
  MerchantRegistrationRequest,
  Minutes,
  NoteText,
} from '@/objects/core/SharedObjects'
import {
  MAX_ADDRESS_LENGTH,
  MAX_MERCHANT_NAME_LENGTH,
  MAX_PREP_MINUTES,
  MAX_STORE_CATEGORY_LENGTH,
  MAX_STORE_NAME_LENGTH,
  MAX_TICKET_NOTE_LENGTH,
  MIN_PREP_MINUTES,
} from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import { asDomainNumber, asDomainText, normalizeTextInput } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import type { MerchantDraft } from '@/pages/DeliveryConsole/objects/DeliveryDraftObjects'
import { optionalDomainText } from '@/pages/DeliveryConsole/functions/payloads/DeliveryPayloadFields'

export function buildMerchantRegistrationPayload(
  draft: MerchantDraft,
  location?: DeliveryCoordinate,
): MerchantRegistrationRequest {
  const merchantName = normalizeTextInput(draft.merchantName, MAX_MERCHANT_NAME_LENGTH)
  const storeName = normalizeTextInput(draft.storeName, MAX_STORE_NAME_LENGTH)
  const category = normalizeTextInput(draft.category, MAX_STORE_CATEGORY_LENGTH)
  const storeAddress = normalizeTextInput(draft.storeAddress, MAX_ADDRESS_LENGTH)
  const imageUrl = draft.imageUrl.trim()
  const note = normalizeTextInput(draft.note, MAX_TICKET_NOTE_LENGTH)

  return {
    merchantName: asDomainText<MerchantRegistrationRequest['merchantName']>(merchantName),
    storeName: asDomainText<DisplayText>(storeName),
    category: category as MerchantRegistrationRequest['category'],
    storeAddress: asDomainText<AddressText>(storeAddress),
    location,
    businessHours: { openTime: draft.openTime, closeTime: draft.closeTime },
    avgPrepMinutes: asDomainNumber<Minutes>(
      Math.max(
        MIN_PREP_MINUTES,
        Math.min(MAX_PREP_MINUTES, Math.round(draft.avgPrepMinutes)),
      ),
    ),
    imageUrl: optionalDomainText<ImageUrl>(imageUrl),
    note: optionalDomainText<NoteText>(note),
  }
}
