package services.merchant.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given

import system.objects.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class MerchantProfile(
    id: MerchantId,
    merchantName: PersonName,
    contactPhone: PhoneNumber,
    payoutAccount: Option[MerchantPayoutAccount],
    settledIncomeCents: CurrencyCents,
    withdrawnCents: CurrencyCents,
    availableToWithdrawCents: CurrencyCents,
    withdrawalHistory: List[MerchantWithdrawal],
)
object MerchantProfile:
  given Encoder[MerchantProfile] = deriveEncoder
  given Decoder[MerchantProfile] = Decoder.instance { cursor =>
    for
      id <- cursor.get[MerchantId]("id")
      merchantName <- cursor.get[PersonName]("merchantName")
      contactPhone <- cursor.getOrElse[PhoneNumber]("contactPhone")(new PhoneNumber(""))
      payoutAccount <- cursor.get[Option[MerchantPayoutAccount]]("payoutAccount").orElse(
        cursor.get[Option[DisplayText]]("payoutAccount").map(_.flatMap(legacyMerchantPayoutAccountFromText))
      )
      settledIncomeCents <- cursor.getOrElse[CurrencyCents]("settledIncomeCents")(NumericDefaults.ZeroCurrencyCents)
      withdrawnCents <- cursor.getOrElse[CurrencyCents]("withdrawnCents")(NumericDefaults.ZeroCurrencyCents)
      availableToWithdrawCents <-
        cursor.getOrElse[CurrencyCents]("availableToWithdrawCents")(
          new CurrencyCents(Math.max(NumericDefaults.ZeroCurrencyCents, settledIncomeCents - withdrawnCents))
        )
      withdrawalHistory <- cursor.getOrElse[List[MerchantWithdrawal]]("withdrawalHistory")(List.empty)
    yield MerchantProfile(
      id = id,
      merchantName = merchantName,
      contactPhone = contactPhone,
      payoutAccount = payoutAccount,
      settledIncomeCents = settledIncomeCents,
      withdrawnCents = withdrawnCents,
      availableToWithdrawCents = availableToWithdrawCents,
      withdrawalHistory = withdrawalHistory,
    )
  }
