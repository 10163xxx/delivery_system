package system.app

import domain.shared.given

import domain.merchant.*
import domain.order.OrderItemSelection
import domain.shared.*

def sanitizeMenuItemSelectionOptions(
    options: List[MenuItemSelectionOption]
): List[MenuItemSelectionOption] =
  options.flatMap(option =>
    sanitizeOptionalText(Some(option.name), DeliveryValidationDefaults.MenuItemSelectionOptionMaxLength).map(
      sanitizedName =>
        option.copy(
          name = sanitizedName,
          additionalPriceCents = Math.max(NumericDefaults.ZeroCurrencyCents, option.additionalPriceCents),
        )
    )
  )

def hasValidMenuItemSelectionOptions(options: List[MenuItemSelectionOption]): Boolean =
  val uniqueNames = options.map(_.name.raw).distinct
  options.nonEmpty &&
  uniqueNames.length == options.length &&
  options.length <= DeliveryValidationDefaults.MenuItemSelectionOptionMaxCount &&
  options.forall(_.additionalPriceCents <= DeliveryValidationDefaults.MenuItemPriceMaxCents)

def menuItemSelectionContainsOption(group: MenuItemSelectionGroup, optionName: DisplayText): Boolean =
  group.options.exists(_.name == optionName)

def menuItemSelectionAdditionalPriceCents(
    menuItem: MenuItem,
    selections: List[OrderItemSelection],
): CurrencyCents =
  val selectedByGroup = selections.map(selection => selection.groupName.raw -> selection.selectedOptions).toMap
  menuItem.selectionGroups.foldLeft(NumericDefaults.ZeroCurrencyCents) { (sum, group) =>
    val additionalCents = selectedByGroup
      .getOrElse(group.name.raw, List.empty)
      .flatMap(optionName => group.options.find(_.name == optionName).map(_.additionalPriceCents))
      .sum
    sum + additionalCents
  }
