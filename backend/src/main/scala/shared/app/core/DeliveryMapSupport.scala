package shared.app

import domain.shared.*

final case class DeliveryCoordinate(latitude: Double, longitude: Double)

val DeliveryDistanceLimitKm = BigDecimal(10)
val DeliveryFallbackDistanceKm = BigDecimal("2.8")
val DeliveryEarthRadiusKm = 6371.0
val DeliveryDefaultCustomerAddress = new AddressText("待填写地址")
