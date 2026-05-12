package shared.app

import domain.shared.given

import domain.admin.*
import domain.customer.*
import domain.merchant.*
import domain.order.*
import domain.review.*
import domain.shared.*

import java.time.{Duration, Instant, LocalTime}
import java.time.temporal.ChronoUnit
import java.util.UUID

val validationStoreRevoked = StoreRevokedStatus
val validationRiderSuspended = RiderSuspendedStatus
val validationStoreOpen = StoreOpenStatus
val afterSalesCouponDescription = new DescriptionText("管理员处理售后申请后补发，可在有效期内下单抵扣")
val afterSalesReturnCouponTitle = new DisplayText("售后退货补偿券")
val afterSalesCompensationCouponTitle = new DisplayText("售后补偿券")
def validationText(value: String): DisplayText = new DisplayText(value)

def validationShowValue[T](value: T)(using renderer: DisplayTextRenderer[T]): DisplayText =
  renderer.render(value)

def joinValidationText(parts: DisplayText*): DisplayText =
  new DisplayText(parts.map(_.raw).mkString)

def joinValidationError(parts: DisplayText*): ErrorMessage =
  new ErrorMessage(joinValidationText(parts*).raw)

def sanitizeRequiredText(
    value: DisplayText,
    maxLength: EntityCount,
    errorMessage: ErrorMessage,
): Either[ErrorMessage, DisplayText] =
  val sanitized = sanitizeText(value, maxLength)
  Either.cond(sanitized.nonEmpty, sanitized, errorMessage)

def sanitizeRequiredText[T](
    value: T,
    maxLength: EntityCount,
    errorMessage: ErrorMessage,
)(using wrapped: WrappedTextType[T]): Either[ErrorMessage, T] =
  val sanitized = sanitizeText(new DisplayText(value.raw), maxLength)
  Either.cond(sanitized.nonEmpty, wrapText(sanitized.raw), errorMessage)

def sanitizeOptionalText(value: Option[DisplayText], maxLength: EntityCount): Option[DisplayText] =
  value.flatMap(text =>
    sanitizeText(text, maxLength) match
      case sanitized if sanitized.isEmpty => None
      case sanitized => Some(sanitized)
  )

def sanitizeOptionalText[T](value: Option[T], maxLength: EntityCount)(using
    wrapped: WrappedTextType[T]
): Option[T] =
  value.flatMap(text =>
    sanitizeText(new DisplayText(text.raw), maxLength) match
      case sanitized if sanitized.isEmpty => None
      case sanitized => Some(wrapText(sanitized.raw))
  )

def sanitizeText(value: DisplayText, maxLength: EntityCount): DisplayText =
  new DisplayText(
    value.raw
      .trim
      .filter(character => !Character.isISOControl(character) || character == '\n' || character == '\t')
      .replace('\n', ' ')
      .replace('\t', ' ')
      .split(' ')
      .filter(_.nonEmpty)
      .mkString(" ")
      .take(maxLength)
  )

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
        menuItem.priceCents,
        NumericDefaults.ZeroQuantity,
      )
    }
  }

def pendingRefundQuantity(order: OrderSummary, menuItemId: MenuItemId): Quantity =
  order.partialRefundRequests
    .filter(refund => refund.menuItemId == menuItemId && refund.status == PartialRefundStatus.Pending)
    .map(_.quantity)
    .sum

def formatCurrency(amountCents: CurrencyCents): DisplayText =
  joinValidationText(
    validationShowValue(
      BigDecimal(amountCents)
        ./(BigDecimal(NumericDefaults.CurrencyCentsPerYuan))
        .setScale(NumericDefaults.CurrencyDisplayScale, BigDecimal.RoundingMode.HALF_UP)
    ),
    validationText(" 元"),
  )

def buildAfterSalesCoupon(
    customerId: CustomerId,
    requestType: AfterSalesRequestType,
    discountCents: CurrencyCents,
    currentTime: IsoDateTime,
): Coupon =
  val title =
    requestType match
      case AfterSalesRequestType.ReturnRequest => afterSalesReturnCouponTitle
      case AfterSalesRequestType.CompensationRequest => afterSalesCompensationCouponTitle
  Coupon(
    id = List("coupon-", customerId, "-after-sales-", UUID.randomUUID().toString.take(IdentifierDefaults.GeneratedCouponSuffixLength)).mkString,
    title = title,
    discountCents = discountCents,
    minimumSpendCents = NumericDefaults.ZeroCurrencyCents,
    description = afterSalesCouponDescription,
    expiresAt = new IsoDateTime(Instant.parse(currentTime.raw).plusSeconds(CouponValidityDays * TimeDefaults.SecondsPerDay).toString),
  )

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
      .map(_ => new IsoDateTime(scheduledInstant.toString))
  }

def ceilToMinute(instant: Instant): Instant =
  val truncated = instant.truncatedTo(ChronoUnit.MINUTES)
  if truncated == instant then instant else truncated.plus(TimeDefaults.MinutesRoundingStep.raw.toLong, ChronoUnit.MINUTES)

def canReviewOrder(order: OrderSummary, currentTime: IsoDateTime): ApprovalFlag =
  order.status == OrderStatus.Completed &&
    hasPendingReviewSection(order) &&
    isWithinRecentWindow(reviewEligibilityTimestamp(order), currentTime, ReviewWindowDays)

def hasPendingReviewSection(order: OrderSummary): ApprovalFlag =
  order.storeRating.isEmpty || (order.riderId.nonEmpty && order.riderRating.isEmpty)

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
  couponId.map(value => new EntityId(value.raw.trim)).filter(_.nonEmpty) match
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
    case Some(value) => Math.min(value.discountCents, Math.max(NumericDefaults.ZeroCurrencyCents, itemSubtotalCents + deliveryFeeCents))
    case None => NumericDefaults.ZeroCurrencyCents

def createApprovedStore(application: MerchantApplication): Store =
  val storeId = new EntityId(List("store-", application.id.raw.takeRight(IdentifierDefaults.ApprovedStoreIdSuffixLength)).mkString)
  Store(
    id = storeId,
    merchantName = application.merchantName,
    name = application.storeName,
    category = application.category,
    cuisine = new CuisineLabel(application.category.raw),
    status = validationStoreOpen,
    businessHours = application.businessHours,
    avgPrepMinutes = application.avgPrepMinutes,
    imageUrl = application.imageUrl,
    menu = List.empty,
    averageRating = NumericDefaults.ZeroAverageRating,
    ratingCount = NumericDefaults.ZeroCount,
    oneStarRatingCount = NumericDefaults.ZeroCount,
    revenueCents = NumericDefaults.ZeroCurrencyCents,
  )

def validateBusinessHours(
    businessHours: BusinessHours
): Either[ErrorMessage, BusinessHours] =
  for
    openTime <- sanitizeRequiredText(businessHours.openTime, DeliveryValidationDefaults.OpenCloseTimeLength, ValidationMessages.Merchant.OpenTimeRequired)
    closeTime <- sanitizeRequiredText(businessHours.closeTime, DeliveryValidationDefaults.OpenCloseTimeLength, ValidationMessages.Merchant.CloseTimeRequired)
    open <- parseBusinessTime(openTime).toRight(ValidationMessages.Merchant.BusinessHoursFormatInvalid)
    close <- parseBusinessTime(closeTime).toRight(ValidationMessages.Merchant.BusinessHoursFormatInvalid)
    _ <- Either.cond(open.isBefore(close), (), ValidationMessages.Merchant.BusinessHoursOrderInvalid)
  yield BusinessHours(
    openTime = new TimeOfDay(open.toString),
    closeTime = new TimeOfDay(close.toString),
  )

def parseBusinessTime(value: TimeOfDay): Option[LocalTime] =
  try Some(LocalTime.parse(value.raw))
  catch case _: Exception => None

def formatBusinessHours(businessHours: BusinessHours): DisplayText =
  joinValidationText(showValue(businessHours.openTime), text(" - "), showValue(businessHours.closeTime))

def isStoreOpenAt(store: Store, currentTimestamp: IsoDateTime): ApprovalFlag =
  (for
    instant <- parseInstant(currentTimestamp)
    open <- parseBusinessTime(store.businessHours.openTime)
    close <- parseBusinessTime(store.businessHours.closeTime)
  yield
    val currentLocalTime = instant.atZone(DeliveryScheduleZone).toLocalTime
    !currentLocalTime.isBefore(open) && currentLocalTime.isBefore(close)
  ).getOrElse(false)

def replaceApplication(
    applications: List[MerchantApplication],
    target: MerchantApplication,
): List[MerchantApplication] =
  applications.map(application => if application.id == target.id then target else application)

def replaceMerchantProfile(
    profiles: List[MerchantProfile],
    target: MerchantProfile,
): List[MerchantProfile] =
  profiles.map(profile => if profile.id == target.id then target else profile)

def replaceAppeal(
    appeals: List[ReviewAppeal],
    target: ReviewAppeal,
): List[ReviewAppeal] =
  appeals.map(appeal => if appeal.id == target.id then target else appeal)

def replaceEligibilityReview(
    reviews: List[EligibilityReview],
    target: EligibilityReview,
): List[EligibilityReview] =
  reviews.map(review => if review.id == target.id then target else review)

def parseInstant(value: IsoDateTime): Option[Instant] =
  try Some(Instant.parse(value.raw))
  catch case _: Exception => None

def isWithinRecentWindow(
    timestamp: IsoDateTime,
    currentTime: IsoDateTime,
    days: DurationDays,
): ApprovalFlag =
  !Instant.parse(timestamp.raw).isBefore(Instant.parse(currentTime.raw).minusSeconds(days * TimeDefaults.SecondsPerDay))
