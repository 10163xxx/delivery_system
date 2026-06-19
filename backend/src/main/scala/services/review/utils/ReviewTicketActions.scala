package services.review.utils

// Business note: service business action/support code; keep validation and state transitions explicit and side effects in IO.
import system.objects.given
import services.admin.objects.apiTypes.*
import system.app.objects.*
import services.order.objects.*

import cats.effect.IO
import services.admin.objects.*
import services.auth.objects.*
import system.objects.*
import system.app.*

def resolveTicket(
      orderId: OrderId,
      request: ResolveTicketRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          _ <- hasResolvableAdminTicket(current, orderId)
          resolution <- sanitizeRequiredText(
            request.resolution,
            DeliveryValidationDefaults.TicketResolutionMaxLength,
            ValidationMessages.Review.TicketResolutionRequired,
          )
          note <- sanitizeRequiredText(
            request.note,
            DeliveryValidationDefaults.OrderReasonMaxLength,
            ValidationMessages.AfterSales.ResolutionNoteRequired,
          )
        yield
          val timestamp = now()
          val resolutionText = renderAdminTicketResolution(resolution, note)
          withDerivedData(
            current.copy(
              deliveryState = current.deliveryState.copy(
                tickets = resolveAdminTickets(current.tickets, orderId, resolutionText, timestamp)
              )
            )
          )
      }
    }
