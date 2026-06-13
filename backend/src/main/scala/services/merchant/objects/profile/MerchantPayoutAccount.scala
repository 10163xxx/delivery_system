package domain.merchant

import domain.shared.given

import domain.shared.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

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
