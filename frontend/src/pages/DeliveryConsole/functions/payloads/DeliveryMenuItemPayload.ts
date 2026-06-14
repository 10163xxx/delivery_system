import type {
  AddMenuItemRequest,
  CurrencyCents,
  DescriptionText,
  DisplayText,
  EntityCount,
  ImageUrl,
  MenuItemSelectionGroup,
  MenuItemSelectionOption,
  Quantity,
} from '@/objects/core/SharedObjects'
import {
  CURRENCY_CENTS_SCALE,
  MAX_MENU_ITEM_CATEGORY_LENGTH,
  MAX_MENU_ITEM_DESCRIPTION_LENGTH,
  MAX_MENU_ITEM_NAME_LENGTH,
  MAX_MENU_ITEM_SELECTION_GROUP_COUNT,
  MAX_MENU_ITEM_SELECTION_GROUP_NAME_LENGTH,
  MAX_MENU_ITEM_SELECTION_OPTION_COUNT,
  MAX_MENU_ITEM_SELECTION_OPTION_LENGTH,
  MAX_MENU_ITEM_STOCK,
} from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import { DELIVERY_CONSOLE_MESSAGES } from '@/pages/DeliveryConsole/functions/shared/DeliveryMessages'
import { asDomainNumber, asDomainText, normalizeTextInput } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import type {
  MenuItemDraft,
  ParsedMenuItemSelectionGroups,
} from '@/pages/DeliveryConsole/objects/DeliveryDraftObjects'
import { optionalDomainText } from '@/pages/DeliveryConsole/functions/payloads/DeliveryPayloadFields'

export function buildMenuItemPayload(draft: MenuItemDraft): AddMenuItemRequest {
  const name = normalizeTextInput(draft.name, MAX_MENU_ITEM_NAME_LENGTH)
  const category = normalizeTextInput(draft.category, MAX_MENU_ITEM_CATEGORY_LENGTH)
  const description = normalizeTextInput(
    draft.description,
    MAX_MENU_ITEM_DESCRIPTION_LENGTH,
  )
  const imageUrl = draft.imageUrl.trim()
  const price = Number(draft.priceYuan.trim())
  const remainingQuantity = draft.remainingQuantity.trim()
  const parsedRemainingQuantity = Number(remainingQuantity)
  const selectionGroups = parseMenuItemSelectionGroups(draft.selectionGroupsText).groups

  return {
    name: asDomainText<DisplayText>(name),
    category: optionalDomainText<DisplayText>(category),
    description: asDomainText<DescriptionText>(description),
    priceCents: asDomainNumber<CurrencyCents>(Number.isFinite(price) ? Math.round(price * CURRENCY_CENTS_SCALE) : 0),
    imageUrl: optionalDomainText<ImageUrl>(imageUrl),
    remainingQuantity:
      remainingQuantity === '' ||
      (Number.isInteger(parsedRemainingQuantity) && parsedRemainingQuantity > MAX_MENU_ITEM_STOCK)
        ? undefined
        : Number.isInteger(parsedRemainingQuantity)
          ? asDomainNumber<Quantity>(parsedRemainingQuantity)
          : undefined,
    selectionGroups,
  }
}

function normalizeSelectionLinePart(value: string, maxLength: number) {
  return normalizeTextInput(value, maxLength)
}

function parseSelectionCountRange(rawRule: string) {
  const trimmed = rawRule.trim()
  if (!trimmed) return { minSelections: 1, maxSelections: 1, ok: true as const }
  const match = trimmed.match(/^\[(\d+)-(\d+)\]$/)
  if (!match) return { minSelections: 0, maxSelections: 0, ok: false as const }
  const minSelections = Number(match[1])
  const maxSelections = Number(match[2])
  if (!Number.isInteger(minSelections) || !Number.isInteger(maxSelections) || minSelections < 0 || maxSelections < minSelections) {
    return { minSelections: 0, maxSelections: 0, ok: false as const }
  }
  return { minSelections, maxSelections, ok: true as const }
}

function parseSelectionOption(rawOption: string): MenuItemSelectionOption | null {
  const trimmed = rawOption.trim()
  if (!trimmed) return null
  const match = trimmed.match(/^(.*?)(?:\(\+(\d+(?:\.\d{1,2})?)\))?$/)
  if (!match) return null
  const name = normalizeSelectionLinePart(
    match[1] ?? '',
    MAX_MENU_ITEM_SELECTION_OPTION_LENGTH,
  )
  if (!name) return null
  const additionalPriceYuan = match[2] == null ? 0 : Number(match[2])
  if (!Number.isFinite(additionalPriceYuan) || additionalPriceYuan < 0) return null
  return {
    name: asDomainText<DisplayText>(name),
    additionalPriceCents: asDomainNumber<CurrencyCents>(Math.round(additionalPriceYuan * CURRENCY_CENTS_SCALE)),
  }
}

export function parseMenuItemSelectionGroups(
  value: string,
): ParsedMenuItemSelectionGroups {
  const lines = value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) return { groups: [], errorText: null }
  if (lines.length > MAX_MENU_ITEM_SELECTION_GROUP_COUNT) {
    return invalidSelectionGroups()
  }

  const groups: MenuItemSelectionGroup[] = []
  const usedNames: DisplayText[] = []

  for (const line of lines) {
    const [leftPart, rightPart, ...rest] = line.split(':')
    if (!leftPart || !rightPart || rest.length > 0) {
      return invalidSelectionGroups()
    }
    const nameRuleMatch = leftPart.trim().match(/^([^[\]]+?)(\[\d+-\d+\])?$/)
    if (!nameRuleMatch) {
      return invalidSelectionGroups()
    }
    const name = normalizeSelectionLinePart(nameRuleMatch[1] ?? '', MAX_MENU_ITEM_SELECTION_GROUP_NAME_LENGTH)
    const range = parseSelectionCountRange(nameRuleMatch[2] ?? '')
    const options = rightPart
      .split(',')
      .map(parseSelectionOption)
      .filter((option): option is MenuItemSelectionOption => option !== null)
    const optionNames = options.map((option) => option.name)

    if (
      !name ||
      usedNames.includes(asDomainText<DisplayText>(name)) ||
      !range.ok ||
      options.length === 0 ||
      options.length > MAX_MENU_ITEM_SELECTION_OPTION_COUNT ||
      optionNames.some((optionName, index) => optionNames.indexOf(optionName) !== index) ||
      range.maxSelections === 0 ||
      range.maxSelections > options.length ||
      range.minSelections > options.length
    ) {
      return invalidSelectionGroups()
    }

    usedNames.push(asDomainText<DisplayText>(name))
    groups.push({
      name: asDomainText<DisplayText>(name),
      minSelections: asDomainNumber<EntityCount>(range.minSelections),
      maxSelections: asDomainNumber<EntityCount>(range.maxSelections),
      options,
    })
  }

  return { groups, errorText: null }
}

function invalidSelectionGroups(): ParsedMenuItemSelectionGroups {
  return {
    groups: [],
    errorText: asDomainText<DisplayText>(DELIVERY_CONSOLE_MESSAGES.merchant.menuItemSelectionGroupsInvalid),
  }
}
