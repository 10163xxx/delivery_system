import { useState } from 'react'
import type {
  AddressLabel,
  AddressText,
  CouponId,
  DisplayText,
  IsoDateTime,
  MenuItemId,
  PersonName,
} from '@/objects/core/SharedObjects'
import { asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import {
  CUSTOMER_STORE_VISIBILITY,
  type CustomerAddressDraft,
  type CustomerAddressField,
  type CustomerStoreVisibility,
} from '@/pages/DeliveryConsole/objects/CustomerWorkspaceObjects'
import type { MenuItemConfigurationModalState, SelectedMenuItemConfiguration } from '@/pages/DeliveryConsole/objects/DeliveryDraftObjects'

export function useCustomerPageState() {
  const storeState = useCustomerStoreState()
  const checkoutState = useCustomerCheckoutState()
  const profileState = useCustomerProfileState()
  const rechargeState = useCustomerRechargeState()
  const noticeState = useCustomerNoticeState()

  return {
    store: storeState,
    checkout: checkoutState,
    profile: profileState,
    recharge: rechargeState,
    notices: noticeState,
  }
}

function useCustomerStoreState() {
  const [customerStoreSearchDraft, setCustomerStoreSearchDraft] = useState<DisplayText>(asDomainText<DisplayText>(''))
  const [customerStoreSearch, setCustomerStoreSearch] = useState<DisplayText>(asDomainText<DisplayText>(''))
  const [customerStoreVisibility, setCustomerStoreVisibility] =
    useState<CustomerStoreVisibility>(CUSTOMER_STORE_VISIBILITY.orderableOnly)

  return {
    customerStoreSearchDraft,
    setCustomerStoreSearchDraft,
    customerStoreSearch,
    setCustomerStoreSearch,
    customerStoreVisibility,
    setCustomerStoreVisibility,
  }
}

function useCustomerCheckoutState() {
  const [deliveryAddress, setDeliveryAddress] = useState<AddressText>(asDomainText<AddressText>(''))
  const [deliveryAddressError, setDeliveryAddressError] = useState<DisplayText | null>(null)
  const [scheduledDeliveryTime, setScheduledDeliveryTime] = useState<IsoDateTime | DisplayText>(asDomainText<DisplayText>(''))
  const [scheduledDeliveryError, setScheduledDeliveryError] = useState<DisplayText | null>(null)
  const [scheduledDeliveryTouched, setScheduledDeliveryTouched] = useState(false)
  const [remark, setRemark] = useState<DisplayText>(asDomainText<DisplayText>(''))
  const [isCheckoutExpanded, setIsCheckoutExpanded] = useState(false)
  const [selectedCouponId, setSelectedCouponId] = useState<CouponId | ''>('')
  const [quantities, setQuantities] = useState<Record<MenuItemId, number>>({})
  const [selectedMenuItemConfigurations, setSelectedMenuItemConfigurations] = useState<
    Record<MenuItemId, SelectedMenuItemConfiguration>
  >({})
  const [menuItemConfigurationModal, setMenuItemConfigurationModal] =
    useState<MenuItemConfigurationModalState | null>(null)

  return {
    deliveryAddress,
    setDeliveryAddress,
    deliveryAddressError,
    setDeliveryAddressError,
    scheduledDeliveryTime,
    setScheduledDeliveryTime,
    scheduledDeliveryError,
    setScheduledDeliveryError,
    scheduledDeliveryTouched,
    setScheduledDeliveryTouched,
    remark,
    setRemark,
    isCheckoutExpanded,
    setIsCheckoutExpanded,
    selectedCouponId,
    setSelectedCouponId,
    quantities,
    setQuantities,
    selectedMenuItemConfigurations,
    setSelectedMenuItemConfigurations,
    menuItemConfigurationModal,
    setMenuItemConfigurationModal,
  }
}

function useCustomerProfileState() {
  const [customerNameDraft, setCustomerNameDraft] = useState<PersonName>(asDomainText<PersonName>(''))
  const [addressDraft, setAddressDraft] = useState<CustomerAddressDraft>({
    label: asDomainText<AddressLabel>(''),
    address: asDomainText<AddressText>(''),
  })
  const [addressFormErrors, setAddressFormErrors] = useState<
    Partial<Record<CustomerAddressField, DisplayText>>
  >({})

  return {
    customerNameDraft,
    setCustomerNameDraft,
    addressDraft,
    setAddressDraft,
    addressFormErrors,
    setAddressFormErrors,
  }
}

function useCustomerRechargeState() {
  const [customRechargeAmount, setCustomRechargeAmount] = useState<DisplayText>(asDomainText<DisplayText>(''))
  const [selectedRechargeAmount, setSelectedRechargeAmount] = useState<number | null>(null)
  const [rechargeFieldError, setRechargeFieldError] = useState<DisplayText | null>(null)

  return {
    customRechargeAmount,
    setCustomRechargeAmount,
    selectedRechargeAmount,
    setSelectedRechargeAmount,
    rechargeFieldError,
    setRechargeFieldError,
  }
}

function useCustomerNoticeState() {
  const [seenCustomerProfileNoticeIds, setSeenCustomerProfileNoticeIds] = useState<string[]>([])

  return {
    seenCustomerProfileNoticeIds,
    setSeenCustomerProfileNoticeIds,
  }
}
