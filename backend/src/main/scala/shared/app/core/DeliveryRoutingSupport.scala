package shared.app

import domain.shared.*

final case class DeliveryQuote(
    distanceKm: BigDecimal,
    deliveryFeeCents: CurrencyCents,
    isDeliverable: ApprovalFlag,
)

private def radians(value: Double): Double =
  value * Math.PI / 180

private def distanceKm(left: DeliveryCoordinate, right: DeliveryCoordinate): BigDecimal =
  val latitudeDelta = radians(right.latitude - left.latitude)
  val longitudeDelta = radians(right.longitude - left.longitude)
  val latitudeA = radians(left.latitude)
  val latitudeB = radians(right.latitude)
  val haversine =
    Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
      Math.cos(latitudeA) * Math.cos(latitudeB) * Math.sin(longitudeDelta / 2) * Math.sin(longitudeDelta / 2)
  BigDecimal(2 * DeliveryEarthRadiusKm * Math.asin(Math.sqrt(haversine))).setScale(1, BigDecimal.RoundingMode.HALF_UP)

private def deliveryFeeCents(distanceKm: BigDecimal): CurrencyCents =
  if distanceKm <= BigDecimal(3) then 600
  else if distanceKm <= BigDecimal(6) then 900
  else if distanceKm <= DeliveryDistanceLimitKm then 1400
  else 1800

private def deliveryCoordinate(latitude: Double, longitude: Double): DeliveryCoordinate =
  DeliveryCoordinate(latitude = latitude, longitude = longitude)

def buildDeliveryQuote(
    storeCoordinate: DeliveryCoordinate,
    deliveryCoordinate: DeliveryCoordinate,
): DeliveryQuote =
  val distance = distanceKm(storeCoordinate, deliveryCoordinate)
  DeliveryQuote(
    distanceKm = distance,
    deliveryFeeCents = deliveryFeeCents(distance),
    isDeliverable = distance <= DeliveryDistanceLimitKm,
  )

def buildStoreDeliveryQuote(
    storeLocation: domain.merchant.StoreLocation,
    deliveryLocation: domain.customer.CustomerLocation,
): DeliveryQuote =
  buildDeliveryQuote(
    deliveryCoordinate(storeLocation.latitude, storeLocation.longitude),
    deliveryCoordinate(deliveryLocation.latitude, deliveryLocation.longitude),
  )
