package domain.order

final case class OrderSummaryActivity(
    timeline: List[OrderTimelineEntry],
    chatMessages: List[OrderChatMessage],
    partialRefundRequests: List[OrderPartialRefundRequest],
)
