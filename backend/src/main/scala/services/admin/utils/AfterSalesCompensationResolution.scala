package services.admin.utils

// Business note: after-sales compensation resolution calculations and customer credit/coupon updates.
import system.objects.given
import services.order.objects.apiTypes.*
import system.app.objects.*

import services.admin.objects.*
import services.customer.objects.*
import services.order.objects.*
import system.objects.*
import system.app.*

private[utils] val afterSalesCouponDescription = wrapText[DescriptionText]("管理员处理售后申请后补发，可在有效期内下单抵扣")
private[utils] val afterSalesReturnCouponTitle = wrapText[DisplayText]("售后退货补偿券")
private[utils] val afterSalesCompensationCouponTitle = wrapText[DisplayText]("售后补偿券")

private[utils] def resolveAfterSalesMode(request: ResolveAfterSalesRequest): AfterSalesResolutionMode =
  if request.approved then request.resolutionMode.getOrElse(AfterSalesResolutionMode.Balance)
  else AfterSalesResolutionMode.Manual

private[utils] def resolveCreditedAmount(
    context: AfterSalesResolutionContext,
): Either[ErrorMessage, CurrencyCents] =
  if !context.request.approved then Right(NumericDefaults.ZeroCurrencyCents)
  else
    context.resolutionMode match
      case AfterSalesResolutionMode.Manual =>
        Right(NumericDefaults.ZeroCurrencyCents)
      case AfterSalesResolutionMode.Balance | AfterSalesResolutionMode.Coupon =>
        context.requestType match
          case AfterSalesRequestType.ReturnRequest =>
            val amount = context.request.actualCompensationCents.getOrElse(context.order.totalPriceCents)
            Either.cond(
              amount > DeliveryValidationDefaults.CompensationAmountMinCentsExclusive,
              amount,
              ValidationMessages.AfterSales.RefundAmountMustBePositive,
            )
          case AfterSalesRequestType.CompensationRequest =>
            context.request.actualCompensationCents.orElse(context.ticket.expectedCompensationCents) match
              case Some(value) if value > DeliveryValidationDefaults.CompensationAmountMinCentsExclusive =>
                Right(value)
              case Some(_) => Left(ValidationMessages.AfterSales.CompensationAmountMustBePositive)
              case None => Left(ValidationMessages.AfterSales.CompensationAmountRequired)

private[utils] def buildAfterSalesOutcomeNote(
    requestType: AfterSalesRequestType,
    approved: ApprovalFlag,
    resolutionMode: AfterSalesResolutionMode,
    creditedAmount: CurrencyCents,
    issuedCoupon: Option[Coupon],
    resolutionNote: ResolutionText,
): DisplayText =
  if !approved then renderAfterSalesOutcomeMessage(AfterSalesOutcomeMessage.Rejected(resolutionNote))
  else
    resolutionMode match
      case AfterSalesResolutionMode.Balance =>
        requestType match
          case AfterSalesRequestType.ReturnRequest =>
            renderAfterSalesOutcomeMessage(AfterSalesOutcomeMessage.ReturnToBalance(creditedAmount, resolutionNote))
          case AfterSalesRequestType.CompensationRequest =>
            renderAfterSalesOutcomeMessage(AfterSalesOutcomeMessage.CompensationToBalance(creditedAmount, resolutionNote))
      case AfterSalesResolutionMode.Coupon =>
        issuedCoupon match
          case Some(coupon) =>
            renderAfterSalesOutcomeMessage(
              AfterSalesOutcomeMessage.CouponIssued(coupon.title, coupon.discountCents, resolutionNote)
            )
          case None =>
            renderAfterSalesOutcomeMessage(AfterSalesOutcomeMessage.ManualApproved(resolutionNote))
      case AfterSalesResolutionMode.Manual =>
        renderAfterSalesOutcomeMessage(AfterSalesOutcomeMessage.ManualApproved(resolutionNote))

private[utils] def updateAfterSalesCustomer(
    customer: Customer,
    approved: ApprovalFlag,
    resolutionMode: AfterSalesResolutionMode,
    creditedAmount: CurrencyCents,
    issuedCoupon: Option[Coupon],
): Customer =
  resolutionMode match
    case AfterSalesResolutionMode.Balance if approved && creditedAmount > NumericDefaults.ZeroCurrencyCents =>
      customer.copy(
        metrics = customer.metrics.copy(
          balanceCents = new CurrencyCents(customer.balanceCents + creditedAmount)
        )
      )
    case AfterSalesResolutionMode.Coupon if approved =>
      customer.copy(
        metrics = customer.metrics.copy(
          coupons = issuedCoupon.toList ++ customer.coupons
        )
      )
    case _ => customer

private[utils] def buildAfterSalesCoupon(
    customerId: CustomerId,
    requestType: AfterSalesRequestType,
    discountCents: CurrencyCents,
    currentTime: IsoDateTime,
): Either[ErrorMessage, Coupon] =
  val title =
    requestType match
      case AfterSalesRequestType.ReturnRequest => afterSalesReturnCouponTitle
      case AfterSalesRequestType.CompensationRequest => afterSalesCompensationCouponTitle
  parseIsoInstant(currentTime)
    .toRight(ValidationMessages.AfterSales.AfterSalesCouponTimeInvalid)
    .map(currentInstant =>
      Coupon(
        id = new CouponId(List("coupon-", customerId.raw, "-afterSales-", java.util.UUID.randomUUID().toString.take(IdentifierDefaults.GeneratedCouponSuffixLength)).mkString),
        title = title,
        discountCents = discountCents,
        minimumSpendCents = NumericDefaults.ZeroCurrencyCents,
        description = afterSalesCouponDescription,
        expiresAt = isoDateTimeFromInstant(currentInstant.plusSeconds(CouponValidityDays * TimeDefaults.SecondsPerDay)),
      )
    )
