package system.objects

import system.objects.given

object NumericDefaults:
  val ZeroCount: EntityCount = new EntityCount(0)
  val ZeroQuantity: Quantity = new Quantity(0)
  val ZeroCurrencyCents: CurrencyCents = new CurrencyCents(0)
  val ZeroAverageRating: AverageRating = new AverageRating(0.0)
  val SingleItemCount: EntityCount = new EntityCount(1)
  val CurrencyDisplayScale: EntityCount = new EntityCount(2)
  val CurrencyCentsPerYuan: Double = 100.0
  val HoursPerDay: DurationDays = new DurationDays(24L)
  val MinutesPerHour: DurationDays = new DurationDays(60L)
  val SecondsPerMinute: DurationDays = new DurationDays(60L)
  val NegativeReviewThreshold: RatingValue = new RatingValue(2)
  val PositiveReviewThreshold: RatingValue = DeliveryValidationDefaults.ReviewRatingMax
  val ZeroDigitChar: Char = '0'
  val ZeroDigitText: DisplayText = new DisplayText("0")

object IdentifierDefaults:
  val GeneratedCouponSuffixLength: EntityCount = new EntityCount(8)
  val ApprovedStoreIdSuffixLength: EntityCount = new EntityCount(4)

object UploadNumericDefaults:
  val WebpFormatOffset: EntityCount = new EntityCount(8)

object NoteTableDefaults:
  val TitleColumnLength: EntityCount = new EntityCount(120)
  val StatusColumnLength: EntityCount = new EntityCount(32)
  val InsertIdParameterIndex: ParameterIndex = new ParameterIndex(1)
  val InsertTitleParameterIndex: ParameterIndex = new ParameterIndex(2)
  val InsertBodyParameterIndex: ParameterIndex = new ParameterIndex(3)
  val InsertStatusParameterIndex: ParameterIndex = new ParameterIndex(4)
  val InsertCreatedAtParameterIndex: ParameterIndex = new ParameterIndex(5)

object TimeDefaults:
  val MinutesRoundingStep: EntityCount = new EntityCount(1)
  val ChronologicalScale: EntityCount = new EntityCount(1)
  val SecondsPerDay: DurationDays =
    new DurationDays(NumericDefaults.HoursPerDay * NumericDefaults.MinutesPerHour * NumericDefaults.SecondsPerMinute)
