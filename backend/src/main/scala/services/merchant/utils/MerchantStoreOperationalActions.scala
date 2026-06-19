package services.merchant.utils

// Business note: service business action/support code; keep validation and state transitions explicit and side effects in IO.
import cats.effect.IO
import services.merchant.objects.apiTypes.*
import system.app.objects.*
import services.merchant.objects.*
import system.objects.*
import system.app.*

private def validatePrepMinutes(value: Minutes): Either[ErrorMessage, Minutes] =
    Either.cond(
      value >= DeliveryValidationDefaults.PrepMinutesMin &&
        value <= DeliveryValidationDefaults.PrepMinutesMax,
      value,
      ValidationMessages.Merchant.PrepMinutesInvalid,
    )

def updateStoreOperationalInfo(
      storeId: StoreId,
      request: UpdateStoreOperationalRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          store <- current.stores.find(_.id == storeId).toRight(ValidationMessages.Merchant.StoreNotFound)
          storeAddress <- sanitizeRequiredText(request.storeAddress, DeliveryValidationDefaults.AddressMaxLength, ValidationMessages.Merchant.StoreAddressRequired)
          businessHours <- validateBusinessHours(request.businessHours)
          avgPrepMinutes <- validatePrepMinutes(request.avgPrepMinutes)
          nextLocation =
            request.location.orElse {
              if store.storeAddress == storeAddress then store.location
              else None
            }
        yield
          withDerivedData(
            replaceStore(
              current,
              store.id,
              storeEntry =>
                storeEntry.copy(
                  operations = storeEntry.operations.copy(
                    storeAddress = storeAddress,
                    location = nextLocation,
                    businessHours = businessHours,
                    avgPrepMinutes = avgPrepMinutes,
                  )
                ),
            )
          )
      }
    }
