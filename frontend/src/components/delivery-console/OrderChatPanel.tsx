import type { OrderSummary, Role } from '@/domain'

type OrderChatPanelProps = {
  order: OrderSummary
  currentRole: Role
  currentDisplayName: string
  draft: string
  errorText?: string
  disabled?: boolean
  disabledReason?: string
  formatTime: (value: string) => string
  onChangeDraft: (value: string) => void
  onSubmit: () => void
}

const roleLabelMap: Record<Role, string> = {
  customer: '顾客',
  merchant: '商家',
  rider: '骑手',
  admin: '管理员',
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
          <p className="ticket-kind">订单沟通</p>
          <h4>顾客 / 商家 / 骑手群聊</h4>
        </div>
        <span className="badge">
          {roleLabelMap[currentRole]} · {currentDisplayName}
        </span>
      </div>
      <div className="order-chat-history">
        {order.chatMessages.length === 0 ? (
          <div className="empty-card order-chat-empty">
            当前还没有沟通消息，可以先说明出餐、取餐或送达要求。
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
                    {roleLabelMap[message.senderRole]} · {formatTime(message.sentAt)}
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
          placeholder="输入消息，例如请放门口、餐已备好、我已到店门口"
          value={draft}
          onChange={(event) => onChangeDraft(event.target.value)}
        />
        <button
          className="primary-button"
          disabled={disabled}
          onClick={onSubmit}
          type="button"
        >
          发送
        </button>
      </div>
      {errorText ? <small className="field-error-text">{errorText}</small> : null}
    </section>
  )
}
