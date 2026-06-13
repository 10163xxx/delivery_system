import type { CustomerRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import type { CustomerRolePanelProps } from '@/pages/CustomerConsole/objects/CustomerPanelObjects'
import { Panel } from '@/pages/DeliveryConsole/components/primitives/LayoutPrimitives'
import { ROUTE_PATH, STORE_STATUS, type Store } from '@/objects/core/SharedObjects'
import { CUSTOMER_PROFILE_COPY } from '@/pages/CustomerConsole/components/profile/CustomerProfileCopy'

function ReturnToProfileButton({ navigate }: Pick<CustomerRoleProps, 'navigate'>) {
  return (
    <button className="secondary-button" onClick={() => navigate(ROUTE_PATH.customerProfile)} type="button">
      {CUSTOMER_PROFILE_COPY.returnToProfileButton}
    </button>
  )
}

function FavoriteStoreCards({
  favoriteStores,
  formatAggregateRating,
  formatStoreAvailability,
  enterStore,
  isStoreCurrentlyOpen,
  toggleFavoriteStore,
  toggleBlockedStore,
}: {
  favoriteStores: Store[]
  formatAggregateRating: CustomerRoleProps['formatAggregateRating']
  formatStoreAvailability: CustomerRoleProps['formatStoreAvailability']
  enterStore: CustomerRoleProps['enterStore']
  isStoreCurrentlyOpen: CustomerRoleProps['isStoreCurrentlyOpen']
  toggleFavoriteStore: CustomerRoleProps['toggleFavoriteStore']
  toggleBlockedStore: CustomerRoleProps['toggleBlockedStore']
}) {
  if (favoriteStores.length === 0) {
    return <div className="empty-card">{CUSTOMER_PROFILE_COPY.favoriteStoreEmptyState}</div>
  }

  return (
    <>
      {favoriteStores.map((store) => {
        const disabled =
          store.status === STORE_STATUS.revoked || !isStoreCurrentlyOpen(store) || store.menu.length === 0

        return (
          <article key={store.id} className="ticket-card">
            <div className="ticket-header">
              <div>
                <p className="ticket-kind">{store.category}</p>
                <h3>{store.name}</h3>
              </div>
              <span className="badge success">{CUSTOMER_PROFILE_COPY.favoriteStoreBadge}</span>
            </div>
            <p>{store.merchantName}</p>
            <p className="meta-line">
              {formatStoreAvailability(store)}
              {' · '}
              {formatAggregateRating(store.averageRating, store.ratingCount)}
            </p>
            <div className="action-row" style={{ marginTop: '16px' }}>
              <button
                className="primary-button"
                disabled={disabled}
                onClick={() => enterStore(store.id)}
                type="button"
              >
                {CUSTOMER_PROFILE_COPY.favoriteStoreEnterButton}
              </button>
              <button
                className="secondary-button"
                onClick={() => toggleFavoriteStore(store.id)}
                type="button"
              >
                {CUSTOMER_PROFILE_COPY.favoriteStoreRemoveButton}
              </button>
              <button
                className="secondary-button"
                onClick={() => toggleBlockedStore(store.id)}
                type="button"
              >
                {CUSTOMER_PROFILE_COPY.favoriteStoreBlockButton}
              </button>
            </div>
          </article>
        )
      })}
    </>
  )
}

function BlockedStoreCards({
  blockedStores,
  formatAggregateRating,
  toggleBlockedStore,
}: {
  blockedStores: Store[]
  formatAggregateRating: CustomerRoleProps['formatAggregateRating']
  toggleBlockedStore: CustomerRoleProps['toggleBlockedStore']
}) {
  if (blockedStores.length === 0) {
    return <div className="empty-card">{CUSTOMER_PROFILE_COPY.blockedStoreEmptyState}</div>
  }

  return (
    <>
      {blockedStores.map((store) => (
        <article key={store.id} className="ticket-card">
          <div className="ticket-header">
            <div>
              <p className="ticket-kind">{store.category}</p>
              <h3>{store.name}</h3>
            </div>
            <span className="badge warning">{CUSTOMER_PROFILE_COPY.blockedStoreBadge}</span>
          </div>
          <p>{store.merchantName}</p>
          <p className="meta-line">{formatAggregateRating(store.averageRating, store.ratingCount)}</p>
          <div className="action-row" style={{ marginTop: '16px' }}>
            <button
              className="secondary-button"
              onClick={() => toggleBlockedStore(store.id)}
              type="button"
            >
              {CUSTOMER_PROFILE_COPY.blockedStoreRemoveButton}
            </button>
          </div>
        </article>
      ))}
    </>
  )
}

export function CustomerProfileFavoritesPanel({ props }: CustomerRolePanelProps) {
  const { enterStore, favoriteStores, formatAggregateRating, formatStoreAvailability, isStoreCurrentlyOpen, navigate, selectedCustomer, toggleBlockedStore, toggleFavoriteStore } = props

  return (
    <Panel
      title={CUSTOMER_PROFILE_COPY.favoriteStorePageTitle}
      description={CUSTOMER_PROFILE_COPY.favoriteStoreDescription}
    >
      {selectedCustomer ? (
        <>
          <div className="summary-bar">
            <div>
              <p>{CUSTOMER_PROFILE_COPY.currentAccountLabel}</p>
              <strong>{selectedCustomer.name}</strong>
            </div>
            <div>
              <p>{CUSTOMER_PROFILE_COPY.favoriteStoreCountLabel}</p>
              <strong>{favoriteStores.length}</strong>
            </div>
            <ReturnToProfileButton navigate={navigate} />
          </div>
          <div className="ticket-grid">
            <FavoriteStoreCards
              enterStore={enterStore}
              favoriteStores={favoriteStores}
              formatAggregateRating={formatAggregateRating}
              formatStoreAvailability={formatStoreAvailability}
              isStoreCurrentlyOpen={isStoreCurrentlyOpen}
              toggleBlockedStore={toggleBlockedStore}
              toggleFavoriteStore={toggleFavoriteStore}
            />
          </div>
        </>
      ) : null}
    </Panel>
  )
}

export function CustomerProfileBlockedStoresPanel({ props }: CustomerRolePanelProps) {
  const { blockedStores, formatAggregateRating, navigate, selectedCustomer, toggleBlockedStore } = props

  return (
    <Panel
      title={CUSTOMER_PROFILE_COPY.blockedStorePageTitle}
      description={CUSTOMER_PROFILE_COPY.blockedStoreDescription}
    >
      {selectedCustomer ? (
        <>
          <div className="summary-bar">
            <div>
              <p>{CUSTOMER_PROFILE_COPY.currentAccountLabel}</p>
              <strong>{selectedCustomer.name}</strong>
            </div>
            <div>
              <p>{CUSTOMER_PROFILE_COPY.blockedStoreCountLabel}</p>
              <strong>{blockedStores.length}</strong>
            </div>
            <ReturnToProfileButton navigate={navigate} />
          </div>
          <div className="ticket-grid">
            <BlockedStoreCards
              blockedStores={blockedStores}
              formatAggregateRating={formatAggregateRating}
              toggleBlockedStore={toggleBlockedStore}
            />
          </div>
        </>
      ) : null}
    </Panel>
  )
}
