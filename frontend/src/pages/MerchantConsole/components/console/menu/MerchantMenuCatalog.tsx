import { useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react'
import type { MerchantConsolePanelProps } from '@/pages/MerchantConsole/hooks/MerchantConsoleState'
import { MerchantMenuItemCard } from '@/pages/MerchantConsole/components/console/menu/MerchantMenuItemCard'
import type { Store } from '@/objects/core/SharedObjects'

type MerchantMenuCategorySection = {
  id: string
  name: string
  itemCount: number
}

type MerchantMenuSection = MerchantMenuCategorySection & {
  items: Store['menu']
}

const UNCATEGORIZED_MENU_LABEL = '未分类'

function toMerchantCategorySectionId(categoryName: string, index: number) {
  return `merchant-menu-category-${index}-${categoryName.trim().replace(/\s+/g, '-').toLowerCase()}`
}

function useMerchantMenuSections(menu: Store['menu']) {
  const sections = useMemo<MerchantMenuSection[]>(() => {
    const grouped = new Map<string, Store['menu']>()
    menu.forEach((item) => {
      const categoryName = item.category?.trim() || UNCATEGORIZED_MENU_LABEL
      const currentItems = grouped.get(categoryName)
      if (currentItems) {
        currentItems.push(item)
      } else {
        grouped.set(categoryName, [item])
      }
    })

    return Array.from(grouped.entries()).map(([name, items], index) => ({
      id: toMerchantCategorySectionId(name, index),
      itemCount: items.length,
      items,
      name,
    }))
  }, [menu])

  const sectionSummaries = useMemo<MerchantMenuCategorySection[]>(
    () =>
      sections.map((section) => ({
        id: section.id,
        itemCount: section.itemCount,
        name: section.name,
      })),
    [sections],
  )

  return { sectionSummaries, sections }
}

function useActiveMerchantMenuCategory(sectionSummaries: MerchantMenuCategorySection[]) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>('')
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    setActiveCategoryId((current) =>
      current && sectionSummaries.some((section) => section.id === current)
        ? current
        : (sectionSummaries[0]?.id ?? ''),
    )
  }, [sectionSummaries])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    sectionSummaries.forEach((section) => {
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
  }, [sectionSummaries])

  function scrollToCategory(categoryId: string) {
    setActiveCategoryId(categoryId)
    sectionRefs.current[categoryId]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return { activeCategoryId, scrollToCategory, sectionRefs }
}

function MerchantMenuCategoryNav({
  activeCategoryId,
  scrollToCategory,
  sectionSummaries,
}: {
  activeCategoryId: string
  scrollToCategory: (categoryId: string) => void
  sectionSummaries: MerchantMenuCategorySection[]
}) {
  return (
    <nav aria-label="商家菜品分类导航" className="menu-category-nav merchant-menu-category-nav">
      {sectionSummaries.map((section) => (
        <button
          key={section.id}
          className={`menu-category-button ${activeCategoryId === section.id ? 'is-active' : ''}`}
          onClick={() => scrollToCategory(section.id)}
          type="button"
        >
          <span>{section.name}</span>
          <small>{section.itemCount} 款</small>
        </button>
      ))}
    </nav>
  )
}

function MerchantMenuCategoryPanel({
  props,
  section,
  sectionRefs,
  store,
}: {
  props: MerchantConsolePanelProps
  section: MerchantMenuSection
  sectionRefs: MutableRefObject<Record<string, HTMLElement | null>>
  store: Store
}) {
  return (
    <section
      key={section.id}
      ref={(element) => {
        sectionRefs.current[section.id] = element
      }}
      className="menu-category-section merchant-menu-category-section"
      id={section.id}
    >
      <div className="menu-category-header">
        <div>
          <p className="ticket-kind">菜品分类</p>
          <h3>{section.name}</h3>
        </div>
        <span className="badge">{section.itemCount} 款</span>
      </div>

      <div className="menu-grid merchant-menu-grid merchant-category-grid">
        {section.items.map((item) => (
          <MerchantMenuItemCard key={item.id} item={item} props={props} store={store} />
        ))}
      </div>
    </section>
  )
}

function MerchantMenuCategorySections({
  props,
  sectionRefs,
  sections,
  store,
}: {
  props: MerchantConsolePanelProps
  sectionRefs: MutableRefObject<Record<string, HTMLElement | null>>
  sections: MerchantMenuSection[]
  store: Store
}) {
  return (
    <div className="menu-category-sections">
      {sections.map((section) => (
        <MerchantMenuCategoryPanel
          key={section.id}
          props={props}
          section={section}
          sectionRefs={sectionRefs}
          store={store}
        />
      ))}
    </div>
  )
}

export function MerchantMenuCatalog({
  store,
  props,
}: {
  store: Store
  props: MerchantConsolePanelProps
}) {
  const { sectionSummaries, sections } = useMerchantMenuSections(store.menu)
  const { activeCategoryId, scrollToCategory, sectionRefs } =
    useActiveMerchantMenuCategory(sectionSummaries)

  return (
    <div className="menu-catalog-layout merchant-menu-catalog-layout">
      <MerchantMenuCategoryNav
        activeCategoryId={activeCategoryId}
        scrollToCategory={scrollToCategory}
        sectionSummaries={sectionSummaries}
      />
      <MerchantMenuCategorySections
        props={props}
        sectionRefs={sectionRefs}
        sections={sections}
        store={store}
      />
    </div>
  )
}
