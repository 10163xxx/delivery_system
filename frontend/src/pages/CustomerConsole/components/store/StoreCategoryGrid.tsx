import type { CustomerRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import type { Store } from '@/objects/core/SharedObjects'
import {
  CUSTOMER_FAVORITE_CATEGORY_IMAGE_SRC,
  CUSTOMER_FAVORITE_STORE_CATEGORY,
  ZERO_COUNT,
} from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import {
  CUSTOMER_STORE_BROWSE_COPY,
  CUSTOMER_STORE_BROWSE_LAYOUT,
  DELIVERY_UI,
  SELECTED_STORE_SECTIONS_LAYOUT,
  categoryImageAlt,
  categoryOrderableCoverageSummary,
} from '@/pages/DeliveryConsole/functions/shared/DeliveryMessages'

export function StoreCategoryGrid({ props }: { props: CustomerRoleProps }) {
  const {
    storeCategories,
    visibleStores,
    getCategoryMeta,
    chooseStoreCategory,
    favoriteStores,
    isStoreCurrentlyOpen,
  } = props

  return (
    <div className={CUSTOMER_STORE_BROWSE_LAYOUT.categoryGridClassName}>
      {storeCategories.map((category: CustomerRoleProps['storeCategories'][number]) => {
        const storesInCategory =
          category === CUSTOMER_FAVORITE_STORE_CATEGORY
            ? favoriteStores
            : visibleStores.filter((store: Store) => store.category === category)
        const openStoreCount = storesInCategory.filter(
          (store: Store) => isStoreCurrentlyOpen(store) && store.menu.length > ZERO_COUNT,
        ).length
        const isFavoriteCategory = category === CUSTOMER_FAVORITE_STORE_CATEGORY
        const categoryImageSrc = isFavoriteCategory
          ? CUSTOMER_FAVORITE_CATEGORY_IMAGE_SRC
          : getCategoryMeta(category).imageSrc
        const categorySubtitle = isFavoriteCategory
          ? CUSTOMER_STORE_BROWSE_COPY.favoriteCategoryDescription
          : getCategoryMeta(category).subtitle
        const categoryTicketKind = isFavoriteCategory
          ? CUSTOMER_STORE_BROWSE_COPY.favoriteCategoryTicketKind
          : CUSTOMER_STORE_BROWSE_COPY.categoryTicketKind
        const categoryButtonLabel = isFavoriteCategory
          ? CUSTOMER_STORE_BROWSE_COPY.favoriteCategoryButton
          : CUSTOMER_STORE_BROWSE_COPY.chooseCategoryButton
        const categoryHint =
          isFavoriteCategory && storesInCategory.length === ZERO_COUNT
            ? CUSTOMER_STORE_BROWSE_COPY.favoriteCategoryEmptyHint
            : categoryOrderableCoverageSummary(openStoreCount, storesInCategory.length)

        return (
          <article key={category} className={CUSTOMER_STORE_BROWSE_LAYOUT.categoryCardClassName}>
            <img
              alt={categoryImageAlt(category)}
              className={CUSTOMER_STORE_BROWSE_LAYOUT.categoryImageClassName}
              src={categoryImageSrc}
            />
            <div className={DELIVERY_UI.ticketHeaderClassName}>
              <div>
                <p className={DELIVERY_UI.ticketKindClassName}>{categoryTicketKind}</p>
                <h3 className={CUSTOMER_STORE_BROWSE_LAYOUT.categoryTitleClassName}>{category}</h3>
              </div>
              <span className={SELECTED_STORE_SECTIONS_LAYOUT.badgeClassName}>
                {`${storesInCategory.length}${CUSTOMER_STORE_BROWSE_COPY.categoryStoreCountSuffix}`}
              </span>
            </div>
            <p className={CUSTOMER_STORE_BROWSE_LAYOUT.categoryDescriptionClassName}>
              {categorySubtitle}
            </p>
            <p className={DELIVERY_UI.metaLineClassName}>{categoryHint}</p>
            <button
              className={DELIVERY_UI.primaryButtonClassName}
              onClick={() => chooseStoreCategory(category)}
              type={DELIVERY_UI.buttonType}
            >
              {categoryButtonLabel}
            </button>
          </article>
        )
      })}
    </div>
  )
}
