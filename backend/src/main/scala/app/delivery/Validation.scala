package app.delivery

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

private val merchantReviewLabel = new DisplayText("商家")
private val riderReviewLabel = new DisplayText("骑手")
private val storeRevoked = StoreRevokedStatus
private val riderSuspended = RiderSuspendedStatus
private val storeOpen = StoreOpenStatus
private val blankText = new DisplayText("")
private val reviewDetailSeparator = new DisplayText("；")
private val afterSalesCouponDescription = new DescriptionText("管理员处理售后申请后补发，可在有效期内下单抵扣")
private val afterSalesReturnCouponTitle = new DisplayText("售后退货补偿券")
private val afterSalesCompensationCouponTitle = new DisplayText("售后补偿券")
private val emptyPhoneNumber = new PhoneNumber("")

private def text(value: String): DisplayText = new DisplayText(value)

private def showValue[T](value: T)(using renderer: DisplayTextRenderer[T]): DisplayText =
  renderer.render(value)

private def joinValidationText(parts: DisplayText*): DisplayText =
  new DisplayText(parts.map(_.raw).mkString)

private def joinValidationError(parts: DisplayText*): ErrorMessage =
  new ErrorMessage(joinValidationText(parts*).raw)

private def joinReviewDetails(details: List[DisplayText]): DisplayText =
  new DisplayText(details.map(_.raw).mkString(reviewDetailSeparator.raw))

private[delivery] def validateMerchantRegistration(
      request: MerchantRegistrationRequest
  ): Either[ErrorMessage, MerchantRegistrationRequest] =
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
  ): Either[ErrorMessage, AddMenuItemRequest] =
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
  ): Either[ErrorMessage, UpdateMenuItemStockRequest] =
    Either.cond(
      request.remainingQuantity.forall(quantity =>
        quantity >= DeliveryValidationDefaults.MenuItemStockMin &&
          quantity <= DeliveryValidationDefaults.MenuItemStockMax
      ),
      request,
      ValidationMessages.MenuItemStockInvalid,
    )

private[delivery] def validateMenuItemPriceRequest(
      request: UpdateMenuItemPriceRequest
  ): Either[ErrorMessage, UpdateMenuItemPriceRequest] =
    Either.cond(
      request.priceCents > DeliveryValidationDefaults.MenuItemPriceMinCentsExclusive &&
        request.priceCents <= DeliveryValidationDefaults.MenuItemPriceMaxCents,
      request,
      ValidationMessages.MenuItemPriceInvalid,
    )

private[delivery] def validateReviewRequest(
      request: ReviewOrderRequest
  ): Either[ErrorMessage, ReviewOrderRequest] =
    for
      _ <- Either.cond(request.storeReview.nonEmpty || request.riderReview.nonEmpty, (), ValidationMessages.ReviewRequired)
      storeReview <- validateReviewSubmission(request.storeReview, merchantReviewLabel)
      riderReview <- validateReviewSubmission(request.riderReview, riderReviewLabel)
    yield ReviewOrderRequest(
      storeReview = storeReview,
      riderReview = riderReview,
    )

private def validateReviewSubmission(
    review: Option[ReviewSubmission],
    label: DisplayText,
): Either[ErrorMessage, Option[ReviewSubmission]] =
  review match
      case None => Right(None)
      case Some(value) =>
        for
          _ <- Either.cond(
            value.rating >= DeliveryValidationDefaults.ReviewRatingMin &&
              value.rating <= DeliveryValidationDefaults.ReviewRatingMax,
            (),
            reviewRatingInvalid(label),
          )
          comment = sanitizeOptionalText(value.comment, DeliveryValidationDefaults.ReviewCommentMaxLength)
          _ <- Either.cond(
            value.rating == DeliveryValidationDefaults.ReviewRatingMax || comment.nonEmpty,
            (),
            lowRatingCommentRequired(label),
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
  ): Either[ErrorMessage, Unit] =
    appellantRole match
      case AppealRole.Merchant => Either.cond(order.storeRating.nonEmpty, (), ValidationMessages.StoreReviewAppealUnavailable)
      case AppealRole.Rider => Either.cond(order.riderId.nonEmpty && order.riderRating.nonEmpty, (), ValidationMessages.RiderReviewAppealUnavailable)

private[delivery] def validateEligibilityTargetState(
      state: DeliveryAppState,
      request: EligibilityReviewRequest,
  ): Either[ErrorMessage, Unit] =
    request.target match
      case EligibilityReviewTarget.Store =>
        state.stores.find(_.id == request.targetId).toRight(ValidationMessages.StoreNotFound).flatMap(store =>
          Either.cond(store.status == storeRevoked, (), ValidationMessages.StoreReviewNotNeeded)
        )
      case EligibilityReviewTarget.Rider =>
        state.riders.find(_.id == request.targetId).toRight(ValidationMessages.RiderNotFound).flatMap(rider =>
          Either.cond(rider.availability == riderSuspended, (), ValidationMessages.RiderReviewNotNeeded)
        )

private[delivery] def findEligibilityTargetName(
      state: DeliveryAppState,
      request: EligibilityReviewRequest,
  ): Either[ErrorMessage, DisplayText] =
    request.target match
      case EligibilityReviewTarget.Store =>
        state.stores.find(_.id == request.targetId).map(_.name).toRight(ValidationMessages.StoreNotFound)
      case EligibilityReviewTarget.Rider =>
        state.riders.find(_.id == request.targetId).map(rider => new DisplayText(rider.name.raw)).toRight(ValidationMessages.RiderNotFound)

private[delivery] def sanitizeRequiredText(
      value: DisplayText,
      maxLength: EntityCount,
      errorMessage: ErrorMessage,
  ): Either[ErrorMessage, DisplayText] =
    val sanitized = sanitizeText(value, maxLength)
    Either.cond(sanitized.nonEmpty, sanitized, errorMessage)

private[delivery] def sanitizeRequiredText[T](
      value: T,
      maxLength: EntityCount,
      errorMessage: ErrorMessage,
  )(using wrapped: WrappedTextType[T]): Either[ErrorMessage, T] =
    val sanitized = sanitizeText(new DisplayText(value.raw), maxLength)
    Either.cond(sanitized.nonEmpty, wrapText(sanitized.raw), errorMessage)

private[delivery] def sanitizeOptionalText(value: Option[DisplayText], maxLength: EntityCount): Option[DisplayText] =
    value.flatMap(text =>
      sanitizeText(text, maxLength) match
        case sanitized if sanitized.isEmpty => None
        case sanitized => Some(sanitized)
    )

private[delivery] def sanitizeOptionalText[T](value: Option[T], maxLength: EntityCount)(using
      wrapped: WrappedTextType[T]
  ): Option[T] =
    value.flatMap(text =>
      sanitizeText(new DisplayText(text.raw), maxLength) match
        case sanitized if sanitized.isEmpty => None
        case sanitized => Some(wrapText(sanitized.raw))
    )

private def sanitizeText(value: DisplayText, maxLength: EntityCount): DisplayText =
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

private[delivery] def buildLineItems(
      store: Store,
      items: List[OrderItemInput],
  ): Either[ErrorMessage, List[OrderLineItem]] =
    val selected = items.filter(_.quantity > NumericDefaults.ZeroQuantity)
    Either.cond(selected.nonEmpty, (), ValidationMessages.OrderRequiresAtLeastOneItem).flatMap { _ =>
      selected.foldLeft[Either[ErrorMessage, List[OrderLineItem]]](Right(List.empty)) { (acc, item) =>
        for
          lineItems <- acc
          menuItem <- store.menu.find(_.id == item.menuItemId).toRight(joinValidationError(text("菜品不存在: "), showValue(item.menuItemId)))
          _ <- Either.cond(
            menuItem.remainingQuantity.forall(_ >= item.quantity),
            (),
            menuItem.remainingQuantity match
              case Some(NumericDefaults.ZeroQuantity) => joinValidationError(menuItem.name, text(" 已售罄"))
              case Some(remaining) => joinValidationError(menuItem.name, text(" 当前仅剩 "), showValue(remaining), text(" 份"))
              case None => joinValidationError(menuItem.name, text(" 库存不足")),
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

private[delivery] def pendingRefundQuantity(order: OrderSummary, menuItemId: MenuItemId): Quantity =
    order.partialRefundRequests
      .filter(refund => refund.menuItemId == menuItemId && refund.status == PartialRefundStatus.Pending)
      .map(_.quantity)
      .sum

private[delivery] def reviewTicket(
      order: OrderSummary,
      request: ReviewOrderRequest,
      timestamp: IsoDateTime,
  ): Option[AdminTicket] =
    val ratings = List(request.storeReview.map(_.rating), request.riderReview.map(_.rating)).flatten
    if ratings.isEmpty then None
    else
      val lowestRating = ratings.min
      val highestRating = ratings.max
      val ticketKind =
        if lowestRating <= NumericDefaults.NegativeReviewThreshold then Some(TicketKind.NegativeReview)
        else if highestRating >= NumericDefaults.PositiveReviewThreshold then Some(TicketKind.PositiveReview)
        else None

      ticketKind.map(kind =>
        AdminTicket(
          id = nextId(new DisplayText("tkt")),
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
): SummaryText =
  val detail = joinReviewDetails(List(
      request.storeReview.map(review =>
        renderReviewDetail(merchantReviewLabel, review.rating, review.comment, review.extraNote)
      ),
      request.riderReview.map(review =>
        renderReviewDetail(riderReviewLabel, review.rating, review.comment, review.extraNote)
      ),
    ).flatten)
    kind match
      case TicketKind.PositiveReview =>
        renderReviewTicketSummary(ReviewTicketSummaryMessage.Positive(order.customerName, order.storeName, detail))
      case TicketKind.NegativeReview =>
        renderReviewTicketSummary(ReviewTicketSummaryMessage.Negative(order.customerName, detail))
      case TicketKind.DeliveryIssue =>
        renderReviewTicketSummary(ReviewTicketSummaryMessage.DeliveryIssue(order.customerName, detail))

private[delivery] def applyReviewToOrder(
      order: OrderSummary,
      request: ReviewOrderRequest,
      timestamp: IsoDateTime,
  ): OrderSummary =
    val noteSegments = List(
      request.storeReview.map(review => renderReviewRatingLabel(merchantReviewLabel, review.rating)),
      request.riderReview.map(review => renderReviewRatingLabel(riderReviewLabel, review.rating)),
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
        renderOrderTimelineMessage(OrderTimelineMessage.CustomerReviewSubmitted(noteSegments)),
        timestamp,
      ),
    )

private[delivery] def revokeReview(
      order: OrderSummary,
      reason: ReasonText,
      timestamp: IsoDateTime,
  ): OrderSummary =
    order.copy(
      reviewStatus = ReviewStatus.Revoked,
      reviewRevokedReason = Some(reason),
      reviewRevokedAt = Some(timestamp),
      updatedAt = timestamp,
      timeline = order.timeline :+ OrderTimelineEntry(
        OrderStatus.Completed,
        renderOrderTimelineMessage(OrderTimelineMessage.ReviewRevoked(reason)),
        timestamp,
      ),
    )

private[delivery] def closeTicketsForOrder(
      tickets: List[AdminTicket],
      orderId: OrderId,
      resolutionNote: ResolutionText,
      timestamp: IsoDateTime,
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

private[delivery] def formatCurrency(amountCents: CurrencyCents): DisplayText =
    joinValidationText(
      showValue(
        BigDecimal(amountCents)
      ./(BigDecimal(NumericDefaults.CurrencyCentsPerYuan))
      .setScale(2, BigDecimal.RoundingMode.HALF_UP)
      ),
      text(" 元"),
    )

private[delivery] def buildAfterSalesCoupon(
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

private[delivery] def validateScheduledDeliveryAt(
      scheduledDeliveryAt: IsoDateTime,
      orderTimestamp: IsoDateTime,
  ): Either[ErrorMessage, IsoDateTime] =
    parseInstant(scheduledDeliveryAt).toRight(ValidationMessages.DeliveryTimeFormatInvalid).flatMap { scheduledInstant =>
      val orderInstant = Instant.parse(orderTimestamp.raw)
      val earliest = ceilToMinute(orderInstant.plus(Duration.ofMinutes(MinimumScheduledLeadMinutes)))
      val orderDate = orderInstant.atZone(DeliveryScheduleZone).toLocalDate
      val scheduledDate = scheduledInstant.atZone(DeliveryScheduleZone).toLocalDate

      Either
        .cond(
          !scheduledInstant.isBefore(earliest),
          (),
          deliveryTimeTooEarly(MinimumScheduledLeadMinutes),
        )
        .flatMap(_ =>
          Either.cond(
            scheduledDate == orderDate,
            (),
            ValidationMessages.DeliveryTimeTodayOnly,
          )
        )
        .map(_ => new IsoDateTime(scheduledInstant.toString))
    }

private def ceilToMinute(instant: Instant): Instant =
  val truncated = instant.truncatedTo(ChronoUnit.MINUTES)
  if truncated == instant then instant else truncated.plus(TimeDefaults.MinutesRoundingStep.raw.toLong, ChronoUnit.MINUTES)

private[delivery] def canReviewOrder(order: OrderSummary, currentTime: IsoDateTime): ApprovalFlag =
    order.status == OrderStatus.Completed &&
      hasPendingReviewSection(order) &&
      isWithinRecentWindow(reviewEligibilityTimestamp(order), currentTime, ReviewWindowDays)

private def hasPendingReviewSection(order: OrderSummary): ApprovalFlag =
  order.storeRating.isEmpty || (order.riderId.nonEmpty && order.riderRating.isEmpty)

private[delivery] def reviewEligibilityTimestamp(order: OrderSummary): IsoDateTime =
    order.timeline.reverseIterator
      .find(_.status == OrderStatus.Completed)
      .map(_.at)
      .getOrElse(order.updatedAt)

private[delivery] def validateOrderCoupon(
      customer: Customer,
      couponId: Option[CouponId],
      itemSubtotalCents: CurrencyCents,
  ): Either[ErrorMessage, Option[Coupon]] =
    couponId.map(value => new EntityId(value.raw.trim)).filter(_.nonEmpty) match
      case None => Right(None)
      case Some(requestedCouponId) =>
        for
          coupon <- customer.coupons.find(_.id == requestedCouponId).toRight(ValidationMessages.CouponUnavailable)
          _ <- Either.cond(itemSubtotalCents >= coupon.minimumSpendCents, (), couponThresholdNotMet(coupon.title))
        yield Some(coupon)

private[delivery] def calculateCouponDiscount(
      coupon: Option[Coupon],
      itemSubtotalCents: CurrencyCents,
      deliveryFeeCents: CurrencyCents,
  ): CurrencyCents =
    coupon match
      case Some(value) => Math.min(value.discountCents, Math.max(NumericDefaults.ZeroCurrencyCents, itemSubtotalCents + deliveryFeeCents))
      case None => NumericDefaults.ZeroCurrencyCents

private[delivery] def createApprovedStore(application: MerchantApplication): Store =
    val storeId = new EntityId(List("store-", application.id.raw.takeRight(IdentifierDefaults.ApprovedStoreIdSuffixLength)).mkString)
    Store(
      id = storeId,
      merchantName = application.merchantName,
      name = application.storeName,
      category = application.category,
      cuisine = new CuisineLabel(application.category.raw),
      status = storeOpen,
      businessHours = application.businessHours,
      avgPrepMinutes = application.avgPrepMinutes,
      imageUrl = application.imageUrl,
      menu = List.empty,
      averageRating = NumericDefaults.ZeroAverageRating,
      ratingCount = NumericDefaults.ZeroCount,
      oneStarRatingCount = NumericDefaults.ZeroCount,
      revenueCents = NumericDefaults.ZeroCurrencyCents,
    )

private[delivery] def validateBusinessHours(
      businessHours: BusinessHours
  ): Either[ErrorMessage, BusinessHours] =
    for
      openTime <- sanitizeRequiredText(businessHours.openTime, DeliveryValidationDefaults.OpenCloseTimeLength, ValidationMessages.OpenTimeRequired)
      closeTime <- sanitizeRequiredText(businessHours.closeTime, DeliveryValidationDefaults.OpenCloseTimeLength, ValidationMessages.CloseTimeRequired)
      open <- parseBusinessTime(openTime).toRight(ValidationMessages.BusinessHoursFormatInvalid)
      close <- parseBusinessTime(closeTime).toRight(ValidationMessages.BusinessHoursFormatInvalid)
      _ <- Either.cond(open.isBefore(close), (), ValidationMessages.BusinessHoursOrderInvalid)
    yield BusinessHours(
      openTime = new TimeOfDay(open.toString),
      closeTime = new TimeOfDay(close.toString),
    )

private def parseBusinessTime(value: TimeOfDay): Option[LocalTime] =
  try Some(LocalTime.parse(value.raw))
  catch case _: Exception => None

private[delivery] def formatBusinessHours(businessHours: BusinessHours): DisplayText =
    joinValidationText(showValue(businessHours.openTime), text(" - "), showValue(businessHours.closeTime))

private[delivery] def isStoreOpenAt(store: Store, currentTimestamp: IsoDateTime): ApprovalFlag =
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
      merchantName: PersonName,
  ): Either[ErrorMessage, MerchantProfile] =
    sanitizeRequiredText(merchantName, DeliveryValidationDefaults.MerchantNameMaxLength, ValidationMessages.MerchantProfileNameRequired).map { sanitizedName =>
      state.merchantProfiles.find(_.merchantName == sanitizedName).getOrElse(
        MerchantProfile(
          id = nextId(MerchantIdPrefix),
          merchantName = sanitizedName,
          contactPhone = emptyPhoneNumber,
          payoutAccount = None,
          settledIncomeCents = NumericDefaults.ZeroCurrencyCents,
          withdrawnCents = NumericDefaults.ZeroCurrencyCents,
          availableToWithdrawCents = NumericDefaults.ZeroCurrencyCents,
          withdrawalHistory = List.empty,
        )
      )
    }

private[delivery] def sanitizeContactPhone(value: PhoneNumber): Either[ErrorMessage, PhoneNumber] =
    sanitizeRequiredText(value, DeliveryValidationDefaults.ContactPhoneMaxLength, ValidationMessages.ContactPhoneRequired).flatMap { phone =>
      Either.cond(
        phone.raw.matches(List("[0-9+\\- ]{", DeliveryValidationDefaults.ContactPhoneMinLength, ",", DeliveryValidationDefaults.ContactPhoneMaxLength, "}").mkString),
        phone,
        ValidationMessages.ContactPhoneInvalid,
      )
    }

private[delivery] def sanitizeMerchantPayoutAccount(
      account: MerchantPayoutAccount,
  ): Either[ErrorMessage, MerchantPayoutAccount] =
    val bankName = account.bankName.map(value => new BankName(value.raw.trim)).filter(_.nonEmpty)
    for
      accountHolder <- sanitizeRequiredText(account.accountHolder, DeliveryValidationDefaults.PayoutAccountHolderMaxLength, ValidationMessages.PayoutAccountHolderRequired)
      accountNumber <- sanitizeRequiredText(account.accountNumber, DeliveryValidationDefaults.PayoutAccountNumberMaxLength, ValidationMessages.PayoutAccountNumberRequired)
      normalizedBankName <-
        if account.accountType == MerchantPayoutAccountType.Bank then
          sanitizeRequiredText(bankName.getOrElse(new BankName("")), DeliveryValidationDefaults.BankNameMaxLength, ValidationMessages.BankNameRequired).map(Some(_))
        else Right(None)
      _ <- Either.cond(
        account.accountType != MerchantPayoutAccountType.Alipay || accountNumber.length >= DeliveryValidationDefaults.AlipayAccountMinLength,
        (),
        ValidationMessages.AlipayAccountInvalid,
      )
      _ <- Either.cond(
        account.accountType != MerchantPayoutAccountType.Bank ||
          accountNumber.raw.matches(List("[0-9 ]{", DeliveryValidationDefaults.BankAccountNumberMinLength, ",", DeliveryValidationDefaults.BankAccountNumberMaxLength, "}").mkString),
        (),
        ValidationMessages.BankAccountInvalid,
      )
    yield MerchantPayoutAccount(
      accountType = account.accountType,
      bankName = normalizedBankName,
      accountNumber = accountNumber,
      accountHolder = accountHolder,
    )

private[delivery] def payoutAccountLabel(account: MerchantPayoutAccount): DisplayText =
    account.accountType match
      case MerchantPayoutAccountType.Alipay =>
        joinValidationText(
          MerchantPayoutAccountType.LegacyAlipayPrefix,
          text(" "),
          showValue(account.accountHolder),
          text(" / "),
          showValue(account.accountNumber),
        )
      case MerchantPayoutAccountType.Bank =>
        joinValidationText(
          showValue(account.bankName.getOrElse(new BankName(MerchantPayoutAccountType.BankLabel.raw))),
          text(" "),
          showValue(account.accountHolder),
          text(" / "),
          showValue(account.accountNumber),
        )

private[delivery] def parseInstant(value: IsoDateTime): Option[Instant] =
    try Some(Instant.parse(value.raw))
    catch case _: Exception => None

private[delivery] def isWithinRecentWindow(
      timestamp: IsoDateTime,
      currentTime: IsoDateTime,
      days: DurationDays,
  ): ApprovalFlag =
    !Instant.parse(timestamp.raw).isBefore(Instant.parse(currentTime.raw).minusSeconds(days * TimeDefaults.SecondsPerDay))
