package shared.app

import domain.shared.given

import domain.admin.*
import domain.customer.*
import domain.merchant.*
import domain.rider.*
import domain.shared.*

private val storeOpen = StoreOpenStatus
private val riderAvailable = RiderAvailableStatus

private def text(value: String): DisplayText = new DisplayText(value)
private def description(value: String): DescriptionText = new DescriptionText(value)
private def image(value: String): ImageUrl = new ImageUrl(value)
private def person(value: String): PersonName = new PersonName(value)
private def phone(value: String): PhoneNumber = new PhoneNumber(value)
private def address(value: String): AddressText = new AddressText(value)
private def label(value: String): AddressLabel = new AddressLabel(value)
private def time(value: String): TimeOfDay = new TimeOfDay(value)
private def vehicle(value: String): VehicleLabel = new VehicleLabel(value)
private def zone(value: String): ZoneLabel = new ZoneLabel(value)

private def seedMenuItem(
      id: MenuItemId,
      name: DisplayText,
      description: DescriptionText,
      priceCents: CurrencyCents,
      imageUrl: ImageUrl,
      remainingQuantity: Option[Quantity] = None,
  ): MenuItem =
    MenuItem(
      id = id,
      name = name,
      description = description,
      priceCents = priceCents,
      imageUrl = Some(imageUrl),
      remainingQuantity = remainingQuantity,
    )

private def seedStore(
      id: StoreId,
      merchantName: PersonName,
      name: DisplayText,
      category: DisplayText,
      businessHours: BusinessHours,
      avgPrepMinutes: Minutes,
      imageUrl: ImageUrl,
      menu: List[MenuItem],
      revenueCents: CurrencyCents = NumericDefaults.ZeroCurrencyCents,
  ): Store =
    Store(
      id = id,
      merchantName = merchantName,
      name = name,
      category = category,
      cuisine = new CuisineLabel(category.raw),
      status = storeOpen,
      businessHours = businessHours,
      avgPrepMinutes = avgPrepMinutes,
      imageUrl = Some(imageUrl),
      menu = menu,
      averageRating = NumericDefaults.ZeroAverageRating,
      ratingCount = NumericDefaults.ZeroCount,
      oneStarRatingCount = NumericDefaults.ZeroCount,
      revenueCents = revenueCents,
    )

private def seedCustomer(
      id: CustomerId,
      phone: PhoneNumber,
      defaultAddress: AddressText,
      addresses: List[AddressEntry],
      balanceCents: CurrencyCents,
  ): Customer =
    Customer(
      id = id,
      name = customerAlias(id),
      phone = phone,
      defaultAddress = defaultAddress,
      addresses = addresses,
      accountStatus = AccountStatus.Active,
      revokedReviewCount = NumericDefaults.ZeroCount,
      membershipTier = MembershipTier.Standard,
      monthlySpendCents = NumericDefaults.ZeroCurrencyCents,
      balanceCents = balanceCents,
      coupons = List.empty,
    )

private def seedRider(
      id: RiderId,
      name: PersonName,
      vehicle: VehicleLabel,
      zone: ZoneLabel,
  ): Rider =
    Rider(
      id = id,
      name = name,
      vehicle = vehicle,
      zone = zone,
      availability = riderAvailable,
      averageRating = NumericDefaults.ZeroAverageRating,
      ratingCount = NumericDefaults.ZeroCount,
      oneStarRatingCount = NumericDefaults.ZeroCount,
      earningsCents = NumericDefaults.ZeroCurrencyCents,
      payoutAccount = None,
      withdrawnCents = NumericDefaults.ZeroCurrencyCents,
      availableToWithdrawCents = NumericDefaults.ZeroCurrencyCents,
      withdrawalHistory = List.empty,
    )

private def seedMerchantProfile(
      id: MerchantId,
      merchantName: PersonName,
      contactPhone: PhoneNumber,
      payoutAccount: Option[MerchantPayoutAccount],
  ): MerchantProfile =
    MerchantProfile(
      id = id,
      merchantName = merchantName,
      contactPhone = contactPhone,
      payoutAccount = payoutAccount,
      settledIncomeCents = NumericDefaults.ZeroCurrencyCents,
      withdrawnCents = NumericDefaults.ZeroCurrencyCents,
      availableToWithdrawCents = NumericDefaults.ZeroCurrencyCents,
      withdrawalHistory = List.empty,
    )

private val emptySystemMetrics: SystemMetrics =
  SystemMetrics(
    totalOrders = NumericDefaults.ZeroCount,
    activeOrders = NumericDefaults.ZeroCount,
    resolvedTickets = NumericDefaults.ZeroCount,
    averageRating = NumericDefaults.ZeroAverageRating,
  )

def seedState(): DeliveryAppState =
    val customers = List(
      seedCustomer(
        id = "cust-1",
        phone = phone("13800000001"),
        defaultAddress = address("浦东新区世纪大道 88 号"),
        addresses = List(
          AddressEntry(label("家"), address("浦东新区世纪大道 88 号")),
          AddressEntry(label("公司"), address("浦东新区张杨路 188 号")),
        ),
        balanceCents = 10000,
      ),
      seedCustomer(
        id = "cust-2",
        phone = phone("13800000002"),
        defaultAddress = address("静安区南京西路 318 号"),
        addresses = List(AddressEntry(label("家"), address("静安区南京西路 318 号"))),
        balanceCents = 5000,
      ),
    )
    val stores = List(
      seedStore(
        id = "store-c27f",
        merchantName = person("王师傅"),
        name = text("深夜牛肉面"),
        category = text("面馆粉档"),
        businessHours = BusinessHours(time("09:00"), time("18:00")),
        avgPrepMinutes = 18,
        imageUrl = image("https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80"),
        menu = List(
          seedMenuItem(
            "dish-706b550d",
            text("红油抄手"),
            description("现包抄手配川味红油，夜宵很合适。"),
            1880,
            image("https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80"),
          ),
          seedMenuItem(
            "dish-92581c7a",
            text("招牌牛肉面"),
            description("大片牛腱配手擀面，汤底浓郁。"),
            2690,
            image("https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80"),
          ),
        ),
        revenueCents = 3760,
      ),
      seedStore(
        id = "store-1d06",
        merchantName = person("王师傅"),
        name = text("测试店铺152209"),
        category = text("中式快餐"),
        businessHours = BusinessHours.Default,
        avgPrepMinutes = 18,
        imageUrl = image("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"),
        menu = List(
          seedMenuItem(
            "dish-0636b442",
            text("招牌鸡腿饭"),
            description("现炸鸡腿配时蔬和米饭"),
            2890,
            image("https://images.unsplash.com/photo-1512058564366-18510be2db19"),
          ),
          seedMenuItem(
            "dish-a0c5c935",
            text("番茄肥牛面"),
            description("酸甜番茄汤底配肥牛和劲道面条"),
            2390,
            image("https://images.unsplash.com/photo-1617093727343-374698b1b08d"),
          ),
          seedMenuItem(
            "dish-829a722f",
            text("冰柠檬茶"),
            description("现萃茶底加整颗鲜柠檬"),
            890,
            image("https://images.unsplash.com/photo-1499638673689-79a0b5115d87"),
          ),
          seedMenuItem(
            "dish-d0f959a6",
            text("联调测试鸡排饭"),
            description("现煎鸡排配椒麻酱和米饭，专门用于验证限量库存和下架功能。"),
            1990,
            image("https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80"),
          ),
        ),
        revenueCents = 5780,
      ),
      seedStore(
        id = "store-salad-01",
        merchantName = person("苏宁"),
        name = text("轻盈能量碗"),
        category = text("轻食沙拉"),
        businessHours = BusinessHours(time("10:00"), time("20:30")),
        avgPrepMinutes = 14,
        imageUrl = image("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80"),
        menu = List(
          seedMenuItem(
            "dish-salad-01",
            text("牛油果鸡胸能量碗"),
            description("鸡胸肉、牛油果、玉米和藜麦组合。"),
            3290,
            image("https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80"),
          ),
          seedMenuItem(
            "dish-salad-02",
            text("低脂鲜虾沙拉"),
            description("鲜虾搭配罗马生菜和油醋汁。"),
            3590,
            image("https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80"),
          ),
          seedMenuItem(
            "dish-salad-03",
            text("冷萃美式"),
            description("无糖冷萃，适合搭配轻食。"),
            1280,
            image("https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80"),
          ),
        ),
      ),
      seedStore(
        id = "store-dumpling-01",
        merchantName = person("王师傅"),
        name = text("北巷饺子馆"),
        category = text("饺子馄饨"),
        businessHours = BusinessHours(time("10:30"), time("22:00")),
        avgPrepMinutes = 20,
        imageUrl = image("https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80"),
        menu = List(
          seedMenuItem(
            "dish-dumpling-01",
            text("三鲜水饺"),
            description("虾仁、鸡蛋、韭菜三鲜馅。"),
            2280,
            image("https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&fit=crop&w=1200&q=80"),
          ),
          seedMenuItem(
            "dish-dumpling-02",
            text("鲜肉小馄饨"),
            description("汤头清爽，适合做午餐加餐。"),
            1680,
            image("https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=1200&q=80"),
          ),
          seedMenuItem(
            "dish-dumpling-03",
            text("酸辣汤"),
            description("木耳豆腐配胡椒醋香。"),
            980,
            image("https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80"),
          ),
        ),
      ),
      seedStore(
        id = "store-tea-01",
        merchantName = person("苏宁"),
        name = text("柠檬云朵茶铺"),
        category = text("奶茶果饮"),
        businessHours = BusinessHours(time("11:00"), time("23:00")),
        avgPrepMinutes = 10,
        imageUrl = image("https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=1200&q=80"),
        menu = List(
          seedMenuItem(
            "dish-tea-01",
            text("芝士葡萄冰"),
            description("现打葡萄果肉配轻芝士奶盖。"),
            1980,
            image("https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=1200&q=80"),
          ),
          seedMenuItem(
            "dish-tea-02",
            text("茉莉轻乳茶"),
            description("茉莉茶底搭配低糖奶香。"),
            1680,
            image("https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=80"),
          ),
          seedMenuItem(
            "dish-tea-03",
            text("手打柠檬绿茶"),
            description("清爽酸甜，适合解腻。"),
            1480,
            image("https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=1200&q=80"),
          ),
        ),
      ),
      seedStore(
        id = "store-dessert-01",
        merchantName = person("苏宁"),
        name = text("暮色咖啡甜点"),
        category = text("咖啡甜点"),
        businessHours = BusinessHours(time("08:30"), time("21:30")),
        avgPrepMinutes = 12,
        imageUrl = image("https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80"),
        menu = List(
          seedMenuItem(
            "dish-dessert-01",
            text("海盐拿铁"),
            description("浓缩咖啡配细腻海盐奶沫。"),
            1880,
            image("https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80"),
          ),
          seedMenuItem(
            "dish-dessert-02",
            text("巴斯克芝士蛋糕"),
            description("入口绵密，带微焦香气。"),
            2280,
            image("https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1200&q=80"),
          ),
          seedMenuItem(
            "dish-dessert-03",
            text("可可布朗尼"),
            description("巧克力风味浓郁，适合下午茶。"),
            1580,
            image("https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80"),
          ),
        ),
      ),
    )
    val riders = List(
      seedRider("rider-1", person("陈凯"), vehicle("电动车"), zone("浦东")),
      seedRider("rider-2", person("赵晨"), vehicle("摩托车"), zone("静安")),
    )
    val admins = List(
      AdminProfile(
        AdminDefaults.PrimaryAdminId,
        AdminDefaults.PrimaryAdminDisplayName,
        NumericDefaults.ZeroCurrencyCents,
      )
    )

    withDerivedData(
      DeliveryAppState(
        customers = customers,
        stores = stores,
        merchantProfiles = List(
          seedMerchantProfile(
            id = "merchant-1",
            merchantName = person("王师傅"),
            contactPhone = phone("13800138000"),
            payoutAccount = Some(
              MerchantPayoutAccount(
                accountType = MerchantPayoutAccountType.Bank,
                bankName = Some(new BankName("招商银行")),
                accountNumber = new AccountNumber("6225888800004021"),
                accountHolder = new AccountHolderName("王师傅"),
              )
            ),
          ),
          seedMerchantProfile(
            id = "merchant-2",
            merchantName = person("苏宁"),
            contactPhone = phone("13800138001"),
            payoutAccount = Some(
              MerchantPayoutAccount(
                accountType = MerchantPayoutAccountType.Alipay,
                bankName = None,
                accountNumber = new AccountNumber("su_store@demo"),
                accountHolder = new AccountHolderName("苏宁"),
              )
            ),
          ),
        ),
        riders = riders,
        admins = admins,
        merchantApplications = List.empty,
        reviewAppeals = List.empty,
        eligibilityReviews = List.empty,
        orders = List.empty,
        tickets = List.empty,
        metrics = emptySystemMetrics,
      )
    )
