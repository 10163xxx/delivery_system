import type { MenuItem } from '@/objects/core/SharedObjects'
import type { MutableRefObject } from 'react'

export type MenuCategorySection = {
  id: string
  name: string
  items: MenuItem[]
}

export type MenuSectionRefs = MutableRefObject<Record<string, HTMLElement | null>>
