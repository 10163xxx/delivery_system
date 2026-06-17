package domain.merchant

import domain.shared.given

import domain.shared.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class Store(
    identity: StoreIdentity,
    operations: StoreOperations,
    metrics: StoreMetrics,
)
object Store:
  extension (store: Store)
    def id: StoreId = store.identity.id
    def merchantName: PersonName = store.identity.merchantName
    def name: DisplayText = store.identity.name
    def category: DisplayText = store.identity.category
    def cuisine: CuisineLabel = store.identity.cuisine
    def status: DisplayText = store.operations.status
    def storeAddress: AddressText = store.operations.storeAddress
    def location: Option[StoreLocation] = store.operations.location
    def businessHours: BusinessHours = store.operations.businessHours
    def avgPrepMinutes: Minutes = store.operations.avgPrepMinutes
    def imageUrl: Option[ImageUrl] = store.operations.imageUrl
    def menu: List[MenuItem] = store.operations.menu
    def averageRating: AverageRating = store.metrics.averageRating
    def ratingCount: EntityCount = store.metrics.ratingCount
    def oneStarRatingCount: EntityCount = store.metrics.oneStarRatingCount
    def revenueCents: CurrencyCents = store.metrics.revenueCents

  given Encoder[Store] = Encoder.instance(store =>
    deriveEncoder[Store]
      .apply(store)
      .deepMerge(deriveEncoder[StoreIdentity].apply(store.identity))
      .deepMerge(deriveEncoder[StoreOperations].apply(store.operations))
      .deepMerge(deriveEncoder[StoreMetrics].apply(store.metrics))
      .mapObject(_.remove("identity").remove("operations").remove("metrics"))
  )
  given Decoder[Store] = Decoder.instance { cursor =>
    for
      id <- cursor.get[StoreId]("id")
      merchantName <- cursor.get[PersonName]("merchantName")
      name <- cursor.get[DisplayText]("name")
      category <- cursor.get[DisplayText]("category")
      cuisine <- cursor.get[CuisineLabel]("cuisine")
      status <- cursor.get[DisplayText]("status")
      storeAddress <- cursor.getOrElse[AddressText]("storeAddress")(new AddressText(""))
      location <- cursor.get[Option[StoreLocation]]("location")
      businessHours <- cursor.getOrElse[BusinessHours]("businessHours")(BusinessHours.Default)
      avgPrepMinutes <- cursor.get[Minutes]("avgPrepMinutes")
      imageUrl <- cursor.get[Option[ImageUrl]]("imageUrl")
      menu <- cursor.getOrElse[List[MenuItem]]("menu")(List.empty)
      averageRating <- cursor.getOrElse[AverageRating]("averageRating")(NumericDefaults.ZeroAverageRating)
      ratingCount <- cursor.getOrElse[EntityCount]("ratingCount")(NumericDefaults.ZeroCount)
      oneStarRatingCount <- cursor.getOrElse[EntityCount]("oneStarRatingCount")(NumericDefaults.ZeroCount)
      revenueCents <- cursor.getOrElse[CurrencyCents]("revenueCents")(NumericDefaults.ZeroCurrencyCents)
    yield Store(
      identity = StoreIdentity(
        id = id,
        merchantName = merchantName,
        name = name,
        category = category,
        cuisine = cuisine,
      ),
      operations = StoreOperations(
        status = status,
        storeAddress = storeAddress,
        location = location,
        businessHours = businessHours,
        avgPrepMinutes = avgPrepMinutes,
        imageUrl = imageUrl,
        menu = menu,
      ),
      metrics = StoreMetrics(
        averageRating = averageRating,
        ratingCount = ratingCount,
        oneStarRatingCount = oneStarRatingCount,
        revenueCents = revenueCents,
      ),
    )
  }
