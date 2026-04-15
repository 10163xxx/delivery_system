package domain.merchant

import domain.shared.given

import domain.shared.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class MenuItem(
    id: MenuItemId,
    name: DisplayText,
    description: DescriptionText,
    priceCents: CurrencyCents,
    imageUrl: Option[ImageUrl],
    remainingQuantity: Option[Quantity],
)
object MenuItem:
  given Encoder[MenuItem] = deriveEncoder
  given Decoder[MenuItem] = Decoder.instance { cursor =>
    for
      id <- cursor.get[MenuItemId]("id")
      name <- cursor.get[DisplayText]("name")
      description <- cursor.get[DescriptionText]("description")
      priceCents <- cursor.get[CurrencyCents]("priceCents")
      imageUrl <- cursor.get[Option[ImageUrl]]("imageUrl")
      remainingQuantity <- cursor.getOrElse[Option[Quantity]]("remainingQuantity")(None)
    yield MenuItem(
      id = id,
      name = name,
      description = description,
      priceCents = priceCents,
      imageUrl = imageUrl,
      remainingQuantity = remainingQuantity,
    )
  }

final case class BusinessHours(
    openTime: TimeOfDay,
    closeTime: TimeOfDay,
)
object BusinessHours:
  val DefaultOpenTime: TimeOfDay = new TimeOfDay("09:00")
  val DefaultCloseTime: TimeOfDay = new TimeOfDay("21:00")
  val Default: BusinessHours = BusinessHours(DefaultOpenTime, DefaultCloseTime)
  given Encoder[BusinessHours] = deriveEncoder
  given Decoder[BusinessHours] = deriveDecoder

final case class Store(
    id: StoreId,
    merchantName: PersonName,
    name: DisplayText,
    category: DisplayText,
    cuisine: CuisineLabel,
    status: DisplayText,
    businessHours: BusinessHours,
    avgPrepMinutes: Minutes,
    imageUrl: Option[ImageUrl],
    menu: List[MenuItem],
    averageRating: AverageRating,
    ratingCount: EntityCount,
    oneStarRatingCount: EntityCount,
    revenueCents: CurrencyCents,
)
object Store:
  given Encoder[Store] = deriveEncoder
  given Decoder[Store] = Decoder.instance { cursor =>
    for
      id <- cursor.get[StoreId]("id")
      merchantName <- cursor.get[PersonName]("merchantName")
      name <- cursor.get[DisplayText]("name")
      category <- cursor.get[DisplayText]("category")
      cuisine <- cursor.get[CuisineLabel]("cuisine")
      status <- cursor.get[DisplayText]("status")
      businessHours <- cursor.getOrElse[BusinessHours]("businessHours")(BusinessHours.Default)
      avgPrepMinutes <- cursor.get[Minutes]("avgPrepMinutes")
      imageUrl <- cursor.get[Option[ImageUrl]]("imageUrl")
      menu <- cursor.getOrElse[List[MenuItem]]("menu")(List.empty)
      averageRating <- cursor.getOrElse[AverageRating]("averageRating")(NumericDefaults.ZeroAverageRating)
      ratingCount <- cursor.getOrElse[EntityCount]("ratingCount")(NumericDefaults.ZeroCount)
      oneStarRatingCount <- cursor.getOrElse[EntityCount]("oneStarRatingCount")(NumericDefaults.ZeroCount)
      revenueCents <- cursor.getOrElse[CurrencyCents]("revenueCents")(NumericDefaults.ZeroCurrencyCents)
    yield Store(
      id = id,
      merchantName = merchantName,
      name = name,
      category = category,
      cuisine = cuisine,
      status = status,
      businessHours = businessHours,
      avgPrepMinutes = avgPrepMinutes,
      imageUrl = imageUrl,
      menu = menu,
      averageRating = averageRating,
      ratingCount = ratingCount,
      oneStarRatingCount = oneStarRatingCount,
      revenueCents = revenueCents,
    )
  }

final case class AddMenuItemRequest(
    name: DisplayText,
    description: DescriptionText,
    priceCents: CurrencyCents,
    imageUrl: Option[ImageUrl],
    remainingQuantity: Option[Quantity],
)
object AddMenuItemRequest:
  given Encoder[AddMenuItemRequest] = deriveEncoder
  given Decoder[AddMenuItemRequest] = deriveDecoder

final case class UpdateMenuItemStockRequest(
    remainingQuantity: Option[Quantity],
)
object UpdateMenuItemStockRequest:
  given Encoder[UpdateMenuItemStockRequest] = deriveEncoder
  given Decoder[UpdateMenuItemStockRequest] = deriveDecoder

final case class UpdateMenuItemPriceRequest(
    priceCents: CurrencyCents,
)
object UpdateMenuItemPriceRequest:
  given Encoder[UpdateMenuItemPriceRequest] = deriveEncoder
  given Decoder[UpdateMenuItemPriceRequest] = deriveDecoder

final case class UpdateStoreOperationalRequest(
    businessHours: BusinessHours,
    avgPrepMinutes: Minutes,
)
object UpdateStoreOperationalRequest:
  given Encoder[UpdateStoreOperationalRequest] = deriveEncoder
  given Decoder[UpdateStoreOperationalRequest] = deriveDecoder
