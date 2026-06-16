import type { NavigateFunction } from 'react-router-dom'
import {
  CustomerCheckoutActionBar,
  CustomerCheckoutFormFields,
  CustomerCheckoutPaymentSummary,
  CustomerCheckoutPriceSummary,
} from '@/pages/CustomerConsole/components/checkout/CustomerCheckoutBlocks'
import { CustomerDeliveryRoutePanel } from '@/pages/CustomerConsole/components/checkout/CustomerDeliveryRoutePanel'
import {
  CUSTOMER_CHECKOUT_COPY,
} from '@/pages/CustomerConsole/components/checkout/CustomerCheckoutCopy'
import type { CheckoutPanelProps } from '@/pages/CustomerConsole/objects/CustomerCheckoutObjects'
import { Panel } from '@/pages/DeliveryConsole/components/primitives/LayoutPrimitives'
import { ROUTE_PATH } from '@/objects/core/SharedObjects'
import { buildCustomerOrderStoreRoute } from '@/pages/DeliveryConsole/objects/CustomerWorkspaceObjects'
import { getSelectedCartLines } from '@/pages/DeliveryConsole/functions/cart/DeliveryCartLines'
import { getMenuItemConfiguredUnitPriceCents } from '@/pages/DeliveryConsole/functions/cart/DeliveryMenuPricing'
import { hasSelectedRequiredCategoryItem, storeHasRequiredMenuCategory } from '@/pages/DeliveryConsole/functions/payloads/DeliveryPayloadCustomer'

function getSelectedCartItems(props: CheckoutPanelProps) {
  return getSelectedCartLines(
    props.selectedStore,
    props.quantities,
    props.selectedMenuItemConfigurations,
  )
}

type SelectedCartItem = ReturnType<typeof getSelectedCartItems>[number]

function CustomerCartPanelHeader({
  navigate,
  selectedStore,
}: Pick<CheckoutPanelProps, 'selectedStore'> & { navigate: NavigateFunction }) {
  return (
    <div className="checkout-panel-header">
      <div>
        <p className="ticket-kind">{CUSTOMER_CHECKOUT_COPY.panel.checkoutTicketKind}</p>
        <h3>{CUSTOMER_CHECKOUT_COPY.panel.checkoutTitle}</h3>
        <p className="meta-line">{CUSTOMER_CHECKOUT_COPY.cart.headerDescription}</p>
      </div>
      <button
        className="secondary-button"
        onClick={() =>
          navigate(
            selectedStore
              ? buildCustomerOrderStoreRoute(selectedStore.id)
              : ROUTE_PATH.customerOrder,
          )}
        type="button"
      >
        {CUSTOMER_CHECKOUT_COPY.cart.backToMenu}
      </button>
    </div>
  )
}

function CustomerCartItemRow({
  formatPrice,
  line,
  updateCartLineQuantity,
}: Pick<CheckoutPanelProps, 'formatPrice' | 'updateCartLineQuantity'> & { line: SelectedCartItem }) {
  return (
    <div className="customer-cart-item-row">
      <div>
        <strong>{line.item.name}</strong>
        <p className="meta-line">
          {line.configuration?.summaryText || CUSTOMER_CHECKOUT_COPY.cart.defaultSelectionSummary}
        </p>
      </div>
      <div className="customer-cart-item-actions">
        <button
          className="secondary-button"
          onClick={() => updateCartLineQuantity(line.item, line.lineKey, line.quantity - 1)}
          type="button"
        >
          {CUSTOMER_CHECKOUT_COPY.cart.decreaseQuantityButton}
        </button>
        <strong>{line.quantity}</strong>
        <button
          className="secondary-button"
          onClick={() => updateCartLineQuantity(line.item, line.lineKey, line.quantity + 1)}
          type="button"
        >
          {CUSTOMER_CHECKOUT_COPY.cart.increaseQuantityButton}
        </button>
        <strong>
          {formatPrice(
            getMenuItemConfiguredUnitPriceCents(line.item, line.configuration) * line.quantity,
          )}
        </strong>
      </div>
    </div>
  )
}

function CustomerCartItemsPanel({
  formatPrice,
  hasRequiredCategorySelection,
  requiresRequiredCategory,
  selectedItems,
  updateCartLineQuantity,
}: Pick<CheckoutPanelProps, 'formatPrice' | 'updateCartLineQuantity'> & {
  hasRequiredCategorySelection: boolean
  requiresRequiredCategory: boolean
  selectedItems: SelectedCartItem[]
}) {
  return (
    <div className="summary-bar checkout-summary customer-cart-items">
      <div className="full customer-cart-items-header">
        <p>{CUSTOMER_CHECKOUT_COPY.cart.itemListTitle}</p>
        <strong>{`${selectedItems.length}${CUSTOMER_CHECKOUT_COPY.cart.itemCountSuffix}`}</strong>
      </div>
      {requiresRequiredCategory ? (
        <div className="full">
          <p className="meta-line">
            {hasRequiredCategorySelection
              ? CUSTOMER_CHECKOUT_COPY.cart.requiredCategorySelectedHint
              : CUSTOMER_CHECKOUT_COPY.cart.requiredCategoryMissingHint}
          </p>
        </div>
      ) : null}
      {selectedItems.map((line) => (
        <CustomerCartItemRow
          key={line.lineKey}
          formatPrice={formatPrice}
          line={line}
          updateCartLineQuantity={updateCartLineQuantity}
        />
      ))}
    </div>
  )
}

export function CustomerCartWorkspace(props: CheckoutPanelProps & { navigate: NavigateFunction }) {
  const { formatPrice, navigate, quantities, selectedMenuItemConfigurations, selectedStore, updateCartLineQuantity } = props
  const selectedItems = getSelectedCartItems(props)
  const requiresRequiredCategory = selectedStore ? storeHasRequiredMenuCategory(selectedStore) : false
  const hasRequiredCategorySelection =
    selectedStore ? hasSelectedRequiredCategoryItem(selectedStore, quantities, selectedMenuItemConfigurations) : false

  return (
    <Panel
      title={
        selectedStore
          ? CUSTOMER_CHECKOUT_COPY.cart.cartTitleWithStore(selectedStore.name)
          : CUSTOMER_CHECKOUT_COPY.cart.cartTitle
      }
      description={CUSTOMER_CHECKOUT_COPY.cart.pageDescription}
    >
      <section className="checkout-panel">
        <CustomerCartPanelHeader navigate={navigate} selectedStore={selectedStore} />
        <CustomerCartItemsPanel
          formatPrice={formatPrice}
          hasRequiredCategorySelection={hasRequiredCategorySelection}
          requiresRequiredCategory={requiresRequiredCategory}
          selectedItems={selectedItems}
          updateCartLineQuantity={updateCartLineQuantity}
        />
        <CustomerDeliveryRoutePanel {...props} />
        <div className="form-grid">
          <CustomerCheckoutFormFields {...props} />
          <CustomerCheckoutPriceSummary {...props} />
          <CustomerCheckoutPaymentSummary {...props} />
          <CustomerCheckoutActionBar {...props} />
        </div>
      </section>
    </Panel>
  )
}
