import type { Role } from '@/objects/core/SharedObjects'
import type { OrderChatPanelProps } from '@/pages/order/objects/OrderPageObjects'
import { ORDER_PAGE_COPY } from '@/pages/order/OrderPageCopy'
import { asDomainText } from '@/features/delivery/DeliveryShared'
import type { DisplayText } from '@/objects/core/SharedObjects'

const roleLabelMap: Record<Role, string> = {
  customer: ORDER_PAGE_COPY.chat.roleCustomer,
  merchant: ORDER_PAGE_COPY.chat.roleMerchant,
  rider: ORDER_PAGE_COPY.chat.roleRider,
  admin: ORDER_PAGE_COPY.chat.roleAdmin,
}

export function OrderChatPanel({
  order,
  currentRole,
  currentDisplayName,
  draft,
  errorText,
  disabled = false,
  disabledReason,
  formatTime,
  onChangeDraft,
  onSubmit,
}: OrderChatPanelProps) {
  return (
    <section className="order-chat-panel">
      <div className="order-chat-header">
        <div>
          <p className="ticket-kind">{ORDER_PAGE_COPY.chat.ticketKind}</p>
          <h4>{ORDER_PAGE_COPY.chat.title}</h4>
        </div>
        <span className="badge">
          {roleLabelMap[currentRole]}
          {ORDER_PAGE_COPY.chat.badgeSeparator}
          {currentDisplayName}
        </span>
      </div>
      <div className="order-chat-history">
        {order.chatMessages.length === 0 ? (
          <div className="empty-card order-chat-empty">
            {ORDER_PAGE_COPY.chat.emptyHint}
          </div>
        ) : (
          order.chatMessages.map((message) => {
            const isSelf =
              message.senderRole === currentRole && message.senderName === currentDisplayName

            return (
              <article
                key={message.id}
                className={`order-chat-message${isSelf ? ' is-self' : ''}`}
              >
                <div className="order-chat-meta">
                  <strong>{message.senderName}</strong>
                  <span>
                    {roleLabelMap[message.senderRole]}
                    {ORDER_PAGE_COPY.chat.badgeSeparator}
                    {formatTime(message.sentAt)}
                  </span>
                </div>
                <p>{message.body}</p>
              </article>
            )
          })
        )}
      </div>
      {disabledReason ? <p className="meta-line">{disabledReason}</p> : null}
      <div className="order-chat-composer">
        <input
          className={errorText ? 'field-error' : undefined}
          disabled={disabled}
          placeholder={ORDER_PAGE_COPY.chat.inputPlaceholder}
          value={draft}
          onChange={(event) => onChangeDraft(asDomainText<DisplayText>(event.target.value))}
        />
        <button
          className="primary-button"
          disabled={disabled}
          onClick={onSubmit}
          type="button"
        >
          {ORDER_PAGE_COPY.chat.submitButton}
        </button>
      </div>
      {errorText ? <small className="field-error-text">{errorText}</small> : null}
    </section>
  )
}
