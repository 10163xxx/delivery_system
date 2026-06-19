package services.admin.utils

// Business note: shared admin case lookup and resolution-note validation rules.
import services.order.objects.*
import system.app.objects.*
import system.objects.*
import system.app.*

private[utils] def findCaseOrder(
      current: DeliveryAppState,
      orderId: OrderId,
  ): Either[ErrorMessage, OrderSummary] =
    current.orders.find(_.id == orderId).toRight(ValidationMessages.Order.OrderNotFound)

private[utils] def sanitizeCaseResolutionNote(value: ResolutionText): Either[ErrorMessage, ResolutionText] =
    sanitizeRequiredText(
      value,
      DeliveryValidationDefaults.OrderReasonMaxLength,
      ValidationMessages.AfterSales.ResolutionNoteRequired,
    )
