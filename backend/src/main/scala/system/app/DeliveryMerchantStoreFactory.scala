package system.app

// Business note: merchant store factory rules for approved merchant applications.
import system.objects.given

import services.merchant.objects.*
import system.objects.*

import java.time.LocalTime

val validationStoreRevoked = StoreRevokedStatus
val validationRiderSuspended = RiderSuspendedStatus
val validationStoreOpen = StoreOpenStatus

def createApprovedStore(application: MerchantApplication): Store =
  val storeId = wrapText[StoreId](List("store-", application.id.raw.takeRight(IdentifierDefaults.ApprovedStoreIdSuffixLength)).mkString)
  Store(
    identity = StoreIdentity(
      id = storeId,
      merchantName = application.merchantName,
      name = application.storeName,
      category = application.category,
      cuisine = wrapText[CuisineLabel](application.category.raw),
    ),
    operations = StoreOperations(
      status = validationStoreOpen,
      storeAddress = application.storeAddress,
      location = application.location,
      businessHours = application.businessHours,
      avgPrepMinutes = application.avgPrepMinutes,
      imageUrl = application.imageUrl,
      menu = List.empty,
    ),
    metrics = StoreMetrics(
      averageRating = NumericDefaults.ZeroAverageRating,
      ratingCount = NumericDefaults.ZeroCount,
      oneStarRatingCount = NumericDefaults.ZeroCount,
      revenueCents = NumericDefaults.ZeroCurrencyCents,
    ),
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
    openTime = wrapText[TimeOfDay](open.toString),
    closeTime = wrapText[TimeOfDay](close.toString),
  )

def parseBusinessTime(value: TimeOfDay): Option[LocalTime] =
  try Some(LocalTime.parse(value.raw))
  catch case _: Exception => None

def formatBusinessHours(businessHours: BusinessHours): DisplayText =
  joinValidationText(showValue(businessHours.openTime), text(" - "), showValue(businessHours.closeTime))

def isStoreOpenAt(store: Store, currentTimestamp: IsoDateTime): ApprovalFlag =
  new ApprovalFlag(
    (for
      instant <- parseInstant(currentTimestamp)
      open <- parseBusinessTime(store.businessHours.openTime)
      close <- parseBusinessTime(store.businessHours.closeTime)
    yield
      val currentLocalTime = instant.atZone(DeliveryScheduleZone).toLocalTime
      !currentLocalTime.isBefore(open) && currentLocalTime.isBefore(close)
    ).getOrElse(false)
  )
