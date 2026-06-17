import type { CustomerRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import type { DisplayText } from '@/objects/core/SharedObjects'
import {
  CUSTOMER_STORE_BROWSE_COPY,
  CUSTOMER_STORE_BROWSE_LAYOUT,
  DELIVERY_UI,
  searchHistoryDeleteLabel,
} from '@/pages/DeliveryConsole/functions/shared/DeliveryMessages'
import { ZERO_COUNT } from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import { asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'

const SEARCH_HISTORY_WRAPPER_STYLE = {
  flex: CUSTOMER_STORE_BROWSE_LAYOUT.fillFlexGrow,
} as const

const SEARCH_HISTORY_LIST_STYLE = {
  display: 'flex',
  flexDirection: 'column',
  gap: CUSTOMER_STORE_BROWSE_LAYOUT.searchHistoryGap,
} as const

const SEARCH_HISTORY_ITEM_STYLE = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: CUSTOMER_STORE_BROWSE_LAYOUT.searchHistoryGap,
  padding: CUSTOMER_STORE_BROWSE_LAYOUT.searchHistoryCardPadding,
  borderRadius: CUSTOMER_STORE_BROWSE_LAYOUT.searchHistoryCardRadius,
  background: CUSTOMER_STORE_BROWSE_LAYOUT.searchHistoryBackground,
  border: CUSTOMER_STORE_BROWSE_LAYOUT.searchHistoryBorder,
} as const

const SEARCH_HISTORY_KEYWORD_BUTTON_STYLE = {
  flex: 1,
  textAlign: 'left',
  border: 'none',
  background: 'transparent',
  padding: CUSTOMER_STORE_BROWSE_LAYOUT.buttonResetPadding,
  font: 'inherit',
  color: 'inherit',
  cursor: 'pointer',
} as const

const SEARCH_HISTORY_REMOVE_BUTTON_STYLE = {
  border: 'none',
  background: 'transparent',
  padding: CUSTOMER_STORE_BROWSE_LAYOUT.buttonResetPadding,
  fontSize: CUSTOMER_STORE_BROWSE_LAYOUT.searchHistoryFontSize,
  lineHeight: CUSTOMER_STORE_BROWSE_LAYOUT.compactLineHeight,
  color: CUSTOMER_STORE_BROWSE_LAYOUT.searchHistoryTextColor,
  cursor: 'pointer',
} as const

export function SearchHistoryPanel({ props }: { props: CustomerRoleProps }) {
  const {
    customerStoreSearchHistory,
    removeCustomerStoreSearchHistoryItem,
    clearCustomerStoreSearchHistory,
    submitCustomerStoreSearch,
  } = props

  if (customerStoreSearchHistory.length === ZERO_COUNT) return null

  return (
    <div className={DELIVERY_UI.summaryBarClassName}>
      <div style={SEARCH_HISTORY_WRAPPER_STYLE}>
        <p>{CUSTOMER_STORE_BROWSE_COPY.searchHistoryLabel}</p>
        <div style={SEARCH_HISTORY_LIST_STYLE}>
          {customerStoreSearchHistory.map((keyword: string) => (
            <div key={keyword} style={SEARCH_HISTORY_ITEM_STYLE}>
              <button
                type={DELIVERY_UI.buttonType}
                onClick={() => submitCustomerStoreSearch(asDomainText<DisplayText>(keyword))}
                style={SEARCH_HISTORY_KEYWORD_BUTTON_STYLE}
              >
                {keyword}
              </button>
              <button
                onClick={() => removeCustomerStoreSearchHistoryItem(keyword)}
                aria-label={searchHistoryDeleteLabel(keyword)}
                type={DELIVERY_UI.buttonType}
                style={SEARCH_HISTORY_REMOVE_BUTTON_STYLE}
              >
                {CUSTOMER_STORE_BROWSE_COPY.searchHistoryRemoveButton}
              </button>
            </div>
          ))}
        </div>
      </div>
      <button
        className={DELIVERY_UI.secondaryButtonClassName}
        onClick={() => clearCustomerStoreSearchHistory()}
        type={DELIVERY_UI.buttonType}
      >
        {CUSTOMER_STORE_BROWSE_COPY.searchHistoryClearButton}
      </button>
    </div>
  )
}
