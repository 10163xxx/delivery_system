import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type MenuItemIdTag = { readonly menuItemIdBrand: never }

export type MenuItemId = TextDomainValue<MenuItemIdTag>
