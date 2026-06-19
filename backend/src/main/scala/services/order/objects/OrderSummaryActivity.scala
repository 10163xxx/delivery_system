package services.order.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import services.order.objects.apiTypes.*

final case class OrderSummaryActivity(
    timeline: List[OrderTimelineEntry],
    chatMessages: List[OrderChatMessage],
    partialRefundRequests: List[OrderPartialRefundRequest],
)
