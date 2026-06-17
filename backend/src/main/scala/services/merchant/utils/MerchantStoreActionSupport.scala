package services.merchant.utils

import domain.merchant.*
import domain.shared.*
import system.app.*

private[utils] def replaceStore(
      current: DeliveryAppState,
      storeId: StoreId,
      update: Store => Store,
  ): DeliveryAppState =
    current.copy(
      stores = current.stores.map(store => if store.id == storeId then update(store) else store)
    )
