package domain.merchant

import domain.shared.given

import domain.shared.*
import io.circe.{Decoder, Encoder}

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
