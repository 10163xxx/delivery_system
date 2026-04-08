package app.delivery

import domain.admin.*
import domain.customer.*
import domain.merchant.*
import domain.rider.*
import domain.shared.*

private def seedMenuItem(
      id: String,
      name: String,
      description: String,
      priceCents: Int,
      imageUrl: String,
      remainingQuantity: Option[Int] = None,
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
      id: String,
      merchantName: String,
      name: String,
      category: String,
      businessHours: BusinessHours,
      avgPrepMinutes: Int,
      imageUrl: String,
      menu: List[MenuItem],
      revenueCents: Int = 0,
  ): Store =
    Store(
      id = id,
      merchantName = merchantName,
      name = name,
      category = category,
      cuisine = category,
      status = "Open",
      businessHours = businessHours,
      avgPrepMinutes = avgPrepMinutes,
      imageUrl = Some(imageUrl),
      menu = menu,
      averageRating = 0.0,
      ratingCount = 0,
      oneStarRatingCount = 0,
      revenueCents = revenueCents,
    )

private[delivery] def seedState(): DeliveryAppState =
    val customers = List(
      Customer(
        "cust-1",
        customerAlias("cust-1"),
        "13800000001",
        "浦东新区世纪大道 88 号",
        List(
          AddressEntry("家", "浦东新区世纪大道 88 号"),
          AddressEntry("公司", "浦东新区张杨路 188 号"),
        ),
        AccountStatus.Active,
        0,
        MembershipTier.Standard,
        0,
        10000,
        List.empty,
      ),
      Customer(
        "cust-2",
        customerAlias("cust-2"),
        "13800000002",
        "静安区南京西路 318 号",
        List(AddressEntry("家", "静安区南京西路 318 号")),
        AccountStatus.Active,
        0,
        MembershipTier.Standard,
        0,
        5000,
        List.empty,
      ),
    )
    val stores = List(
      seedStore(
        id = "store-c27f",
        merchantName = "王师傅",
        name = "深夜牛肉面",
        category = "面馆粉档",
        businessHours = BusinessHours("09:00", "18:00"),
        avgPrepMinutes = 18,
        imageUrl = "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
        menu = List(
          seedMenuItem(
            "dish-706b550d",
            "红油抄手",
            "现包抄手配川味红油，夜宵很合适。",
            1880,
            "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
          ),
          seedMenuItem(
            "dish-92581c7a",
            "招牌牛肉面",
            "大片牛腱配手擀面，汤底浓郁。",
            2690,
            "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80",
          ),
        ),
        revenueCents = 3760,
      ),
      seedStore(
        id = "store-1d06",
        merchantName = "王师傅",
        name = "测试店铺152209",
        category = "中式快餐",
        businessHours = BusinessHours.Default,
        avgPrepMinutes = 18,
        imageUrl = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
        menu = List(
          seedMenuItem(
            "dish-0636b442",
            "招牌鸡腿饭",
            "现炸鸡腿配时蔬和米饭",
            2890,
            "https://images.unsplash.com/photo-1512058564366-18510be2db19",
          ),
          seedMenuItem(
            "dish-a0c5c935",
            "番茄肥牛面",
            "酸甜番茄汤底配肥牛和劲道面条",
            2390,
            "https://images.unsplash.com/photo-1617093727343-374698b1b08d",
          ),
          seedMenuItem(
            "dish-829a722f",
            "冰柠檬茶",
            "现萃茶底加整颗鲜柠檬",
            890,
            "https://images.unsplash.com/photo-1499638673689-79a0b5115d87",
          ),
          seedMenuItem(
            "dish-d0f959a6",
            "联调测试鸡排饭",
            "现煎鸡排配椒麻酱和米饭，专门用于验证限量库存和下架功能。",
            1990,
            "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
          ),
        ),
        revenueCents = 5780,
      ),
      seedStore(
        id = "store-salad-01",
        merchantName = "苏宁",
        name = "轻盈能量碗",
        category = "轻食沙拉",
        businessHours = BusinessHours("10:00", "20:30"),
        avgPrepMinutes = 14,
        imageUrl = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
        menu = List(
          seedMenuItem(
            "dish-salad-01",
            "牛油果鸡胸能量碗",
            "鸡胸肉、牛油果、玉米和藜麦组合。",
            3290,
            "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
          ),
          seedMenuItem(
            "dish-salad-02",
            "低脂鲜虾沙拉",
            "鲜虾搭配罗马生菜和油醋汁。",
            3590,
            "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80",
          ),
          seedMenuItem(
            "dish-salad-03",
            "冷萃美式",
            "无糖冷萃，适合搭配轻食。",
            1280,
            "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
          ),
        ),
      ),
      seedStore(
        id = "store-dumpling-01",
        merchantName = "王师傅",
        name = "北巷饺子馆",
        category = "饺子馄饨",
        businessHours = BusinessHours("10:30", "22:00"),
        avgPrepMinutes = 20,
        imageUrl = "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80",
        menu = List(
          seedMenuItem(
            "dish-dumpling-01",
            "三鲜水饺",
            "虾仁、鸡蛋、韭菜三鲜馅。",
            2280,
            "https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&fit=crop&w=1200&q=80",
          ),
          seedMenuItem(
            "dish-dumpling-02",
            "鲜肉小馄饨",
            "汤头清爽，适合做午餐加餐。",
            1680,
            "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=1200&q=80",
          ),
          seedMenuItem(
            "dish-dumpling-03",
            "酸辣汤",
            "木耳豆腐配胡椒醋香。",
            980,
            "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80",
          ),
        ),
      ),
      seedStore(
        id = "store-tea-01",
        merchantName = "苏宁",
        name = "柠檬云朵茶铺",
        category = "奶茶果饮",
        businessHours = BusinessHours("11:00", "23:00"),
        avgPrepMinutes = 10,
        imageUrl = "https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=1200&q=80",
        menu = List(
          seedMenuItem(
            "dish-tea-01",
            "芝士葡萄冰",
            "现打葡萄果肉配轻芝士奶盖。",
            1980,
            "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=1200&q=80",
          ),
          seedMenuItem(
            "dish-tea-02",
            "茉莉轻乳茶",
            "茉莉茶底搭配低糖奶香。",
            1680,
            "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=80",
          ),
          seedMenuItem(
            "dish-tea-03",
            "手打柠檬绿茶",
            "清爽酸甜，适合解腻。",
            1480,
            "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=1200&q=80",
          ),
        ),
      ),
      seedStore(
        id = "store-dessert-01",
        merchantName = "苏宁",
        name = "暮色咖啡甜点",
        category = "咖啡甜点",
        businessHours = BusinessHours("08:30", "21:30"),
        avgPrepMinutes = 12,
        imageUrl = "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
        menu = List(
          seedMenuItem(
            "dish-dessert-01",
            "海盐拿铁",
            "浓缩咖啡配细腻海盐奶沫。",
            1880,
            "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
          ),
          seedMenuItem(
            "dish-dessert-02",
            "巴斯克芝士蛋糕",
            "入口绵密，带微焦香气。",
            2280,
            "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1200&q=80",
          ),
          seedMenuItem(
            "dish-dessert-03",
            "可可布朗尼",
            "巧克力风味浓郁，适合下午茶。",
            1580,
            "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80",
          ),
        ),
      ),
    )
    val riders = List(
      Rider("rider-1", "陈凯", "电动车", "浦东", "Available", 0.0, 0, 0, 0, None, 0, 0, List.empty),
      Rider("rider-2", "赵晨", "摩托车", "静安", "Available", 0.0, 0, 0, 0, None, 0, 0, List.empty),
    )
    val admins = List(AdminProfile("admin-1", "总控台管理员"))

    withDerivedData(
      DeliveryAppState(
        customers = customers,
        stores = stores,
        merchantProfiles = List(
          MerchantProfile(
            "merchant-1",
            "王师傅",
            "13800138000",
            Some(MerchantPayoutAccount(MerchantPayoutAccountType.Bank, Some("招商银行"), "6225888800004021", "王师傅")),
            0,
            0,
            0,
            List.empty,
          ),
          MerchantProfile(
            "merchant-2",
            "苏宁",
            "13800138001",
            Some(MerchantPayoutAccount(MerchantPayoutAccountType.Alipay, None, "su_store@demo", "苏宁")),
            0,
            0,
            0,
            List.empty,
          ),
        ),
        riders = riders,
        admins = admins,
        merchantApplications = List.empty,
        reviewAppeals = List.empty,
        eligibilityReviews = List.empty,
        orders = List.empty,
        tickets = List.empty,
        metrics = SystemMetrics(0, 0, 0, 0.0),
      )
    )
