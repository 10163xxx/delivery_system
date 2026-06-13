import type { MenuItem } from '@/objects/core/SharedObjects'

export type MenuCategorySection = {
  id: string
  name: string
  items: MenuItem[]
}

export function toCategorySectionId(categoryName: string, index: number) {
  return `menu-category-${index}-${categoryName.trim().replace(/\s+/g, '-').toLowerCase()}`
}
