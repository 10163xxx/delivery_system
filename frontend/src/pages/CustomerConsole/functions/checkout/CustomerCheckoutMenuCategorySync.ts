import { useCallback, useEffect, useRef, useState, type MutableRefObject } from 'react'
import { REQUIRED_MENU_CATEGORY_HASH, REQUIRED_MENU_CATEGORY_NAME } from '@/pages/DeliveryConsole/functions/payloads/DeliveryPayloadCustomer'
import type {
  MenuCategorySection,
  MenuSectionRefs,
} from '@/pages/CustomerConsole/objects/CustomerCheckoutMenuTypes'

export function useActiveMenuCategory(
  sections: MenuCategorySection[],
  selectedStoreId: string | undefined,
  sectionRefs: MenuSectionRefs,
) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>('')
  const activeCategoryIdRef = useRef('')
  const commitActiveCategory = useCallback((nextCategoryId: string) => {
    if (!nextCategoryId || activeCategoryIdRef.current === nextCategoryId) return
    activeCategoryIdRef.current = nextCategoryId
    setActiveCategoryId(nextCategoryId)
  }, [])

  useEffect(() => {
    setActiveCategoryId((current) => {
      const nextCategoryId = current && sections.some((section) => section.id === current) ? current : (sections[0]?.id ?? '')
      activeCategoryIdRef.current = nextCategoryId
      return nextCategoryId
    })
  }, [sections, selectedStoreId])

  useMenuCategoryScrollSync(sections, sectionRefs, activeCategoryIdRef, commitActiveCategory)
  useRequiredCategoryHashSync(sections, sectionRefs, activeCategoryIdRef, setActiveCategoryId)

  function scrollToCategory(categoryId: string) {
    activeCategoryIdRef.current = categoryId
    setActiveCategoryId(categoryId)
    sectionRefs.current[categoryId]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return {
    activeCategoryId,
    scrollToCategory,
  }
}

function getCategoryIdAtAnchor(
  sections: MenuCategorySection[],
  sectionRefs: MenuSectionRefs,
  activeCategoryId: string,
) {
  const anchorOffset = Math.min(Math.max(window.innerHeight * 0.32, 160), 260)
  const currentElement = sectionRefs.current[activeCategoryId]

  if (currentElement) {
    const currentRect = currentElement.getBoundingClientRect()
    if (currentRect.top <= anchorOffset + 72 && currentRect.bottom >= anchorOffset - 72) {
      return activeCategoryId
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

function useMenuCategoryScrollSync(
  sections: MenuCategorySection[],
  sectionRefs: MenuSectionRefs,
  activeCategoryIdRef: MutableRefObject<string>,
  commitActiveCategory: (categoryId: string) => void,
) {
  useEffect(() => {
    let animationFrame = 0
    let scrollSettleTimer = 0

    function syncActiveCategory(immediate = false) {
      animationFrame = 0
      if (immediate) {
        commitActiveCategory(getCategoryIdAtAnchor(sections, sectionRefs, activeCategoryIdRef.current))
        return
      }

      if (scrollSettleTimer) window.clearTimeout(scrollSettleTimer)
      scrollSettleTimer = window.setTimeout(() => {
        scrollSettleTimer = 0
        commitActiveCategory(getCategoryIdAtAnchor(sections, sectionRefs, activeCategoryIdRef.current))
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
  }, [activeCategoryIdRef, commitActiveCategory, sectionRefs, sections])
}

function useRequiredCategoryHashSync(
  sections: MenuCategorySection[],
  sectionRefs: MenuSectionRefs,
  activeCategoryIdRef: MutableRefObject<string>,
  setActiveCategoryId: (categoryId: string) => void,
) {
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
  }, [activeCategoryIdRef, sectionRefs, sections, setActiveCategoryId])
}
