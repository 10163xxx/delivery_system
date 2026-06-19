package services.rider.utils

// Business note: service business action/support code; keep validation and state transitions explicit and side effects in IO.
import system.objects.given
import services.rider.objects.apiTypes.*
import system.app.objects.*

import cats.effect.IO
import services.merchant.objects.{MerchantPayoutAccount, MerchantWithdrawal}
import services.merchant.utils.*
import services.rider.objects.*
import system.objects.*
import system.app.*

private def validateWithdrawalAmount(
      amountCents: CurrencyCents
  ): Either[ErrorMessage, CurrencyCents] =
    Either.cond(
      amountCents > DeliveryValidationDefaults.WithdrawAmountMinCentsExclusive &&
        amountCents <= DeliveryValidationDefaults.WithdrawAmountMaxCents,
      amountCents,
      ValidationMessages.Merchant.WithdrawAmountInvalid,
    )

private def validateRiderAvailability(
      availability: AvailabilityLabel
  ): Either[ErrorMessage, AvailabilityLabel] =
    Either.cond(
      availability == RiderAvailableStatus || availability == RiderUnavailableStatus,
      availability,
      ValidationMessages.Order.RiderUnavailable,
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
          rider <- current.riders.find(_.id == riderId).toRight(ValidationMessages.Merchant.RiderNotFound)
          payoutAccount <- sanitizeMerchantPayoutAccount(request.payoutAccount)
        yield
          withDerivedData(
            current.copy(
              riders = current.riders.map(entry =>
                if entry.id == rider.id then
                  entry.copy(
                    payout = entry.payout.copy(payoutAccount = Some(payoutAccount))
                  )
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
          rider <- current.riders.find(_.id == riderId).toRight(ValidationMessages.Merchant.RiderNotFound)
          amountCents <- validateWithdrawalAmount(request.amountCents)
          payoutAccount <- rider.payoutAccount.toRight(ValidationMessages.Merchant.PayoutAccountRequired)
          _ <- Either.cond(rider.availableToWithdrawCents >= amountCents, (), ValidationMessages.Merchant.WithdrawBalanceInsufficient)
        yield
          val timestamp = now()
          val withdrawal = buildWithdrawal(new DisplayText("rwd"), amountCents, payoutAccount, timestamp)
          withDerivedData(
            current.copy(
              riders = current.riders.map(entry =>
                if entry.id == rider.id then
                  entry.copy(
                    payout = entry.payout.copy(
                      withdrawnCents = rider.withdrawnCents + amountCents,
                      withdrawalHistory = withdrawal :: rider.withdrawalHistory,
                    ),
                  )
                else entry
              ),
            ),
            timestamp,
          )
      }
    }

def updateRiderAvailability(
      riderId: RiderId,
      request: UpdateRiderAvailabilityRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          rider <- current.riders.find(_.id == riderId).toRight(ValidationMessages.Merchant.RiderNotFound)
          _ <- Either.cond(rider.availability != RiderOnDeliveryStatus, (), ValidationMessages.Order.RiderAvailabilityLocked)
          availability <- validateRiderAvailability(request.availability)
        yield
          withDerivedData(
            current.copy(
              riders = current.riders.map(entry =>
                if entry.id == rider.id then
                  entry.copy(identity = entry.identity.copy(availability = availability))
                else entry
              ),
            ),
            now(),
          )
      }
    }
