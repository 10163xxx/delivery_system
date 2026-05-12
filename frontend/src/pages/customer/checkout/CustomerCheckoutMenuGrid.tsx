import type { CheckoutPanelProps } from '@/pages/customer/object/CustomerPageObjects'
import { DisplayImageSlot } from '@/shared/components/primitives/DisplayImageSlot'
import type { MenuItem } from '@/shared/object/core/SharedObjects'
import {
  CUSTOMER_CHECKOUT_COPY,
  getMenuItemQuantity,
} from '@/pages/customer/checkout/CustomerCheckoutCopy'

export function CustomerCheckoutMenuGrid(props: CheckoutPanelProps) {
  const { formatPrice, monthlySalesByMenuItem, quantities, selectedStore, updateQuantity } = props
  if (!selectedStore || selectedStore.menu.length === 0) return null

  return (
    <div className="menu-grid">
      {selectedStore.menu.map((item: MenuItem) => {
        const currentQuantity = getMenuItemQuantity(quantities, item.id)
        const disableIncrement =
          item.remainingQuantity != null && currentQuantity >= item.remainingQuantity

        return (
          <article key={item.id} className="menu-card">
            <DisplayImageSlot
              alt={`${item.name} 菜品图`}
              className="menu-image"
              label={CUSTOMER_CHECKOUT_COPY.menu.menuImageLabel}
              src={item.imageUrl}
            />
            <div>
              <h3>{item.name}</h3>
              <p className="meta-line menu-sales-text">
                {CUSTOMER_CHECKOUT_COPY.menu.menuSalesPrefix} {monthlySalesByMenuItem[item.id] ?? 0}
              </p>
              <p>{item.description}</p>
              {item.remainingQuantity != null ? (
                <p className="meta-line">
                  {item.remainingQuantity > 0
                    ? CUSTOMER_CHECKOUT_COPY.menu.inStockPattern(item.remainingQuantity)
                    : CUSTOMER_CHECKOUT_COPY.menu.noStock}
                </p>
              ) : null}
            </div>
            <div className="menu-footer">
              <strong>{formatPrice(item.priceCents)}</strong>
              <div className="stepper">
                <button type="button" onClick={() => updateQuantity(item, currentQuantity - 1)}>
                  -
                </button>
                <span>{currentQuantity}</span>
                <button
                  type="button"
                  disabled={disableIncrement}
                  onClick={() => updateQuantity(item, currentQuantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
