package system.app

// Business note: delivery map distance defaults and fallback address values.
import system.objects.*
import services.customer.objects.*

val DeliveryDistanceLimitKm = BigDecimal(10)
val DeliveryFallbackDistanceKm = BigDecimal("2.8")
val DeliveryEarthRadiusKm = 6371.0
val DeliveryDefaultCustomerAddress = new AddressText("待填写地址")
