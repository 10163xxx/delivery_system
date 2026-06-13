import type { CustomerRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import type { CustomerRolePanelProps } from '@/pages/CustomerConsole/objects/CustomerPanelObjects'
import { Panel } from '@/pages/DeliveryConsole/components/primitives/LayoutPrimitives'
import {
  ROUTE_PATH,
  type AddressEntry,
  type AddressLabel,
  type AddressText,
} from '@/objects/core/SharedObjects'
import { CUSTOMER_PROFILE_COPY } from '@/pages/CustomerConsole/components/profile/CustomerProfileCopy'
import { asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'

function ReturnToProfileButton({ navigate }: Pick<CustomerRoleProps, 'navigate'>) {
  return (
    <button className="secondary-button" onClick={() => navigate(ROUTE_PATH.customerProfile)} type="button">
      {CUSTOMER_PROFILE_COPY.returnToProfileButton}
    </button>
  )
}

function AddressActions({
  address,
  defaultAddress,
  removeCustomerAddress,
  setDefaultCustomerAddress,
}: {
  address: AddressEntry
  defaultAddress: string
  removeCustomerAddress: CustomerRoleProps['removeCustomerAddress']
  setDefaultCustomerAddress: CustomerRoleProps['setDefaultCustomerAddress']
}) {
  const isDefaultAddress = address.address === defaultAddress
  const isLocatedAddress = Boolean(address.location)

  return (
    <>
      <div className="action-row" style={{ marginTop: '16px' }}>
        {!isDefaultAddress ? (
          <button
            className="secondary-button"
            disabled={!isLocatedAddress}
            onClick={() => void setDefaultCustomerAddress(address.address)}
            type="button"
          >
            {CUSTOMER_PROFILE_COPY.addressSetDefaultButton}
          </button>
        ) : null}
        <button
          className="secondary-button"
          disabled={isDefaultAddress}
          onClick={() => void removeCustomerAddress(address.address)}
          type="button"
        >
          {CUSTOMER_PROFILE_COPY.addressDeleteButton}
        </button>
      </div>
      {isDefaultAddress ? (
        <p className="meta-line" style={{ marginTop: '12px' }}>
          {CUSTOMER_PROFILE_COPY.addressDefaultDeleteHint}
        </p>
      ) : null}
      {!isLocatedAddress ? (
        <p className="meta-line" style={{ marginTop: '12px' }}>
          {CUSTOMER_PROFILE_COPY.addressUnlocatedHint}
        </p>
      ) : null}
    </>
  )
}

function AddressCards({
  addresses,
  defaultAddress,
  removeCustomerAddress,
  setDefaultCustomerAddress,
}: {
  addresses: AddressEntry[]
  defaultAddress: string
  removeCustomerAddress: CustomerRoleProps['removeCustomerAddress']
  setDefaultCustomerAddress: CustomerRoleProps['setDefaultCustomerAddress']
}) {
  return (
    <>
      {addresses.map((address: AddressEntry) => (
        <article key={`${address.label}-${address.address}`} className="ticket-card">
          <div className="ticket-header">
            <div>
              <p className="ticket-kind">{CUSTOMER_PROFILE_COPY.addressBookTicketKind}</p>
              <h3>{address.label}</h3>
            </div>
            <span className="badge">
              {address.address === defaultAddress
                ? CUSTOMER_PROFILE_COPY.defaultBadge
                : address.location
                  ? CUSTOMER_PROFILE_COPY.addressSavedBadge
                  : CUSTOMER_PROFILE_COPY.addressUnlocatedBadge}
            </span>
          </div>
          <p>{address.address}</p>
          <AddressActions
            address={address}
            defaultAddress={defaultAddress}
            removeCustomerAddress={removeCustomerAddress}
            setDefaultCustomerAddress={setDefaultCustomerAddress}
          />
        </article>
      ))}
    </>
  )
}

export function CustomerProfileAddressesPanel({ props }: CustomerRolePanelProps) {
  const {
    addCustomerAddress,
    addressDraft,
    addressFormErrors,
    navigate,
    removeCustomerAddress,
    selectedCustomer,
    setAddressDraft,
    setAddressFormErrors,
    setDefaultCustomerAddress,
  } = props

  return (
    <Panel
      title={CUSTOMER_PROFILE_COPY.addressPageTitle}
      description={CUSTOMER_PROFILE_COPY.addressDescription}
    >
      {selectedCustomer ? (
        <>
          <div className="summary-bar">
            <div>
              <p>{CUSTOMER_PROFILE_COPY.defaultAddressLabel}</p>
              <strong>{selectedCustomer.defaultAddress}</strong>
            </div>
            <div>
              <p>{CUSTOMER_PROFILE_COPY.addressCountLabel}</p>
              <strong>{selectedCustomer.addresses.length}</strong>
            </div>
            <ReturnToProfileButton navigate={navigate} />
          </div>
          <div className="form-grid">
            <label>
              <span>{CUSTOMER_PROFILE_COPY.addressLabelField}</span>
              <input
                className={addressFormErrors.label ? 'field-error' : undefined}
                value={addressDraft.label}
                onChange={(event) => {
                  setAddressDraft((current) => ({ ...current, label: asDomainText<AddressLabel>(event.target.value) }))
                  setAddressFormErrors((current) => ({ ...current, label: undefined }))
                }}
              />
              {addressFormErrors.label ? (
                <span className="field-error-text">{addressFormErrors.label}</span>
              ) : null}
            </label>
            <label className="full">
              <span>{CUSTOMER_PROFILE_COPY.addressNewField}</span>
              <input
                className={addressFormErrors.address ? 'field-error' : undefined}
                value={addressDraft.address}
                onChange={(event) => {
                  setAddressDraft((current) => ({ ...current, address: asDomainText<AddressText>(event.target.value) }))
                  setAddressFormErrors((current) => ({ ...current, address: undefined }))
                }}
              />
              {addressFormErrors.address ? (
                <span className="field-error-text">{addressFormErrors.address}</span>
              ) : null}
            </label>
          </div>
          <div className="summary-bar">
            <button className="secondary-button" onClick={() => void addCustomerAddress()} type="button">
              {CUSTOMER_PROFILE_COPY.addressAddButton}
            </button>
          </div>
          <div className="ticket-grid">
            <AddressCards
              addresses={selectedCustomer.addresses}
              defaultAddress={selectedCustomer.defaultAddress}
              removeCustomerAddress={removeCustomerAddress}
              setDefaultCustomerAddress={setDefaultCustomerAddress}
            />
          </div>
        </>
      ) : null}
    </Panel>
  )
}
