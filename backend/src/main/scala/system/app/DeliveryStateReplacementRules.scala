package system.app

// Business note: shared state replacement and currency formatting rules used by delivery actions.
import services.admin.objects.*
import services.merchant.objects.*
import services.review.objects.*
import system.objects.*

import java.time.Instant

def formatCurrency(amountCents: CurrencyCents): DisplayText =
  joinValidationText(
    validationShowValue(
      BigDecimal(amountCents)
        ./(BigDecimal(NumericDefaults.CurrencyCentsPerYuan))
        .setScale(NumericDefaults.CurrencyDisplayScale, BigDecimal.RoundingMode.HALF_UP)
    ),
    validationText(" 元"),
  )

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
  new ApprovalFlag(
    !Instant.parse(timestamp.raw).isBefore(Instant.parse(currentTime.raw).minusSeconds(days * TimeDefaults.SecondsPerDay))
  )
