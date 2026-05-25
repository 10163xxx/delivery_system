import { uploadMerchantStoreImageApiDefinition } from '@/shared/api/ApiRoutes'
import { decodeImageUploadResponse } from '@/shared/api/ResponseDecoders'
import { postFormData } from '@/shared/api/SharedHttpClient'

export function uploadMerchantStoreImage(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return postFormData(
    uploadMerchantStoreImageApiDefinition,
    formData,
    decodeImageUploadResponse,
  )
}
