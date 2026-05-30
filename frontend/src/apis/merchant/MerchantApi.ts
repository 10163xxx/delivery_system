import { addMenuItem } from '@/apis/merchant/AddMenuItemApi'
import { getMerchantStoreImageUrl } from '@/apis/merchant/GetMerchantStoreImageApi'
import { removeMenuItem } from '@/apis/merchant/RemoveMenuItemApi'
import { submitMerchantApplication } from '@/apis/merchant/SubmitMerchantApplicationApi'
import { updateMerchantProfile } from '@/apis/merchant/UpdateMerchantProfileApi'
import { updateMenuItemCategory } from '@/apis/merchant/UpdateMenuItemCategoryApi'
import { updateMenuItemPrice } from '@/apis/merchant/UpdateMenuItemPriceApi'
import { updateMenuItemStock } from '@/apis/merchant/UpdateMenuItemStockApi'
import { updateStoreOperationalInfo } from '@/apis/merchant/UpdateStoreOperationalInfoApi'
import { uploadMerchantStoreImage } from '@/apis/merchant/UploadMerchantStoreImageApi'
import { withdrawMerchantIncome } from '@/apis/merchant/WithdrawMerchantIncomeApi'

export {
  addMenuItem,
  getMerchantStoreImageUrl,
  removeMenuItem,
  submitMerchantApplication,
  updateMerchantProfile,
  updateMenuItemCategory,
  updateMenuItemPrice,
  updateMenuItemStock,
  updateStoreOperationalInfo,
  uploadMerchantStoreImage,
  withdrawMerchantIncome,
}
