package services.merchant.utils

// Business note: service business action/support code; keep validation and state transitions explicit and side effects in IO.
import system.app.*

import system.objects.given
import system.app.objects.*

import services.merchant.objects.*
import system.objects.*

private val emptyProfilePhoneNumber = wrapText[PhoneNumber]("")

private def profileText(value: String): DisplayText = wrapText[DisplayText](value)

private def profileShowValue[T](value: T)(using renderer: DisplayTextRenderer[T]): DisplayText =
  renderer.render(value)

private def profileJoinText(parts: DisplayText*): DisplayText =
  wrapText[DisplayText](parts.map(_.raw).mkString)

def findOrCreateMerchantProfile(
      state: DeliveryAppState,
      merchantName: PersonName,
  ): Either[ErrorMessage, MerchantProfile] =
    sanitizeRequiredText(merchantName, DeliveryValidationDefaults.MerchantNameMaxLength, ValidationMessages.Merchant.MerchantProfileNameRequired).map { sanitizedName =>
      state.merchantProfiles.find(_.merchantName == sanitizedName).getOrElse(
        MerchantProfile(
          id = nextId(MerchantIdPrefix),
          merchantName = sanitizedName,
          contactPhone = emptyProfilePhoneNumber,
          payoutAccount = None,
          settledIncomeCents = NumericDefaults.ZeroCurrencyCents,
          withdrawnCents = NumericDefaults.ZeroCurrencyCents,
          availableToWithdrawCents = NumericDefaults.ZeroCurrencyCents,
          withdrawalHistory = List.empty,
        )
      )
    }

def sanitizeContactPhone(value: PhoneNumber): Either[ErrorMessage, PhoneNumber] =
    sanitizeRequiredText(value, DeliveryValidationDefaults.ContactPhoneMaxLength, ValidationMessages.Merchant.ContactPhoneRequired).flatMap { phone =>
      Either.cond(
        phone.raw.matches(List("[0-9+\\- ]{", DeliveryValidationDefaults.ContactPhoneMinLength, ",", DeliveryValidationDefaults.ContactPhoneMaxLength, "}").mkString),
        phone,
        ValidationMessages.Merchant.ContactPhoneInvalid,
      )
    }

def sanitizeMerchantPayoutAccount(
      account: MerchantPayoutAccount,
  ): Either[ErrorMessage, MerchantPayoutAccount] =
    val bankName = account.bankName.map(value => wrapText[BankName](value.raw.trim)).filter(_.nonEmpty)
    for
      accountHolder <- sanitizeRequiredText(account.accountHolder, DeliveryValidationDefaults.PayoutAccountHolderMaxLength, ValidationMessages.Merchant.PayoutAccountHolderRequired)
      accountNumber <- sanitizeRequiredText(account.accountNumber, DeliveryValidationDefaults.PayoutAccountNumberMaxLength, ValidationMessages.Merchant.PayoutAccountNumberRequired)
      normalizedBankName <-
        if account.accountType == MerchantPayoutAccountType.Bank then
          sanitizeRequiredText(bankName.getOrElse(wrapText[BankName]("")), DeliveryValidationDefaults.BankNameMaxLength, ValidationMessages.Merchant.BankNameRequired).map(Some(_))
        else Right(None)
      _ <- Either.cond(
        account.accountType != MerchantPayoutAccountType.Alipay || accountNumber.length >= DeliveryValidationDefaults.AlipayAccountMinLength,
        (),
        ValidationMessages.Merchant.AlipayAccountInvalid,
      )
      _ <- Either.cond(
        account.accountType != MerchantPayoutAccountType.Bank ||
          accountNumber.raw.matches(List("[0-9 ]{", DeliveryValidationDefaults.BankAccountNumberMinLength, ",", DeliveryValidationDefaults.BankAccountNumberMaxLength, "}").mkString),
        (),
        ValidationMessages.Merchant.BankAccountInvalid,
      )
    yield MerchantPayoutAccount(
      accountType = account.accountType,
      bankName = normalizedBankName,
      accountNumber = accountNumber,
      accountHolder = accountHolder,
    )

def payoutAccountLabel(account: MerchantPayoutAccount): DisplayText =
    account.accountType match
      case MerchantPayoutAccountType.Alipay =>
        profileJoinText(
          MerchantPayoutAccountType.LegacyAlipayPrefix,
          profileText(" "),
          profileShowValue(account.accountHolder),
          profileText(" / "),
          profileShowValue(account.accountNumber),
        )
      case MerchantPayoutAccountType.Bank =>
        profileJoinText(
          profileShowValue(account.bankName.getOrElse(wrapText[BankName](MerchantPayoutAccountType.BankLabel.raw))),
          profileText(" "),
          profileShowValue(account.accountHolder),
          profileText(" / "),
          profileShowValue(account.accountNumber),
        )
