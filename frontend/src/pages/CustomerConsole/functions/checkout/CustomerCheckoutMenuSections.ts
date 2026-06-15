import type { MenuItem } from '@/objects/core/SharedObjects'
import {
  CUSTOMER_CHECKOUT_COPY,
} from '@/pages/CustomerConsole/components/checkout/CustomerCheckoutCopy'
import type { MenuCategorySection } from '@/pages/CustomerConsole/objects/CustomerCheckoutMenuTypes'

function toCategorySectionId(categoryName: string, index: number) {
  return `menu-category-${index}-${categoryName.trim().replace(/\s+/g, '-').toLowerCase()}`
}

export function buildMenuSections(menuItems: MenuItem[]): MenuCategorySection[] {
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
}
