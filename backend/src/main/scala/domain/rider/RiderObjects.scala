package domain.rider

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.merchant.{MerchantPayoutAccount, MerchantWithdrawal, legacyMerchantPayoutAccountFromText}
import domain.shared.*

final case class Rider(
    id: RiderId,
    name: PersonName,
    vehicle: VehicleLabel,
    zone: ZoneLabel,
    availability: AvailabilityLabel,
    averageRating: AverageRating,
    ratingCount: EntityCount,
    oneStarRatingCount: EntityCount,
    earningsCents: CurrencyCents,
    payoutAccount: Option[MerchantPayoutAccount],
    withdrawnCents: CurrencyCents,
    availableToWithdrawCents: CurrencyCents,
    withdrawalHistory: List[MerchantWithdrawal],
)
object Rider:
  given Encoder[Rider] = deriveEncoder
  given Decoder[Rider] = Decoder.instance { cursor =>
    for
      id <- cursor.get[RiderId]("id")
      name <- cursor.get[PersonName]("name")
      vehicle <- cursor.get[VehicleLabel]("vehicle")
      zone <- cursor.get[ZoneLabel]("zone")
      availability <- cursor.get[AvailabilityLabel]("availability")
      averageRating <- cursor.get[AverageRating]("averageRating")
      ratingCount <- cursor.get[EntityCount]("ratingCount")
      oneStarRatingCount <- cursor.get[EntityCount]("oneStarRatingCount")
      earningsCents <- cursor.getOrElse[CurrencyCents]("earningsCents")(NumericDefaults.ZeroCurrencyCents)
      payoutAccount <- cursor.get[Option[MerchantPayoutAccount]]("payoutAccount").orElse(
        cursor.get[Option[DisplayText]]("payoutAccount").map(_.flatMap(legacyMerchantPayoutAccountFromText))
      )
      withdrawnCents <- cursor.getOrElse[CurrencyCents]("withdrawnCents")(NumericDefaults.ZeroCurrencyCents)
      availableToWithdrawCents <-
        cursor.getOrElse[CurrencyCents]("availableToWithdrawCents")(
          Math.max(NumericDefaults.ZeroCurrencyCents, earningsCents - withdrawnCents)
        )
      withdrawalHistory <- cursor.getOrElse[List[MerchantWithdrawal]]("withdrawalHistory")(List.empty)
    yield Rider(
      id = id,
      name = name,
      vehicle = vehicle,
      zone = zone,
      availability = availability,
      averageRating = averageRating,
      ratingCount = ratingCount,
      oneStarRatingCount = oneStarRatingCount,
      earningsCents = earningsCents,
      payoutAccount = payoutAccount,
      withdrawnCents = withdrawnCents,
      availableToWithdrawCents = availableToWithdrawCents,
      withdrawalHistory = withdrawalHistory,
    )
  }

final case class UpdateRiderProfileRequest(
    payoutAccount: MerchantPayoutAccount,
)
object UpdateRiderProfileRequest:
  given Encoder[UpdateRiderProfileRequest] = deriveEncoder
  given Decoder[UpdateRiderProfileRequest] = deriveDecoder

final case class WithdrawRiderIncomeRequest(amountCents: CurrencyCents)
object WithdrawRiderIncomeRequest:
  given Encoder[WithdrawRiderIncomeRequest] = deriveEncoder
  given Decoder[WithdrawRiderIncomeRequest] = deriveDecoder
