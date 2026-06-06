// Store menu grid with category navigation and option-selection modal support.
import { useEffect, useMemo, useRef, useState } from 'react'
import type { CheckoutPanelProps } from '@/pages/customer/objects/CustomerPageObjects'
import { DisplayImageSlot } from '@/components/primitives/DisplayImageSlot'
import type { MenuItem } from '@/objects/core/SharedObjects'
import {
  CUSTOMER_CHECKOUT_COPY,
} from '@/pages/customer/checkout/CustomerCheckoutCopy'
import {
  getMenuItemCartQuantity,
  getMenuItemDisplayPriceText,
  REQUIRED_MENU_CATEGORY_HASH,
  REQUIRED_MENU_CATEGORY_NAME,
} from '@/features/delivery/DeliveryServices'
import { MenuItemConfigurationDialog } from '@/pages/customer/checkout/MenuItemConfigurationDialog'
import {
  toCategorySectionId,
  type MenuCategorySection,
} from '@/pages/customer/checkout/CustomerCheckoutMenuTypes'

export function CustomerCheckoutMenuGrid(props: CheckoutPanelProps) {
  const {
    closeMenuItemConfiguration,
    confirmMenuItemConfiguration,
    formatPrice,
    menuItemConfigurationModal,
    monthlySalesByMenuItem,
    openMenuItemConfiguration,
    quantities,
    selectedStore,
    updateQuantity,
  } = props
  const [activeCategoryId, setActiveCategoryId] = useState<string>('')
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const activeCategoryIdRef = useRef('')
  const menuItems = selectedStore?.menu ?? []
  const configurableItem = menuItems.find((item) => item.id === menuItemConfigurationModal?.itemId) ?? null

  const sections = useMemo<MenuCategorySection[]>(() => {
    // Grouping is derived at render time so merchant menu edits immediately reshape the category nav.
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
    setActiveCategoryId((current) => {
      const nextCategoryId = current && sections.some((section) => section.id === current) ? current : (sections[0]?.id ?? '')
      activeCategoryIdRef.current = nextCategoryId
      return nextCategoryId
    })
  }, [sections, selectedStore?.id])

  useEffect(() => {
    let animationFrame = 0
    let scrollSettleTimer = 0

    function commitActiveCategory(nextCategoryId: string) {
      if (!nextCategoryId || activeCategoryIdRef.current === nextCategoryId) return
      activeCategoryIdRef.current = nextCategoryId
      setActiveCategoryId(nextCategoryId)
    }

    function getCategoryIdAtAnchor() {
      const anchorOffset = Math.min(Math.max(window.innerHeight * 0.32, 160), 260)
      const currentElement = sectionRefs.current[activeCategoryIdRef.current]

      if (currentElement) {
        const currentRect = currentElement.getBoundingClientRect()
        if (currentRect.top <= anchorOffset + 72 && currentRect.bottom >= anchorOffset - 72) {
          return activeCategoryIdRef.current
        }
      }

      const visibleSection = sections.find((section) => {
        const element = sectionRefs.current[section.id]
        if (!element) return false
        const rect = element.getBoundingClientRect()
        return rect.top <= anchorOffset && rect.bottom > anchorOffset
      })
      const fallbackSection = sections.find((section) => {
        const element = sectionRefs.current[section.id]
        return element ? element.getBoundingClientRect().top > anchorOffset : false
      })

      return visibleSection?.id ?? fallbackSection?.id ?? sections.at(-1)?.id ?? ''
    }

    function syncActiveCategory(immediate = false) {
      animationFrame = 0
      if (immediate) {
        commitActiveCategory(getCategoryIdAtAnchor())
        return
      }

      if (scrollSettleTimer) window.clearTimeout(scrollSettleTimer)
      scrollSettleTimer = window.setTimeout(() => {
        scrollSettleTimer = 0
        commitActiveCategory(getCategoryIdAtAnchor())
      }, 90)
    }

    function scheduleSync() {
      if (animationFrame) return
      animationFrame = window.requestAnimationFrame(() => syncActiveCategory())
    }

    function handleResize() {
      syncActiveCategory(true)
    }

    syncActiveCategory(true)
    window.addEventListener('scroll', scheduleSync, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      if (scrollSettleTimer) window.clearTimeout(scrollSettleTimer)
      window.removeEventListener('scroll', scheduleSync)
      window.removeEventListener('resize', handleResize)
    }
  }, [sections])

  useEffect(() => {
    function scrollToRequiredCategoryFromHash() {
      if (window.location.hash !== `#${REQUIRED_MENU_CATEGORY_HASH}`) return
      const requiredSection = sections.find((section) => section.name === REQUIRED_MENU_CATEGORY_NAME)
      if (!requiredSection) return
      sectionRefs.current[requiredSection.id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      activeCategoryIdRef.current = requiredSection.id
      setActiveCategoryId(requiredSection.id)
      window.history.replaceState(
        window.history.state,
        '',
        `${window.location.pathname}${window.location.search}`,
      )
    }

    scrollToRequiredCategoryFromHash()
    window.addEventListener('hashchange', scrollToRequiredCategoryFromHash)

    return () => {
      window.removeEventListener('hashchange', scrollToRequiredCategoryFromHash)
    }
  }, [sections])

  function scrollToCategory(categoryId: string) {
    activeCategoryIdRef.current = categoryId
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
                  const currentQuantity = getMenuItemCartQuantity(quantities, item.id)
                  const disableIncrement =
                    item.remainingQuantity != null && currentQuantity >= item.remainingQuantity
                  const requiresConfiguration = item.selectionGroups.length > 0

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
                          {requiresConfiguration && currentQuantity > 0 ? (
                            <p className="meta-line">
                              {CUSTOMER_CHECKOUT_COPY.menu.configurationSummaryLabel}
                              {`${currentQuantity} 份已选，可继续添加不同配置`}
                            </p>
                          ) : null}
                          {requiresConfiguration ? (
                            <p className="meta-line">
                              <button
                                className="secondary-button"
                                onClick={() => openMenuItemConfiguration(item)}
                                type="button"
                              >
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
