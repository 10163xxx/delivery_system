package merchant.app

import domain.shared.given

import cats.effect.IO
import domain.merchant.*
import domain.shared.*
import shared.app.*

private def validateWithdrawalAmount(
      amountCents: CurrencyCents
  ): Either[ErrorMessage, CurrencyCents] =
    Either.cond(
      amountCents > DeliveryValidationDefaults.WithdrawAmountMinCentsExclusive &&
        amountCents <= DeliveryValidationDefaults.WithdrawAmountMaxCents,
      amountCents,
      ValidationMessages.WithdrawAmountInvalid,
    )

private def buildWithdrawal(
      prefix: DisplayText,
      amountCents: CurrencyCents,
      payoutAccount: MerchantPayoutAccount,
      timestamp: IsoDateTime,
  ): MerchantWithdrawal =
    MerchantWithdrawal(
      id = nextId(prefix),
      amountCents = amountCents,
      accountLabel = payoutAccountLabel(payoutAccount),
      requestedAt = timestamp,
    )

def updateMerchantProfile(
      merchantName: PersonName,
      request: UpdateMerchantProfileRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          profile <- findOrCreateMerchantProfile(current, merchantName)
          contactPhone <- sanitizeContactPhone(request.contactPhone)
          payoutAccount <- sanitizeMerchantPayoutAccount(request.payoutAccount)
        yield
          withDerivedData(
            current.copy(
              merchantProfiles = replaceMerchantProfile(
                current.merchantProfiles,
                profile.copy(contactPhone = contactPhone, payoutAccount = Some(payoutAccount)),
              ),
            ),
            now(),
          )
      }
    }

def withdrawMerchantIncome(
      merchantName: PersonName,
      request: WithdrawMerchantIncomeRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          profile <- findOrCreateMerchantProfile(current, merchantName)
          amountCents <- validateWithdrawalAmount(request.amountCents)
          payoutAccount <- profile.payoutAccount.toRight(ValidationMessages.PayoutAccountRequired)
          _ <- Either.cond(profile.availableToWithdrawCents >= amountCents, (), ValidationMessages.WithdrawBalanceInsufficient)
        yield
          val timestamp = now()
          val withdrawal = buildWithdrawal(new DisplayText("mwd"), amountCents, payoutAccount, timestamp)
          withDerivedData(
            current.copy(
              merchantProfiles = replaceMerchantProfile(
                current.merchantProfiles,
                profile.copy(
                  withdrawnCents = profile.withdrawnCents + amountCents,
                  withdrawalHistory = withdrawal :: profile.withdrawalHistory,
                ),
              ),
            ),
            timestamp,
          )
      }
    }
