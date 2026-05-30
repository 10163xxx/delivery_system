package shared.app

import domain.shared.*

final case class DeliveryQuote(
    distanceKm: BigDecimal,
    deliveryFeeCents: CurrencyCents,
    isDeliverable: ApprovalFlag,
)

private final case class DeliveryCoordinate(latitude: Double, longitude: Double)
private final case class DeliveryAddressCoordinateRule(keyword: String, coordinate: DeliveryCoordinate)

private val DeliveryDistanceLimitKm = BigDecimal(10)
private val fallbackDistanceKm = BigDecimal("2.8")
private val earthRadiusKm = 6371.0
private val deliveryCoordinateRules = List(
  DeliveryAddressCoordinateRule("上海市浦东新区世纪大道100号上海环球金融中心", DeliveryCoordinate(31.2367, 121.5026)),
  DeliveryAddressCoordinateRule("上海市浦东新区世纪大道88号金茂大厦", DeliveryCoordinate(31.2356, 121.5062)),
  DeliveryAddressCoordinateRule("上海市浦东新区张杨路188号汤臣中心", DeliveryCoordinate(31.2304, 121.5158)),
  DeliveryAddressCoordinateRule("上海市黄浦区南京西路318号", DeliveryCoordinate(31.2302, 121.4647)),
  DeliveryAddressCoordinateRule("上海市静安区吴江路269号", DeliveryCoordinate(31.2311, 121.4583)),
  DeliveryAddressCoordinateRule("上海市静安区南京西路580号", DeliveryCoordinate(31.2293, 121.4593)),
  DeliveryAddressCoordinateRule("上海市静安区愚园路246号", DeliveryCoordinate(31.2236, 121.4378)),
  DeliveryAddressCoordinateRule("上海市浦东新区张杨路628号", DeliveryCoordinate(31.2286, 121.5164)),
  DeliveryAddressCoordinateRule("上海市浦东新区世纪大道1200号", DeliveryCoordinate(31.2338, 121.5202)),
  DeliveryAddressCoordinateRule("上海市浦东新区陆家嘴环路1088号", DeliveryCoordinate(31.2398, 121.5018)),
  DeliveryAddressCoordinateRule("世纪大道 88 号", DeliveryCoordinate(31.2356, 121.5062)),
  DeliveryAddressCoordinateRule("世纪大道 1200 号", DeliveryCoordinate(31.2338, 121.5202)),
  DeliveryAddressCoordinateRule("世纪大道 1267 号", DeliveryCoordinate(31.2352, 121.5134)),
  DeliveryAddressCoordinateRule("张杨路 188 号", DeliveryCoordinate(31.2304, 121.5158)),
  DeliveryAddressCoordinateRule("张杨路 628 号", DeliveryCoordinate(31.2286, 121.5164)),
  DeliveryAddressCoordinateRule("浦东南路 1118 号", DeliveryCoordinate(31.2254, 121.5178)),
  DeliveryAddressCoordinateRule("浦东南路 855 号", DeliveryCoordinate(31.2292, 121.5149)),
  DeliveryAddressCoordinateRule("陆家嘴环路 1088 号", DeliveryCoordinate(31.2398, 121.5018)),
  DeliveryAddressCoordinateRule("南京西路 318 号", DeliveryCoordinate(31.2302, 121.4647)),
  DeliveryAddressCoordinateRule("南京西路 580 号", DeliveryCoordinate(31.2293, 121.4593)),
  DeliveryAddressCoordinateRule("南京西路 1038 号", DeliveryCoordinate(31.2278, 121.4511)),
  DeliveryAddressCoordinateRule("静安寺", DeliveryCoordinate(31.2239, 121.4451)),
  DeliveryAddressCoordinateRule("愚园路 246 号", DeliveryCoordinate(31.2236, 121.4378)),
  DeliveryAddressCoordinateRule("吴江路 269 号", DeliveryCoordinate(31.2311, 121.4583)),
  DeliveryAddressCoordinateRule("苏宁夜宵铺", DeliveryCoordinate(31.2311, 121.4583)),
  DeliveryAddressCoordinateRule("苏宁咖啡甜点", DeliveryCoordinate(31.2293, 121.4593)),
  DeliveryAddressCoordinateRule("苏宁奶茶研究所", DeliveryCoordinate(31.2236, 121.4378)),
  DeliveryAddressCoordinateRule("王师傅面馆", DeliveryCoordinate(31.2286, 121.5164)),
  DeliveryAddressCoordinateRule("王师傅盖饭", DeliveryCoordinate(31.2338, 121.5202)),
  DeliveryAddressCoordinateRule("王师傅小炒", DeliveryCoordinate(31.2398, 121.5018)),
)

private def radians(value: Double): Double =
  value * Math.PI / 180

private def addressCoordinate(address: AddressText): Option[DeliveryCoordinate] =
  val rawAddress = address.raw.trim
  deliveryCoordinateRules.find(rule => rawAddress.contains(rule.keyword)).map(_.coordinate)

private def distanceKm(left: DeliveryCoordinate, right: DeliveryCoordinate): BigDecimal =
  val latitudeDelta = radians(right.latitude - left.latitude)
  val longitudeDelta = radians(right.longitude - left.longitude)
  val latitudeA = radians(left.latitude)
  val latitudeB = radians(right.latitude)
  val haversine =
    Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
      Math.cos(latitudeA) * Math.cos(latitudeB) * Math.sin(longitudeDelta / 2) * Math.sin(longitudeDelta / 2)
  BigDecimal(2 * earthRadiusKm * Math.asin(Math.sqrt(haversine))).setScale(1, BigDecimal.RoundingMode.HALF_UP)

private def deliveryFeeCents(distanceKm: BigDecimal): CurrencyCents =
  if distanceKm <= BigDecimal(3) then 600
  else if distanceKm <= BigDecimal(6) then 900
  else if distanceKm <= DeliveryDistanceLimitKm then 1400
  else 1800

def buildDeliveryQuote(storeAddress: AddressText, deliveryAddress: AddressText): DeliveryQuote =
  val nextDistanceKm =
    (for
      storeCoordinate <- addressCoordinate(storeAddress)
      customerCoordinate <- addressCoordinate(deliveryAddress)
    yield distanceKm(storeCoordinate, customerCoordinate)).getOrElse(fallbackDistanceKm)

  DeliveryQuote(
    distanceKm = nextDistanceKm,
    deliveryFeeCents = deliveryFeeCents(nextDistanceKm),
    isDeliverable = nextDistanceKm <= DeliveryDistanceLimitKm,
  )

def buildStoreDeliveryQuote(store: domain.merchant.Store, deliveryAddress: AddressText): DeliveryQuote =
  val resolvedStoreAddress =
    if store.storeAddress.raw.trim.nonEmpty then store.storeAddress else wrapText[AddressText](store.name.raw)
  buildDeliveryQuote(resolvedStoreAddress, deliveryAddress)
