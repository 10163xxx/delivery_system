package app.delivery

import domain.shared.given

import cats.effect.IO
import domain.auth.*
import domain.customer.*
import domain.merchant.*
import domain.rider.*
import domain.shared.*

private def findAccountCustomer(
      current: DeliveryAppState,
      customerId: CustomerId,
  ): Either[ErrorMessage, Customer] =
    current.customers.find(_.id == customerId).toRight(ValidationMessages.CustomerNotFound)

private def updateCustomerEntry(
      current: DeliveryAppState,
      customerId: CustomerId,
  )(
      update: Customer => Customer
  ): DeliveryAppState =
    current.copy(
      customers = current.customers.map(entry =>
        if entry.id == customerId then update(entry) else entry
      ),
    )

private def sanitizedCustomerAddressEntry(
      request: AddCustomerAddressRequest
  ): Either[ErrorMessage, AddressEntry] =
    for
      label <- sanitizeRequiredText(request.label, DeliveryValidationDefaults.AddressLabelMaxLength, ValidationMessages.AddressLabelRequired)
      address <- sanitizeRequiredText(request.address, DeliveryValidationDefaults.AddressMaxLength, ValidationMessages.AddressRequired)
    yield AddressEntry(label, address)

private def sanitizedCustomerAddress(
      address: AddressText
  ): Either[ErrorMessage, AddressText] =
    sanitizeRequiredText(
      address,
      DeliveryValidationDefaults.AddressMaxLength,
      ValidationMessages.AddressRequired,
    )

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

def updateCustomerProfile(
      customerId: CustomerId,
      request: UpdateCustomerProfileRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          customer <- findAccountCustomer(current, customerId)
          name <- sanitizeRequiredText(request.name, DeliveryValidationDefaults.CustomerNameMaxLength, ValidationMessages.CustomerNameRequired)
        yield
          withDerivedData(
            updateCustomerEntry(current, customer.id)(_.copy(name = name)),
            now(),
          )
      }
    }

def addCustomerAddress(
      customerId: CustomerId,
      request: AddCustomerAddressRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          customer <- findAccountCustomer(current, customerId)
          addressEntry <- sanitizedCustomerAddressEntry(request)
        yield
          val nextAddresses =
            customer.addresses.filterNot(_.address == addressEntry.address) :+ addressEntry
          withDerivedData(
            updateCustomerEntry(current, customer.id)(_.copy(addresses = nextAddresses)),
            now(),
          )
      }
    }

def removeCustomerAddress(
      customerId: CustomerId,
      request: RemoveCustomerAddressRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          customer <- findAccountCustomer(current, customerId)
          address <- sanitizedCustomerAddress(request.address)
          _ <- Either.cond(customer.addresses.exists(_.address == address), (), ValidationMessages.AddressNotFound)
          _ <- Either.cond(
            customer.addresses.length > NumericDefaults.SingleItemCount,
            (),
            ValidationMessages.AtLeastOneAddressRequired,
          )
          _ <- Either.cond(customer.defaultAddress != address, (), ValidationMessages.ChangeDefaultAddressBeforeDeleting)
        yield
          val nextAddresses = customer.addresses.filterNot(_.address == address)
          withDerivedData(
            updateCustomerEntry(current, customer.id)(_.copy(addresses = nextAddresses)),
            now(),
          )
      }
    }

def setDefaultCustomerAddress(
      customerId: CustomerId,
      request: SetDefaultCustomerAddressRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          customer <- findAccountCustomer(current, customerId)
          address <- sanitizedCustomerAddress(request.address)
          _ <- Either.cond(customer.addresses.exists(_.address == address), (), ValidationMessages.AddressNotFound)
        yield
          withDerivedData(
            updateCustomerEntry(current, customer.id)(_.copy(defaultAddress = address)),
            now(),
          )
      }
    }

def rechargeCustomerBalance(
      customerId: CustomerId,
      request: RechargeBalanceRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          customer <- findAccountCustomer(current, customerId)
          _ <- Either.cond(customer.accountStatus == AccountStatus.Active, (), ValidationMessages.CustomerAccountSuspended)
          _ <- Either.cond(
            request.amountCents > DeliveryValidationDefaults.RechargeAmountMinCentsExclusive &&
              request.amountCents <= DeliveryValidationDefaults.RechargeAmountMaxCents,
            (),
            ValidationMessages.RechargeAmountInvalid,
          )
        yield
          withDerivedData(
            updateCustomerEntry(current, customer.id)(entry =>
              entry.copy(balanceCents = entry.balanceCents + request.amountCents)
            ),
            now(),
          )
      }
    }

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
