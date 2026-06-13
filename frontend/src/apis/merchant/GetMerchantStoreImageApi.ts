import type { FileNameText } from '@/objects/core/SharedObjects'
import { API_CLIENT_DEFAULTS } from '@/system/api/ApiConstants'
import { buildApiPath1, defineJsonGetApi1, routeSegment } from '@/system/api/TypedApiDefinitions'

const getMerchantStoreImageApiDefinition = defineJsonGetApi1<FileNameText, void>(
  [routeSegment('uploads'), routeSegment('store-images')],
)

export function getMerchantStoreImageUrl(filename: FileNameText) {
  return `${API_CLIENT_DEFAULTS.backendUrl}${buildApiPath1(getMerchantStoreImageApiDefinition, filename)}`
}
