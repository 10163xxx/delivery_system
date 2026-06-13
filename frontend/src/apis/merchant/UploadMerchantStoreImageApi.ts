import type { ImageUploadResponse } from '@/objects/core/SharedObjects'
import { decodeImageUploadResponse } from '@/system/api/ResponseDecoders'
import { postFormData } from '@/system/api/SharedHttpClient'
import { defineUploadPostApi0, routeSegment } from '@/system/api/TypedApiDefinitions'

export const uploadMerchantStoreImageApiDefinition = defineUploadPostApi0<ImageUploadResponse>([
  routeSegment('api'),
  routeSegment('delivery'),
  routeSegment('uploads'),
  routeSegment('store-image'),
])

export function uploadMerchantStoreImage(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return postFormData(
    uploadMerchantStoreImageApiDefinition,
    formData,
    decodeImageUploadResponse,
  )
}
