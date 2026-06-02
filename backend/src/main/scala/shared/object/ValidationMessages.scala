package domain.shared

import domain.shared.given

object ValidationMessages:
  object Auth:
    val UsernameRequired: ErrorMessage = errorMessage("用户名不能为空")
    val PasswordRequired: ErrorMessage = errorMessage("密码不能为空")
    val PasswordTooShort: ErrorMessage = errorMessage("密码至少需要 6 位")
    val AdminSelfRegistrationForbidden: ErrorMessage = errorMessage("管理员账号不能自助注册")
    val UsernameAlreadyExists: ErrorMessage = errorMessage("用户名已存在")
    val UsernamePatternInvalid: ErrorMessage = errorMessage("用户名只能包含字母、数字和下划线")
    val AccountNotFound: ErrorMessage = errorMessage("账号不存在")
    val PasswordIncorrect: ErrorMessage = errorMessage("密码错误")
    val LoginRoleMismatch: ErrorMessage = errorMessage("登录身份与账号角色不匹配")

  object Customer:
    val CustomerNotFound: ErrorMessage = errorMessage("顾客不存在")
    val CustomerAccountSuspended: ErrorMessage = errorMessage("顾客账号已被封禁")
    val CustomerNameRequired: ErrorMessage = errorMessage("用户名不能为空")
    val AddressLabelRequired: ErrorMessage = errorMessage("地址标签不能为空")
    val AddressRequired: ErrorMessage = errorMessage("地址不能为空")
    val AddressLocationRequired: ErrorMessage = errorMessage("地址尚未完成定位，请选择可被地图识别的真实地址")
    val AddressNotFound: ErrorMessage = errorMessage("地址不存在")
    val AtLeastOneAddressRequired: ErrorMessage = errorMessage("至少需要保留一个地址")
    val ChangeDefaultAddressBeforeDeleting: ErrorMessage = errorMessage("请先将其他地址设为默认地址，再删除当前默认地址")
    val RechargeAmountInvalid: ErrorMessage = errorMessage("充值金额需在 0.01 到 5000 元之间")

  object Merchant:
    val MerchantNameRequired: ErrorMessage = errorMessage("商家姓名不能为空")
    val StoreNameRequired: ErrorMessage = errorMessage("店铺名称不能为空")
    val StoreCategoryRequired: ErrorMessage = errorMessage("店铺大类不能为空")
    val StoreAddressRequired: ErrorMessage = errorMessage("店铺地址不能为空")
    val InvalidStoreCategory: ErrorMessage = errorMessage("店铺大类不合法")
    val PrepMinutesInvalid: ErrorMessage = errorMessage("预计出餐时间需在 1 到 120 分钟之间")
    val MenuItemNameRequired: ErrorMessage = errorMessage("菜品名称不能为空")
    val MenuItemCategoryRequired: ErrorMessage = errorMessage("菜品分类不能为空")
    val MenuItemCategoryInvalid: ErrorMessage = errorMessage("菜品分类长度不能超过 20 个字符")
    val MenuItemDescriptionRequired: ErrorMessage = errorMessage("菜品说明不能为空")
    val MenuItemPriceInvalid: ErrorMessage = errorMessage("菜品价格需在 0.01 到 9999.99 元之间")
    val MenuItemRemainingQuantityInvalid: ErrorMessage = errorMessage("限量库存需为正整数，超过 10 按不限量处理")
    val MenuItemImageRequired: ErrorMessage = errorMessage("请上传菜品图片或填写可访问的图片 URL")
    val MenuItemSelectionGroupsInvalid: ErrorMessage = errorMessage("商品选项配置不合法")
    val MenuItemStockInvalid: ErrorMessage = errorMessage("剩余份数需为 0 或正整数，超过 10 按不限量处理")
    val MerchantProfileNameRequired: ErrorMessage = errorMessage("商家名称不能为空")
    val ContactPhoneRequired: ErrorMessage = errorMessage("联系电话不能为空")
    val ContactPhoneInvalid: ErrorMessage = errorMessage("联系电话格式不正确")
    val PayoutAccountHolderRequired: ErrorMessage = errorMessage("收款人不能为空")
    val PayoutAccountNumberRequired: ErrorMessage = errorMessage("账号不能为空")
    val BankNameRequired: ErrorMessage = errorMessage("请选择开户银行")
    val AlipayAccountInvalid: ErrorMessage = errorMessage("支付宝账号格式不正确")
    val BankAccountInvalid: ErrorMessage = errorMessage("银行卡号格式不正确")
    val WithdrawAmountInvalid: ErrorMessage = errorMessage("提现金额需在 0.01 到 50000 元之间")
    val PayoutAccountRequired: ErrorMessage = errorMessage("请先完善提现账户")
    val WithdrawBalanceInsufficient: ErrorMessage = errorMessage("可提现余额不足")
    val RiderNotFound: ErrorMessage = errorMessage("骑手不存在")
    val OpenTimeRequired: ErrorMessage = errorMessage("开业时间不能为空")
    val CloseTimeRequired: ErrorMessage = errorMessage("打烊时间不能为空")
    val BusinessHoursFormatInvalid: ErrorMessage = errorMessage("营业时间格式不正确，应为 HH:mm")
    val BusinessHoursOrderInvalid: ErrorMessage = errorMessage("打烊时间需晚于开业时间")
    val StoreReviewNotNeeded: ErrorMessage = errorMessage("当前店铺无需复核")
    val RiderReviewNotNeeded: ErrorMessage = errorMessage("当前骑手无需复核")
    val MerchantApplicationNotFound: ErrorMessage = errorMessage("入驻申请不存在")
    val OnlyPendingApplicationCanApprove: ErrorMessage = errorMessage("只有待审核申请可以通过")
    val OnlyPendingApplicationCanReject: ErrorMessage = errorMessage("只有待审核申请可以驳回")
    val ReviewNoteRequired: ErrorMessage = errorMessage("审核说明不能为空")
    val StoreNotFound: ErrorMessage = errorMessage("店铺不存在")
    val RevokedStoreCannotAddMenuItem: ErrorMessage = errorMessage("暂停营业的店铺不能新增菜品")
    val MenuItemNotFound: ErrorMessage = errorMessage("菜品不存在")
    val StoreRevoked: ErrorMessage = errorMessage("店铺已取消营业资格")

  object Order:
    val OrderRequiresAtLeastOneItem: ErrorMessage = errorMessage("订单至少需要一个商品")
    val DeliveryAddressRequired: ErrorMessage = errorMessage("配送地址不能为空")
    val StoreLocationRequired: ErrorMessage = errorMessage("店铺地址尚未完成定位，暂不可下单")
    val DeliveryDistanceOutOfRange: ErrorMessage = errorMessage("当前配送地址距离店铺超过 10 公里，暂不支持配送")
    val InsufficientBalanceForOrder: ErrorMessage = errorMessage("账户余额不足，请先充值后再提交订单")
    val DeliveryTimeFormatInvalid: ErrorMessage = errorMessage("配送时间格式不正确")
    val DeliveryTimeTodayOnly: ErrorMessage = errorMessage("配送时间仅支持选择下单当天")
    val CouponUnavailable: ErrorMessage = errorMessage("优惠券不存在或已失效")
    val MenuItemSelectionsRequired: ErrorMessage = errorMessage("请先完成商品配置选择")
    val RequiredCategoryItemMissingPrefix: ErrorMessage = errorMessage("当前店铺要求至少选择 1 件“")
    val RequiredCategoryItemMissingSuffix: ErrorMessage = errorMessage("”分区商品后才能下单")
    val OrderNotFound: ErrorMessage = errorMessage("订单不存在")
    val RejectOrderReasonRequired: ErrorMessage = errorMessage("拒单理由不能为空")
    val OrderCannotReject: ErrorMessage = errorMessage("当前订单不能拒绝")
    val OrderCannotAssignRider: ErrorMessage = errorMessage("当前订单不可分配骑手")
    val OrderAlreadyAssignedRider: ErrorMessage = errorMessage("订单已经分配过骑手")
    val RiderSuspended: ErrorMessage = errorMessage("骑手已取消接单资格")
    val RiderUnavailable: ErrorMessage = errorMessage("骑手当前不可接新单")
    val RiderAvailabilityLocked: ErrorMessage = errorMessage("骑手配送中，暂不可切换接单状态")
    val OrderCannotPickup: ErrorMessage = errorMessage("当前订单不能取餐")
    val RiderAssignmentRequired: ErrorMessage = errorMessage("请先分配骑手")
    val OrderCannotDeliver: ErrorMessage = errorMessage("当前订单不能确认送达")
    val OnlyCompletedOrdersCanReview: ErrorMessage = errorMessage("只有已完成订单可以评价")
    val StoreReviewAlreadySubmitted: ErrorMessage = errorMessage("商家评价已提交")
    val StoreReviewReplyRequired: ErrorMessage = errorMessage("商家追加评论不能为空")
    val StoreReviewReplyUnavailable: ErrorMessage = errorMessage("当前订单没有可追加评论的商家评价")
    val StoreReviewReplyAlreadySubmitted: ErrorMessage = errorMessage("该评价已追加过商家评论")
    val RiderReviewAlreadySubmitted: ErrorMessage = errorMessage("骑手评价已提交")
    val RiderReviewUnavailable: ErrorMessage = errorMessage("当前订单没有骑手可评价")
    val OrderChatMessageRequired: ErrorMessage = errorMessage("消息内容不能为空")

  object AfterSales:
    val AfterSalesTicketNotFound: ErrorMessage = errorMessage("售后工单不存在")
    val TicketIsNotAfterSalesRequest: ErrorMessage = errorMessage("当前工单不是售后申请")
    val AfterSalesAlreadyResolved: ErrorMessage = errorMessage("当前售后申请已处理")
    val RelatedOrderNotFound: ErrorMessage = errorMessage("关联订单不存在")
    val RelatedCustomerNotFound: ErrorMessage = errorMessage("关联顾客不存在")
    val MissingAfterSalesRequestType: ErrorMessage = errorMessage("售后申请类型缺失")
    val ResolutionNoteRequired: ErrorMessage = errorMessage("处理说明不能为空")
    val RefundAmountMustBePositive: ErrorMessage = errorMessage("退款金额必须大于 0")
    val CompensationAmountMustBePositive: ErrorMessage = errorMessage("补偿金额必须大于 0")
    val CompensationAmountRequired: ErrorMessage = errorMessage("赔偿申请需要填写补偿金额")
    val PendingAfterSalesExists: ErrorMessage = errorMessage("当前订单已有待处理售后申请")
    val AfterSalesReasonRequired: ErrorMessage = errorMessage("售后原因不能为空")
    val ExpectedCompensationMustBePositive: ErrorMessage = errorMessage("赔偿金额必须大于 0")
    val ExpectedCompensationRequired: ErrorMessage = errorMessage("赔偿申请必须填写期望赔偿金额")
    val PartialRefundOrderStatusInvalid: ErrorMessage = errorMessage("只有待接单或备餐中的订单可以申请缺货退款")
    val PartialRefundItemMissing: ErrorMessage = errorMessage("订单中没有该菜品")
    val PartialRefundQuantityInvalid: ErrorMessage = errorMessage("退款数量必须大于 0")
    val PartialRefundQuantityUnavailable: ErrorMessage = errorMessage("该菜品当前没有可申请退款的数量")
    val PartialRefundReasonRequired: ErrorMessage = errorMessage("退款原因不能为空")
    val PartialRefundNotFound: ErrorMessage = errorMessage("退款申请不存在")
    val PartialRefundAlreadyResolved: ErrorMessage = errorMessage("当前退款申请已处理")
    val PartialRefundResolveStatusInvalid: ErrorMessage = errorMessage("当前订单阶段不能处理缺货退款")
    val PartialRefundWouldEmptyOrder: ErrorMessage = errorMessage("当前流程只支持退掉部分商品，不能把整单全部退空")
    val PartialRefundQuantityOutOfRange: ErrorMessage = errorMessage("退款数量超过了该菜品可退款范围")

  object Review:
    val ReviewRequired: ErrorMessage = errorMessage("请至少提交一项评价")
    val ReviewRatingInvalidPrefix: ErrorMessage = errorMessage("评分必须在 1 到 5 之间")
    val LowRatingCommentRequiredSuffix: ErrorMessage = errorMessage("非 5 星评价必须填写理由")
    val StoreReviewAppealUnavailable: ErrorMessage = errorMessage("当前订单没有可申诉的商家评价")
    val RiderReviewAppealUnavailable: ErrorMessage = errorMessage("当前订单没有可申诉的骑手评价")
    val ReviewRevokedCannotAppeal: ErrorMessage = errorMessage("当前评价已撤销，不能申诉")
    val PendingAppealExists: ErrorMessage = errorMessage("当前角色已有待处理申诉")
    val AppealReasonRequired: ErrorMessage = errorMessage("申诉理由不能为空")
    val AppealNotFound: ErrorMessage = errorMessage("申诉不存在")
    val AppealAlreadyResolved: ErrorMessage = errorMessage("当前申诉已处理")
    val PendingEligibilityReviewExists: ErrorMessage = errorMessage("当前对象已有待处理复核申请")
    val EligibilityReviewReasonRequired: ErrorMessage = errorMessage("复核理由不能为空")
    val EligibilityReviewNotFound: ErrorMessage = errorMessage("复核申请不存在")
    val EligibilityReviewAlreadyResolved: ErrorMessage = errorMessage("当前复核申请已处理")
    val EligibilityReviewResolutionRequired: ErrorMessage = errorMessage("复核结论不能为空")
    val NoPendingTicket: ErrorMessage = errorMessage("没有待处理工单")
    val TicketResolutionRequired: ErrorMessage = errorMessage("处理结果不能为空")

def orderStatusMismatch(expected: OrderStatus): ErrorMessage =
  errorMessage(s"订单当前状态不是 ${expected.toString}")

def reviewRatingInvalid(label: DisplayText): ErrorMessage =
  errorMessage(s"${label.raw}${ValidationMessages.Review.ReviewRatingInvalidPrefix.raw}")

def lowRatingCommentRequired(label: DisplayText): ErrorMessage =
  errorMessage(s"${label.raw}${ValidationMessages.Review.LowRatingCommentRequiredSuffix.raw}")

def storeCurrentlyClosed(businessHoursText: DisplayText): ErrorMessage =
  errorMessage(s"当前店铺营业时间为 ${businessHoursText.raw}，暂不可下单")

def deliveryTimeTooEarly(minutes: DurationDays): ErrorMessage =
  errorMessage(s"配送时间不得早于下单后 $minutes 分钟")

def couponThresholdNotMet(couponTitle: DisplayText): ErrorMessage =
  errorMessage(s"${couponTitle.raw} 未达到使用门槛")

def requiredCategoryItemMissing(categoryName: DisplayText): ErrorMessage =
  errorMessage(
    s"${ValidationMessages.Order.RequiredCategoryItemMissingPrefix.raw}${categoryName.raw}${ValidationMessages.Order.RequiredCategoryItemMissingSuffix.raw}"
  )

def reviewWindowExpired(days: DurationDays): ErrorMessage =
  errorMessage(s"只能评价最近${days}天内完成的订单")

def partialRefundQuantityExceeded(remainingQuantity: Quantity): ErrorMessage =
  errorMessage(s"该菜品最多还能申请退款 $remainingQuantity 份")
