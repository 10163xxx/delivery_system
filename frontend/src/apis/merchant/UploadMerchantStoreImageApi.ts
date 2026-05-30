import { uploadMerchantStoreImageApiDefinition } from '@/system/api/ApiRoutes'
import { decodeImageUploadResponse } from '@/system/api/ResponseDecoders'
import { postFormData } from '@/system/api/SharedHttpClient'

export function uploadMerchantStoreImage(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return postFormData(
    uploadMerchantStoreImageApiDefinition,
    formData,
    decodeImageUploadResponse,
  )
}
