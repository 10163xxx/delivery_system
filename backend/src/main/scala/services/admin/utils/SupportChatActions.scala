package services.admin.utils

// Business note: service business action/support code; keep validation and state transitions explicit and side effects in IO.
import cats.effect.IO
import services.order.objects.apiTypes.*
import system.app.objects.*
import services.auth.objects.*
import services.order.objects.*
import system.objects.*
import system.app.*

private def buildOrderChatMessage(
      senderRole: UserRole,
      senderName: PersonName,
      body: DisplayText,
      timestamp: IsoDateTime,
  ): OrderChatMessage =
    OrderChatMessage(
      id = nextId(new DisplayText("chat")),
      senderRole = senderRole,
      senderName = senderName,
      body = body,
      sentAt = timestamp,
    )

def addOrderChatMessage(
      orderId: OrderId,
      senderRole: UserRole,
      senderName: PersonName,
      request: SendOrderChatMessageRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          _ <- findCaseOrder(current, orderId)
          body <- sanitizeRequiredText(request.body, DeliveryValidationDefaults.OrderChatMessageMaxLength, ValidationMessages.Order.OrderChatMessageRequired)
        yield
          val timestamp = now()
          val message = buildOrderChatMessage(senderRole, senderName, body, timestamp)
          val nextOrders = current.orders.map(entry =>
            if entry.id == orderId then
              entry.copy(
                lifecycle = entry.lifecycle.copy(updatedAt = timestamp),
                activity = entry.activity.copy(chatMessages = entry.chatMessages :+ message),
              )
            else entry
          )
          withDerivedData(current.copy(deliveryState = current.deliveryState.copy(orders = nextOrders)))
      }
    }
