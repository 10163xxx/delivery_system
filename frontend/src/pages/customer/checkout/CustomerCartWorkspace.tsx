import type { NavigateFunction } from 'react-router-dom'
import {
  CustomerCheckoutActionBar,
  CustomerCheckoutFormFields,
  CustomerCheckoutPaymentSummary,
  CustomerCheckoutPriceSummary,
} from '@/pages/customer/checkout/CustomerCheckoutBlocks'
import { CustomerDeliveryRoutePanel } from '@/pages/customer/checkout/CustomerDeliveryRoutePanel'
import {
  CUSTOMER_CHECKOUT_COPY,
} from '@/pages/customer/checkout/CustomerCheckoutCopy'
import type { CheckoutPanelProps } from '@/objects/customer/page/CustomerPageObjects'
import { Panel } from '@/components/primitives/LayoutPrimitives'
import { ROUTE_PATH, type MenuItem } from '@/objects/core/SharedObjects'
import { buildCustomerOrderStoreRoute } from '@/objects/page/DeliveryAppObjects'
import {
  getMenuItemConfiguredUnitPriceCents,
  hasSelectedRequiredCategoryItem,
  storeHasRequiredMenuCategory,
} from '@/features/delivery/DeliveryServices'

function getSelectedCartItems(props: CheckoutPanelProps) {
  return (
    props.selectedStore?.menu.filter((item: MenuItem) => (props.quantities[item.id] ?? 0) > 0) ?? []
  )
}

export function CustomerCartWorkspace(props: CheckoutPanelProps & { navigate: NavigateFunction }) {
  const { formatPrice, navigate, quantities, selectedMenuItemConfigurations, selectedStore, updateQuantity } = props
  const selectedItems = getSelectedCartItems(props)
  const requiresRequiredCategory = selectedStore ? storeHasRequiredMenuCategory(selectedStore) : false
  const hasRequiredCategorySelection =
    selectedStore ? hasSelectedRequiredCategoryItem(selectedStore, quantities) : false

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
          {selectedItems.map((item) => {
            const quantity = quantities[item.id] ?? 0
            const selectedConfiguration = selectedMenuItemConfigurations[item.id]

            return (
              <div key={item.id} className="customer-cart-item-row">
                <div>
                  <strong>{item.name}</strong>
                  <p className="meta-line">
                    {selectedConfiguration?.summaryText || CUSTOMER_CHECKOUT_COPY.cart.defaultSelectionSummary}
                  </p>
                </div>
                <div className="customer-cart-item-actions">
                  <button
                    className="secondary-button"
                    onClick={() => updateQuantity(item, quantity - 1)}
                    type="button"
                  >
                    {CUSTOMER_CHECKOUT_COPY.cart.decreaseQuantityButton}
                  </button>
                  <strong>{quantity}</strong>
                  <button
                    className="secondary-button"
                    onClick={() => updateQuantity(item, quantity + 1)}
                    type="button"
                  >
                    {CUSTOMER_CHECKOUT_COPY.cart.increaseQuantityButton}
                  </button>
                  <strong>
                    {formatPrice(
                      getMenuItemConfiguredUnitPriceCents(item, selectedConfiguration) * quantity,
                    )}
                  </strong>
                </div>
              </div>
            )
          })}
        </div>
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
