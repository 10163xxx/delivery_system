package domain.merchant

import domain.shared.given

import domain.shared.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

enum MerchantPayoutAccountType:
  case Alipay, Bank

private val merchantPayoutAlipayValue: DisplayText = new DisplayText("alipay")
private val merchantPayoutBankValue: DisplayText = new DisplayText("bank")

private def merchantPayoutAccountTypeFromSerialized(
    value: DisplayText
): Either[DisplayText, MerchantPayoutAccountType] =
  value.raw.trim.toLowerCase match
    case raw if raw == merchantPayoutAlipayValue.raw => Right(MerchantPayoutAccountType.Alipay)
    case raw if raw == merchantPayoutBankValue.raw => Right(MerchantPayoutAccountType.Bank)
    case other => Left(new DisplayText(s"Invalid MerchantPayoutAccountType: $other"))

private def serializeMerchantPayoutAccountType(value: MerchantPayoutAccountType): DisplayText =
  value match
    case MerchantPayoutAccountType.Alipay => merchantPayoutAlipayValue
    case MerchantPayoutAccountType.Bank => merchantPayoutBankValue

def legacyMerchantPayoutAccountFromText(value: DisplayText): Option[MerchantPayoutAccount] =
  val legacy = value.raw.trim
  if legacy.isEmpty then None
  else if legacy.startsWith(MerchantPayoutAccountType.LegacyAlipayPrefix.raw) then
    Some(
      MerchantPayoutAccount(
        accountType = MerchantPayoutAccountType.Alipay,
        bankName = None,
        accountNumber = new AccountNumber(legacy.stripPrefix(MerchantPayoutAccountType.LegacyAlipayPrefix.raw).trim),
        accountHolder = new AccountHolderName(""),
      )
    )
  else
    Some(
      MerchantPayoutAccount(
        accountType = MerchantPayoutAccountType.Bank,
        bankName = legacy.split(" ").headOption.filter(_.nonEmpty).map(value => new BankName(value)),
        accountNumber = new AccountNumber(legacy),
        accountHolder = new AccountHolderName(""),
      )
    )

object MerchantPayoutAccountType:
  val LegacyAlipayPrefix: DisplayText = new DisplayText("支付宝")
  val BankLabel: DisplayText = new DisplayText("银行卡")
  given Encoder[MerchantPayoutAccountType] =
    Encoder.encodeString.contramap(value => serializeMerchantPayoutAccountType(value).raw)
  given Decoder[MerchantPayoutAccountType] =
    Decoder.decodeString.emap(value => merchantPayoutAccountTypeFromSerialized(new DisplayText(value)).left.map(_.raw))

final case class MerchantWithdrawal(
    id: EntityId,
    amountCents: CurrencyCents,
    accountLabel: DisplayText,
    requestedAt: IsoDateTime,
)
object MerchantWithdrawal:
  given Encoder[MerchantWithdrawal] = deriveEncoder
  given Decoder[MerchantWithdrawal] = deriveDecoder

final case class MerchantPayoutAccount(
    accountType: MerchantPayoutAccountType,
    bankName: Option[BankName],
    accountNumber: AccountNumber,
    accountHolder: AccountHolderName,
)
object MerchantPayoutAccount:
  given Encoder[MerchantPayoutAccount] = deriveEncoder
  given Decoder[MerchantPayoutAccount] = Decoder.instance { cursor =>
    for
      accountType <- cursor.get[MerchantPayoutAccountType]("accountType")
      bankName <- cursor.get[Option[BankName]]("bankName")
      accountNumber <- cursor.getOrElse[AccountNumber]("accountNumber")(new AccountNumber(""))
      accountHolder <- cursor.getOrElse[AccountHolderName]("accountHolder")(new AccountHolderName(""))
    yield MerchantPayoutAccount(
      accountType = accountType,
      bankName = bankName,
      accountNumber = accountNumber,
      accountHolder = accountHolder,
    )
  }

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
          Math.max(NumericDefaults.ZeroCurrencyCents, settledIncomeCents - withdrawnCents)
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

final case class UpdateMerchantProfileRequest(
    contactPhone: PhoneNumber,
    payoutAccount: MerchantPayoutAccount,
)
object UpdateMerchantProfileRequest:
  given Encoder[UpdateMerchantProfileRequest] = deriveEncoder
  given Decoder[UpdateMerchantProfileRequest] = deriveDecoder

final case class WithdrawMerchantIncomeRequest(amountCents: CurrencyCents)
object WithdrawMerchantIncomeRequest:
  given Encoder[WithdrawMerchantIncomeRequest] = deriveEncoder
  given Decoder[WithdrawMerchantIncomeRequest] = deriveDecoder

final case class ImageUploadResponse(url: ExternalUrl)
object ImageUploadResponse:
  given Encoder[ImageUploadResponse] = deriveEncoder
  given Decoder[ImageUploadResponse] = deriveDecoder
