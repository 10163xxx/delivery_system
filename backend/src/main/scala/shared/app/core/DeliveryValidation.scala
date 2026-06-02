package shared.app

import domain.shared.given

import domain.admin.*
import domain.customer.*
import domain.merchant.*
import domain.order.*
import domain.review.*
import domain.shared.*

private def normalizeMenuItemRemainingQuantity(
      quantity: Option[Quantity]
  ): Option[Quantity] =
    quantity.filter(_ <= DeliveryValidationDefaults.MenuItemStockMax)

def validateMerchantRegistration(
      request: MerchantRegistrationRequest
  ): Either[ErrorMessage, MerchantRegistrationRequest] =
    for
      merchantName <- sanitizeRequiredText(request.merchantName, DeliveryValidationDefaults.MerchantNameMaxLength, ValidationMessages.Merchant.MerchantNameRequired)
      storeName <- sanitizeRequiredText(request.storeName, DeliveryValidationDefaults.StoreNameMaxLength, ValidationMessages.Merchant.StoreNameRequired)
      category <- sanitizeRequiredText(request.category, DeliveryValidationDefaults.StoreCategoryMaxLength, ValidationMessages.Merchant.StoreCategoryRequired)
      storeAddress <- sanitizeRequiredText(request.storeAddress, DeliveryValidationDefaults.AddressMaxLength, ValidationMessages.Merchant.StoreAddressRequired)
      _ <- Either.cond(StoreCategories.contains(category), (), ValidationMessages.Merchant.InvalidStoreCategory)
      businessHours <- validateBusinessHours(request.businessHours)
      _ <- Either.cond(
        request.avgPrepMinutes >= DeliveryValidationDefaults.PrepMinutesMin &&
          request.avgPrepMinutes <= DeliveryValidationDefaults.PrepMinutesMax,
        (),
        ValidationMessages.Merchant.PrepMinutesInvalid,
      )
    yield MerchantRegistrationRequest(
      merchantName = merchantName,
      storeName = storeName,
      category = category,
      storeAddress = storeAddress,
      businessHours = businessHours,
      avgPrepMinutes = request.avgPrepMinutes,
      imageUrl = sanitizeOptionalText(request.imageUrl, DeliveryValidationDefaults.ImageUrlMaxLength),
      note = sanitizeOptionalText(request.note, DeliveryValidationDefaults.NoteMaxLength),
    )

def validateMenuItemRequest(
      request: AddMenuItemRequest
  ): Either[ErrorMessage, AddMenuItemRequest] =
    for
      name <- sanitizeRequiredText(request.name, DeliveryValidationDefaults.MenuItemNameMaxLength, ValidationMessages.Merchant.MenuItemNameRequired)
      category <- sanitizeRequiredText(
        request.category.getOrElse(new DisplayText("")),
        DeliveryValidationDefaults.MenuItemCategoryMaxLength,
        ValidationMessages.Merchant.MenuItemCategoryRequired,
      )
      description <- sanitizeRequiredText(request.description, DeliveryValidationDefaults.MenuItemDescriptionMaxLength, ValidationMessages.Merchant.MenuItemDescriptionRequired)
      _ <- Either.cond(
        request.priceCents > DeliveryValidationDefaults.MenuItemPriceMinCentsExclusive &&
          request.priceCents <= DeliveryValidationDefaults.MenuItemPriceMaxCents,
        (),
        ValidationMessages.Merchant.MenuItemPriceInvalid,
      )
      _ <- Either.cond(
        request.remainingQuantity.forall(quantity =>
          quantity >= DeliveryValidationDefaults.MenuItemQuantityMin
        ),
        (),
        ValidationMessages.Merchant.MenuItemRemainingQuantityInvalid,
      )
      imageUrl <- sanitizeOptionalText(request.imageUrl, DeliveryValidationDefaults.MenuItemImageUrlMaxLength).toRight(ValidationMessages.Merchant.MenuItemImageRequired)
      selectionGroups <- validateMenuItemSelectionGroups(request.selectionGroups)
    yield AddMenuItemRequest(
      name = name,
      category = Some(category),
      description = description,
      priceCents = request.priceCents,
      imageUrl = Some(imageUrl),
      remainingQuantity = normalizeMenuItemRemainingQuantity(request.remainingQuantity),
      selectionGroups = selectionGroups,
    )

private def validateMenuItemSelectionGroups(
      groups: List[MenuItemSelectionGroup]
  ): Either[ErrorMessage, List[MenuItemSelectionGroup]] =
    Either.cond(
      groups.length <= DeliveryValidationDefaults.MenuItemSelectionGroupMaxCount,
      (),
      ValidationMessages.Merchant.MenuItemSelectionGroupsInvalid,
    ).flatMap { _ =>
      groups.foldLeft[Either[ErrorMessage, (List[MenuItemSelectionGroup], Set[String])]](Right((List.empty, Set.empty))) {
        case (acc, group) =>
          for
            tuple <- acc
            (validated, seenNames) = tuple
            name <- sanitizeRequiredText(
              group.name,
              DeliveryValidationDefaults.MenuItemSelectionGroupNameMaxLength,
              ValidationMessages.Merchant.MenuItemSelectionGroupsInvalid,
            )
            _ <- Either.cond(!seenNames.contains(name.raw), (), ValidationMessages.Merchant.MenuItemSelectionGroupsInvalid)
            sanitizedOptions = sanitizeMenuItemSelectionOptions(group.options)
            _ <- Either.cond(
              hasValidMenuItemSelectionOptions(sanitizedOptions) &&
                group.minSelections >= NumericDefaults.ZeroCount &&
                group.maxSelections >= group.minSelections &&
                group.maxSelections > NumericDefaults.ZeroCount &&
                group.maxSelections <= sanitizedOptions.length &&
                group.minSelections <= sanitizedOptions.length,
              (),
              ValidationMessages.Merchant.MenuItemSelectionGroupsInvalid,
            )
          yield (
            validated :+ group.copy(name = name, options = sanitizedOptions),
            seenNames + name.raw,
          )
      }.map(_._1)
    }

def validateMenuItemStockRequest(
      request: UpdateMenuItemStockRequest
  ): Either[ErrorMessage, UpdateMenuItemStockRequest] =
    Either.cond(
      request.remainingQuantity.forall(quantity =>
        quantity >= DeliveryValidationDefaults.MenuItemStockMin
      ),
      request.copy(remainingQuantity = normalizeMenuItemRemainingQuantity(request.remainingQuantity)),
      ValidationMessages.Merchant.MenuItemStockInvalid,
    )

def validateMenuItemPriceRequest(
      request: UpdateMenuItemPriceRequest
  ): Either[ErrorMessage, UpdateMenuItemPriceRequest] =
    Either.cond(
      request.priceCents > DeliveryValidationDefaults.MenuItemPriceMinCentsExclusive &&
        request.priceCents <= DeliveryValidationDefaults.MenuItemPriceMaxCents,
      request,
      ValidationMessages.Merchant.MenuItemPriceInvalid,
    )

def validateMenuItemCategoryRequest(
      request: UpdateMenuItemCategoryRequest
  ): Either[ErrorMessage, UpdateMenuItemCategoryRequest] =
    sanitizeRequiredText(
      request.category,
      DeliveryValidationDefaults.MenuItemCategoryMaxLength,
      ValidationMessages.Merchant.MenuItemCategoryRequired,
    ).map(category => request.copy(category = category))

def validateEligibilityTargetState(
      state: DeliveryAppState,
      request: EligibilityReviewRequest,
  ): Either[ErrorMessage, Unit] =
    request.target match
      case EligibilityReviewTarget.Store =>
        state.stores.find(_.id == request.targetId).toRight(ValidationMessages.Merchant.StoreNotFound).flatMap(store =>
          Either.cond(store.status == validationStoreRevoked, (), ValidationMessages.Merchant.StoreReviewNotNeeded)
        )
      case EligibilityReviewTarget.Rider =>
        state.riders.find(_.id == request.targetId).toRight(ValidationMessages.Merchant.RiderNotFound).flatMap(rider =>
          Either.cond(rider.availability == validationRiderSuspended, (), ValidationMessages.Merchant.RiderReviewNotNeeded)
        )

def findEligibilityTargetName(
      state: DeliveryAppState,
      request: EligibilityReviewRequest,
  ): Either[ErrorMessage, DisplayText] =
    request.target match
      case EligibilityReviewTarget.Store =>
        state.stores.find(_.id == request.targetId).map(_.name).toRight(ValidationMessages.Merchant.StoreNotFound)
      case EligibilityReviewTarget.Rider =>
        state.riders.find(_.id == request.targetId).map(rider => new DisplayText(rider.name.raw)).toRight(ValidationMessages.Merchant.RiderNotFound)
