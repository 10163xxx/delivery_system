package rider.app

import domain.shared.given

import cats.effect.IO
import domain.merchant.{MerchantPayoutAccount, MerchantWithdrawal}
import domain.rider.*
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

def updateRiderProfile(
      riderId: RiderId,
      request: UpdateRiderProfileRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          rider <- current.riders.find(_.id == riderId).toRight(ValidationMessages.RiderNotFound)
          payoutAccount <- sanitizeMerchantPayoutAccount(request.payoutAccount)
        yield
          withDerivedData(
            current.copy(
              riders = current.riders.map(entry =>
                if entry.id == rider.id then entry.copy(payoutAccount = Some(payoutAccount))
                else entry
              ),
            ),
            now(),
          )
      }
    }

def withdrawRiderIncome(
      riderId: RiderId,
      request: WithdrawRiderIncomeRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          rider <- current.riders.find(_.id == riderId).toRight(ValidationMessages.RiderNotFound)
          amountCents <- validateWithdrawalAmount(request.amountCents)
          payoutAccount <- rider.payoutAccount.toRight(ValidationMessages.PayoutAccountRequired)
          _ <- Either.cond(rider.availableToWithdrawCents >= amountCents, (), ValidationMessages.WithdrawBalanceInsufficient)
        yield
          val timestamp = now()
          val withdrawal = buildWithdrawal(new DisplayText("rwd"), amountCents, payoutAccount, timestamp)
          withDerivedData(
            current.copy(
              riders = current.riders.map(entry =>
                if entry.id == rider.id then
                  entry.copy(
                    withdrawnCents = rider.withdrawnCents + amountCents,
                    withdrawalHistory = withdrawal :: rider.withdrawalHistory,
                  )
                else entry
              ),
            ),
            timestamp,
          )
      }
    }
