package shared.app

import domain.shared.*

final case class DeliveryCoordinate(latitude: Latitude, longitude: Longitude)

val DeliveryDistanceLimitKm = BigDecimal(10)
val DeliveryFallbackDistanceKm = BigDecimal("2.8")
val DeliveryEarthRadiusKm = 6371.0
val DeliveryDefaultCustomerAddress = new AddressText("待填写地址")
