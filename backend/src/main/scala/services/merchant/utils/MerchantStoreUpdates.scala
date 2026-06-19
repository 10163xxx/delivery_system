package services.merchant.utils

// Business note: merchant store update helper for replacing a store inside application state.
import services.merchant.objects.*
import system.app.objects.*
import system.objects.*
import system.app.*

private[utils] def replaceStore(
      current: DeliveryAppState,
      storeId: StoreId,
      update: Store => Store,
  ): DeliveryAppState =
    current.copy(
      stores = current.stores.map(store => if store.id == storeId then update(store) else store)
    )
