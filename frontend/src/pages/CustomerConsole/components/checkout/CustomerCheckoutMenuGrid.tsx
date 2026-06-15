import { useMemo, useRef } from 'react'
import type { CheckoutPanelProps } from '@/pages/CustomerConsole/objects/CustomerCheckoutObjects'
import type { MenuItem } from '@/objects/core/SharedObjects'
import { MenuItemConfigurationDialog } from '@/pages/CustomerConsole/components/checkout/MenuItemConfigurationDialog'
import {
  MenuCategoryNav,
  MenuCategorySections,
} from '@/pages/CustomerConsole/components/checkout/CustomerCheckoutMenuCategories'
import { useActiveMenuCategory } from '@/pages/CustomerConsole/functions/checkout/CustomerCheckoutMenuCategorySync'
import { buildMenuSections } from '@/pages/CustomerConsole/functions/checkout/CustomerCheckoutMenuSections'

const EMPTY_MENU_ITEMS: MenuItem[] = []

export function CustomerCheckoutMenuGrid(props: CheckoutPanelProps) {
  const {
    closeMenuItemConfiguration,
    confirmMenuItemConfiguration,
    menuItemConfigurationModal,
    selectedStore,
  } = props
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const menuItems = selectedStore?.menu ?? EMPTY_MENU_ITEMS
  const configurableItem = menuItems.find((item) => item.id === menuItemConfigurationModal?.itemId) ?? null
  const sections = useMemo(() => buildMenuSections(menuItems), [menuItems])
  const { activeCategoryId, scrollToCategory } = useActiveMenuCategory(
    sections,
    selectedStore?.id,
    sectionRefs,
  )

  if (!selectedStore || menuItems.length === 0) return null

  return (
    <>
      <div className="menu-catalog-layout">
        <MenuCategoryNav
          activeCategoryId={activeCategoryId}
          onSelectCategory={scrollToCategory}
          sections={sections}
        />
        <MenuCategorySections
          onSectionElement={(categoryId, element) => {
            sectionRefs.current[categoryId] = element
          }}
          sections={sections}
          {...props}
        />
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
