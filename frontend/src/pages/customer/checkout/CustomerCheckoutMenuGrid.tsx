import { useEffect, useMemo, useRef, useState } from 'react'
import type { CheckoutPanelProps } from '@/pages/customer/object/CustomerPageObjects'
import { DisplayImageSlot } from '@/shared/components/primitives/DisplayImageSlot'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import type { MenuItem } from '@/shared/object/core/SharedObjects'
import {
  CUSTOMER_CHECKOUT_LAYOUT,
  CUSTOMER_CHECKOUT_COPY,
  getMenuItemQuantity,
} from '@/pages/customer/checkout/CustomerCheckoutCopy'
import {
  REQUIRED_MENU_CATEGORY_HASH,
  REQUIRED_MENU_CATEGORY_NAME,
} from '@/shared/delivery/DeliveryServices'

type MenuCategorySection = {
  id: string
  name: string
  items: MenuItem[]
}

function toCategorySectionId(categoryName: string, index: number) {
  return `menu-category-${index}-${categoryName.trim().replace(/\s+/g, '-').toLowerCase()}`
}

export function CustomerCheckoutMenuGrid(props: CheckoutPanelProps) {
  const {
    closeMenuItemConfiguration,
    confirmMenuItemConfiguration,
    formatPrice,
    menuItemConfigurationModal,
    monthlySalesByMenuItem,
    openMenuItemConfiguration,
    quantities,
    selectedMenuItemConfigurations,
    selectedStore,
    updateQuantity,
  } = props
  const [activeCategoryId, setActiveCategoryId] = useState<string>('')
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const menuItems = selectedStore?.menu ?? []
  const configurableItem = menuItems.find((item) => item.id === menuItemConfigurationModal?.itemId) ?? null

  const sections = useMemo<MenuCategorySection[]>(() => {
    const grouped = new Map<string, MenuItem[]>()
    menuItems.forEach((item) => {
      const categoryName = item.category?.trim() || CUSTOMER_CHECKOUT_COPY.menu.categoryFallback
      const items = grouped.get(categoryName)
      if (items) {
        items.push(item)
      } else {
        grouped.set(categoryName, [item])
      }
    })

    return Array.from(grouped.entries()).map(([name, items], index) => ({
      id: toCategorySectionId(name, index),
      name,
      items,
    }))
  }, [menuItems])

  useEffect(() => {
    setActiveCategoryId((current) => (current && sections.some((section) => section.id === current) ? current : (sections[0]?.id ?? '')))
  }, [sections])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    sections.forEach((section) => {
        const element = sectionRefs.current[section.id]
        if (!element) return

        const observer = new IntersectionObserver(
          (entries) => {
            const visibleEntry = entries
              .filter((entry) => entry.isIntersecting)
              .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0]
            if (visibleEntry) {
              setActiveCategoryId(section.id)
            }
          },
          {
            root: null,
            rootMargin: '0px 0px -55% 0px',
            threshold: [0.2, 0.45, 0.7],
          },
        )
        observer.observe(element)
        observers.push(observer)
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [sections])

  useEffect(() => {
    if (window.location.hash !== `#${REQUIRED_MENU_CATEGORY_HASH}`) return
    const requiredSection = sections.find((section) => section.name === REQUIRED_MENU_CATEGORY_NAME)
    if (!requiredSection) return
    sectionRefs.current[requiredSection.id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveCategoryId(requiredSection.id)
  }, [sections])

  function scrollToCategory(categoryId: string) {
    setActiveCategoryId(categoryId)
    sectionRefs.current[categoryId]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (!selectedStore || menuItems.length === 0) return null

  return (
    <>
      <div className="menu-catalog-layout">
        <nav aria-label={CUSTOMER_CHECKOUT_COPY.menu.categoryNavAriaLabel} className="menu-category-nav">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`menu-category-button ${activeCategoryId === section.id ? 'is-active' : ''}`}
              onClick={() => scrollToCategory(section.id)}
              type="button"
            >
              <span>{section.name}</span>
              <small>{`${section.items.length}${CUSTOMER_CHECKOUT_COPY.menu.categoryItemCountSuffix}`}</small>
            </button>
          ))}
        </nav>

        <div className="menu-category-sections">
          {sections.map((section) => (
            <section
              key={section.id}
              ref={(element) => {
                sectionRefs.current[section.id] = element
              }}
              className="menu-category-section"
              id={section.id}
            >
              <div className="menu-category-header">
                <div>
                  <p className="ticket-kind">{CUSTOMER_CHECKOUT_COPY.menu.categorySectionLabel}</p>
                  <h3>{section.name}</h3>
                  {section.name === REQUIRED_MENU_CATEGORY_NAME ? (
                    <p className="meta-line">{CUSTOMER_CHECKOUT_COPY.menu.categoryRequiredHint}</p>
                  ) : null}
                </div>
                <span className="badge">
                  {section.name === REQUIRED_MENU_CATEGORY_NAME
                    ? CUSTOMER_CHECKOUT_COPY.menu.categoryRequiredBadge
                    : `${section.items.length}${CUSTOMER_CHECKOUT_COPY.menu.categoryItemCountSuffix}`}
                </span>
              </div>

              <div className="menu-category-list">
                {section.items.map((item: MenuItem) => {
                  const currentQuantity = getMenuItemQuantity(quantities, item.id)
                  const disableIncrement =
                    item.remainingQuantity != null && currentQuantity >= item.remainingQuantity
                  const selectedConfiguration = selectedMenuItemConfigurations[item.id]

                  return (
                    <article key={item.id} className="menu-card menu-list-card">
                      <DisplayImageSlot
                        alt={CUSTOMER_CHECKOUT_COPY.menu.menuItemImageAlt(item.name)}
                        className="menu-image"
                        label={CUSTOMER_CHECKOUT_COPY.menu.menuImageLabel}
                        src={item.imageUrl}
                      />
                      <div className="menu-card-body">
                        <div>
                          <h3>{item.name}</h3>
                          <p className="meta-line menu-sales-text">
                            {CUSTOMER_CHECKOUT_COPY.menu.menuSalesPrefix} {monthlySalesByMenuItem[item.id] ?? 0}
                          </p>
                          <p>{item.description}</p>
                          {item.selectionGroups.length > 0 ? (
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
                          ) : null}
                          {selectedConfiguration?.summaryText ? (
                            <p className="meta-line">
                              {CUSTOMER_CHECKOUT_COPY.menu.configurationSummaryLabel}
                              {selectedConfiguration.summaryText}
                            </p>
                          ) : null}
                          {item.selectionGroups.length > 0 ? (
                            <p className="meta-line">
                              <button
                                className="secondary-button"
                                onClick={() => openMenuItemConfiguration(item)}
                                type="button"
                              >
                                {selectedConfiguration?.summaryText
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
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      <MenuItemConfigurationDialog
        item={configurableItem}
        modalState={menuItemConfigurationModal}
        onClose={closeMenuItemConfiguration}
        onConfirm={confirmMenuItemConfiguration}
      />
    </>
  )
}

type MenuItemConfigurationDialogProps = {
  item: MenuItem | null
  modalState: CheckoutPanelProps['menuItemConfigurationModal']
  onClose: CheckoutPanelProps['closeMenuItemConfiguration']
  onConfirm: CheckoutPanelProps['confirmMenuItemConfiguration']
}

function MenuItemConfigurationDialog(props: MenuItemConfigurationDialogProps) {
  const { item, modalState, onClose, onConfirm } = props
  const [draftSelections, setDraftSelections] = useState<Record<string, string[]>>({})

  useEffect(() => {
    if (!modalState) return
    setDraftSelections(modalState.draftSelections)
  }, [modalState])

  if (!item || !modalState) return null

  function toggleOption(groupName: string, option: string, maxSelections: number) {
    setDraftSelections((current) => {
      const currentValues = current[groupName] ?? []
      const exists = currentValues.includes(option)
      if (exists) {
        return { ...current, [groupName]: currentValues.filter((value) => value !== option) }
      }
      if (maxSelections <= 1) {
        return { ...current, [groupName]: [option] }
      }
      if (currentValues.length >= maxSelections) return current
      return { ...current, [groupName]: [...currentValues, option] }
    })
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="rounded-3xl bg-white p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle>{item.name}</DialogTitle>
          <DialogDescription>
            {CUSTOMER_CHECKOUT_COPY.menu.configurationDialogDescription}
          </DialogDescription>
        </DialogHeader>
        <div className="stack">
          {item.selectionGroups.map((group) => {
            const selectedOptions = draftSelections[group.name] ?? []
            return (
              <section key={group.name}>
                <div
                  className="meta-line"
                  style={{ marginBottom: CUSTOMER_CHECKOUT_LAYOUT.configurationGroupSpacing }}
                >
                  <strong>{group.name}</strong>
                  {group.minSelections === 1 && group.maxSelections === 1
                    ? CUSTOMER_CHECKOUT_COPY.menu.configurationGroupRequiredSingle
                    : CUSTOMER_CHECKOUT_COPY.menu.configurationGroupSelectionRange(
                        group.minSelections,
                        group.maxSelections,
                      )}
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: CUSTOMER_CHECKOUT_LAYOUT.configurationOptionGap,
                  }}
                >
                  {group.options.map((option) => {
                    const selected = selectedOptions.includes(option)
                    return (
                      <button
                        key={option}
                        type="button"
                        className={`secondary-button${selected ? ' is-active' : ''}`}
                        onClick={() => toggleOption(group.name, option, group.maxSelections)}
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>
              </section>
            )
          })}
          {modalState.errorText ? <p className="field-error-text">{modalState.errorText}</p> : null}
        </div>
        <DialogFooter>
          <button className="secondary-button" onClick={onClose} type="button">
            {CUSTOMER_CHECKOUT_COPY.menu.configurationDialogCancelButton}
          </button>
          <button
            className="primary-button"
            onClick={() => onConfirm(item, modalState.quantityAfterConfirm, draftSelections)}
            type="button"
          >
            {CUSTOMER_CHECKOUT_COPY.menu.configurationDialogConfirmButton}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
