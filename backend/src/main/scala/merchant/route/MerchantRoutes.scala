package merchant.route

import domain.shared.given

import cats.effect.IO
import cats.syntax.semigroupk.*
import org.http4s.HttpRoutes

val merchantRoutes: HttpRoutes[IO] =
  updateMerchantProfileRoute <+>
    withdrawMerchantIncomeRoute <+>
    submitMerchantApplicationRoute <+>
    uploadMerchantStoreImageRoute <+>
    getMerchantStoreImageRoute <+>
    addMenuItemRoute <+>
    removeMenuItemRoute <+>
    updateMenuItemStockRoute <+>
    updateMenuItemPriceRoute <+>
    updateMenuItemCategoryRoute <+>
    updateStoreOperationalInfoRoute
