package state

import cats.effect.IO
import objects.*

import java.nio.file.Paths
import java.time.{Duration, Instant, LocalTime, ZoneId}
import java.time.temporal.ChronoUnit
import java.util.UUID
import java.util.concurrent.atomic.AtomicReference

object DeliveryStateRepo:

  private val OneStarRevocationThreshold = 50
  private val CustomerBanThreshold = 5
  private val MemberMonthlySpendThresholdCents = 100000
  private val StandardAutoDispatchMinutes = 15L
  private val MemberAutoDispatchMinutes = 8L
  private val MonthlyWindowDays = 30L
  private val ReviewWindowDays = 10L
  private val MinimumScheduledLeadMinutes = 30L
  private val DeliveryFeeCents = 1000
  private val RiderEarningPerOrderCents = 500
  private val CouponSpendStepCents = 10000
  private val CouponValidityDays = 30L
  private val DeliveryScheduleZone = ZoneId.systemDefault()
  private val StoreCategories = List(
    "中式快餐",
    "盖饭简餐",
    "面馆粉档",
    "麻辣香锅",
    "饺子馄饨",
    "轻食沙拉",
    "咖啡甜点",
    "奶茶果饮",
    "夜宵小吃",
  )
  private val SpendRewardCouponTemplates = List(
    ("满30减3", 300, 3000, "累计消费奖励券，适合搭配早餐或饮品订单"),
    ("满50减6", 600, 5000, "累计消费奖励券，适合工作日午餐使用"),
    ("满70减8", 800, 7000, "累计消费奖励券，适合常规正餐订单"),
    ("满100减12", 1200, 10000, "累计消费奖励券，适合多人拼单或大额订单"),
    ("满120减15", 1500, 12000, "累计消费奖励券，单张优惠力度不超过 85 折"),
  )

  private val stateFile = Paths.get(sys.env.getOrElse("DELIVERY_STATE_FILE", "data/delivery-state.json"))
  private val writeLock = new AnyRef
  private val stateRef = new AtomicReference[DeliveryAppState](loadState())

  def getState: IO[DeliveryAppState] =
    IO.blocking {
      writeLock.synchronized {
        val refreshed = refreshState(stateRef.get(), now())
        saveState(refreshed)
        stateRef.set(refreshed)
        refreshed
      }
    }

  def registerUserProfile(role: UserRole, displayName: String): Either[String, Option[String]] =
    role match
      case UserRole.customer =>
        val customerId = nextId("cust")
        val registrationCoupons = initialRegistrationCoupons(customerId, now())
        updateState { current =>
          Right(
            withDerivedData(
              current.copy(
                customers =
                  Customer(
                    id = customerId,
                    name = customerAlias(customerId),
                    phone = s"139${customerId.filter(_.isDigit).padTo(8, '0').mkString.take(8)}",
                    defaultAddress = "请先完善默认地址",
                    addresses = List(AddressEntry("默认", "请先完善默认地址")),
                    accountStatus = AccountStatus.Active,
                    revokedReviewCount = 0,
                    membershipTier = MembershipTier.Standard,
                    monthlySpendCents = 0,
                    balanceCents = 0,
                    coupons = registrationCoupons,
                  ) :: current.customers,
              )
            )
          )
        }.map(_ => Some(customerId))
      case UserRole.rider =>
        val riderId = nextId("rider")
        updateState { current =>
          Right(
            withDerivedData(
              current.copy(
                riders =
                  Rider(
                    id = riderId,
                    name = displayName,
                    vehicle = "待完善",
                    zone = "待分区",
                    availability = "Available",
                    averageRating = 0.0,
                    ratingCount = 0,
                    oneStarRatingCount = 0,
                    earningsCents = 0,
                    payoutAccount = None,
                    withdrawnCents = 0,
                    availableToWithdrawCents = 0,
                    withdrawalHistory = List.empty,
                  ) :: current.riders,
              )
            )
          )
        }.map(_ => Some(riderId))
      case UserRole.merchant =>
        val merchantProfileId = nextId("merchant")
        updateState { current =>
          Right(
            withDerivedData(
              current.copy(
                merchantProfiles =
                  MerchantProfile(
                    id = merchantProfileId,
                    merchantName = displayName,
                    contactPhone = "",
                    payoutAccount = None,
                    settledIncomeCents = 0,
                    withdrawnCents = 0,
                    availableToWithdrawCents = 0,
                    withdrawalHistory = List.empty,
                  ) :: current.merchantProfiles.filterNot(_.merchantName == displayName),
              )
            )
          )
        }.map(_ => Some(merchantProfileId))
      case UserRole.admin =>
        Left("管理员账号不能自助注册")

  def customerAlias(customerId: String): String =
    val digits = customerId.filter(_.isDigit)
    val suffix =
      if digits.nonEmpty then digits.takeRight(5).reverse.padTo(5, '0').reverse.mkString
      else "00000"
    s"用户$suffix"

  def ownsCustomer(customerId: String, linkedProfileId: Option[String]): Boolean =
    linkedProfileId.contains(customerId)

  def ownsOrderAsCustomer(orderId: String, linkedProfileId: Option[String]): Boolean =
    stateRef.get().orders.exists(order => order.id == orderId && linkedProfileId.contains(order.customerId))

  def ownsStore(storeId: String, merchantName: String): Boolean =
    stateRef.get().stores.exists(store => store.id == storeId && store.merchantName == merchantName)

  def ownsOrderAsMerchant(orderId: String, merchantName: String): Boolean =
    val current = stateRef.get()
    current.orders.exists(order =>
      order.id == orderId && current.stores.exists(store => store.id == order.storeId && store.merchantName == merchantName)
    )

  def ownsMerchantApplication(applicationId: String, merchantName: String): Boolean =
    stateRef.get().merchantApplications.exists(application =>
      application.id == applicationId && application.merchantName == merchantName
    )

  def ownsMerchantProfile(merchantName: String, linkedProfileId: Option[String]): Boolean =
    val current = stateRef.get()
    linkedProfileId.exists(profileId =>
      current.merchantProfiles.exists(profile => profile.id == profileId && profile.merchantName == merchantName)
    ) || current.merchantProfiles.exists(_.merchantName == merchantName)

  def ownsRiderProfile(riderId: String, linkedProfileId: Option[String]): Boolean =
    linkedProfileId.contains(riderId)

  def ownsOrderAsRider(orderId: String, linkedProfileId: Option[String]): Boolean =
    stateRef.get().orders.exists(order => order.id == orderId && linkedProfileId.contains(order.riderId.getOrElse("")))

  def updateCustomerProfile(
      customerId: String,
      request: UpdateCustomerProfileRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          customer <- current.customers.find(_.id == customerId).toRight("顾客不存在")
          name <- sanitizeRequiredText(request.name, 30, "用户名不能为空")
        yield
          withDerivedData(
            current.copy(
              customers = current.customers.map(entry =>
                if entry.id == customer.id then entry.copy(name = name) else entry
              ),
            ),
            now(),
          )
      }
    }

  def addCustomerAddress(
      customerId: String,
      request: AddCustomerAddressRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          customer <- current.customers.find(_.id == customerId).toRight("顾客不存在")
          label <- sanitizeRequiredText(request.label, 20, "地址标签不能为空")
          address <- sanitizeRequiredText(request.address, 120, "地址不能为空")
        yield
          val addressEntry = AddressEntry(label, address)
          val nextAddresses = customer.addresses.filterNot(_.address == address) :+ addressEntry
          withDerivedData(
            current.copy(
              customers = current.customers.map(entry =>
                if entry.id == customer.id then
                  entry.copy(
                    addresses = nextAddresses,
                  )
                else entry
              ),
            ),
            now(),
          )
      }
    }

  def removeCustomerAddress(
      customerId: String,
      request: RemoveCustomerAddressRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          customer <- current.customers.find(_.id == customerId).toRight("顾客不存在")
          address <- sanitizeRequiredText(request.address, 120, "地址不能为空")
          _ <- Either.cond(customer.addresses.exists(_.address == address), (), "地址不存在")
          _ <- Either.cond(customer.addresses.length > 1, (), "至少需要保留一个地址")
          _ <- Either.cond(customer.defaultAddress != address, (), "请先将其他地址设为默认地址，再删除当前默认地址")
        yield
          val nextAddresses = customer.addresses.filterNot(_.address == address)
          withDerivedData(
            current.copy(
              customers = current.customers.map(entry =>
                if entry.id == customer.id then
                  entry.copy(
                    addresses = nextAddresses,
                  )
                else entry
              ),
            ),
            now(),
          )
      }
    }

  def setDefaultCustomerAddress(
      customerId: String,
      request: SetDefaultCustomerAddressRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          customer <- current.customers.find(_.id == customerId).toRight("顾客不存在")
          address <- sanitizeRequiredText(request.address, 120, "地址不能为空")
          _ <- Either.cond(customer.addresses.exists(_.address == address), (), "地址不存在")
        yield
          withDerivedData(
            current.copy(
              customers = current.customers.map(entry =>
                if entry.id == customer.id then entry.copy(defaultAddress = address) else entry
              ),
            ),
            now(),
          )
      }
    }

  def rechargeCustomerBalance(
      customerId: String,
      request: RechargeBalanceRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          customer <- current.customers.find(_.id == customerId).toRight("顾客不存在")
          _ <- Either.cond(customer.accountStatus == AccountStatus.Active, (), "顾客账号已被封禁")
          _ <- Either.cond(request.amountCents > 0 && request.amountCents <= 500000, (), "充值金额需在 0.01 到 5000 元之间")
        yield
          withDerivedData(
            current.copy(
              customers = current.customers.map(entry =>
                if entry.id == customer.id then entry.copy(balanceCents = entry.balanceCents + request.amountCents)
                else entry
              ),
            ),
            now(),
          )
      }
    }

  def updateMerchantProfile(
      merchantName: String,
      request: UpdateMerchantProfileRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          profile <- findOrCreateMerchantProfile(current, merchantName)
          contactPhone <- sanitizeContactPhone(request.contactPhone)
          payoutAccount <- sanitizeMerchantPayoutAccount(request.payoutAccount)
        yield
          withDerivedData(
            current.copy(
              merchantProfiles = replaceMerchantProfile(
                current.merchantProfiles,
                profile.copy(contactPhone = contactPhone, payoutAccount = Some(payoutAccount)),
              ),
            ),
            now(),
          )
      }
    }

  def withdrawMerchantIncome(
      merchantName: String,
      request: WithdrawMerchantIncomeRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          profile <- findOrCreateMerchantProfile(current, merchantName)
          amountCents <- Either.cond(
            request.amountCents > 0 && request.amountCents <= 5000000,
            request.amountCents,
            "提现金额需在 0.01 到 50000 元之间",
          )
          payoutAccount <- profile.payoutAccount.toRight("请先完善提现账户")
          _ <- Either.cond(profile.availableToWithdrawCents >= amountCents, (), "可提现余额不足")
        yield
          val timestamp = now()
          val withdrawal = MerchantWithdrawal(
            id = nextId("mwd"),
            amountCents = amountCents,
            accountLabel = payoutAccountLabel(payoutAccount),
            requestedAt = timestamp,
          )
          withDerivedData(
            current.copy(
              merchantProfiles = replaceMerchantProfile(
                current.merchantProfiles,
                profile.copy(
                  withdrawnCents = profile.withdrawnCents + amountCents,
                  withdrawalHistory = withdrawal :: profile.withdrawalHistory,
                ),
              ),
            ),
            timestamp,
          )
      }
    }

  def updateRiderProfile(
      riderId: String,
      request: UpdateRiderProfileRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          rider <- current.riders.find(_.id == riderId).toRight("骑手不存在")
          payoutAccount <- sanitizeMerchantPayoutAccount(request.payoutAccount)
        yield
          withDerivedData(
            current.copy(
              riders = current.riders.map(entry =>
                if entry.id == rider.id then entry.copy(payoutAccount = Some(payoutAccount))
                else entry
              ),
            ),
            now(),
          )
      }
    }

  def withdrawRiderIncome(
      riderId: String,
      request: WithdrawRiderIncomeRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          rider <- current.riders.find(_.id == riderId).toRight("骑手不存在")
          amountCents <- Either.cond(
            request.amountCents > 0 && request.amountCents <= 5000000,
            request.amountCents,
            "提现金额需在 0.01 到 50000 元之间",
          )
          payoutAccount <- rider.payoutAccount.toRight("请先完善提现账户")
          _ <- Either.cond(rider.availableToWithdrawCents >= amountCents, (), "可提现余额不足")
        yield
          val timestamp = now()
          val withdrawal = MerchantWithdrawal(
            id = nextId("rwd"),
            amountCents = amountCents,
            accountLabel = payoutAccountLabel(payoutAccount),
            requestedAt = timestamp,
          )
          withDerivedData(
            current.copy(
              riders = current.riders.map(entry =>
                if entry.id == rider.id then
                  entry.copy(
                    withdrawnCents = rider.withdrawnCents + amountCents,
                    withdrawalHistory = withdrawal :: rider.withdrawalHistory,
                  )
                else entry
              ),
            ),
            timestamp,
          )
      }
    }

  def submitMerchantApplication(
      request: MerchantRegistrationRequest
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        validateMerchantRegistration(request).map { sanitized =>
          val timestamp = now()
          val application = MerchantApplication(
            id = nextId("app"),
            merchantName = sanitized.merchantName,
            storeName = sanitized.storeName,
            category = sanitized.category,
            businessHours = sanitized.businessHours,
            avgPrepMinutes = sanitized.avgPrepMinutes,
            imageUrl = sanitized.imageUrl,
            note = sanitized.note,
            status = MerchantApplicationStatus.Pending,
            reviewNote = None,
            submittedAt = timestamp,
            reviewedAt = None,
          )
          withDerivedData(
            current.copy(merchantApplications = application :: current.merchantApplications)
          )
        }
      }
    }

  def approveMerchantApplication(
      applicationId: String,
      request: ReviewMerchantApplicationRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          application <- current.merchantApplications.find(_.id == applicationId).toRight("入驻申请不存在")
          _ <- Either.cond(application.status == MerchantApplicationStatus.Pending, (), "只有待审核申请可以通过")
          reviewNote <- sanitizeRequiredText(request.reviewNote, 120, "审核说明不能为空")
        yield
          val timestamp = now()
          val reviewedApplication = application.copy(
            status = MerchantApplicationStatus.Approved,
            reviewNote = Some(reviewNote),
            reviewedAt = Some(timestamp),
          )
          withDerivedData(
            current.copy(
              stores = createApprovedStore(application) :: current.stores,
              merchantApplications = replaceApplication(current.merchantApplications, reviewedApplication),
            )
          )
      }
    }

  def rejectMerchantApplication(
      applicationId: String,
      request: ReviewMerchantApplicationRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          application <- current.merchantApplications.find(_.id == applicationId).toRight("入驻申请不存在")
          _ <- Either.cond(application.status == MerchantApplicationStatus.Pending, (), "只有待审核申请可以驳回")
          reviewNote <- sanitizeRequiredText(request.reviewNote, 120, "审核说明不能为空")
        yield
          val timestamp = now()
          val reviewedApplication = application.copy(
            status = MerchantApplicationStatus.Rejected,
            reviewNote = Some(reviewNote),
            reviewedAt = Some(timestamp),
          )
          withDerivedData(
            current.copy(
              merchantApplications = replaceApplication(current.merchantApplications, reviewedApplication)
            )
          )
      }
    }

  def createOrder(request: CreateOrderRequest): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          customer <- current.customers.find(_.id == request.customerId).toRight("顾客不存在")
          _ <- Either.cond(customer.accountStatus == AccountStatus.Active, (), "顾客账号已被封禁")
          store <- current.stores.find(_.id == request.storeId).toRight("店铺不存在")
          _ <- Either.cond(store.status != "Revoked", (), "店铺已取消营业资格")
          timestamp = now()
          _ <- Either.cond(isStoreOpenAt(store, timestamp), (), s"当前店铺营业时间为 ${formatBusinessHours(store.businessHours)}，暂不可下单")
          items <- buildLineItems(store, request.items)
          deliveryAddress <- sanitizeRequiredText(request.deliveryAddress, 120, "配送地址不能为空")
          scheduledDeliveryAt <- validateScheduledDeliveryAt(request.scheduledDeliveryAt, timestamp)
          itemSubtotalCents = items.map(item => item.unitPriceCents * item.quantity).sum
          appliedCoupon <- validateOrderCoupon(customer, request.couponId, itemSubtotalCents)
          couponDiscountCents = calculateCouponDiscount(appliedCoupon, itemSubtotalCents, DeliveryFeeCents)
          totalPriceCents = Math.max(0, itemSubtotalCents + DeliveryFeeCents - couponDiscountCents)
          _ <- Either.cond(customer.balanceCents >= totalPriceCents, (), "账户余额不足，请先充值后再提交订单")
        yield
          val order = OrderSummary(
            id = nextId("ord"),
            customerId = customer.id,
            customerName = customer.name,
            storeId = store.id,
            storeName = store.name,
            riderId = None,
            riderName = None,
            status = OrderStatus.PendingMerchantAcceptance,
            deliveryAddress = deliveryAddress,
            scheduledDeliveryAt = scheduledDeliveryAt,
            remark = sanitizeOptionalText(request.remark, 120),
            items = items,
            itemSubtotalCents = itemSubtotalCents,
            deliveryFeeCents = DeliveryFeeCents,
            couponDiscountCents = couponDiscountCents,
            appliedCoupon = appliedCoupon,
            totalPriceCents = totalPriceCents,
            createdAt = timestamp,
            updatedAt = timestamp,
            storeRating = None,
            riderRating = None,
            reviewComment = None,
            reviewExtraNote = None,
            storeReviewComment = None,
            storeReviewExtraNote = None,
            riderReviewComment = None,
            riderReviewExtraNote = None,
            merchantRejectReason = None,
            reviewStatus = ReviewStatus.Active,
            reviewRevokedReason = None,
            reviewRevokedAt = None,
            timeline = List(
              OrderTimelineEntry(
                OrderStatus.PendingMerchantAcceptance,
                appliedCoupon match
                  case Some(coupon) =>
                    f"顾客已下单并完成余额支付，使用 ${coupon.title} 抵扣 ${couponDiscountCents / 100.0}%.2f 元，预约送达时间 ${scheduledDeliveryAt}"
                  case None =>
                    s"顾客已下单并完成余额支付，预约送达时间 ${scheduledDeliveryAt}",
                timestamp,
              )
            ),
            chatMessages = List.empty,
            partialRefundRequests = List.empty,
          )
          withDerivedData(
            current.copy(
              orders = order :: current.orders,
              stores = current.stores.map(entry =>
                if entry.id == store.id then
                  entry.copy(
                    menu = entry.menu.map { menuItem =>
                      items.find(_.menuItemId == menuItem.id) match
                        case Some(lineItem) =>
                          menuItem.copy(
                            remainingQuantity = menuItem.remainingQuantity.map(quantity =>
                              Math.max(0, quantity - lineItem.quantity)
                            )
                          )
                        case None => menuItem
                    }
                  )
                else entry
              ),
              customers = current.customers.map(entry =>
                if entry.id == customer.id then
                  entry.copy(
                    balanceCents = entry.balanceCents - totalPriceCents,
                    coupons = appliedCoupon match
                      case Some(coupon) => entry.coupons.filterNot(_.id == coupon.id)
                      case None => entry.coupons,
                  )
                else entry
              ),
            )
          )
      }
    }

  def addMenuItem(
      storeId: String,
      request: AddMenuItemRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          store <- current.stores.find(_.id == storeId).toRight("店铺不存在")
          _ <- Either.cond(store.status != "Revoked", (), "暂停营业的店铺不能新增菜品")
          sanitized <- validateMenuItemRequest(request)
          nextMenuItem = MenuItem(
            id = nextId("dish"),
            name = sanitized.name,
            description = sanitized.description,
            priceCents = sanitized.priceCents,
            imageUrl = sanitized.imageUrl,
            remainingQuantity = sanitized.remainingQuantity,
          )
        yield
          withDerivedData(
            current.copy(
              stores = current.stores.map(entry =>
                if entry.id == store.id then entry.copy(menu = entry.menu :+ nextMenuItem) else entry
              )
            )
          )
      }
    }

  def removeMenuItem(
      storeId: String,
      menuItemId: String,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          store <- current.stores.find(_.id == storeId).toRight("店铺不存在")
          _ <- store.menu.find(_.id == menuItemId).toRight("菜品不存在")
        yield
          withDerivedData(
            current.copy(
              stores = current.stores.map(entry =>
                if entry.id == store.id then entry.copy(menu = entry.menu.filterNot(_.id == menuItemId))
                else entry
              )
            )
          )
      }
    }

  def updateMenuItemStock(
      storeId: String,
      menuItemId: String,
      request: UpdateMenuItemStockRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          store <- current.stores.find(_.id == storeId).toRight("店铺不存在")
          _ <- store.menu.find(_.id == menuItemId).toRight("菜品不存在")
          sanitized <- validateMenuItemStockRequest(request)
        yield
          withDerivedData(
            current.copy(
              stores = current.stores.map(entry =>
                if entry.id == store.id then
                  entry.copy(
                    menu = entry.menu.map(menuItem =>
                      if menuItem.id == menuItemId then
                        menuItem.copy(remainingQuantity = sanitized.remainingQuantity)
                      else menuItem
                    )
                  )
                else entry
              )
            )
          )
      }
    }

  def updateStoreOperationalInfo(
      storeId: String,
      request: UpdateStoreOperationalRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          store <- current.stores.find(_.id == storeId).toRight("店铺不存在")
          businessHours <- validateBusinessHours(request.businessHours)
          _ <- Either.cond(request.avgPrepMinutes > 0 && request.avgPrepMinutes <= 120, (), "预计出餐时间需在 1 到 120 分钟之间")
        yield
          withDerivedData(
            current.copy(
              stores = current.stores.map(entry =>
                if entry.id == store.id then
                  entry.copy(
                    businessHours = businessHours,
                    avgPrepMinutes = request.avgPrepMinutes,
                  )
                else entry
              )
            )
          )
      }
    }

  def acceptOrder(orderId: String): IO[Either[String, DeliveryAppState]] =
    transitionOrder(orderId, OrderStatus.PendingMerchantAcceptance, OrderStatus.Preparing, "商家已接单，开始备餐")

  def rejectOrder(orderId: String, request: RejectOrderRequest): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- current.orders.find(_.id == orderId).toRight("订单不存在")
          _ <- Either.cond(order.status == OrderStatus.PendingMerchantAcceptance, (), "当前订单不能拒绝")
          reason <- sanitizeRequiredText(request.reason, 160, "拒单理由不能为空")
        yield
          val timestamp = now()
          val nextOrders = current.orders.map(entry =>
            if entry.id == orderId then
              entry.copy(
                status = OrderStatus.Cancelled,
                merchantRejectReason = Some(reason),
                updatedAt = timestamp,
                timeline = entry.timeline :+ OrderTimelineEntry(
                  OrderStatus.Cancelled,
                  s"商家已拒单，理由：$reason。订单金额已原路退回",
                  timestamp,
                ),
              )
            else entry
          )
          val nextCustomers = current.customers.map(customer =>
            if customer.id == order.customerId then
              customer.copy(balanceCents = customer.balanceCents + order.totalPriceCents)
            else customer
          )
          val nextStores = current.stores.map(store =>
            if store.id == order.storeId then
              store.copy(
                menu = store.menu.map(menuItem =>
                  order.items.find(_.menuItemId == menuItem.id) match
                    case Some(lineItem) =>
                      menuItem.copy(
                        remainingQuantity = menuItem.remainingQuantity.map(quantity => quantity + lineItem.quantity)
                      )
                    case None => menuItem
                )
              )
            else store
          )
          withDerivedData(current.copy(orders = nextOrders, customers = nextCustomers, stores = nextStores))
      }
    }

  def readyOrder(orderId: String): IO[Either[String, DeliveryAppState]] =
    transitionOrder(orderId, OrderStatus.Preparing, OrderStatus.ReadyForPickup, "商家已完成备餐，等待骑手取餐")

  def assignRider(orderId: String, request: AssignRiderRequest): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- current.orders.find(_.id == orderId).toRight("订单不存在")
          _ <- Either.cond(order.status == OrderStatus.ReadyForPickup, (), "当前订单不可分配骑手")
          _ <- Either.cond(order.riderId.isEmpty, (), "订单已经分配过骑手")
          rider <- current.riders.find(_.id == request.riderId).toRight("骑手不存在")
          _ <- Either.cond(rider.availability != "Suspended", (), "骑手已取消接单资格")
        yield
          val timestamp = now()
          val nextOrders = current.orders.map(entry =>
            if entry.id == orderId then
              entry.copy(
                riderId = Some(rider.id),
                riderName = Some(rider.name),
                updatedAt = timestamp,
                timeline = entry.timeline :+ OrderTimelineEntry(OrderStatus.ReadyForPickup, s"已指派骑手 ${rider.name}", timestamp),
              )
            else entry
          )
          val nextRiders = current.riders.map(entry =>
            if entry.id == rider.id then entry.copy(availability = "OnDelivery") else entry
          )
          withDerivedData(current.copy(orders = nextOrders, riders = nextRiders))
      }
    }

  def pickupOrder(orderId: String): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- current.orders.find(_.id == orderId).toRight("订单不存在")
          _ <- Either.cond(order.status == OrderStatus.ReadyForPickup, (), "当前订单不能取餐")
          _ <- Either.cond(order.riderId.nonEmpty, (), "请先分配骑手")
        yield
          val timestamp = now()
          val nextOrders = current.orders.map(entry =>
            if entry.id == orderId then
              entry.copy(
                status = OrderStatus.Delivering,
                updatedAt = timestamp,
                timeline = entry.timeline :+ OrderTimelineEntry(OrderStatus.Delivering, "骑手已取餐，订单配送中", timestamp),
              )
            else entry
          )
          withDerivedData(current.copy(orders = nextOrders))
      }
    }

  def deliverOrder(orderId: String): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- current.orders.find(_.id == orderId).toRight("订单不存在")
          _ <- Either.cond(order.status == OrderStatus.Delivering, (), "当前订单不能确认送达")
        yield
          val timestamp = now()
          val nextOrders = current.orders.map(entry =>
            if entry.id == orderId then
              entry.copy(
                status = OrderStatus.Completed,
                updatedAt = timestamp,
                timeline = entry.timeline :+ OrderTimelineEntry(OrderStatus.Completed, "骑手已确认送达", timestamp),
              )
            else entry
          )
          val nextRiders = current.riders.map(rider =>
            if Some(rider.id) == order.riderId then rider.copy(availability = "Available") else rider
          )
          withDerivedData(current.copy(orders = nextOrders, riders = nextRiders))
      }
    }

  def reviewOrder(orderId: String, request: ReviewOrderRequest): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- current.orders.find(_.id == orderId).toRight("订单不存在")
          customer <- current.customers.find(_.id == order.customerId).toRight("顾客不存在")
          _ <- Either.cond(customer.accountStatus == AccountStatus.Active, (), "顾客账号已被封禁")
          _ <- Either.cond(order.status == OrderStatus.Completed, (), "只有已完成订单可以评价")
          _ <- Either.cond(canReviewOrder(order, now()), (), s"只能评价最近${ReviewWindowDays}天内完成的订单")
          sanitized <- validateReviewRequest(request)
          _ <- Either.cond(sanitized.storeReview.isEmpty || order.storeRating.isEmpty, (), "商家评价已提交")
          _ <- Either.cond(sanitized.riderReview.isEmpty || (order.riderId.nonEmpty && order.riderRating.isEmpty), (), "骑手评价已提交")
          _ <- Either.cond(sanitized.riderReview.isEmpty || order.riderId.nonEmpty, (), "当前订单没有骑手可评价")
        yield
          val timestamp = now()
          val nextOrders = current.orders.map(entry =>
            if entry.id == orderId then
              applyReviewToOrder(entry, sanitized, timestamp)
            else entry
          )
          val nextTickets = reviewTicket(order, sanitized, timestamp).map(_ :: current.tickets).getOrElse(current.tickets)
          withDerivedData(current.copy(orders = nextOrders, tickets = nextTickets))
      }
    }

  def submitReviewAppeal(
      orderId: String,
      request: ReviewAppealRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- current.orders.find(_.id == orderId).toRight("订单不存在")
          _ <- Either.cond(order.reviewStatus == ReviewStatus.Active, (), "当前评价已撤销，不能申诉")
          _ <- validateAppealRole(order, request.appellantRole)
          _ <- Either.cond(
            !current.reviewAppeals.exists(appeal =>
              appeal.orderId == orderId &&
              appeal.appellantRole == request.appellantRole &&
              appeal.status == AppealStatus.Pending,
            ),
            (),
            "当前角色已有待处理申诉",
          )
          reason <- sanitizeRequiredText(request.reason, 160, "申诉理由不能为空")
        yield
          val timestamp = now()
          val appeal = ReviewAppeal(
            id = nextId("apl"),
            orderId = order.id,
            customerId = order.customerId,
            customerName = order.customerName,
            storeId = order.storeId,
            riderId = order.riderId,
            appellantRole = request.appellantRole,
            reason = reason,
            status = AppealStatus.Pending,
            resolutionNote = None,
            submittedAt = timestamp,
            reviewedAt = None,
          )
          withDerivedData(current.copy(reviewAppeals = appeal :: current.reviewAppeals))
      }
    }

  def resolveReviewAppeal(
      appealId: String,
      request: ResolveReviewAppealRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          appeal <- current.reviewAppeals.find(_.id == appealId).toRight("申诉不存在")
          _ <- Either.cond(appeal.status == AppealStatus.Pending, (), "当前申诉已处理")
          order <- current.orders.find(_.id == appeal.orderId).toRight("关联订单不存在")
          resolutionNote <- sanitizeRequiredText(request.resolutionNote, 160, "处理说明不能为空")
        yield
          val timestamp = now()
          val reviewedAppeal = appeal.copy(
            status = if request.approved then AppealStatus.Approved else AppealStatus.Rejected,
            resolutionNote = Some(resolutionNote),
            reviewedAt = Some(timestamp),
          )
          val nextOrders =
            if request.approved then
              current.orders.map(entry =>
                if entry.id == order.id then revokeReview(entry, resolutionNote, timestamp) else entry
              )
            else current.orders
          val nextTickets =
            if request.approved then
              closeTicketsForOrder(
                current.tickets,
                order.id,
                s"申诉成功，评价已撤销：$resolutionNote",
                timestamp,
              )
            else current.tickets
          withDerivedData(
            current.copy(
              orders = nextOrders,
              tickets = nextTickets,
              reviewAppeals = replaceAppeal(current.reviewAppeals, reviewedAppeal),
            )
          )
      }
    }

  def submitEligibilityReview(
      request: EligibilityReviewRequest
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          targetName <- findEligibilityTargetName(current, request)
          _ <- validateEligibilityTargetState(current, request)
          _ <- Either.cond(
            !current.eligibilityReviews.exists(review =>
              review.target == request.target &&
              review.targetId == request.targetId &&
              review.status == AppealStatus.Pending,
            ),
            (),
            "当前对象已有待处理复核申请",
          )
          reason <- sanitizeRequiredText(request.reason, 160, "复核理由不能为空")
        yield
          val timestamp = now()
          val review = EligibilityReview(
            id = nextId("eqr"),
            target = request.target,
            targetId = request.targetId,
            targetName = targetName,
            reason = reason,
            status = AppealStatus.Pending,
            resolutionNote = None,
            submittedAt = timestamp,
            reviewedAt = None,
          )
          withDerivedData(current.copy(eligibilityReviews = review :: current.eligibilityReviews))
      }
    }

  def resolveEligibilityReview(
      reviewId: String,
      request: ResolveEligibilityReviewRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          review <- current.eligibilityReviews.find(_.id == reviewId).toRight("复核申请不存在")
          _ <- Either.cond(review.status == AppealStatus.Pending, (), "当前复核申请已处理")
          resolutionNote <- sanitizeRequiredText(request.resolutionNote, 160, "复核结论不能为空")
        yield
          val timestamp = now()
          val reviewed = review.copy(
            status = if request.approved then AppealStatus.Approved else AppealStatus.Rejected,
            resolutionNote = Some(resolutionNote),
            reviewedAt = Some(timestamp),
          )
          withDerivedData(
            current.copy(eligibilityReviews = replaceEligibilityReview(current.eligibilityReviews, reviewed))
          )
      }
    }

  def resolveTicket(orderId: String, request: ResolveTicketRequest): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        current.tickets
          .find(ticket => ticket.orderId == orderId && ticket.status == TicketStatus.Open)
          .toRight("没有待处理工单")
          .flatMap { _ =>
            for
              resolution <- sanitizeRequiredText(request.resolution, 60, "处理结果不能为空")
              note <- sanitizeRequiredText(request.note, 160, "处理说明不能为空")
            yield
              val timestamp = now()
              val nextTickets = current.tickets.map(ticket =>
                if ticket.orderId == orderId && ticket.status == TicketStatus.Open then
                  ticket.copy(
                    status = TicketStatus.Resolved,
                    resolutionNote = Some(s"$resolution；$note"),
                    updatedAt = timestamp,
                  )
                else ticket
              )
              withDerivedData(current.copy(tickets = nextTickets))
          }
      }
    }

  def submitAfterSalesRequest(
      orderId: String,
      request: SubmitAfterSalesRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- current.orders.find(_.id == orderId).toRight("订单不存在")
          _ <- Either.cond(
            !current.tickets.exists(ticket =>
              ticket.orderId == orderId &&
              ticket.kind == TicketKind.DeliveryIssue &&
              ticket.status == TicketStatus.Open,
            ),
            (),
            "当前订单已有待处理售后申请",
          )
          reason <- sanitizeRequiredText(request.reason, 160, "售后原因不能为空")
          expectedCompensationCents <-
            request.expectedCompensationCents match
              case Some(value) =>
                Either.cond(value > 0, Some(value), "赔偿金额必须大于 0")
              case None =>
                Either.cond(
                  request.requestType != AfterSalesRequestType.CompensationRequest,
                  None,
                  "赔偿申请必须填写期望赔偿金额",
                )
        yield
          val timestamp = now()
          val summary = request.requestType match
            case AfterSalesRequestType.ReturnRequest =>
              s"顾客申请退货售后：$reason"
            case AfterSalesRequestType.CompensationRequest =>
              val amountText = expectedCompensationCents.map(cents => f"${cents / 100.0}%.2f 元").getOrElse("未填写金额")
              s"顾客申请赔偿售后（期望 $amountText）：$reason"
          val ticket = AdminTicket(
            id = nextId("ticket"),
            orderId = order.id,
            kind = TicketKind.DeliveryIssue,
            status = TicketStatus.Open,
            summary = summary,
            resolutionNote = None,
            updatedAt = timestamp,
          )
          withDerivedData(current.copy(tickets = ticket :: current.tickets))
      }
    }

  def addOrderChatMessage(
      orderId: String,
      senderRole: UserRole,
      senderName: String,
      request: SendOrderChatMessageRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          _ <- current.orders.find(_.id == orderId).toRight("订单不存在")
          body <- sanitizeRequiredText(request.body, 240, "消息内容不能为空")
        yield
          val timestamp = now()
          val message = OrderChatMessage(
            id = nextId("chat"),
            senderRole = senderRole,
            senderName = senderName,
            body = body,
            sentAt = timestamp,
          )
          val nextOrders = current.orders.map(entry =>
            if entry.id == orderId then
              entry.copy(
                updatedAt = timestamp,
                chatMessages = entry.chatMessages :+ message,
              )
            else entry
          )
          withDerivedData(current.copy(orders = nextOrders))
      }
    }

  def ownsPartialRefundRequestAsMerchant(refundId: String, merchantName: String): Boolean =
    val current = stateRef.get()
    current.orders.exists(order =>
      order.partialRefundRequests.exists(_.id == refundId) &&
        current.stores.exists(store => store.id == order.storeId && store.merchantName == merchantName)
    )

  def submitPartialRefundRequest(
      orderId: String,
      request: SubmitPartialRefundRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- current.orders.find(_.id == orderId).toRight("订单不存在")
          _ <- Either.cond(
            order.status == OrderStatus.PendingMerchantAcceptance || order.status == OrderStatus.Preparing,
            (),
            "只有待接单或备餐中的订单可以申请缺货退款",
          )
          item <- order.items.find(_.menuItemId == request.menuItemId).toRight("订单中没有该菜品")
          _ <- Either.cond(request.quantity > 0, (), "退款数量必须大于 0")
          remainingRefundable = item.quantity - item.refundedQuantity - pendingRefundQuantity(order, item.menuItemId)
          _ <- Either.cond(remainingRefundable > 0, (), "该菜品当前没有可申请退款的数量")
          _ <- Either.cond(request.quantity <= remainingRefundable, (), s"该菜品最多还能申请退款 $remainingRefundable 份")
          reason <- sanitizeRequiredText(request.reason, 160, "退款原因不能为空")
        yield
          val timestamp = now()
          val partialRefund = OrderPartialRefundRequest(
            id = nextId("prf"),
            orderId = order.id,
            menuItemId = item.menuItemId,
            itemName = item.name,
            quantity = request.quantity,
            reason = reason,
            status = PartialRefundStatus.Pending,
            resolutionNote = None,
            submittedAt = timestamp,
            reviewedAt = None,
          )
          val nextOrders = current.orders.map(entry =>
            if entry.id == order.id then
              entry.copy(
                updatedAt = timestamp,
                partialRefundRequests = entry.partialRefundRequests :+ partialRefund,
                timeline = entry.timeline :+ OrderTimelineEntry(
                  entry.status,
                  s"顾客申请退掉 ${item.name} x ${request.quantity}，原因：$reason",
                  timestamp,
                ),
              )
            else entry
          )
          withDerivedData(current.copy(orders = nextOrders))
      }
    }

  def resolvePartialRefundRequest(
      refundId: String,
      request: ResolvePartialRefundRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- current.orders.find(_.partialRefundRequests.exists(_.id == refundId)).toRight("退款申请不存在")
          partialRefund <- order.partialRefundRequests.find(_.id == refundId).toRight("退款申请不存在")
          _ <- Either.cond(partialRefund.status == PartialRefundStatus.Pending, (), "当前退款申请已处理")
          _ <- Either.cond(
            order.status == OrderStatus.PendingMerchantAcceptance || order.status == OrderStatus.Preparing,
            (),
            "当前订单阶段不能处理缺货退款",
          )
          item <- order.items.find(_.menuItemId == partialRefund.menuItemId).toRight("订单中没有该菜品")
          resolutionNote <- sanitizeRequiredText(request.resolutionNote, 160, "处理说明不能为空")
          remainingQuantityAfterApproval =
            order.items.map(entry => entry.quantity - entry.refundedQuantity).sum -
              (if request.approved then partialRefund.quantity else 0)
          _ <- Either.cond(!request.approved || remainingQuantityAfterApproval > 0, (), "当前流程只支持退掉部分商品，不能把整单全部退空")
          _ <- Either.cond(
            !request.approved || item.refundedQuantity + partialRefund.quantity <= item.quantity,
            (),
            "退款数量超过了该菜品可退款范围",
          )
        yield
          val timestamp = now()
          val reviewedRefund = partialRefund.copy(
            status = if request.approved then PartialRefundStatus.Approved else PartialRefundStatus.Rejected,
            resolutionNote = Some(resolutionNote),
            reviewedAt = Some(timestamp),
          )
          val refundAmountCents = partialRefund.quantity * item.unitPriceCents
          val nextOrders = current.orders.map(entry =>
            if entry.id == order.id then
              val nextItems =
                if request.approved then
                  entry.items.map(lineItem =>
                    if lineItem.menuItemId == partialRefund.menuItemId then
                      lineItem.copy(refundedQuantity = lineItem.refundedQuantity + partialRefund.quantity)
                    else lineItem
                  )
                else entry.items
              val nextItemSubtotal =
                if request.approved then entry.itemSubtotalCents - refundAmountCents else entry.itemSubtotalCents
              val nextTotalPrice =
                if request.approved then
                  Math.max(
                    0,
                    nextItemSubtotal + entry.deliveryFeeCents - calculateCouponDiscount(entry.appliedCoupon, nextItemSubtotal, entry.deliveryFeeCents),
                  )
                else entry.totalPriceCents
              val nextCouponDiscountCents =
                if request.approved then calculateCouponDiscount(entry.appliedCoupon, nextItemSubtotal, entry.deliveryFeeCents)
                else entry.couponDiscountCents
              entry.copy(
                items = nextItems,
                itemSubtotalCents = nextItemSubtotal,
                couponDiscountCents = nextCouponDiscountCents,
                totalPriceCents = nextTotalPrice,
                updatedAt = timestamp,
                partialRefundRequests = entry.partialRefundRequests.map(existing =>
                  if existing.id == reviewedRefund.id then reviewedRefund else existing
                ),
                timeline = entry.timeline :+ OrderTimelineEntry(
                  entry.status,
                  if request.approved then
                    f"商家同意退掉 ${partialRefund.itemName} x ${partialRefund.quantity}，已退款 ${refundAmountCents / 100.0}%.2f 元：$resolutionNote"
                  else
                    s"商家拒绝退掉 ${partialRefund.itemName} x ${partialRefund.quantity}：$resolutionNote",
                  timestamp,
                ),
              )
            else entry
          )
          val nextCustomers =
            if request.approved then
              current.customers.map(customer =>
                if customer.id == order.customerId then
                  customer.copy(balanceCents = customer.balanceCents + refundAmountCents)
                else customer
              )
            else current.customers
          withDerivedData(current.copy(orders = nextOrders, customers = nextCustomers))
      }
    }

  private def transitionOrder(
      orderId: String,
      expected: OrderStatus,
      next: OrderStatus,
      note: String,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- current.orders.find(_.id == orderId).toRight("订单不存在")
          _ <- Either.cond(order.status == expected, (), s"订单当前状态不是 $expected")
        yield
          val timestamp = now()
          val nextOrders = current.orders.map(entry =>
            if entry.id == orderId then
              entry.copy(
                status = next,
                updatedAt = timestamp,
                timeline = entry.timeline :+ OrderTimelineEntry(next, note, timestamp),
              )
            else entry
          )
          withDerivedData(current.copy(orders = nextOrders))
      }
    }

  private def updateState(
      mutate: DeliveryAppState => Either[String, DeliveryAppState]
  ): Either[String, DeliveryAppState] =
    writeLock.synchronized {
      val current = refreshState(stateRef.get(), now())
      mutate(current).map(next =>
        val refreshed = refreshState(next, now())
        saveState(refreshed)
        stateRef.set(refreshed)
        refreshed
      )
    }

  private def loadState(): DeliveryAppState =
    JsonFileStore.loadOrCreate(stateFile, seedState())

  private def saveState(state: DeliveryAppState): Unit =
    JsonFileStore.write(stateFile, state)

  private def validateMerchantRegistration(
      request: MerchantRegistrationRequest
  ): Either[String, MerchantRegistrationRequest] =
    for
      merchantName <- sanitizeRequiredText(request.merchantName, 40, "商家姓名不能为空")
      storeName <- sanitizeRequiredText(request.storeName, 40, "店铺名称不能为空")
      category <- sanitizeRequiredText(request.category, 20, "店铺大类不能为空")
      _ <- Either.cond(StoreCategories.contains(category), (), "店铺大类不合法")
      businessHours <- validateBusinessHours(request.businessHours)
      _ <- Either.cond(request.avgPrepMinutes > 0 && request.avgPrepMinutes <= 120, (), "预计出餐时间需在 1 到 120 分钟之间")
    yield MerchantRegistrationRequest(
      merchantName = merchantName,
      storeName = storeName,
      category = category,
      businessHours = businessHours,
      avgPrepMinutes = request.avgPrepMinutes,
      imageUrl = sanitizeOptionalText(request.imageUrl, 500),
      note = sanitizeOptionalText(request.note, 160),
    )

  private def validateMenuItemRequest(
      request: AddMenuItemRequest
  ): Either[String, AddMenuItemRequest] =
    for
      name <- sanitizeRequiredText(request.name, 40, "菜品名称不能为空")
      description <- sanitizeRequiredText(request.description, 160, "菜品说明不能为空")
      _ <- Either.cond(request.priceCents > 0 && request.priceCents <= 999999, (), "菜品价格需在 0.01 到 9999.99 元之间")
      _ <- Either.cond(
        request.remainingQuantity.forall(quantity => quantity >= 1 && quantity <= 10),
        (),
        "限量库存需在 1 到 10 之间",
      )
      imageUrl <- sanitizeOptionalText(request.imageUrl, 500).toRight("请上传菜品图片或填写可访问的图片 URL")
    yield AddMenuItemRequest(
      name = name,
      description = description,
      priceCents = request.priceCents,
      imageUrl = Some(imageUrl),
      remainingQuantity = request.remainingQuantity,
    )

  private def validateMenuItemStockRequest(
      request: UpdateMenuItemStockRequest
  ): Either[String, UpdateMenuItemStockRequest] =
    Either.cond(
      request.remainingQuantity.forall(quantity => quantity >= 0 && quantity <= 10),
      request,
      "剩余份数需在 0 到 10 之间，留空表示不限量",
    )

  private def validateReviewRequest(
      request: ReviewOrderRequest
  ): Either[String, ReviewOrderRequest] =
    for
      _ <- Either.cond(request.storeReview.nonEmpty || request.riderReview.nonEmpty, (), "请至少提交一项评价")
      storeReview <- validateReviewSubmission(request.storeReview, "商家")
      riderReview <- validateReviewSubmission(request.riderReview, "骑手")
    yield ReviewOrderRequest(
      storeReview = storeReview,
      riderReview = riderReview,
    )

  private def validateReviewSubmission(
      review: Option[ReviewSubmission],
      label: String,
  ): Either[String, Option[ReviewSubmission]] =
    review match
      case None => Right(None)
      case Some(value) =>
        for
          _ <- Either.cond(value.rating >= 1 && value.rating <= 5, (), s"${label}评分必须在 1 到 5 之间")
          comment = sanitizeOptionalText(value.comment, 160)
          _ <- Either.cond(value.rating == 5 || comment.nonEmpty, (), s"${label}非 5 星评价必须填写理由")
        yield Some(
          ReviewSubmission(
            rating = value.rating,
            comment = comment,
            extraNote = sanitizeOptionalText(value.extraNote, 240),
          )
        )

  private def validateAppealRole(
      order: OrderSummary,
      appellantRole: AppealRole,
  ): Either[String, Unit] =
    appellantRole match
      case AppealRole.Merchant => Either.cond(order.storeRating.nonEmpty, (), "当前订单没有可申诉的商家评价")
      case AppealRole.Rider => Either.cond(order.riderId.nonEmpty && order.riderRating.nonEmpty, (), "当前订单没有可申诉的骑手评价")

  private def validateEligibilityTargetState(
      state: DeliveryAppState,
      request: EligibilityReviewRequest,
  ): Either[String, Unit] =
    request.target match
      case EligibilityReviewTarget.Store =>
        state.stores.find(_.id == request.targetId).toRight("店铺不存在").flatMap(store =>
          Either.cond(store.status == "Revoked", (), "当前店铺无需复核")
        )
      case EligibilityReviewTarget.Rider =>
        state.riders.find(_.id == request.targetId).toRight("骑手不存在").flatMap(rider =>
          Either.cond(rider.availability == "Suspended", (), "当前骑手无需复核")
        )

  private def findEligibilityTargetName(
      state: DeliveryAppState,
      request: EligibilityReviewRequest,
  ): Either[String, String] =
    request.target match
      case EligibilityReviewTarget.Store =>
        state.stores.find(_.id == request.targetId).map(_.name).toRight("店铺不存在")
      case EligibilityReviewTarget.Rider =>
        state.riders.find(_.id == request.targetId).map(_.name).toRight("骑手不存在")

  private def sanitizeRequiredText(
      value: String,
      maxLength: Int,
      errorMessage: String,
  ): Either[String, String] =
    val sanitized = sanitizeText(value, maxLength)
    Either.cond(sanitized.nonEmpty, sanitized, errorMessage)

  private def sanitizeOptionalText(value: Option[String], maxLength: Int): Option[String] =
    value.flatMap(text =>
      sanitizeText(text, maxLength) match
        case "" => None
        case sanitized => Some(sanitized)
    )

  private def sanitizeText(value: String, maxLength: Int): String =
    value
      .trim
      .filter(character => !Character.isISOControl(character) || character == '\n' || character == '\t')
      .replace('\n', ' ')
      .replace('\t', ' ')
      .split(' ')
      .filter(_.nonEmpty)
      .mkString(" ")
      .take(maxLength)

  private def buildLineItems(
      store: Store,
      items: List[OrderItemInput],
  ): Either[String, List[OrderLineItem]] =
    val selected = items.filter(_.quantity > 0)
    Either.cond(selected.nonEmpty, (), "订单至少需要一个商品").flatMap { _ =>
      selected.foldLeft[Either[String, List[OrderLineItem]]](Right(List.empty)) { (acc, item) =>
        for
          lineItems <- acc
          menuItem <- store.menu.find(_.id == item.menuItemId).toRight(s"菜品不存在: ${item.menuItemId}")
          _ <- Either.cond(
            menuItem.remainingQuantity.forall(_ >= item.quantity),
            (),
            menuItem.remainingQuantity match
              case Some(0) => s"${menuItem.name} 已售罄"
              case Some(remaining) => s"${menuItem.name} 当前仅剩 ${remaining} 份"
              case None => s"${menuItem.name} 库存不足",
          )
        yield lineItems :+ OrderLineItem(menuItem.id, menuItem.name, item.quantity, menuItem.priceCents, 0)
      }
    }

  private def pendingRefundQuantity(order: OrderSummary, menuItemId: String): Int =
    order.partialRefundRequests
      .filter(refund => refund.menuItemId == menuItemId && refund.status == PartialRefundStatus.Pending)
      .map(_.quantity)
      .sum

  private def reviewTicket(
      order: OrderSummary,
      request: ReviewOrderRequest,
      timestamp: String,
  ): Option[AdminTicket] =
    val ratings = List(request.storeReview.map(_.rating), request.riderReview.map(_.rating)).flatten
    if ratings.isEmpty then None
    else
      val lowestRating = ratings.min
      val highestRating = ratings.max
      val ticketKind =
        if lowestRating <= 2 then Some(TicketKind.NegativeReview)
        else if highestRating >= 5 then Some(TicketKind.PositiveReview)
        else None

      ticketKind.map(kind =>
        AdminTicket(
          id = nextId("tkt"),
          orderId = order.id,
          kind = kind,
          status = TicketStatus.Open,
          summary = buildTicketSummary(order, request, kind),
          resolutionNote = None,
          updatedAt = timestamp,
        )
      )

  private def buildTicketSummary(
      order: OrderSummary,
      request: ReviewOrderRequest,
      kind: TicketKind,
  ): String =
    val detail = List(
      request.storeReview.map(review =>
        s"商家 ${review.rating} 星${review.comment.map(comment => s"，理由：$comment").getOrElse("")}${review.extraNote.map(note => s"，补充：$note").getOrElse("")}"
      ),
      request.riderReview.map(review =>
        s"骑手 ${review.rating} 星${review.comment.map(comment => s"，理由：$comment").getOrElse("")}${review.extraNote.map(note => s"，补充：$note").getOrElse("")}"
      ),
    ).flatten.mkString("；")
    kind match
      case TicketKind.PositiveReview =>
        s"${order.customerName} 对 ${order.storeName} 给出好评。$detail".trim
      case TicketKind.NegativeReview =>
        s"${order.customerName} 提交了差评。$detail".trim
      case TicketKind.DeliveryIssue =>
        s"${order.customerName} 反馈配送异常。$detail".trim

  private def applyReviewToOrder(
      order: OrderSummary,
      request: ReviewOrderRequest,
      timestamp: String,
  ): OrderSummary =
    val noteSegments = List(
      request.storeReview.map(review => s"商家 ${review.rating} 星"),
      request.riderReview.map(review => s"骑手 ${review.rating} 星"),
    ).flatten
    order.copy(
      storeRating = request.storeReview.map(_.rating).orElse(order.storeRating),
      riderRating = request.riderReview.map(_.rating).orElse(order.riderRating),
      reviewComment = request.storeReview.flatMap(_.comment).orElse(request.riderReview.flatMap(_.comment)).orElse(order.reviewComment),
      reviewExtraNote = request.storeReview.flatMap(_.extraNote).orElse(request.riderReview.flatMap(_.extraNote)).orElse(order.reviewExtraNote),
      storeReviewComment = request.storeReview.flatMap(_.comment).orElse(order.storeReviewComment),
      storeReviewExtraNote = request.storeReview.flatMap(_.extraNote).orElse(order.storeReviewExtraNote),
      riderReviewComment = request.riderReview.flatMap(_.comment).orElse(order.riderReviewComment),
      riderReviewExtraNote = request.riderReview.flatMap(_.extraNote).orElse(order.riderReviewExtraNote),
      merchantRejectReason = order.merchantRejectReason,
      reviewStatus = ReviewStatus.Active,
      updatedAt = timestamp,
      timeline = order.timeline :+ OrderTimelineEntry(
        OrderStatus.Completed,
        s"顾客已提交${noteSegments.mkString("、")}评价",
        timestamp,
      ),
    )

  private def revokeReview(
      order: OrderSummary,
      reason: String,
      timestamp: String,
  ): OrderSummary =
    order.copy(
      reviewStatus = ReviewStatus.Revoked,
      reviewRevokedReason = Some(reason),
      reviewRevokedAt = Some(timestamp),
      updatedAt = timestamp,
      timeline = order.timeline :+ OrderTimelineEntry(
        OrderStatus.Completed,
        s"评价因申诉成功被撤销：$reason",
        timestamp,
      ),
    )

  private def closeTicketsForOrder(
      tickets: List[AdminTicket],
      orderId: String,
      resolutionNote: String,
      timestamp: String,
  ): List[AdminTicket] =
    tickets.map(ticket =>
      if ticket.orderId == orderId && ticket.status == TicketStatus.Open then
        ticket.copy(
          status = TicketStatus.Resolved,
          resolutionNote = Some(resolutionNote),
          updatedAt = timestamp,
        )
      else ticket
    )

  private def refreshState(state: DeliveryAppState, currentTime: String): DeliveryAppState =
    withDerivedData(applyAutomaticDispatch(state, currentTime), currentTime)

  private def withDerivedData(state: DeliveryAppState): DeliveryAppState =
    withDerivedData(state, now())

  private def withDerivedData(state: DeliveryAppState, currentTime: String): DeliveryAppState =
    val activeReviewedOrders = state.orders.filter(order =>
      order.reviewStatus == ReviewStatus.Active &&
      order.storeRating.nonEmpty &&
      order.riderRating.nonEmpty,
    )
    val revokedReviewedOrders = state.orders.filter(order =>
      order.reviewStatus == ReviewStatus.Revoked &&
      (order.storeRating.nonEmpty || order.riderRating.nonEmpty),
    )
    val storeRatings = activeReviewedOrders.flatMap(order =>
      order.storeRating.map(rating => order.storeId -> rating)
    )
    val riderRatings = activeReviewedOrders.flatMap(order =>
      for
        riderId <- order.riderId
        rating <- order.riderRating
      yield riderId -> rating
    )
    val latestStoreReviewReset = latestApprovedEligibilityReviewTimes(
      state.eligibilityReviews,
      EligibilityReviewTarget.Store,
    )
    val latestRiderReviewReset = latestApprovedEligibilityReviewTimes(
      state.eligibilityReviews,
      EligibilityReviewTarget.Rider,
    )
    val storeOneStars = activeReviewedOrders.collect {
      case order
          if order.storeRating.contains(1) &&
            isAfterReviewReset(order.updatedAt, latestStoreReviewReset.get(order.storeId)) =>
        order.storeId
    }
    val riderOneStars = activeReviewedOrders.collect {
      case order
          if order.riderRating.contains(1) &&
            order.riderId.nonEmpty &&
            isAfterReviewReset(order.updatedAt, order.riderId.flatMap(latestRiderReviewReset.get)) =>
        order.riderId.get
    }
    val revenueByStore = state.orders
      .filter(_.status == OrderStatus.Completed)
      .groupBy(_.storeId)
      .view
      .mapValues(orders => orders.map(_.itemSubtotalCents).sum)
      .toMap
    val completedOrdersByCustomer = state.orders
      .filter(_.status == OrderStatus.Completed)
      .groupBy(_.customerId)
      .view
      .mapValues(_.sortBy(order => reviewEligibilityTimestamp(order)))
      .toMap
    val monthlySpendByCustomer = state.orders
      .filter(order =>
        order.status == OrderStatus.Completed &&
          isWithinRecentWindow(order.updatedAt, currentTime, MonthlyWindowDays),
      )
      .groupBy(_.customerId)
      .view
      .mapValues(orders => orders.map(_.totalPriceCents).sum)
      .toMap
    val revokedCountsByCustomer = revokedReviewedOrders.groupBy(_.customerId).view.mapValues(_.size).toMap
    val nextCustomers = state.customers.map(customer =>
      val alias = customerAlias(customer.id)
      val monthlySpendCents = monthlySpendByCustomer.getOrElse(customer.id, 0)
      val membershipTier =
        if monthlySpendCents > MemberMonthlySpendThresholdCents then MembershipTier.Member
        else MembershipTier.Standard
      customer.copy(
        name = alias,
        revokedReviewCount = revokedCountsByCustomer.getOrElse(customer.id, 0),
        accountStatus =
          if revokedCountsByCustomer.getOrElse(customer.id, 0) > CustomerBanThreshold then AccountStatus.Suspended
          else AccountStatus.Active,
        membershipTier = membershipTier,
        monthlySpendCents = monthlySpendCents,
        coupons = couponsForCustomer(
          customer.id,
          membershipTier,
          customer.coupons,
          completedOrdersByCustomer.getOrElse(customer.id, List.empty),
          currentTime,
        ),
      )
    )
    val nextOrders = state.orders.map(order =>
      order.copy(
        customerName = customerAlias(order.customerId),
        chatMessages = order.chatMessages.map(message =>
          if message.senderRole == UserRole.customer then
            message.copy(senderName = customerAlias(order.customerId))
          else message
        ),
      )
    )
    val nextAppeals = state.reviewAppeals.map(appeal =>
      appeal.copy(customerName = customerAlias(appeal.customerId))
    )
    val nextStores = state.stores.map(store =>
      applyRatingToStore(
        store,
        ratingsForId(storeRatings, store.id),
        countById(storeOneStars, store.id),
        revenueByStore.getOrElse(store.id, 0),
      )
    )
    val settledIncomeByMerchant = nextStores
      .groupBy(_.merchantName)
      .view
      .mapValues(stores => stores.map(_.revenueCents).sum)
      .toMap
    val nextRiders = state.riders.map(rider =>
      applyRatingToRider(
        rider,
        ratingsForId(riderRatings, rider.id),
        countById(riderOneStars, rider.id),
        state.orders.count(_.riderId.contains(rider.id)) * RiderEarningPerOrderCents,
      )
    )
    val nextMerchantProfiles = mergeMerchantProfiles(state, settledIncomeByMerchant)
    val activeOrders = state.orders.count(order =>
      order.status == OrderStatus.PendingMerchantAcceptance ||
        order.status == OrderStatus.Preparing ||
        order.status == OrderStatus.ReadyForPickup ||
        order.status == OrderStatus.Delivering
    )

    state.copy(
      customers = nextCustomers,
      orders = nextOrders,
      reviewAppeals = nextAppeals,
      stores = nextStores,
      merchantProfiles = nextMerchantProfiles,
      riders = nextRiders,
      metrics = SystemMetrics(
        totalOrders = state.orders.size,
        activeOrders = activeOrders,
        resolvedTickets = state.tickets.count(_.status == TicketStatus.Resolved),
        averageRating = roundAverage(activeReviewedOrders.flatMap(order => List(order.storeRating, order.riderRating).flatten)),
      ),
    )

  private def ratingsForId(entries: List[(String, Int)], id: String): List[Int] =
    entries.collect { case (`id`, rating) => rating }

  private def countById(entries: List[String], id: String): Int =
    entries.count(_ == id)

  private def applyAutomaticDispatch(
      state: DeliveryAppState,
      currentTime: String,
  ): DeliveryAppState =
    val membershipByCustomer = state.orders
      .filter(order =>
        order.status == OrderStatus.Completed &&
          isWithinRecentWindow(order.updatedAt, currentTime, MonthlyWindowDays),
      )
      .groupBy(_.customerId)
      .view
      .mapValues(orders => orders.map(_.totalPriceCents).sum)
      .toMap
    val candidateOrders = state.orders
      .filter(order =>
        order.status == OrderStatus.ReadyForPickup &&
          order.riderId.isEmpty &&
          minutesBetween(order.updatedAt, currentTime) >= autoDispatchMinutesForCustomer(
            membershipByCustomer.getOrElse(order.customerId, 0),
          ),
      )
      .sortBy(_.updatedAt)
    val initial = (state.orders, state.riders)
    val (nextOrders, nextRiders) = candidateOrders.foldLeft(initial) { case ((orders, riders), targetOrder) =>
      val availableRider = riders.find(_.availability == "Available")
      availableRider match
        case Some(rider) =>
          val note =
            if autoDispatchMinutesForCustomer(membershipByCustomer.getOrElse(targetOrder.customerId, 0)) == MemberAutoDispatchMinutes
            then s"系统已为会员订单优先指派骑手 ${rider.name}"
            else s"系统已为超时订单指派骑手 ${rider.name}"
          val updatedOrders = orders.map(order =>
            if order.id == targetOrder.id then
              order.copy(
                riderId = Some(rider.id),
                riderName = Some(rider.name),
                updatedAt = currentTime,
                timeline = order.timeline :+ OrderTimelineEntry(OrderStatus.ReadyForPickup, note, currentTime),
              )
            else order
          )
          val updatedRiders = riders.map(entry =>
            if entry.id == rider.id then entry.copy(availability = "OnDelivery") else entry
          )
          (updatedOrders, updatedRiders)
        case None => (orders, riders)
    }
    state.copy(orders = nextOrders, riders = nextRiders)

  private def autoDispatchMinutesForCustomer(monthlySpendCents: Int): Long =
    if monthlySpendCents > MemberMonthlySpendThresholdCents then MemberAutoDispatchMinutes
    else StandardAutoDispatchMinutes

  private def minutesBetween(from: String, to: String): Long =
    java.time.Duration.between(Instant.parse(from), Instant.parse(to)).toMinutes

  private def validateScheduledDeliveryAt(
      scheduledDeliveryAt: String,
      orderTimestamp: String,
  ): Either[String, String] =
    parseInstant(scheduledDeliveryAt).toRight("配送时间格式不正确").flatMap { scheduledInstant =>
      val orderInstant = Instant.parse(orderTimestamp)
      val earliest = ceilToMinute(orderInstant.plus(Duration.ofMinutes(MinimumScheduledLeadMinutes)))
      val orderDate = orderInstant.atZone(DeliveryScheduleZone).toLocalDate
      val scheduledDate = scheduledInstant.atZone(DeliveryScheduleZone).toLocalDate

      Either
        .cond(
          !scheduledInstant.isBefore(earliest),
          (),
          s"配送时间不得早于下单后 ${MinimumScheduledLeadMinutes} 分钟",
        )
        .flatMap(_ =>
          Either.cond(
            scheduledDate == orderDate,
            (),
            "配送时间仅支持选择下单当天",
          )
        )
        .map(_ => scheduledInstant.toString)
    }

  private def ceilToMinute(instant: Instant): Instant =
    val truncated = instant.truncatedTo(ChronoUnit.MINUTES)
    if truncated == instant then instant else truncated.plus(1, ChronoUnit.MINUTES)

  private def isWithinRecentWindow(
      timestamp: String,
      currentTime: String,
      days: Long,
  ): Boolean =
    !Instant.parse(timestamp).isBefore(Instant.parse(currentTime).minusSeconds(days * 24L * 60L * 60L))

  private def canReviewOrder(order: OrderSummary, currentTime: String): Boolean =
    order.status == OrderStatus.Completed &&
      hasPendingReviewSection(order) &&
      isWithinRecentWindow(reviewEligibilityTimestamp(order), currentTime, ReviewWindowDays)

  private def hasPendingReviewSection(order: OrderSummary): Boolean =
    order.storeRating.isEmpty || (order.riderId.nonEmpty && order.riderRating.isEmpty)

  private def reviewEligibilityTimestamp(order: OrderSummary): String =
    order.timeline.reverseIterator
      .find(_.status == OrderStatus.Completed)
      .map(_.at)
      .getOrElse(order.updatedAt)

  private def couponsForCustomer(
      customerId: String,
      membershipTier: MembershipTier,
      existingCoupons: List[Coupon],
      completedOrders: List[OrderSummary],
      currentTime: String,
  ): List[Coupon] =
    val activeCoupons = existingCoupons.filterNot(coupon => isCouponExpired(coupon, currentTime))
    val spendRewardCoupons = spendingRewardCoupons(customerId, completedOrders, currentTime)
    val tierCoupons = membershipTier match
      case MembershipTier.Member =>
        List(
          Coupon(
            id = s"coupon-$customerId-monthly",
            title = "会员极速配送券",
            discountCents = 1200,
            minimumSpendCents = 6000,
            description = "近 30 天消费达标会员礼包，可配合更快派单",
            expiresAt = Instant.parse(currentTime).plusSeconds(14L * 24L * 60L * 60L).toString,
          )
        )
      case MembershipTier.Standard => List.empty

    (activeCoupons ++ spendRewardCoupons ++ tierCoupons)
      .groupBy(_.id)
      .values
      .map(_.head)
      .toList
      .sortBy(_.expiresAt)

  private def initialRegistrationCoupons(customerId: String, currentTime: String): List[Coupon] =
    List.tabulate(3) { index =>
      Coupon(
        id = s"coupon-$customerId-welcome-${index + 1}",
        title = "新人满70减8",
        discountCents = 800,
        minimumSpendCents = 7000,
        description = "新用户注册礼券，下单满 70 元可用",
        expiresAt = Instant.parse(currentTime).plusSeconds(CouponValidityDays * 24L * 60L * 60L).toString,
      )
    }

  private def spendingRewardCoupons(
      customerId: String,
      completedOrders: List[OrderSummary],
      currentTime: String,
  ): List[Coupon] =
    val (_, _, coupons) = completedOrders.foldLeft((0, 0, List.empty[Coupon])) {
      case ((accumulatedSpendCents, issuedCount, rewardCoupons), order) =>
        val nextAccumulatedSpendCents = accumulatedSpendCents + order.totalPriceCents
        val nextIssuedCount = nextAccumulatedSpendCents / CouponSpendStepCents

        if nextIssuedCount <= issuedCount then
          (nextAccumulatedSpendCents, issuedCount, rewardCoupons)
        else
          val newCoupons = (issuedCount until nextIssuedCount).toList.map { rewardIndex =>
            val template = SpendRewardCouponTemplates(rewardIndex % SpendRewardCouponTemplates.length)
            val issuedAt = parseInstant(reviewEligibilityTimestamp(order)).getOrElse(Instant.parse(currentTime))
            val (title, discountCents, minimumSpendCents, description) = template

            Coupon(
              id = s"coupon-$customerId-spend-${rewardIndex + 1}",
              title = title,
              discountCents = discountCents,
              minimumSpendCents = minimumSpendCents,
              description = description,
              expiresAt = issuedAt.plusSeconds(CouponValidityDays * 24L * 60L * 60L).toString,
            )
          }

          (nextAccumulatedSpendCents, nextIssuedCount, rewardCoupons ++ newCoupons)
    }

    coupons.filterNot(coupon => isCouponExpired(coupon, currentTime))

  private def isCouponExpired(coupon: Coupon, currentTime: String): Boolean =
    parseInstant(coupon.expiresAt).exists(_.isBefore(Instant.parse(currentTime)))

  private def validateOrderCoupon(
      customer: Customer,
      couponId: Option[String],
      itemSubtotalCents: Int,
  ): Either[String, Option[Coupon]] =
    couponId.map(_.trim).filter(_.nonEmpty) match
      case None => Right(None)
      case Some(requestedCouponId) =>
        for
          coupon <- customer.coupons.find(_.id == requestedCouponId).toRight("优惠券不存在或已失效")
          _ <- Either.cond(itemSubtotalCents >= coupon.minimumSpendCents, (), s"${coupon.title} 未达到使用门槛")
        yield Some(coupon)

  private def calculateCouponDiscount(
      coupon: Option[Coupon],
      itemSubtotalCents: Int,
      deliveryFeeCents: Int,
  ): Int =
    coupon match
      case Some(value) => Math.min(value.discountCents, Math.max(0, itemSubtotalCents + deliveryFeeCents))
      case None => 0

  private def applyRatingToStore(
      store: Store,
      ratings: List[Int],
      oneStarCount: Int,
      revenueCents: Int,
  ): Store =
    store.copy(
      status =
        if oneStarCount > OneStarRevocationThreshold then "Revoked"
        else if store.status == "Busy" then "Busy"
        else "Open",
      averageRating = roundAverage(ratings),
      ratingCount = ratings.size,
      oneStarRatingCount = oneStarCount,
      revenueCents = revenueCents,
    )

  private def applyRatingToRider(
      rider: Rider,
      ratings: List[Int],
      oneStarCount: Int,
      earningsCents: Int,
  ): Rider =
    rider.copy(
      availability =
        if oneStarCount > OneStarRevocationThreshold then "Suspended"
        else if rider.availability == "OnDelivery" then "OnDelivery"
        else "Available",
      averageRating = roundAverage(ratings),
      ratingCount = ratings.size,
      oneStarRatingCount = oneStarCount,
      earningsCents = earningsCents,
      availableToWithdrawCents = Math.max(0, earningsCents - rider.withdrawnCents),
    )

  private def roundAverage(ratings: List[Int]): Double =
    if ratings.isEmpty then 0.0
    else BigDecimal(ratings.sum.toDouble / ratings.size).setScale(1, BigDecimal.RoundingMode.HALF_UP).toDouble

  private def createApprovedStore(application: MerchantApplication): Store =
    val storeId = s"store-${application.id.takeRight(4)}"
    Store(
      id = storeId,
      merchantName = application.merchantName,
      name = application.storeName,
      category = application.category,
      cuisine = application.category,
      status = "Open",
      businessHours = application.businessHours,
      avgPrepMinutes = application.avgPrepMinutes,
      imageUrl = application.imageUrl,
      menu = List.empty,
      averageRating = 0.0,
      ratingCount = 0,
      oneStarRatingCount = 0,
      revenueCents = 0,
    )

  private def validateBusinessHours(
      businessHours: BusinessHours
  ): Either[String, BusinessHours] =
    for
      openTime <- sanitizeRequiredText(businessHours.openTime, 5, "开业时间不能为空")
      closeTime <- sanitizeRequiredText(businessHours.closeTime, 5, "打烊时间不能为空")
      open <- parseBusinessTime(openTime).toRight("营业时间格式不正确，应为 HH:mm")
      close <- parseBusinessTime(closeTime).toRight("营业时间格式不正确，应为 HH:mm")
      _ <- Either.cond(open.isBefore(close), (), "打烊时间需晚于开业时间")
    yield BusinessHours(
      openTime = open.toString,
      closeTime = close.toString,
    )

  private def parseBusinessTime(value: String): Option[LocalTime] =
    try Some(LocalTime.parse(value))
    catch case _: Exception => None

  private def formatBusinessHours(businessHours: BusinessHours): String =
    s"${businessHours.openTime} - ${businessHours.closeTime}"

  private def isStoreOpenAt(store: Store, currentTimestamp: String): Boolean =
    (for
      instant <- parseInstant(currentTimestamp)
      open <- parseBusinessTime(store.businessHours.openTime)
      close <- parseBusinessTime(store.businessHours.closeTime)
    yield
      val currentLocalTime = instant.atZone(DeliveryScheduleZone).toLocalTime
      !currentLocalTime.isBefore(open) && currentLocalTime.isBefore(close)
    ).getOrElse(false)

  private def latestApprovedEligibilityReviewTimes(
      reviews: List[EligibilityReview],
      target: EligibilityReviewTarget,
  ): Map[String, String] =
    reviews
      .filter(review => review.target == target && review.status == AppealStatus.Approved)
      .flatMap(review => review.reviewedAt.map(at => review.targetId -> at))
      .groupBy(_._1)
      .view
      .mapValues(entries => entries.map(_._2).max)
      .toMap

  private def isAfterReviewReset(
      reviewTimestamp: String,
      resetTimestamp: Option[String],
  ): Boolean =
    resetTimestamp.forall(reset => reviewTimestamp >= reset)

  private def replaceApplication(
      applications: List[MerchantApplication],
      target: MerchantApplication,
  ): List[MerchantApplication] =
    applications.map(application => if application.id == target.id then target else application)

  private def replaceMerchantProfile(
      profiles: List[MerchantProfile],
      target: MerchantProfile,
  ): List[MerchantProfile] =
    profiles.map(profile => if profile.id == target.id then target else profile)

  private def replaceAppeal(
      appeals: List[ReviewAppeal],
      target: ReviewAppeal,
  ): List[ReviewAppeal] =
    appeals.map(appeal => if appeal.id == target.id then target else appeal)

  private def replaceEligibilityReview(
      reviews: List[EligibilityReview],
      target: EligibilityReview,
  ): List[EligibilityReview] =
    reviews.map(review => if review.id == target.id then target else review)

  private def findOrCreateMerchantProfile(
      state: DeliveryAppState,
      merchantName: String,
  ): Either[String, MerchantProfile] =
    sanitizeRequiredText(merchantName, 40, "商家名称不能为空").map { sanitizedName =>
      state.merchantProfiles.find(_.merchantName == sanitizedName).getOrElse(
        MerchantProfile(
          id = nextId("merchant"),
          merchantName = sanitizedName,
          contactPhone = "",
          payoutAccount = None,
          settledIncomeCents = 0,
          withdrawnCents = 0,
          availableToWithdrawCents = 0,
          withdrawalHistory = List.empty,
        )
      )
    }

  private def sanitizeContactPhone(value: String): Either[String, String] =
    sanitizeRequiredText(value, 20, "联系电话不能为空").flatMap { phone =>
      Either.cond(phone.matches("[0-9+\\- ]{6,20}"), phone, "联系电话格式不正确")
    }

  private def sanitizeMerchantPayoutAccount(
      account: MerchantPayoutAccount,
  ): Either[String, MerchantPayoutAccount] =
    val accountType = account.accountType.trim
    val bankName = account.bankName.map(_.trim).filter(_.nonEmpty)
    for
      normalizedType <- Either.cond(
        accountType == "alipay" || accountType == "bank",
        accountType,
        "提现账户类型不正确",
      )
      accountHolder <- sanitizeRequiredText(account.accountHolder, 30, "收款人不能为空")
      accountNumber <- sanitizeRequiredText(account.accountNumber, 60, "账号不能为空")
      normalizedBankName <-
        if normalizedType == "bank" then
          sanitizeRequiredText(bankName.getOrElse(""), 30, "请选择开户银行").map(Some(_))
        else Right(None)
      _ <- Either.cond(normalizedType != "alipay" || accountNumber.length >= 4, (), "支付宝账号格式不正确")
      _ <- Either.cond(normalizedType != "bank" || accountNumber.matches("[0-9 ]{8,30}"), (), "银行卡号格式不正确")
    yield MerchantPayoutAccount(
      accountType = normalizedType,
      bankName = normalizedBankName,
      accountNumber = accountNumber,
      accountHolder = accountHolder,
    )

  private def payoutAccountLabel(account: MerchantPayoutAccount): String =
    account.accountType match
      case "alipay" => s"支付宝 ${account.accountHolder} / ${account.accountNumber}"
      case "bank" => s"${account.bankName.getOrElse("银行卡")} ${account.accountHolder} / ${account.accountNumber}"
      case _ => account.accountNumber

  private def mergeMerchantProfiles(
      state: DeliveryAppState,
      settledIncomeByMerchant: Map[String, Int],
  ): List[MerchantProfile] =
    val merchantNames = (state.merchantProfiles.map(_.merchantName) ++ state.stores.map(_.merchantName)).distinct
    merchantNames.map { merchantName =>
      val existing = state.merchantProfiles.find(_.merchantName == merchantName)
      val profile = existing.getOrElse(
        MerchantProfile(
          id = nextId("merchant"),
          merchantName = merchantName,
          contactPhone = "",
          payoutAccount = None,
          settledIncomeCents = 0,
          withdrawnCents = 0,
          availableToWithdrawCents = 0,
          withdrawalHistory = List.empty,
        )
      )
      val settledIncomeCents = settledIncomeByMerchant.getOrElse(merchantName, 0)
      profile.copy(
        settledIncomeCents = settledIncomeCents,
        availableToWithdrawCents = Math.max(0, settledIncomeCents - profile.withdrawnCents),
        withdrawalHistory = profile.withdrawalHistory.sortBy(_.requestedAt)(Ordering.String.reverse),
      )
    }

  private def nextId(prefix: String): String =
    s"$prefix-${UUID.randomUUID().toString.take(8)}"

  private def now(): String = Instant.now().toString

  private def parseInstant(value: String): Option[Instant] =
    try Some(Instant.parse(value))
    catch case _: Exception => None

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

  private def seedState(): DeliveryAppState =
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
        businessHours = BusinessHours("09:00", "21:00"),
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
            Some(MerchantPayoutAccount("bank", Some("招商银行"), "6225888800004021", "王师傅")),
            0,
            0,
            0,
            List.empty,
          ),
          MerchantProfile(
            "merchant-2",
            "苏宁",
            "13800138001",
            Some(MerchantPayoutAccount("alipay", None, "su_store@demo", "苏宁")),
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
