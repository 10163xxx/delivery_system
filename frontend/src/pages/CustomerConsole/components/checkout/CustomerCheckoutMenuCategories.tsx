import type { CheckoutPanelProps } from '@/pages/CustomerConsole/objects/CustomerCheckoutObjects'
import {
  CUSTOMER_CHECKOUT_COPY,
} from '@/pages/CustomerConsole/components/checkout/CustomerCheckoutCopy'
import { REQUIRED_MENU_CATEGORY_NAME } from '@/pages/DeliveryConsole/functions/payloads/DeliveryPayloadCustomer'
import type {
  MenuCategorySection,
} from '@/pages/CustomerConsole/objects/CustomerCheckoutMenuTypes'
import { CustomerCheckoutMenuItemCard } from '@/pages/CustomerConsole/components/checkout/CustomerCheckoutMenuItemCard'

export function MenuCategoryNav(props: {
  activeCategoryId: string
  onSelectCategory: (categoryId: string) => void
  sections: MenuCategorySection[]
}) {
  const { activeCategoryId, onSelectCategory, sections } = props

  return (
    <nav aria-label={CUSTOMER_CHECKOUT_COPY.menu.categoryNavAriaLabel} className="menu-category-nav">
      {sections.map((section) => (
        <button
          key={section.id}
          className={`menu-category-button ${activeCategoryId === section.id ? 'is-active' : ''}`}
          onClick={() => onSelectCategory(section.id)}
          type="button"
        >
          <span>{section.name}</span>
          <small>{`${section.items.length}${CUSTOMER_CHECKOUT_COPY.menu.categoryItemCountSuffix}`}</small>
        </button>
      ))}
    </nav>
  )
}

export function MenuCategorySections(props: CheckoutPanelProps & {
  onSectionElement: (categoryId: string, element: HTMLElement | null) => void
  sections: MenuCategorySection[]
}) {
  const { onSectionElement, sections, ...checkoutProps } = props

  return (
    <div className="menu-category-sections">
      {sections.map((section) => (
        <MenuCategorySectionPanel
          key={section.id}
          onSectionElement={onSectionElement}
          section={section}
          {...checkoutProps}
        />
      ))}
    </div>
  )
}

function MenuCategorySectionPanel(props: CheckoutPanelProps & {
  onSectionElement: (categoryId: string, element: HTMLElement | null) => void
  section: MenuCategorySection
}) {
  const { onSectionElement, section, ...checkoutProps } = props
  const isRequiredCategory = section.name === REQUIRED_MENU_CATEGORY_NAME

  return (
    <section
      ref={(element) => {
        onSectionElement(section.id, element)
      }}
      className="menu-category-section"
      id={section.id}
    >
      <div className="menu-category-header">
        <div>
          <p className="ticket-kind">{CUSTOMER_CHECKOUT_COPY.menu.categorySectionLabel}</p>
          <h3>{section.name}</h3>
          {isRequiredCategory ? (
            <p className="meta-line">{CUSTOMER_CHECKOUT_COPY.menu.categoryRequiredHint}</p>
          ) : null}
        </div>
        <span className="badge">
          {isRequiredCategory
            ? CUSTOMER_CHECKOUT_COPY.menu.categoryRequiredBadge
            : `${section.items.length}${CUSTOMER_CHECKOUT_COPY.menu.categoryItemCountSuffix}`}
        </span>
      </div>

      <div className="menu-category-list">
        {section.items.map((item) => (
          <CustomerCheckoutMenuItemCard key={item.id} item={item} {...checkoutProps} />
        ))}
      </div>
    </section>
  )
}
