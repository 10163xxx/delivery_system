package domain.shared

import domain.shared.given

object NumericDefaults:
  val ZeroCount: EntityCount = 0
  val ZeroQuantity: Quantity = 0
  val ZeroCurrencyCents: CurrencyCents = 0
  val ZeroAverageRating: AverageRating = 0.0
  val SingleItemCount: EntityCount = 1
  val CurrencyCentsPerYuan: Double = 100.0
  val HoursPerDay: DurationDays = 24L
  val MinutesPerHour: DurationDays = 60L
  val SecondsPerMinute: DurationDays = 60L
  val NegativeReviewThreshold: RatingValue = 2
  val PositiveReviewThreshold: RatingValue = DeliveryValidationDefaults.ReviewRatingMax
  val ZeroDigitChar: Char = '0'
  val ZeroDigitText: DisplayText = new DisplayText("0")

object IdentifierDefaults:
  val GeneratedCouponSuffixLength: EntityCount = 8
  val ApprovedStoreIdSuffixLength: EntityCount = 4

object NoteTableDefaults:
  val TitleColumnLength: EntityCount = 120
  val StatusColumnLength: EntityCount = 32
  val InsertIdParameterIndex: ParameterIndex = 1
  val InsertTitleParameterIndex: ParameterIndex = 2
  val InsertBodyParameterIndex: ParameterIndex = 3
  val InsertStatusParameterIndex: ParameterIndex = 4
  val InsertCreatedAtParameterIndex: ParameterIndex = 5

object TimeDefaults:
  val MinutesRoundingStep: EntityCount = 1
  val ChronologicalScale: EntityCount = 1
  val SecondsPerDay: DurationDays =
    NumericDefaults.HoursPerDay * NumericDefaults.MinutesPerHour * NumericDefaults.SecondsPerMinute
