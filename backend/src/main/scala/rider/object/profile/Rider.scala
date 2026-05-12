package domain.rider

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.merchant.{MerchantPayoutAccount, MerchantWithdrawal, legacyMerchantPayoutAccountFromText}
import domain.shared.*

final case class RiderPerformance(
    averageRating: AverageRating,
    ratingCount: EntityCount,
    oneStarRatingCount: EntityCount,
    earningsCents: CurrencyCents,
)

final case class RiderPayout(
    payoutAccount: Option[MerchantPayoutAccount],
    withdrawnCents: CurrencyCents,
    availableToWithdrawCents: CurrencyCents,
    withdrawalHistory: List[MerchantWithdrawal],
)

final case class Rider(
    id: RiderId,
    name: PersonName,
    vehicle: VehicleLabel,
    zone: ZoneLabel,
    availability: AvailabilityLabel,
    performance: RiderPerformance,
    payout: RiderPayout,
)
object Rider:
  given Encoder[RiderPerformance] = deriveEncoder
  given Decoder[RiderPerformance] = deriveDecoder
  given Encoder[RiderPayout] = deriveEncoder
  given Decoder[RiderPayout] = deriveDecoder

  def apply(
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
  ): Rider =
    new Rider(
      id = id,
      name = name,
      vehicle = vehicle,
      zone = zone,
      availability = availability,
      performance = RiderPerformance(
        averageRating = averageRating,
        ratingCount = ratingCount,
        oneStarRatingCount = oneStarRatingCount,
        earningsCents = earningsCents,
      ),
      payout = RiderPayout(
        payoutAccount = payoutAccount,
        withdrawnCents = withdrawnCents,
        availableToWithdrawCents = availableToWithdrawCents,
        withdrawalHistory = withdrawalHistory,
      ),
    )

  extension (rider: Rider)
    def averageRating: AverageRating = rider.performance.averageRating
    def ratingCount: EntityCount = rider.performance.ratingCount
    def oneStarRatingCount: EntityCount = rider.performance.oneStarRatingCount
    def earningsCents: CurrencyCents = rider.performance.earningsCents
    def payoutAccount: Option[MerchantPayoutAccount] = rider.payout.payoutAccount
    def withdrawnCents: CurrencyCents = rider.payout.withdrawnCents
    def availableToWithdrawCents: CurrencyCents = rider.payout.availableToWithdrawCents
    def withdrawalHistory: List[MerchantWithdrawal] = rider.payout.withdrawalHistory

  given Encoder[Rider] = Encoder.instance(rider =>
    deriveEncoder[Rider]
      .apply(rider)
      .deepMerge(deriveEncoder[RiderPerformance].apply(rider.performance))
      .deepMerge(deriveEncoder[RiderPayout].apply(rider.payout))
      .mapObject(_.remove("performance").remove("payout"))
  )
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
