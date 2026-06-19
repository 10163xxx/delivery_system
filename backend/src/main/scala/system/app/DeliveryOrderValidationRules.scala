package system.app

// Business note: order validation rules for line items, menu selections, and delivery scheduling.
import system.objects.given
import services.order.objects.apiTypes.*

import services.customer.objects.*
import services.merchant.objects.*
import services.merchant.utils.*
import services.order.objects.*
import system.objects.*

import java.time.{Duration, Instant}
import java.time.temporal.ChronoUnit

private val requiredOrderCategoryName = wrapText[DisplayText]("必选品")

def buildLineItems(
    store: Store,
    items: List[OrderItemInput],
): Either[ErrorMessage, List[OrderLineItem]] =
  val selected = items.filter(_.quantity > NumericDefaults.ZeroQuantity)
  Either.cond(selected.nonEmpty, (), ValidationMessages.Order.OrderRequiresAtLeastOneItem).flatMap { _ =>
    selected.foldLeft[Either[ErrorMessage, List[OrderLineItem]]](Right(List.empty)) { (acc, item) =>
      for
        lineItems <- acc
        menuItem <- store.menu.find(_.id == item.menuItemId).toRight(joinValidationError(validationText("菜品不存在: "), validationShowValue(item.menuItemId)))
        selections <- validateOrderItemSelections(menuItem, item.selections)
        _ <- Either.cond(
          menuItem.remainingQuantity.forall(_ >= item.quantity),
          (),
          menuItem.remainingQuantity match
            case Some(NumericDefaults.ZeroQuantity) => joinValidationError(menuItem.name, validationText(" 已售罄"))
            case Some(remaining) => joinValidationError(menuItem.name, validationText(" 当前仅剩 "), validationShowValue(remaining), validationText(" 份"))
            case None => joinValidationError(menuItem.name, validationText(" 库存不足")),
        )
      yield lineItems :+ OrderLineItem(
        menuItem.id,
        menuItem.name,
        item.quantity,
        menuItem.priceCents + menuItemSelectionAdditionalPriceCents(menuItem, selections),
        NumericDefaults.ZeroQuantity,
        selections,
      )
    }
  }.flatMap(validateRequiredOrderCategory(store, _))

private def validateRequiredOrderCategory(
    store: Store,
    lineItems: List[OrderLineItem],
): Either[ErrorMessage, List[OrderLineItem]] =
  val requiredCategoryItems = store.menu.filter(_.category.contains(requiredOrderCategoryName))
  if requiredCategoryItems.isEmpty then Right(lineItems)
  else
    Either.cond(
      lineItems.exists(lineItem => requiredCategoryItems.exists(_.id == lineItem.menuItemId)),
      lineItems,
      requiredCategoryItemMissing(requiredOrderCategoryName),
    )

private def validateOrderItemSelections(
    menuItem: MenuItem,
    requestSelections: List[OrderItemSelection],
): Either[ErrorMessage, List[OrderItemSelection]] =
  val groupMap = menuItem.selectionGroups.map(group => group.name.raw -> group).toMap
  val requestMap = requestSelections.map(selection => selection.groupName.raw -> selection).toMap
  val hasDuplicateGroups = requestMap.size != requestSelections.length

  Either.cond(!hasDuplicateGroups, (), ValidationMessages.Order.MenuItemSelectionsRequired).flatMap { _ =>
    Either.cond(
      requestSelections.forall(selection => groupMap.contains(selection.groupName.raw)),
      (),
      ValidationMessages.Order.MenuItemSelectionsRequired,
    ).flatMap { _ =>
      menuItem.selectionGroups.foldLeft[Either[ErrorMessage, List[OrderItemSelection]]](Right(List.empty)) {
        case (acc, group) =>
          val requested = requestMap.get(group.name.raw)
          val selectedOptions = requested.map(_.selectedOptions).getOrElse(List.empty)
          val sanitizedOptions = selectedOptions.flatMap(option =>
            sanitizeOptionalText(Some(option), DeliveryValidationDefaults.MenuItemSelectionOptionMaxLength)
          )
          val uniqueOptions = sanitizedOptions.distinct

          for
            validated <- acc
            _ <- Either.cond(
              uniqueOptions.length == sanitizedOptions.length &&
                uniqueOptions.length >= group.minSelections &&
                uniqueOptions.length <= group.maxSelections &&
                uniqueOptions.forall(option => menuItemSelectionContainsOption(group, option)),
              (),
              ValidationMessages.Order.MenuItemSelectionsRequired,
            )
          yield
            if group.maxSelections > NumericDefaults.ZeroCount || uniqueOptions.nonEmpty then
              validated :+ OrderItemSelection(group.name, uniqueOptions)
            else validated
      }
    }
  }

def pendingRefundQuantity(order: OrderSummary, menuItemId: MenuItemId): Quantity =
  order.partialRefundRequests
    .filter(refund => refund.menuItemId == menuItemId && refund.status == PartialRefundStatus.Pending)
    .map(_.quantity)
    .sum

def validateScheduledDeliveryAt(
    scheduledDeliveryAt: IsoDateTime,
    orderTimestamp: IsoDateTime,
): Either[ErrorMessage, IsoDateTime] =
  parseInstant(scheduledDeliveryAt).toRight(ValidationMessages.Order.DeliveryTimeFormatInvalid).flatMap { scheduledInstant =>
    val orderInstant = Instant.parse(orderTimestamp.raw)
    val earliest = ceilToMinute(orderInstant.plus(Duration.ofMinutes(MinimumScheduledLeadMinutes)))
    val orderDate = orderInstant.atZone(DeliveryScheduleZone).toLocalDate
    val scheduledDate = scheduledInstant.atZone(DeliveryScheduleZone).toLocalDate
    Either
      .cond(!scheduledInstant.isBefore(earliest), (), deliveryTimeTooEarly(MinimumScheduledLeadMinutes))
      .flatMap(_ => Either.cond(scheduledDate == orderDate, (), ValidationMessages.Order.DeliveryTimeTodayOnly))
      .map(_ => wrapText[IsoDateTime](scheduledInstant.toString))
  }

def ceilToMinute(instant: Instant): Instant =
  val truncated = instant.truncatedTo(ChronoUnit.MINUTES)
  if truncated == instant then instant else truncated.plus(TimeDefaults.MinutesRoundingStep.raw.toLong, ChronoUnit.MINUTES)

def canReviewOrder(order: OrderSummary, currentTime: IsoDateTime): ApprovalFlag =
  new ApprovalFlag(
    order.status == OrderStatus.Completed &&
      hasPendingReviewSection(order) &&
      isWithinRecentWindow(reviewEligibilityTimestamp(order), currentTime, ReviewWindowDays)
  )

def hasPendingReviewSection(order: OrderSummary): ApprovalFlag =
  new ApprovalFlag(order.storeRating.isEmpty || (order.riderId.nonEmpty && order.riderRating.isEmpty))

def reviewEligibilityTimestamp(order: OrderSummary): IsoDateTime =
  order.timeline.reverseIterator
    .find(_.status == OrderStatus.Completed)
    .map(_.at)
    .getOrElse(order.updatedAt)

def validateOrderCoupon(
    customer: Customer,
    couponId: Option[CouponId],
    itemSubtotalCents: CurrencyCents,
): Either[ErrorMessage, Option[Coupon]] =
  couponId.map(value => wrapText[CouponId](value.raw.trim)).filter(_.nonEmpty) match
    case None => Right(None)
    case Some(requestedCouponId) =>
      for
        coupon <- customer.coupons.find(_.id == requestedCouponId).toRight(ValidationMessages.Order.CouponUnavailable)
        _ <- Either.cond(itemSubtotalCents >= coupon.minimumSpendCents, (), couponThresholdNotMet(coupon.title))
      yield Some(coupon)

def calculateCouponDiscount(
    coupon: Option[Coupon],
    itemSubtotalCents: CurrencyCents,
    deliveryFeeCents: CurrencyCents,
): CurrencyCents =
  coupon match
    case Some(value) => minCurrencyCents(value.discountCents, maxCurrencyCents(NumericDefaults.ZeroCurrencyCents, itemSubtotalCents + deliveryFeeCents))
    case None => NumericDefaults.ZeroCurrencyCents
