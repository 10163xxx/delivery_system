package domain.shared

import org.typelevel.ci.CIString

import java.nio.file.{Path, Paths}

object ServerDefaults:
  val ServiceName: String = "backend-sample"
  val HostEnv: String = "APP_HOST"
  val PortEnv: String = "APP_PORT"
  val Host: String = "0.0.0.0"
  val Port: Int = 8081

object HttpHeaders:
  val SessionToken: CIString = CIString("x-session-token")

object AuthDefaults:
  val StateFileEnv: String = "AUTH_STATE_FILE"
  val StateFilePath: Path = Paths.get("data", "auth-state.json")
  val UsernameMaxLength: Int = 24
  val PasswordMaxLength: Int = 64
  val PasswordMinLength: Int = 6
  val UsernamePattern: String = "[A-Za-z0-9_]+"
  val UserIdPrefix: String = "usr"
  val GeneratedIdSuffixLength: Int = 8

object UploadDefaults:
  val MaxUploadBytes: Int = 5 * 1024 * 1024
  val UploadRoot: Path = Paths.get("uploads", "store-images")
  val PublicUrlPrefix: String = "/uploads/store-images/"
  val MultipartFileField: String = "file"
  val EmptyUploadMessage: String = "请选择要上传的图片"
  val OversizedUploadMessage: String = "图片大小不能超过 5MB"
  val UnsupportedImageMessage: String = "仅支持 JPG、PNG、GIF、WebP 图片"
  val FallbackExtension: String = "img"
  val AllowedExtensions: Set[String] = Set("jpg", "jpeg", "png", "gif", "webp")
  val FilenameSeparators: Set[String] = Set("/", "\\")

object DatabaseRuntimeDefaults:
  val DefaultDatabaseName: String = "backend_sample"
  val NameEnv: String = "DB_NAME"
  val HostEnv: String = "DB_HOST"
  val PortEnv: String = "DB_PORT"
  val UserEnv: String = "DB_USER"
  val PasswordEnv: String = "DB_PASSWORD"
  val MaxPoolSizeEnv: String = "DB_MAX_POOL_SIZE"
  val ConnectionTimeoutEnv: String = "DB_CONNECTION_TIMEOUT_MS"
  val DefaultHost: String = "127.0.0.1"
  val DefaultPort: Int = 5432
  val DefaultUser: String = "db"
  val DefaultPassword: String = "root"
  val DefaultMaxPoolSize: Int = 10
  val DefaultConnectionTimeoutMs: Long = 3000L
  val DriverClassName: String = "org.postgresql.Driver"
  val PoolName: String = "backend-sample-pool"
  val NotInitializedMessage: String = "DatabaseSession is not initialized"

object DeliveryValidationDefaults:
  val MerchantNameMaxLength: Int = 40
  val StoreNameMaxLength: Int = 40
  val StoreCategoryMaxLength: Int = 20
  val NoteMaxLength: Int = 160
  val ImageUrlMaxLength: Int = 500

  val MenuItemNameMaxLength: Int = 40
  val MenuItemDescriptionMaxLength: Int = 160
  val MenuItemImageUrlMaxLength: Int = 500
  val MenuItemPriceMinCentsExclusive: Int = 0
  val MenuItemPriceMaxCents: Int = 999999
  val MenuItemQuantityMin: Int = 1
  val MenuItemStockMin: Int = 0
  val MenuItemStockMax: Int = 10
  val PrepMinutesMin: Int = 1
  val PrepMinutesMax: Int = 120

  val ReviewRatingMin: Int = 1
  val ReviewRatingMax: Int = 5
  val ReviewCommentMaxLength: Int = 160
  val ReviewExtraNoteMaxLength: Int = 240
  val ReviewApplicationNoteMaxLength: Int = 120

  val OpenCloseTimeLength: Int = 5
  val CustomerNameMaxLength: Int = 30
  val AddressLabelMaxLength: Int = 20
  val AddressMaxLength: Int = 120
  val OrderRemarkMaxLength: Int = 120
  val ContactPhoneMaxLength: Int = 20
  val ContactPhoneMinLength: Int = 6
  val PayoutAccountHolderMaxLength: Int = 30
  val PayoutAccountNumberMaxLength: Int = 60
  val BankNameMaxLength: Int = 30
  val BankAccountNumberMinLength: Int = 8
  val BankAccountNumberMaxLength: Int = 30
  val AlipayAccountMinLength: Int = 4

  val OrderChatMessageMaxLength: Int = 240
  val OrderReasonMaxLength: Int = 160
  val TicketResolutionMaxLength: Int = 60

  val RechargeAmountMinCentsExclusive: Int = 0
  val RechargeAmountMaxCents: Int = 500000
  val WithdrawAmountMinCentsExclusive: Int = 0
  val WithdrawAmountMaxCents: Int = 5000000
  val CompensationAmountMinCentsExclusive: Int = 0

object DeliveryBusinessDefaults:
  final case class CouponTemplate(
      title: String,
      discountCents: Int,
      minimumSpendCents: Int,
      description: String,
  )

  val OneStarRevocationThreshold: Int = 50
  val CustomerBanThreshold: Int = 5
  val MemberMonthlySpendThresholdCents: Int = 100000
  val StandardAutoDispatchMinutes: Long = 15L
  val MemberAutoDispatchMinutes: Long = 8L
  val MonthlyWindowDays: Long = 30L
  val ReviewWindowDays: Long = 10L
  val MinimumScheduledLeadMinutes: Long = 30L
  val DeliveryFeeCents: Int = 1000
  val RiderEarningPerOrderCents: Int = 500
  val CouponSpendStepCents: Int = 10000
  val CouponValidityDays: Long = 30L
  val MemberTierCouponValidityDays: Long = 14L
  val WelcomeCouponCount: Int = 3
  val WelcomeCouponTemplate: CouponTemplate =
    CouponTemplate("新人满70减8", 800, 7000, "新用户注册礼券，下单满 70 元可用")
  val MemberTierCouponTemplate: CouponTemplate =
    CouponTemplate("会员极速配送券", 1200, 6000, "近 30 天消费达标会员礼包，可配合更快派单")
  val SpendRewardCouponTemplates: List[CouponTemplate] = List(
    CouponTemplate("满30减3", 300, 3000, "累计消费奖励券，适合搭配早餐或饮品订单"),
    CouponTemplate("满50减6", 600, 5000, "累计消费奖励券，适合工作日午餐使用"),
    CouponTemplate("满70减8", 800, 7000, "累计消费奖励券，适合常规正餐订单"),
    CouponTemplate("满100减12", 1200, 10000, "累计消费奖励券，适合多人拼单或大额订单"),
    CouponTemplate("满120减15", 1500, 12000, "累计消费奖励券，单张优惠力度不超过 85 折"),
  )
  val CustomerAliasLength: Int = 5
  val GeneratedIdSuffixLength: Int = 8

object ValidationMessages:
  val UsernameRequired: String = "用户名不能为空"
  val PasswordRequired: String = "密码不能为空"
  val PasswordTooShort: String = "密码至少需要 6 位"
  val AdminSelfRegistrationForbidden: String = "管理员账号不能自助注册"
  val UsernameAlreadyExists: String = "用户名已存在"
  val UsernamePatternInvalid: String = "用户名只能包含字母、数字和下划线"
  val AccountNotFound: String = "账号不存在"
  val PasswordIncorrect: String = "密码错误"

  val CustomerNotFound: String = "顾客不存在"
  val CustomerAccountSuspended: String = "顾客账号已被封禁"
  val CustomerNameRequired: String = "用户名不能为空"
  val AddressLabelRequired: String = "地址标签不能为空"
  val AddressRequired: String = "地址不能为空"
  val AddressNotFound: String = "地址不存在"
  val AtLeastOneAddressRequired: String = "至少需要保留一个地址"
  val ChangeDefaultAddressBeforeDeleting: String = "请先将其他地址设为默认地址，再删除当前默认地址"
  val RechargeAmountInvalid: String = "充值金额需在 0.01 到 5000 元之间"

  val MerchantNameRequired: String = "商家姓名不能为空"
  val StoreNameRequired: String = "店铺名称不能为空"
  val StoreCategoryRequired: String = "店铺大类不能为空"
  val InvalidStoreCategory: String = "店铺大类不合法"
  val PrepMinutesInvalid: String = "预计出餐时间需在 1 到 120 分钟之间"
  val MenuItemNameRequired: String = "菜品名称不能为空"
  val MenuItemDescriptionRequired: String = "菜品说明不能为空"
  val MenuItemPriceInvalid: String = "菜品价格需在 0.01 到 9999.99 元之间"
  val MenuItemRemainingQuantityInvalid: String = "限量库存需在 1 到 10 之间"
  val MenuItemImageRequired: String = "请上传菜品图片或填写可访问的图片 URL"
  val MenuItemStockInvalid: String = "剩余份数需在 0 到 10 之间，留空表示不限量"
  val MerchantProfileNameRequired: String = "商家名称不能为空"
  val ContactPhoneRequired: String = "联系电话不能为空"
  val ContactPhoneInvalid: String = "联系电话格式不正确"
  val PayoutAccountHolderRequired: String = "收款人不能为空"
  val PayoutAccountNumberRequired: String = "账号不能为空"
  val BankNameRequired: String = "请选择开户银行"
  val AlipayAccountInvalid: String = "支付宝账号格式不正确"
  val BankAccountInvalid: String = "银行卡号格式不正确"
  val WithdrawAmountInvalid: String = "提现金额需在 0.01 到 50000 元之间"
  val PayoutAccountRequired: String = "请先完善提现账户"
  val WithdrawBalanceInsufficient: String = "可提现余额不足"
  val RiderNotFound: String = "骑手不存在"

  val OpenTimeRequired: String = "开业时间不能为空"
  val CloseTimeRequired: String = "打烊时间不能为空"
  val BusinessHoursFormatInvalid: String = "营业时间格式不正确，应为 HH:mm"
  val BusinessHoursOrderInvalid: String = "打烊时间需晚于开业时间"
  val ReviewRequired: String = "请至少提交一项评价"
  val ReviewRatingInvalidPrefix: String = "评分必须在 1 到 5 之间"
  val LowRatingCommentRequiredSuffix: String = "非 5 星评价必须填写理由"
  val StoreReviewAppealUnavailable: String = "当前订单没有可申诉的商家评价"
  val RiderReviewAppealUnavailable: String = "当前订单没有可申诉的骑手评价"
  val StoreReviewNotNeeded: String = "当前店铺无需复核"
  val RiderReviewNotNeeded: String = "当前骑手无需复核"
  val OrderRequiresAtLeastOneItem: String = "订单至少需要一个商品"
  val DeliveryAddressRequired: String = "配送地址不能为空"
  val InsufficientBalanceForOrder: String = "账户余额不足，请先充值后再提交订单"
  val DeliveryTimeFormatInvalid: String = "配送时间格式不正确"
  val DeliveryTimeTodayOnly: String = "配送时间仅支持选择下单当天"
  val CouponUnavailable: String = "优惠券不存在或已失效"

  val MerchantApplicationNotFound: String = "入驻申请不存在"
  val OnlyPendingApplicationCanApprove: String = "只有待审核申请可以通过"
  val OnlyPendingApplicationCanReject: String = "只有待审核申请可以驳回"
  val ReviewNoteRequired: String = "审核说明不能为空"
  val StoreNotFound: String = "店铺不存在"
  val RevokedStoreCannotAddMenuItem: String = "暂停营业的店铺不能新增菜品"
  val MenuItemNotFound: String = "菜品不存在"

  val OrderNotFound: String = "订单不存在"
  val StoreRevoked: String = "店铺已取消营业资格"
  val RejectOrderReasonRequired: String = "拒单理由不能为空"
  val OrderCannotReject: String = "当前订单不能拒绝"
  val OrderCannotAssignRider: String = "当前订单不可分配骑手"
  val OrderAlreadyAssignedRider: String = "订单已经分配过骑手"
  val RiderSuspended: String = "骑手已取消接单资格"
  val OrderCannotPickup: String = "当前订单不能取餐"
  val RiderAssignmentRequired: String = "请先分配骑手"
  val OrderCannotDeliver: String = "当前订单不能确认送达"
  val OnlyCompletedOrdersCanReview: String = "只有已完成订单可以评价"
  val StoreReviewAlreadySubmitted: String = "商家评价已提交"
  val RiderReviewAlreadySubmitted: String = "骑手评价已提交"
  val RiderReviewUnavailable: String = "当前订单没有骑手可评价"

  val AfterSalesTicketNotFound: String = "售后工单不存在"
  val TicketIsNotAfterSalesRequest: String = "当前工单不是售后申请"
  val AfterSalesAlreadyResolved: String = "当前售后申请已处理"
  val RelatedOrderNotFound: String = "关联订单不存在"
  val RelatedCustomerNotFound: String = "关联顾客不存在"
  val MissingAfterSalesRequestType: String = "售后申请类型缺失"
  val ResolutionNoteRequired: String = "处理说明不能为空"
  val RefundAmountMustBePositive: String = "退款金额必须大于 0"
  val CompensationAmountMustBePositive: String = "补偿金额必须大于 0"
  val CompensationAmountRequired: String = "赔偿申请需要填写补偿金额"
  val PendingAfterSalesExists: String = "当前订单已有待处理售后申请"
  val AfterSalesReasonRequired: String = "售后原因不能为空"
  val ExpectedCompensationMustBePositive: String = "赔偿金额必须大于 0"
  val ExpectedCompensationRequired: String = "赔偿申请必须填写期望赔偿金额"
  val OrderChatMessageRequired: String = "消息内容不能为空"
  val PartialRefundOrderStatusInvalid: String = "只有待接单或备餐中的订单可以申请缺货退款"
  val PartialRefundItemMissing: String = "订单中没有该菜品"
  val PartialRefundQuantityInvalid: String = "退款数量必须大于 0"
  val PartialRefundQuantityUnavailable: String = "该菜品当前没有可申请退款的数量"
  val PartialRefundReasonRequired: String = "退款原因不能为空"
  val PartialRefundNotFound: String = "退款申请不存在"
  val PartialRefundAlreadyResolved: String = "当前退款申请已处理"
  val PartialRefundResolveStatusInvalid: String = "当前订单阶段不能处理缺货退款"
  val PartialRefundWouldEmptyOrder: String = "当前流程只支持退掉部分商品，不能把整单全部退空"
  val PartialRefundQuantityOutOfRange: String = "退款数量超过了该菜品可退款范围"

  val ReviewRevokedCannotAppeal: String = "当前评价已撤销，不能申诉"
  val PendingAppealExists: String = "当前角色已有待处理申诉"
  val AppealReasonRequired: String = "申诉理由不能为空"
  val AppealNotFound: String = "申诉不存在"
  val AppealAlreadyResolved: String = "当前申诉已处理"
  val PendingEligibilityReviewExists: String = "当前对象已有待处理复核申请"
  val EligibilityReviewReasonRequired: String = "复核理由不能为空"
  val EligibilityReviewNotFound: String = "复核申请不存在"
  val EligibilityReviewAlreadyResolved: String = "当前复核申请已处理"
  val EligibilityReviewResolutionRequired: String = "复核结论不能为空"
  val NoPendingTicket: String = "没有待处理工单"
  val TicketResolutionRequired: String = "处理结果不能为空"
  def orderStatusMismatch(expected: Any): String = s"订单当前状态不是 $expected"

  def reviewRatingInvalid(label: String): String = s"$label$ReviewRatingInvalidPrefix"
  def lowRatingCommentRequired(label: String): String = s"$label$LowRatingCommentRequiredSuffix"
  def storeCurrentlyClosed(businessHoursText: String): String = s"当前店铺营业时间为 $businessHoursText，暂不可下单"
  def deliveryTimeTooEarly(minutes: Long): String = s"配送时间不得早于下单后 $minutes 分钟"
  def couponThresholdNotMet(couponTitle: String): String = s"$couponTitle 未达到使用门槛"
  def reviewWindowExpired(days: Long): String = s"只能评价最近${days}天内完成的订单"
  def partialRefundQuantityExceeded(remainingQuantity: Int): String = s"该菜品最多还能申请退款 $remainingQuantity 份"
