package app.delivery

import cats.effect.IO
import domain.auth.*
import domain.customer.*
import domain.merchant.*
import domain.rider.*
import domain.shared.*

def updateCustomerProfile(
      customerId: String,
      request: UpdateCustomerProfileRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          customer <- current.customers.find(_.id == customerId).toRight(ValidationMessages.CustomerNotFound)
          name <- sanitizeRequiredText(request.name, DeliveryValidationDefaults.CustomerNameMaxLength, ValidationMessages.CustomerNameRequired)
        yield
          withDerivedData(
            current.copy(
              customers = current.customers.map(entry =>
                if entry.id == customer.id then entry.copy(name = name) else entry
              ),
            ),
            now(),
          )
      }
    }

def addCustomerAddress(
      customerId: String,
      request: AddCustomerAddressRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          customer <- current.customers.find(_.id == customerId).toRight(ValidationMessages.CustomerNotFound)
          label <- sanitizeRequiredText(request.label, DeliveryValidationDefaults.AddressLabelMaxLength, ValidationMessages.AddressLabelRequired)
          address <- sanitizeRequiredText(request.address, DeliveryValidationDefaults.AddressMaxLength, ValidationMessages.AddressRequired)
        yield
          val addressEntry = AddressEntry(label, address)
          val nextAddresses = customer.addresses.filterNot(_.address == address) :+ addressEntry
          withDerivedData(
            current.copy(
              customers = current.customers.map(entry =>
                if entry.id == customer.id then entry.copy(addresses = nextAddresses) else entry
              ),
            ),
            now(),
          )
      }
    }

def removeCustomerAddress(
      customerId: String,
      request: RemoveCustomerAddressRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          customer <- current.customers.find(_.id == customerId).toRight(ValidationMessages.CustomerNotFound)
          address <- sanitizeRequiredText(request.address, DeliveryValidationDefaults.AddressMaxLength, ValidationMessages.AddressRequired)
          _ <- Either.cond(customer.addresses.exists(_.address == address), (), ValidationMessages.AddressNotFound)
          _ <- Either.cond(customer.addresses.length > 1, (), ValidationMessages.AtLeastOneAddressRequired)
          _ <- Either.cond(customer.defaultAddress != address, (), ValidationMessages.ChangeDefaultAddressBeforeDeleting)
        yield
          val nextAddresses = customer.addresses.filterNot(_.address == address)
          withDerivedData(
            current.copy(
              customers = current.customers.map(entry =>
                if entry.id == customer.id then entry.copy(addresses = nextAddresses) else entry
              ),
            ),
            now(),
          )
      }
    }

def setDefaultCustomerAddress(
      customerId: String,
      request: SetDefaultCustomerAddressRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          customer <- current.customers.find(_.id == customerId).toRight(ValidationMessages.CustomerNotFound)
          address <- sanitizeRequiredText(request.address, DeliveryValidationDefaults.AddressMaxLength, ValidationMessages.AddressRequired)
          _ <- Either.cond(customer.addresses.exists(_.address == address), (), ValidationMessages.AddressNotFound)
        yield
          withDerivedData(
            current.copy(
              customers = current.customers.map(entry =>
                if entry.id == customer.id then entry.copy(defaultAddress = address) else entry
              ),
            ),
            now(),
          )
      }
    }

def rechargeCustomerBalance(
      customerId: String,
      request: RechargeBalanceRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          customer <- current.customers.find(_.id == customerId).toRight(ValidationMessages.CustomerNotFound)
          _ <- Either.cond(customer.accountStatus == AccountStatus.Active, (), ValidationMessages.CustomerAccountSuspended)
          _ <- Either.cond(
            request.amountCents > DeliveryValidationDefaults.RechargeAmountMinCentsExclusive &&
              request.amountCents <= DeliveryValidationDefaults.RechargeAmountMaxCents,
            (),
            ValidationMessages.RechargeAmountInvalid,
          )
        yield
          withDerivedData(
            current.copy(
              customers = current.customers.map(entry =>
                if entry.id == customer.id then entry.copy(balanceCents = entry.balanceCents + request.amountCents)
                else entry
              ),
            ),
            now(),
          )
      }
    }

def updateMerchantProfile(
      merchantName: String,
      request: UpdateMerchantProfileRequest,
  ): IO[Either[String, DeliveryAppState]] =
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
      merchantName: String,
      request: WithdrawMerchantIncomeRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          profile <- findOrCreateMerchantProfile(current, merchantName)
          amountCents <- Either.cond(
            request.amountCents > DeliveryValidationDefaults.WithdrawAmountMinCentsExclusive &&
              request.amountCents <= DeliveryValidationDefaults.WithdrawAmountMaxCents,
            request.amountCents,
            ValidationMessages.WithdrawAmountInvalid,
          )
          payoutAccount <- profile.payoutAccount.toRight(ValidationMessages.PayoutAccountRequired)
          _ <- Either.cond(profile.availableToWithdrawCents >= amountCents, (), ValidationMessages.WithdrawBalanceInsufficient)
        yield
          val timestamp = now()
          val withdrawal = MerchantWithdrawal(
            id = nextId("mwd"),
            amountCents = amountCents,
            accountLabel = payoutAccountLabel(payoutAccount),
            requestedAt = timestamp,
          )
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

def updateRiderProfile(
      riderId: String,
      request: UpdateRiderProfileRequest,
  ): IO[Either[String, DeliveryAppState]] =
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
      riderId: String,
      request: WithdrawRiderIncomeRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          rider <- current.riders.find(_.id == riderId).toRight(ValidationMessages.RiderNotFound)
          amountCents <- Either.cond(
            request.amountCents > DeliveryValidationDefaults.WithdrawAmountMinCentsExclusive &&
              request.amountCents <= DeliveryValidationDefaults.WithdrawAmountMaxCents,
            request.amountCents,
            ValidationMessages.WithdrawAmountInvalid,
          )
          payoutAccount <- rider.payoutAccount.toRight(ValidationMessages.PayoutAccountRequired)
          _ <- Either.cond(rider.availableToWithdrawCents >= amountCents, (), ValidationMessages.WithdrawBalanceInsufficient)
        yield
          val timestamp = now()
          val withdrawal = MerchantWithdrawal(
            id = nextId("rwd"),
            amountCents = amountCents,
            accountLabel = payoutAccountLabel(payoutAccount),
            requestedAt = timestamp,
          )
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
