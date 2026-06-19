package system.app

// Business note: delivery distance and fee quoting rules.
import system.objects.*

final case class DeliveryQuote(
    distanceKm: BigDecimal,
    deliveryFeeCents: CurrencyCents,
    isDeliverable: ApprovalFlag,
)

private def radians(value: Double): Double =
  value * Math.PI / 180

private def distanceKm(left: DeliveryCoordinate, right: DeliveryCoordinate): BigDecimal =
  val latitudeDelta = radians(right.latitude.raw - left.latitude.raw)
  val longitudeDelta = radians(right.longitude.raw - left.longitude.raw)
  val latitudeA = radians(left.latitude.raw)
  val latitudeB = radians(right.latitude.raw)
  val haversine =
    Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
      Math.cos(latitudeA) * Math.cos(latitudeB) * Math.sin(longitudeDelta / 2) * Math.sin(longitudeDelta / 2)
  BigDecimal(2 * DeliveryEarthRadiusKm * Math.asin(Math.sqrt(haversine))).setScale(1, BigDecimal.RoundingMode.HALF_UP)

private def deliveryFeeCents(distanceKm: BigDecimal): CurrencyCents =
  if distanceKm <= BigDecimal(3) then new CurrencyCents(600)
  else if distanceKm <= BigDecimal(6) then new CurrencyCents(900)
  else if distanceKm <= DeliveryDistanceLimitKm then new CurrencyCents(1400)
  else new CurrencyCents(1800)

private def deliveryCoordinate(latitude: Latitude, longitude: Longitude): DeliveryCoordinate =
  DeliveryCoordinate(latitude = latitude, longitude = longitude)

def buildDeliveryQuote(
    storeCoordinate: DeliveryCoordinate,
    deliveryCoordinate: DeliveryCoordinate,
): DeliveryQuote =
  val distance = distanceKm(storeCoordinate, deliveryCoordinate)
  DeliveryQuote(
    distanceKm = distance,
    deliveryFeeCents = deliveryFeeCents(distance),
    isDeliverable = new ApprovalFlag(distance <= DeliveryDistanceLimitKm),
  )

def buildStoreDeliveryQuote(
    storeLocation: services.merchant.objects.StoreLocation,
    deliveryLocation: services.customer.objects.CustomerLocation,
): DeliveryQuote =
  buildDeliveryQuote(
    deliveryCoordinate(storeLocation.latitude, storeLocation.longitude),
    deliveryCoordinate(deliveryLocation.latitude, deliveryLocation.longitude),
  )
