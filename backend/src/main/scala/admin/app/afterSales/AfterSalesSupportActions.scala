package admin.app

import domain.shared.given

import cats.effect.IO
import domain.admin.*
import domain.auth.*
import domain.customer.*
import domain.order.*
import domain.shared.*
import shared.app.*

def resolveAfterSalesTicket(
      ticketId: TicketId,
      request: ResolveAfterSalesRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          ticket <- findAfterSalesTicket(current, ticketId)
          _ <- requireAfterSalesTicket(ticket)
          _ <- requireOpenAfterSalesTicket(ticket)
          order <- findAfterSalesOrderByTicket(current, ticket)
          customer <- findRelatedCustomer(current, order)
          requestType <- ticket.requestType.toRight(ValidationMessages.AfterSales.MissingAfterSalesRequestType)
          resolutionNote <- sanitizeSupportResolutionNote(request.resolutionNote)
          resolutionMode = resolveAfterSalesMode(request)
          creditedAmount <- resolveCreditedAmount(
            AfterSalesResolutionContext(request, ticket, order, requestType, resolutionMode)
          )
        yield
          val timestamp = now()
          val issuedCoupon =
            if request.approved && resolutionMode == AfterSalesResolutionMode.Coupon then
              Some(buildAfterSalesCoupon(customer.id, requestType, creditedAmount, timestamp))
            else None
          val outcomeNote =
            buildAfterSalesOutcomeNote(
              requestType,
              request.approved,
              resolutionMode,
              creditedAmount,
              issuedCoupon,
              resolutionNote,
            )
          val nextCustomers =
            current.customers.map(entry =>
              if entry.id == customer.id then
                updateAfterSalesCustomer(entry, request.approved, resolutionMode, creditedAmount, issuedCoupon)
              else entry
            )
          val nextOrders = current.orders.map(entry =>
            if entry.id == order.id then
              entry.copy(
                lifecycle = entry.lifecycle.copy(updatedAt = timestamp),
                activity = entry.activity.copy(
                  timeline = entry.timeline :+ OrderTimelineEntry(entry.status, outcomeNote, timestamp)
                ),
              )
            else entry
          )
          val nextTickets = current.tickets.map(entry =>
            if entry.id == ticket.id then
              entry.copy(
                status = TicketStatus.Resolved,
                resolution = entry.resolution.copy(
                  approved = Some(request.approved),
                  actualCompensationCents =
                    if request.approved && creditedAmount > NumericDefaults.ZeroCurrencyCents then Some(creditedAmount) else None,
                  resolutionMode = if request.approved then Some(resolutionMode) else Some(AfterSalesResolutionMode.Manual),
                  issuedCoupon = issuedCoupon,
                  resolutionNote = Some(resolutionNote),
                  reviewedAt = Some(timestamp),
                ),
                updatedAt = timestamp,
              )
            else entry
          )
          withDerivedData(
            current.copy(
              customers = nextCustomers,
              deliveryState = current.deliveryState.copy(orders = nextOrders, tickets = nextTickets),
            )
          )
      }
    }

def submitAfterSalesRequest(
      orderId: OrderId,
      request: SubmitAfterSalesRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- findAfterSalesOrder(current, orderId)
          _ <- Either.cond(!hasPendingAfterSalesTicket(current, orderId), (), ValidationMessages.AfterSales.PendingAfterSalesExists)
          reason <- sanitizeAfterSalesReason(request.reason)
          expectedCompensationCents <- validateExpectedCompensation(request)
        yield
          val timestamp = now()
          val ticket = buildAfterSalesTicket(order, request, reason, expectedCompensationCents, timestamp)
          val nextOrders = current.orders.map(entry =>
            if entry.id == order.id then
              entry.copy(
                lifecycle = entry.lifecycle.copy(updatedAt = timestamp),
                activity = entry.activity.copy(
                  timeline = entry.timeline :+ OrderTimelineEntry(
                    entry.status,
                    renderOrderTimelineMessage(OrderTimelineMessage.AfterSalesSubmitted),
                    timestamp,
                  )
                ),
              )
            else entry
          )
          withDerivedData(
            current.copy(
              deliveryState = current.deliveryState.copy(
                orders = nextOrders,
                tickets = ticket :: current.tickets,
              )
            )
          )
      }
    }
