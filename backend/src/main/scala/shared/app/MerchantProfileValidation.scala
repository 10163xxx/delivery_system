package shared.app

import domain.shared.given

import domain.merchant.*
import domain.shared.*

private val emptyProfilePhoneNumber = new PhoneNumber("")

private def profileText(value: String): DisplayText = new DisplayText(value)

private def profileShowValue[T](value: T)(using renderer: DisplayTextRenderer[T]): DisplayText =
  renderer.render(value)

private def profileJoinText(parts: DisplayText*): DisplayText =
  new DisplayText(parts.map(_.raw).mkString)

def findOrCreateMerchantProfile(
      state: DeliveryAppState,
      merchantName: PersonName,
  ): Either[ErrorMessage, MerchantProfile] =
    sanitizeRequiredText(merchantName, DeliveryValidationDefaults.MerchantNameMaxLength, ValidationMessages.MerchantProfileNameRequired).map { sanitizedName =>
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
    sanitizeRequiredText(value, DeliveryValidationDefaults.ContactPhoneMaxLength, ValidationMessages.ContactPhoneRequired).flatMap { phone =>
      Either.cond(
        phone.raw.matches(List("[0-9+\\- ]{", DeliveryValidationDefaults.ContactPhoneMinLength, ",", DeliveryValidationDefaults.ContactPhoneMaxLength, "}").mkString),
        phone,
        ValidationMessages.ContactPhoneInvalid,
      )
    }

def sanitizeMerchantPayoutAccount(
      account: MerchantPayoutAccount,
  ): Either[ErrorMessage, MerchantPayoutAccount] =
    val bankName = account.bankName.map(value => new BankName(value.raw.trim)).filter(_.nonEmpty)
    for
      accountHolder <- sanitizeRequiredText(account.accountHolder, DeliveryValidationDefaults.PayoutAccountHolderMaxLength, ValidationMessages.PayoutAccountHolderRequired)
      accountNumber <- sanitizeRequiredText(account.accountNumber, DeliveryValidationDefaults.PayoutAccountNumberMaxLength, ValidationMessages.PayoutAccountNumberRequired)
      normalizedBankName <-
        if account.accountType == MerchantPayoutAccountType.Bank then
          sanitizeRequiredText(bankName.getOrElse(new BankName("")), DeliveryValidationDefaults.BankNameMaxLength, ValidationMessages.BankNameRequired).map(Some(_))
        else Right(None)
      _ <- Either.cond(
        account.accountType != MerchantPayoutAccountType.Alipay || accountNumber.length >= DeliveryValidationDefaults.AlipayAccountMinLength,
        (),
        ValidationMessages.AlipayAccountInvalid,
      )
      _ <- Either.cond(
        account.accountType != MerchantPayoutAccountType.Bank ||
          accountNumber.raw.matches(List("[0-9 ]{", DeliveryValidationDefaults.BankAccountNumberMinLength, ",", DeliveryValidationDefaults.BankAccountNumberMaxLength, "}").mkString),
        (),
        ValidationMessages.BankAccountInvalid,
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
          profileShowValue(account.bankName.getOrElse(new BankName(MerchantPayoutAccountType.BankLabel.raw))),
          profileText(" "),
          profileShowValue(account.accountHolder),
          profileText(" / "),
          profileShowValue(account.accountNumber),
        )
