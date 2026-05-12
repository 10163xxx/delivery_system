import type { CustomerRoleProps } from '@/shared/app/role-props'
import type { CustomerRolePanelProps } from '@/pages/customer/object/CustomerPageObjects'
import { Panel } from '@/shared/components/primitives/LayoutPrimitives'
import type { AddressEntry } from '@/shared/object/core/SharedObjects'

function ReturnToProfileButton({ navigate }: Pick<CustomerRoleProps, 'navigate'>) {
  return (
    <button className="secondary-button" onClick={() => navigate('/customer/profile')} type="button">
      返回个人信息
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

  return (
    <>
      <div className="action-row" style={{ marginTop: '16px' }}>
        {!isDefaultAddress ? (
          <button
            className="secondary-button"
            onClick={() => void setDefaultCustomerAddress(address.address)}
            type="button"
          >
            设为默认
          </button>
        ) : null}
        <button
          className="secondary-button"
          disabled={isDefaultAddress}
          onClick={() => void removeCustomerAddress(address.address)}
          type="button"
        >
          删除地址
        </button>
      </div>
      {isDefaultAddress ? (
        <p className="meta-line" style={{ marginTop: '12px' }}>
          如需删除当前默认地址，请先把其他地址设为默认。
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
              <p className="ticket-kind">地址簿</p>
              <h3>{address.label}</h3>
            </div>
            <span className="badge">{address.address === defaultAddress ? '默认' : '已保存'}</span>
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
    <Panel title="地址管理" description="把常用地址维护独立出来，个人信息页只保留摘要。">
      {selectedCustomer ? (
        <>
          <div className="summary-bar">
            <div>
              <p>默认地址</p>
              <strong>{selectedCustomer.defaultAddress}</strong>
            </div>
            <div>
              <p>地址数量</p>
              <strong>{selectedCustomer.addresses.length}</strong>
            </div>
            <ReturnToProfileButton navigate={navigate} />
          </div>
          <div className="form-grid">
            <label>
              <span>地址标签</span>
              <input
                className={addressFormErrors.label ? 'field-error' : undefined}
                value={addressDraft.label}
                onChange={(event) => {
                  setAddressDraft((current) => ({ ...current, label: event.target.value }))
                  setAddressFormErrors((current) => ({ ...current, label: undefined }))
                }}
              />
              {addressFormErrors.label ? (
                <span className="field-error-text">{addressFormErrors.label}</span>
              ) : null}
            </label>
            <label className="full">
              <span>新增地址</span>
              <input
                className={addressFormErrors.address ? 'field-error' : undefined}
                value={addressDraft.address}
                onChange={(event) => {
                  setAddressDraft((current) => ({ ...current, address: event.target.value }))
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
              添加地址
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
