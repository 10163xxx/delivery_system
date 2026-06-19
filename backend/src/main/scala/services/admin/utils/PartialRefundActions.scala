package services.admin.utils

// Business note: service business action/support code; keep validation and state transitions explicit and side effects in IO.
import system.objects.given
import services.order.objects.apiTypes.*
import system.app.objects.*

import cats.effect.IO
import services.order.objects.*
import system.objects.*
import system.app.*

def ownsPartialRefundRequestAsMerchant(refundId: RefundRequestId, merchantName: PersonName): ApprovalFlag =
    val current = stateRef.get()
    new ApprovalFlag(
      current.orders.exists(order =>
        order.partialRefundRequests.exists(_.id == refundId) &&
          current.stores.exists(store => store.id == order.storeId && store.merchantName == merchantName)
      )
    )

def submitPartialRefundRequest(
      orderId: OrderId,
      request: SubmitPartialRefundRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- findCaseOrder(current, orderId)
          _ <- requireRefundableOrder(order)
          item <- order.items.find(_.menuItemId == request.menuItemId).toRight(ValidationMessages.AfterSales.PartialRefundItemMissing)
          _ <- Either.cond(request.quantity > DeliveryValidationDefaults.MenuItemPriceMinCentsExclusive, (), ValidationMessages.AfterSales.PartialRefundQuantityInvalid)
          remainingRefundable = item.quantity - item.refundedQuantity - pendingRefundQuantity(order, item.menuItemId)
          _ <- Either.cond(remainingRefundable > NumericDefaults.ZeroQuantity, (), ValidationMessages.AfterSales.PartialRefundQuantityUnavailable)
          _ <- Either.cond(request.quantity <= remainingRefundable, (), partialRefundQuantityExceeded(remainingRefundable))
          reason <- sanitizeRequiredText(request.reason, DeliveryValidationDefaults.OrderReasonMaxLength, ValidationMessages.AfterSales.PartialRefundReasonRequired)
        yield
          val timestamp = now()
          val partialRefund = buildPartialRefundRequest(order, item, request, reason, timestamp)
          val nextOrders = current.orders.map(entry =>
            if entry.id == order.id then
              entry.copy(
                lifecycle = entry.lifecycle.copy(updatedAt = timestamp),
                activity = entry.activity.copy(
                  partialRefundRequests = entry.partialRefundRequests :+ partialRefund,
                  timeline = entry.timeline :+ OrderTimelineEntry(
                    entry.status,
                    renderOrderTimelineMessage(
                      OrderTimelineMessage.PartialRefundRequested(item.name, request.quantity, reason)
                    ),
                    timestamp,
                  ),
                ),
              )
            else entry
          )
          withDerivedData(current.copy(deliveryState = current.deliveryState.copy(orders = nextOrders)))
      }
    }

def resolvePartialRefundRequest(
      refundId: RefundRequestId,
      request: ResolvePartialRefundRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          context <- validatePartialRefundResolution(current, refundId, request)
        yield
          val timestamp = now()
          val reviewedRefund = reviewPartialRefund(
            context.partialRefund,
            request.approved,
            context.resolutionNote,
            timestamp,
          )
          val refundAmountCents = context.item.unitPriceCents * context.partialRefund.quantity
          val nextOrders = current.orders.map(entry =>
            if entry.id == context.order.id then
              buildResolvedPartialRefundOrder(
                entry,
                context,
                reviewedRefund,
                request.approved,
                refundAmountCents,
                timestamp,
              )
            else entry
          )
          val nextCustomers = buildCustomersAfterPartialRefundResolution(
            current,
            context,
            request.approved,
            refundAmountCents,
          )
          withDerivedData(
            current.copy(
              customers = nextCustomers,
              deliveryState = current.deliveryState.copy(orders = nextOrders),
            )
          )
      }
    }
