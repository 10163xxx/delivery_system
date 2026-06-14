import type {
  DescriptionText,
  DisplayText,
  ImageUrl,
} from '@/objects/core/SharedObjects'
import type { MenuItemSelectionGroup } from '@/objects/core/SharedObjects'

type MenuItemContentDraft = {
  name: DisplayText
  category: DisplayText
  description: DescriptionText
}

type MenuItemPricingDraft = {
  priceYuan: DisplayText
  remainingQuantity: DisplayText
}

type MenuItemAssetDraft = {
  imageUrl: ImageUrl
  uploadedImageName: DisplayText
  selectionGroupsText: DisplayText
}

export type MenuItemDraft = MenuItemContentDraft & MenuItemPricingDraft & MenuItemAssetDraft

export type ParsedMenuItemSelectionGroups = {
  groups: MenuItemSelectionGroup[]
  errorText: DisplayText | null
}
