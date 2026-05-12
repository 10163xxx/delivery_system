package review.app

import domain.shared.given

import cats.effect.IO
import domain.admin.*
import domain.auth.*
import domain.shared.*
import shared.app.*

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
