import type { Dispatch, SetStateAction } from 'react'
import { updateStoreOperationalInfo } from '@/system/api/SharedApi'
import type {
  AddressText,
  Minutes,
  Store,
} from '@/objects/core/SharedObjects'
import { asDomainNumber, asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import { DELIVERY_CONSOLE_MESSAGES } from '@/pages/DeliveryConsole/functions/shared/DeliveryMessages'
import {
  MAX_PREP_MINUTES,
  MIN_PREP_MINUTES,
  MINUTES_PER_HOUR,
} from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import { isValidBusinessTime, normalizeWhitespace } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import { geocodeDeliveryAddress } from '@/pages/DeliveryConsole/functions/map/DeliveryGeocoding'
import type {
  MerchantConsoleStateArgs,
  StoreOperationDraft,
  StoreOperationErrorMap,
  StoreOperationErrors,
} from '@/pages/MerchantConsole/objects/MerchantConsoleObjects'
import { toDisplayText } from '@/pages/MerchantConsole/functions/merchantConsole/MerchantConsoleValueHelpers'

export function buildStoreOperationDraft(store: Store): StoreOperationDraft {
  return {
    storeAddress: store.storeAddress,
    openTime: store.businessHours.openTime,
    closeTime: store.businessHours.closeTime,
    avgPrepMinutes: toDisplayText(String(store.avgPrepMinutes)),
  }
}

function businessTimeToMinutes(value: string) {
  if (!isValidBusinessTime(value)) return Number.NaN
  const [hours, minutes] = value.split(':').map(Number)
  if (hours == null || minutes == null) return Number.NaN
  return hours * MINUTES_PER_HOUR + minutes
}

export function validateStoreOperationDraft(draft: StoreOperationDraft): StoreOperationErrors {
  const storeAddress = normalizeWhitespace(draft.storeAddress).trim()
  const avgPrepMinutes = Number(draft.avgPrepMinutes.trim())
  const businessHoursError =
    !isValidBusinessTime(draft.openTime) || !isValidBusinessTime(draft.closeTime)
      ? DELIVERY_CONSOLE_MESSAGES.merchant.businessHoursInvalid
      : businessTimeToMinutes(draft.openTime) >= businessTimeToMinutes(draft.closeTime)
        ? DELIVERY_CONSOLE_MESSAGES.merchant.businessHoursOrderInvalid
        : undefined

  return {
    storeAddress: storeAddress ? undefined : toDisplayText(DELIVERY_CONSOLE_MESSAGES.merchant.storeAddressRequired),
    openTime: businessHoursError ? toDisplayText(businessHoursError) : undefined,
    closeTime: businessHoursError ? toDisplayText(businessHoursError) : undefined,
    avgPrepMinutes:
      Number.isInteger(avgPrepMinutes) &&
      avgPrepMinutes >= MIN_PREP_MINUTES &&
      avgPrepMinutes <= MAX_PREP_MINUTES
        ? undefined
        : toDisplayText(DELIVERY_CONSOLE_MESSAGES.merchant.prepMinutesInvalid),
  }
}

export function createStoreOperationActions({
  getStoreOperationDraft,
  runAction,
  setStoreOperationErrors,
}: Pick<MerchantConsoleStateArgs, 'runAction'> & {
  getStoreOperationDraft: (store: Store) => StoreOperationDraft
  setStoreOperationErrors: Dispatch<SetStateAction<StoreOperationErrorMap>>
}) {
  async function submitStoreOperationalInfo(store: Store) {
    const draft = getStoreOperationDraft(store)
    const errors = validateStoreOperationDraft(draft)
    if (errors.storeAddress || errors.openTime || errors.closeTime || errors.avgPrepMinutes) {
      setStoreOperationErrors((current) => ({ ...current, [store.id]: errors }))
      return
    }
    const storeAddress = normalizeWhitespace(draft.storeAddress).trim()
    const location = await geocodeDeliveryAddress(storeAddress)
    if (!location) {
      setStoreOperationErrors((current) => ({
        ...current,
        [store.id]: {
          ...errors,
          storeAddress: toDisplayText(DELIVERY_CONSOLE_MESSAGES.profile.addressLocationRequired),
        },
      }))
      return
    }
    const success = await runAction(() =>
      updateStoreOperationalInfo(store.id, {
        storeAddress: asDomainText<AddressText>(storeAddress),
        location,
        businessHours: { openTime: draft.openTime, closeTime: draft.closeTime },
        avgPrepMinutes: asDomainNumber<Minutes>(Number(draft.avgPrepMinutes.trim())),
      }),
    )
    if (!success) return
    setStoreOperationErrors((current) => {
      const next = { ...current }
      delete next[store.id]
      return next
    })
  }

  return { submitStoreOperationalInfo }
}
