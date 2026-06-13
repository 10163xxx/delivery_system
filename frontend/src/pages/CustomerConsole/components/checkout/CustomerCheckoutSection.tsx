import type { CheckoutPanelProps } from '@/pages/CustomerConsole/objects/CustomerCheckoutObjects'
import {
  CUSTOMER_CHECKOUT_COPY,
} from '@/pages/CustomerConsole/components/checkout/CustomerCheckoutCopy'
import {
  CustomerCheckoutActionBar,
  CustomerCheckoutFormFields,
  CustomerCheckoutPaymentSummary,
  CustomerCheckoutPriceSummary,
} from '@/pages/CustomerConsole/components/checkout/CustomerCheckoutBlocks'

export function CustomerCheckoutSection(props: CheckoutPanelProps) {
  if (!props.isCheckoutExpanded || !props.selectedStore) return null

  return (
    <section className="checkout-panel">
      <div className="checkout-panel-header">
        <div>
          <p className="ticket-kind">{CUSTOMER_CHECKOUT_COPY.panel.checkoutTicketKind}</p>
          <h3>{CUSTOMER_CHECKOUT_COPY.panel.checkoutTitle}</h3>
          <p className="meta-line">{CUSTOMER_CHECKOUT_COPY.panel.checkoutDescription}</p>
        </div>
        <button
          className="secondary-button"
          onClick={() => props.setIsCheckoutExpanded(false)}
          type="button"
        >
          {CUSTOMER_CHECKOUT_COPY.panel.removePanel}
        </button>
      </div>
      <div className="form-grid">
        <CustomerCheckoutFormFields {...props} />
        <CustomerCheckoutPriceSummary {...props} />
        <CustomerCheckoutPaymentSummary {...props} />
        <CustomerCheckoutActionBar {...props} />
      </div>
    </section>
  )
}
