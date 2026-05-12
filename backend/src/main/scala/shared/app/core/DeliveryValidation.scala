package shared.app

import domain.shared.given

import domain.admin.*
import domain.customer.*
import domain.merchant.*
import domain.order.*
import domain.review.*
import domain.shared.*

def validateMerchantRegistration(
      request: MerchantRegistrationRequest
  ): Either[ErrorMessage, MerchantRegistrationRequest] =
    for
      merchantName <- sanitizeRequiredText(request.merchantName, DeliveryValidationDefaults.MerchantNameMaxLength, ValidationMessages.Merchant.MerchantNameRequired)
      storeName <- sanitizeRequiredText(request.storeName, DeliveryValidationDefaults.StoreNameMaxLength, ValidationMessages.Merchant.StoreNameRequired)
      category <- sanitizeRequiredText(request.category, DeliveryValidationDefaults.StoreCategoryMaxLength, ValidationMessages.Merchant.StoreCategoryRequired)
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
      description <- sanitizeRequiredText(request.description, DeliveryValidationDefaults.MenuItemDescriptionMaxLength, ValidationMessages.Merchant.MenuItemDescriptionRequired)
      _ <- Either.cond(
        request.priceCents > DeliveryValidationDefaults.MenuItemPriceMinCentsExclusive &&
          request.priceCents <= DeliveryValidationDefaults.MenuItemPriceMaxCents,
        (),
        ValidationMessages.Merchant.MenuItemPriceInvalid,
      )
      _ <- Either.cond(
        request.remainingQuantity.forall(quantity =>
          quantity >= DeliveryValidationDefaults.MenuItemQuantityMin &&
            quantity <= DeliveryValidationDefaults.MenuItemStockMax
        ),
        (),
        ValidationMessages.Merchant.MenuItemRemainingQuantityInvalid,
      )
      imageUrl <- sanitizeOptionalText(request.imageUrl, DeliveryValidationDefaults.MenuItemImageUrlMaxLength).toRight(ValidationMessages.Merchant.MenuItemImageRequired)
    yield AddMenuItemRequest(
      name = name,
      description = description,
      priceCents = request.priceCents,
      imageUrl = Some(imageUrl),
      remainingQuantity = request.remainingQuantity,
    )

def validateMenuItemStockRequest(
      request: UpdateMenuItemStockRequest
  ): Either[ErrorMessage, UpdateMenuItemStockRequest] =
    Either.cond(
      request.remainingQuantity.forall(quantity =>
        quantity >= DeliveryValidationDefaults.MenuItemStockMin &&
          quantity <= DeliveryValidationDefaults.MenuItemStockMax
      ),
      request,
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
