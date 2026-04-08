package app.delivery

import domain.admin.*
import domain.customer.*
import domain.merchant.*
import domain.order.*
import domain.review.*
import domain.shared.*

import java.time.{Duration, Instant, LocalTime}
import java.time.temporal.ChronoUnit
import java.util.UUID

private[delivery] def validateMerchantRegistration(
      request: MerchantRegistrationRequest
  ): Either[String, MerchantRegistrationRequest] =
    for
      merchantName <- sanitizeRequiredText(request.merchantName, DeliveryValidationDefaults.MerchantNameMaxLength, ValidationMessages.MerchantNameRequired)
      storeName <- sanitizeRequiredText(request.storeName, DeliveryValidationDefaults.StoreNameMaxLength, ValidationMessages.StoreNameRequired)
      category <- sanitizeRequiredText(request.category, DeliveryValidationDefaults.StoreCategoryMaxLength, ValidationMessages.StoreCategoryRequired)
      _ <- Either.cond(StoreCategories.contains(category), (), ValidationMessages.InvalidStoreCategory)
      businessHours <- validateBusinessHours(request.businessHours)
      _ <- Either.cond(
        request.avgPrepMinutes >= DeliveryValidationDefaults.PrepMinutesMin &&
          request.avgPrepMinutes <= DeliveryValidationDefaults.PrepMinutesMax,
        (),
        ValidationMessages.PrepMinutesInvalid,
      )
    yield MerchantRegistrationRequest(
      merchantName = merchantName,
      storeName = storeName,
      category = category,
      businessHours = businessHours,
      avgPrepMinutes = request.avgPrepMinutes,
      imageUrl = sanitizeOptionalText(request.imageUrl, DeliveryValidationDefaults.ImageUrlMaxLength),
      note = sanitizeOptionalText(request.note, DeliveryValidationDefaults.NoteMaxLength),
    )

private[delivery] def validateMenuItemRequest(
      request: AddMenuItemRequest
  ): Either[String, AddMenuItemRequest] =
    for
      name <- sanitizeRequiredText(request.name, DeliveryValidationDefaults.MenuItemNameMaxLength, ValidationMessages.MenuItemNameRequired)
      description <- sanitizeRequiredText(request.description, DeliveryValidationDefaults.MenuItemDescriptionMaxLength, ValidationMessages.MenuItemDescriptionRequired)
      _ <- Either.cond(
        request.priceCents > DeliveryValidationDefaults.MenuItemPriceMinCentsExclusive &&
          request.priceCents <= DeliveryValidationDefaults.MenuItemPriceMaxCents,
        (),
        ValidationMessages.MenuItemPriceInvalid,
      )
      _ <- Either.cond(
        request.remainingQuantity.forall(quantity =>
          quantity >= DeliveryValidationDefaults.MenuItemQuantityMin &&
            quantity <= DeliveryValidationDefaults.MenuItemStockMax
        ),
        (),
        ValidationMessages.MenuItemRemainingQuantityInvalid,
      )
      imageUrl <- sanitizeOptionalText(request.imageUrl, DeliveryValidationDefaults.MenuItemImageUrlMaxLength).toRight(ValidationMessages.MenuItemImageRequired)
    yield AddMenuItemRequest(
      name = name,
      description = description,
      priceCents = request.priceCents,
      imageUrl = Some(imageUrl),
      remainingQuantity = request.remainingQuantity,
    )

private[delivery] def validateMenuItemStockRequest(
      request: UpdateMenuItemStockRequest
  ): Either[String, UpdateMenuItemStockRequest] =
    Either.cond(
      request.remainingQuantity.forall(quantity =>
        quantity >= DeliveryValidationDefaults.MenuItemStockMin &&
          quantity <= DeliveryValidationDefaults.MenuItemStockMax
      ),
      request,
      ValidationMessages.MenuItemStockInvalid,
    )

private[delivery] def validateReviewRequest(
      request: ReviewOrderRequest
  ): Either[String, ReviewOrderRequest] =
    for
      _ <- Either.cond(request.storeReview.nonEmpty || request.riderReview.nonEmpty, (), ValidationMessages.ReviewRequired)
      storeReview <- validateReviewSubmission(request.storeReview, "商家")
      riderReview <- validateReviewSubmission(request.riderReview, "骑手")
    yield ReviewOrderRequest(
      storeReview = storeReview,
      riderReview = riderReview,
    )

private def validateReviewSubmission(
    review: Option[ReviewSubmission],
    label: String,
): Either[String, Option[ReviewSubmission]] =
  review match
      case None => Right(None)
      case Some(value) =>
        for
          _ <- Either.cond(
            value.rating >= DeliveryValidationDefaults.ReviewRatingMin &&
              value.rating <= DeliveryValidationDefaults.ReviewRatingMax,
            (),
            ValidationMessages.reviewRatingInvalid(label),
          )
          comment = sanitizeOptionalText(value.comment, DeliveryValidationDefaults.ReviewCommentMaxLength)
          _ <- Either.cond(
            value.rating == DeliveryValidationDefaults.ReviewRatingMax || comment.nonEmpty,
            (),
            ValidationMessages.lowRatingCommentRequired(label),
          )
        yield Some(
          ReviewSubmission(
            rating = value.rating,
            comment = comment,
            extraNote = sanitizeOptionalText(value.extraNote, DeliveryValidationDefaults.ReviewExtraNoteMaxLength),
          )
        )

private[delivery] def validateAppealRole(
      order: OrderSummary,
      appellantRole: AppealRole,
  ): Either[String, Unit] =
    appellantRole match
      case AppealRole.Merchant => Either.cond(order.storeRating.nonEmpty, (), ValidationMessages.StoreReviewAppealUnavailable)
      case AppealRole.Rider => Either.cond(order.riderId.nonEmpty && order.riderRating.nonEmpty, (), ValidationMessages.RiderReviewAppealUnavailable)

private[delivery] def validateEligibilityTargetState(
      state: DeliveryAppState,
      request: EligibilityReviewRequest,
  ): Either[String, Unit] =
    request.target match
      case EligibilityReviewTarget.Store =>
        state.stores.find(_.id == request.targetId).toRight(ValidationMessages.StoreNotFound).flatMap(store =>
          Either.cond(store.status == "Revoked", (), ValidationMessages.StoreReviewNotNeeded)
        )
      case EligibilityReviewTarget.Rider =>
        state.riders.find(_.id == request.targetId).toRight(ValidationMessages.RiderNotFound).flatMap(rider =>
          Either.cond(rider.availability == "Suspended", (), ValidationMessages.RiderReviewNotNeeded)
        )

private[delivery] def findEligibilityTargetName(
      state: DeliveryAppState,
      request: EligibilityReviewRequest,
  ): Either[String, String] =
    request.target match
      case EligibilityReviewTarget.Store =>
        state.stores.find(_.id == request.targetId).map(_.name).toRight(ValidationMessages.StoreNotFound)
      case EligibilityReviewTarget.Rider =>
        state.riders.find(_.id == request.targetId).map(_.name).toRight(ValidationMessages.RiderNotFound)

private[delivery] def sanitizeRequiredText(
      value: String,
      maxLength: Int,
      errorMessage: String,
  ): Either[String, String] =
    val sanitized = sanitizeText(value, maxLength)
    Either.cond(sanitized.nonEmpty, sanitized, errorMessage)

private[delivery] def sanitizeOptionalText(value: Option[String], maxLength: Int): Option[String] =
    value.flatMap(text =>
      sanitizeText(text, maxLength) match
        case "" => None
        case sanitized => Some(sanitized)
    )

private def sanitizeText(value: String, maxLength: Int): String =
  value
      .trim
      .filter(character => !Character.isISOControl(character) || character == '\n' || character == '\t')
      .replace('\n', ' ')
      .replace('\t', ' ')
      .split(' ')
      .filter(_.nonEmpty)
      .mkString(" ")
      .take(maxLength)

private[delivery] def buildLineItems(
      store: Store,
      items: List[OrderItemInput],
  ): Either[String, List[OrderLineItem]] =
    val selected = items.filter(_.quantity > 0)
    Either.cond(selected.nonEmpty, (), ValidationMessages.OrderRequiresAtLeastOneItem).flatMap { _ =>
      selected.foldLeft[Either[String, List[OrderLineItem]]](Right(List.empty)) { (acc, item) =>
        for
          lineItems <- acc
          menuItem <- store.menu.find(_.id == item.menuItemId).toRight(s"菜品不存在: ${item.menuItemId}")
          _ <- Either.cond(
            menuItem.remainingQuantity.forall(_ >= item.quantity),
            (),
            menuItem.remainingQuantity match
              case Some(0) => s"${menuItem.name} 已售罄"
              case Some(remaining) => s"${menuItem.name} 当前仅剩 ${remaining} 份"
              case None => s"${menuItem.name} 库存不足",
          )
        yield lineItems :+ OrderLineItem(menuItem.id, menuItem.name, item.quantity, menuItem.priceCents, 0)
      }
    }

private[delivery] def pendingRefundQuantity(order: OrderSummary, menuItemId: String): Int =
    order.partialRefundRequests
      .filter(refund => refund.menuItemId == menuItemId && refund.status == PartialRefundStatus.Pending)
      .map(_.quantity)
      .sum

private[delivery] def reviewTicket(
      order: OrderSummary,
      request: ReviewOrderRequest,
      timestamp: String,
  ): Option[AdminTicket] =
    val ratings = List(request.storeReview.map(_.rating), request.riderReview.map(_.rating)).flatten
    if ratings.isEmpty then None
    else
      val lowestRating = ratings.min
      val highestRating = ratings.max
      val ticketKind =
        if lowestRating <= 2 then Some(TicketKind.NegativeReview)
        else if highestRating >= 5 then Some(TicketKind.PositiveReview)
        else None

      ticketKind.map(kind =>
        AdminTicket(
          id = nextId("tkt"),
          orderId = order.id,
          kind = kind,
          status = TicketStatus.Open,
          summary = buildTicketSummary(order, request, kind),
          requestType = None,
          submittedByRole = Some(UserRole.customer),
          submittedByName = Some(order.customerName),
          expectedCompensationCents = None,
          actualCompensationCents = None,
          approved = None,
          resolutionMode = None,
          issuedCoupon = None,
          submittedAt = timestamp,
          reviewedAt = None,
          resolutionNote = None,
          updatedAt = timestamp,
        )
      )

private def buildTicketSummary(
    order: OrderSummary,
    request: ReviewOrderRequest,
    kind: TicketKind,
): String =
  val detail = List(
      request.storeReview.map(review =>
        s"商家 ${review.rating} 星${review.comment.map(comment => s"，理由：$comment").getOrElse("")}${review.extraNote.map(note => s"，补充：$note").getOrElse("")}"
      ),
      request.riderReview.map(review =>
        s"骑手 ${review.rating} 星${review.comment.map(comment => s"，理由：$comment").getOrElse("")}${review.extraNote.map(note => s"，补充：$note").getOrElse("")}"
      ),
    ).flatten.mkString("；")
    kind match
      case TicketKind.PositiveReview =>
        s"${order.customerName} 对 ${order.storeName} 给出好评。$detail".trim
      case TicketKind.NegativeReview =>
        s"${order.customerName} 提交了差评。$detail".trim
      case TicketKind.DeliveryIssue =>
        s"${order.customerName} 反馈配送异常。$detail".trim

private[delivery] def applyReviewToOrder(
      order: OrderSummary,
      request: ReviewOrderRequest,
      timestamp: String,
  ): OrderSummary =
    val noteSegments = List(
      request.storeReview.map(review => s"商家 ${review.rating} 星"),
      request.riderReview.map(review => s"骑手 ${review.rating} 星"),
    ).flatten
    order.copy(
      storeRating = request.storeReview.map(_.rating).orElse(order.storeRating),
      riderRating = request.riderReview.map(_.rating).orElse(order.riderRating),
      reviewComment = request.storeReview.flatMap(_.comment).orElse(request.riderReview.flatMap(_.comment)).orElse(order.reviewComment),
      reviewExtraNote = request.storeReview.flatMap(_.extraNote).orElse(request.riderReview.flatMap(_.extraNote)).orElse(order.reviewExtraNote),
      storeReviewComment = request.storeReview.flatMap(_.comment).orElse(order.storeReviewComment),
      storeReviewExtraNote = request.storeReview.flatMap(_.extraNote).orElse(order.storeReviewExtraNote),
      riderReviewComment = request.riderReview.flatMap(_.comment).orElse(order.riderReviewComment),
      riderReviewExtraNote = request.riderReview.flatMap(_.extraNote).orElse(order.riderReviewExtraNote),
      merchantRejectReason = order.merchantRejectReason,
      reviewStatus = ReviewStatus.Active,
      updatedAt = timestamp,
      timeline = order.timeline :+ OrderTimelineEntry(
        OrderStatus.Completed,
        s"顾客已提交${noteSegments.mkString("、")}评价",
        timestamp,
      ),
    )

private[delivery] def revokeReview(
      order: OrderSummary,
      reason: String,
      timestamp: String,
  ): OrderSummary =
    order.copy(
      reviewStatus = ReviewStatus.Revoked,
      reviewRevokedReason = Some(reason),
      reviewRevokedAt = Some(timestamp),
      updatedAt = timestamp,
      timeline = order.timeline :+ OrderTimelineEntry(
        OrderStatus.Completed,
        s"评价因申诉成功被撤销：$reason",
        timestamp,
      ),
    )

private[delivery] def closeTicketsForOrder(
      tickets: List[AdminTicket],
      orderId: String,
      resolutionNote: String,
      timestamp: String,
  ): List[AdminTicket] =
    tickets.map(ticket =>
      if ticket.orderId == orderId && ticket.status == TicketStatus.Open then
        ticket.copy(
          status = TicketStatus.Resolved,
          approved = None,
          resolutionNote = Some(resolutionNote),
          reviewedAt = Some(timestamp),
          updatedAt = timestamp,
        )
      else ticket
    )

private[delivery] def formatCurrency(amountCents: Int): String =
    f"${amountCents / 100.0}%.2f 元"

private[delivery] def buildAfterSalesCoupon(
      customerId: String,
      requestType: AfterSalesRequestType,
      discountCents: Int,
      currentTime: String,
  ): Coupon =
    val title =
      requestType match
        case AfterSalesRequestType.ReturnRequest => "售后退货补偿券"
        case AfterSalesRequestType.CompensationRequest => "售后补偿券"
    Coupon(
      id = s"coupon-$customerId-after-sales-${UUID.randomUUID().toString.take(8)}",
      title = title,
      discountCents = discountCents,
      minimumSpendCents = 0,
      description = "管理员处理售后申请后补发，可在有效期内下单抵扣",
      expiresAt = Instant.parse(currentTime).plusSeconds(CouponValidityDays * 24L * 60L * 60L).toString,
    )

private[delivery] def validateScheduledDeliveryAt(
      scheduledDeliveryAt: String,
      orderTimestamp: String,
  ): Either[String, String] =
    parseInstant(scheduledDeliveryAt).toRight(ValidationMessages.DeliveryTimeFormatInvalid).flatMap { scheduledInstant =>
      val orderInstant = Instant.parse(orderTimestamp)
      val earliest = ceilToMinute(orderInstant.plus(Duration.ofMinutes(MinimumScheduledLeadMinutes)))
      val orderDate = orderInstant.atZone(DeliveryScheduleZone).toLocalDate
      val scheduledDate = scheduledInstant.atZone(DeliveryScheduleZone).toLocalDate

      Either
        .cond(
          !scheduledInstant.isBefore(earliest),
          (),
          ValidationMessages.deliveryTimeTooEarly(MinimumScheduledLeadMinutes),
        )
        .flatMap(_ =>
          Either.cond(
            scheduledDate == orderDate,
            (),
            ValidationMessages.DeliveryTimeTodayOnly,
          )
        )
        .map(_ => scheduledInstant.toString)
    }

private def ceilToMinute(instant: Instant): Instant =
  val truncated = instant.truncatedTo(ChronoUnit.MINUTES)
  if truncated == instant then instant else truncated.plus(1, ChronoUnit.MINUTES)

private[delivery] def canReviewOrder(order: OrderSummary, currentTime: String): Boolean =
    order.status == OrderStatus.Completed &&
      hasPendingReviewSection(order) &&
      isWithinRecentWindow(reviewEligibilityTimestamp(order), currentTime, ReviewWindowDays)

private def hasPendingReviewSection(order: OrderSummary): Boolean =
  order.storeRating.isEmpty || (order.riderId.nonEmpty && order.riderRating.isEmpty)

private[delivery] def reviewEligibilityTimestamp(order: OrderSummary): String =
    order.timeline.reverseIterator
      .find(_.status == OrderStatus.Completed)
      .map(_.at)
      .getOrElse(order.updatedAt)

private[delivery] def validateOrderCoupon(
      customer: Customer,
      couponId: Option[String],
      itemSubtotalCents: Int,
  ): Either[String, Option[Coupon]] =
    couponId.map(_.trim).filter(_.nonEmpty) match
      case None => Right(None)
      case Some(requestedCouponId) =>
        for
          coupon <- customer.coupons.find(_.id == requestedCouponId).toRight("优惠券不存在或已失效")
          _ <- Either.cond(itemSubtotalCents >= coupon.minimumSpendCents, (), s"${coupon.title} 未达到使用门槛")
        yield Some(coupon)

private[delivery] def calculateCouponDiscount(
      coupon: Option[Coupon],
      itemSubtotalCents: Int,
      deliveryFeeCents: Int,
  ): Int =
    coupon match
      case Some(value) => Math.min(value.discountCents, Math.max(0, itemSubtotalCents + deliveryFeeCents))
      case None => 0

private[delivery] def createApprovedStore(application: MerchantApplication): Store =
    val storeId = s"store-${application.id.takeRight(4)}"
    Store(
      id = storeId,
      merchantName = application.merchantName,
      name = application.storeName,
      category = application.category,
      cuisine = application.category,
      status = "Open",
      businessHours = application.businessHours,
      avgPrepMinutes = application.avgPrepMinutes,
      imageUrl = application.imageUrl,
      menu = List.empty,
      averageRating = 0.0,
      ratingCount = 0,
      oneStarRatingCount = 0,
      revenueCents = 0,
    )

private[delivery] def validateBusinessHours(
      businessHours: BusinessHours
  ): Either[String, BusinessHours] =
    for
      openTime <- sanitizeRequiredText(businessHours.openTime, DeliveryValidationDefaults.OpenCloseTimeLength, ValidationMessages.OpenTimeRequired)
      closeTime <- sanitizeRequiredText(businessHours.closeTime, DeliveryValidationDefaults.OpenCloseTimeLength, ValidationMessages.CloseTimeRequired)
      open <- parseBusinessTime(openTime).toRight(ValidationMessages.BusinessHoursFormatInvalid)
      close <- parseBusinessTime(closeTime).toRight(ValidationMessages.BusinessHoursFormatInvalid)
      _ <- Either.cond(open.isBefore(close), (), ValidationMessages.BusinessHoursOrderInvalid)
    yield BusinessHours(
      openTime = open.toString,
      closeTime = close.toString,
    )

private def parseBusinessTime(value: String): Option[LocalTime] =
  try Some(LocalTime.parse(value))
  catch case _: Exception => None

private[delivery] def formatBusinessHours(businessHours: BusinessHours): String =
    s"${businessHours.openTime} - ${businessHours.closeTime}"

private[delivery] def isStoreOpenAt(store: Store, currentTimestamp: String): Boolean =
    (for
      instant <- parseInstant(currentTimestamp)
      open <- parseBusinessTime(store.businessHours.openTime)
      close <- parseBusinessTime(store.businessHours.closeTime)
    yield
      val currentLocalTime = instant.atZone(DeliveryScheduleZone).toLocalTime
      !currentLocalTime.isBefore(open) && currentLocalTime.isBefore(close)
    ).getOrElse(false)

private[delivery] def replaceApplication(
      applications: List[MerchantApplication],
      target: MerchantApplication,
  ): List[MerchantApplication] =
    applications.map(application => if application.id == target.id then target else application)

private[delivery] def replaceMerchantProfile(
      profiles: List[MerchantProfile],
      target: MerchantProfile,
  ): List[MerchantProfile] =
    profiles.map(profile => if profile.id == target.id then target else profile)

private[delivery] def replaceAppeal(
      appeals: List[ReviewAppeal],
      target: ReviewAppeal,
  ): List[ReviewAppeal] =
    appeals.map(appeal => if appeal.id == target.id then target else appeal)

private[delivery] def replaceEligibilityReview(
      reviews: List[EligibilityReview],
      target: EligibilityReview,
  ): List[EligibilityReview] =
    reviews.map(review => if review.id == target.id then target else review)

private[delivery] def findOrCreateMerchantProfile(
      state: DeliveryAppState,
      merchantName: String,
  ): Either[String, MerchantProfile] =
    sanitizeRequiredText(merchantName, DeliveryValidationDefaults.MerchantNameMaxLength, ValidationMessages.MerchantProfileNameRequired).map { sanitizedName =>
      state.merchantProfiles.find(_.merchantName == sanitizedName).getOrElse(
        MerchantProfile(
          id = nextId("merchant"),
          merchantName = sanitizedName,
          contactPhone = "",
          payoutAccount = None,
          settledIncomeCents = 0,
          withdrawnCents = 0,
          availableToWithdrawCents = 0,
          withdrawalHistory = List.empty,
        )
      )
    }

private[delivery] def sanitizeContactPhone(value: String): Either[String, String] =
    sanitizeRequiredText(value, DeliveryValidationDefaults.ContactPhoneMaxLength, ValidationMessages.ContactPhoneRequired).flatMap { phone =>
      Either.cond(
        phone.matches(s"[0-9+\\- ]{${DeliveryValidationDefaults.ContactPhoneMinLength},${DeliveryValidationDefaults.ContactPhoneMaxLength}}"),
        phone,
        ValidationMessages.ContactPhoneInvalid,
      )
    }

private[delivery] def sanitizeMerchantPayoutAccount(
      account: MerchantPayoutAccount,
  ): Either[String, MerchantPayoutAccount] =
    val bankName = account.bankName.map(_.trim).filter(_.nonEmpty)
    for
      accountHolder <- sanitizeRequiredText(account.accountHolder, DeliveryValidationDefaults.PayoutAccountHolderMaxLength, ValidationMessages.PayoutAccountHolderRequired)
      accountNumber <- sanitizeRequiredText(account.accountNumber, DeliveryValidationDefaults.PayoutAccountNumberMaxLength, ValidationMessages.PayoutAccountNumberRequired)
      normalizedBankName <-
        if account.accountType == MerchantPayoutAccountType.Bank then
          sanitizeRequiredText(bankName.getOrElse(""), DeliveryValidationDefaults.BankNameMaxLength, ValidationMessages.BankNameRequired).map(Some(_))
        else Right(None)
      _ <- Either.cond(
        account.accountType != MerchantPayoutAccountType.Alipay || accountNumber.length >= DeliveryValidationDefaults.AlipayAccountMinLength,
        (),
        ValidationMessages.AlipayAccountInvalid,
      )
      _ <- Either.cond(
        account.accountType != MerchantPayoutAccountType.Bank ||
          accountNumber.matches(s"[0-9 ]{${DeliveryValidationDefaults.BankAccountNumberMinLength},${DeliveryValidationDefaults.BankAccountNumberMaxLength}}"),
        (),
        ValidationMessages.BankAccountInvalid,
      )
    yield MerchantPayoutAccount(
      accountType = account.accountType,
      bankName = normalizedBankName,
      accountNumber = accountNumber,
      accountHolder = accountHolder,
    )

private[delivery] def payoutAccountLabel(account: MerchantPayoutAccount): String =
    account.accountType match
      case MerchantPayoutAccountType.Alipay => s"${MerchantPayoutAccountType.LegacyAlipayPrefix} ${account.accountHolder} / ${account.accountNumber}"
      case MerchantPayoutAccountType.Bank =>
        s"${account.bankName.getOrElse(MerchantPayoutAccountType.BankLabel)} ${account.accountHolder} / ${account.accountNumber}"

private[delivery] def parseInstant(value: String): Option[Instant] =
    try Some(Instant.parse(value))
    catch case _: Exception => None

private[delivery] def isWithinRecentWindow(
      timestamp: String,
      currentTime: String,
      days: Long,
  ): Boolean =
    !Instant.parse(timestamp).isBefore(Instant.parse(currentTime).minusSeconds(days * 24L * 60L * 60L))
