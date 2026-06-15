import type { CheckoutPanelProps } from '@/pages/CustomerConsole/objects/CustomerCheckoutObjects'
import { DisplayImageSlot } from '@/pages/DeliveryConsole/components/primitives/DisplayImageSlot'
import type { MenuItem } from '@/objects/core/SharedObjects'
import {
  CUSTOMER_CHECKOUT_COPY,
} from '@/pages/CustomerConsole/components/checkout/CustomerCheckoutCopy'
import { getMenuItemCartQuantity } from '@/pages/DeliveryConsole/functions/cart/DeliveryCartLines'
import { getMenuItemDisplayPriceText } from '@/pages/DeliveryConsole/functions/cart/DeliveryMenuPricing'

export function CustomerCheckoutMenuItemCard(props: CheckoutPanelProps & { item: MenuItem }) {
  const {
    formatPrice,
    item,
    monthlySalesByMenuItem,
    openMenuItemConfiguration,
    quantities,
    updateQuantity,
  } = props
  const currentQuantity = getMenuItemCartQuantity(quantities, item.id)
  const disableIncrement = item.remainingQuantity != null && currentQuantity >= item.remainingQuantity
  const requiresConfiguration = item.selectionGroups.length > 0

  return (
    <article className="menu-card menu-list-card">
      <DisplayImageSlot
        alt={CUSTOMER_CHECKOUT_COPY.menu.menuItemImageAlt(item.name)}
        className="menu-image"
        label={CUSTOMER_CHECKOUT_COPY.menu.menuImageLabel}
        src={item.imageUrl}
      />
      <div className="menu-card-body">
        <MenuItemDetails
          currentQuantity={currentQuantity}
          item={item}
          monthlySales={monthlySalesByMenuItem[item.id] ?? 0}
          onConfigure={openMenuItemConfiguration}
          requiresConfiguration={requiresConfiguration}
        />
        <div className="menu-footer">
          <strong>{getMenuItemDisplayPriceText(item, formatPrice)}</strong>
          <div className="stepper">
            <button type="button" onClick={() => updateQuantity(item, currentQuantity - 1)}>
              -
            </button>
            <span>{currentQuantity}</span>
            <button
              type="button"
              disabled={disableIncrement}
              onClick={() =>
                requiresConfiguration
                  ? openMenuItemConfiguration(item)
                  : updateQuantity(item, currentQuantity + 1)}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

function MenuItemDetails(props: {
  currentQuantity: number
  item: MenuItem
  monthlySales: number
  onConfigure: (item: MenuItem) => void
  requiresConfiguration: boolean
}) {
  const { currentQuantity, item, monthlySales, onConfigure, requiresConfiguration } = props

  return (
    <div>
      <h3>{item.name}</h3>
      <p className="meta-line menu-sales-text">
        {CUSTOMER_CHECKOUT_COPY.menu.menuSalesPrefix} {monthlySales}
      </p>
      <p>{item.description}</p>
      <MenuItemConfigurationSummary item={item} />
      {requiresConfiguration && currentQuantity > 0 ? (
        <p className="meta-line">
          {CUSTOMER_CHECKOUT_COPY.menu.configurationSummaryLabel}
          {`${currentQuantity} 份已选，可继续添加不同配置`}
        </p>
      ) : null}
      {requiresConfiguration ? (
        <p className="meta-line">
          <button className="secondary-button" onClick={() => onConfigure(item)} type="button">
            {currentQuantity > 0
              ? CUSTOMER_CHECKOUT_COPY.menu.configurationButtonUpdate
              : CUSTOMER_CHECKOUT_COPY.menu.configurationButtonSelect}
          </button>
        </p>
      ) : null}
      {item.remainingQuantity != null ? (
        <p className="meta-line">
          {item.remainingQuantity > 0
            ? CUSTOMER_CHECKOUT_COPY.menu.inStockPattern(item.remainingQuantity)
            : CUSTOMER_CHECKOUT_COPY.menu.noStock}
        </p>
      ) : null}
    </div>
  )
}

function MenuItemConfigurationSummary({ item }: { item: MenuItem }) {
  if (item.selectionGroups.length === 0) return null

  return (
    <p className="meta-line">
      {CUSTOMER_CHECKOUT_COPY.menu.configurationSummaryRequiredLabel}
      {item.selectionGroups
        .map((group) =>
          `${group.name}${
            group.minSelections === 1 && group.maxSelections === 1
              ? CUSTOMER_CHECKOUT_COPY.menu.configurationSummarySingleSelectSuffix
              : CUSTOMER_CHECKOUT_COPY.menu.configurationSummaryRangeSuffix(
                  group.minSelections,
                  group.maxSelections,
                )
          }`,
        )
        .join(CUSTOMER_CHECKOUT_COPY.menu.selectionSummarySeparator)}
    </p>
  )
}
