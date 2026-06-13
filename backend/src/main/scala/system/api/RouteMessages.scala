package system.api

import domain.shared.given

import domain.shared.*

object RouteMessages:
  val LoginExpired: ErrorMessage = errorMessage("登录已失效")
  val LoginRequired: ErrorMessage = errorMessage("未登录")
  val StoreImageNotFound: ErrorMessage = errorMessage("图片不存在")
  val ModifyOtherMerchantProfileForbidden: ErrorMessage = errorMessage("无权修改其他商家资料")
  val WithdrawOtherMerchantIncomeForbidden: ErrorMessage = errorMessage("无权发起其他商家的提现")
  val ModifyOtherMerchantMenuForbidden: ErrorMessage = errorMessage("无权修改其他商家的菜品")
  val ModifyOtherMerchantStoreForbidden: ErrorMessage = errorMessage("无权修改其他商家的店铺信息")
  val ModifyOtherCustomerProfileForbidden: ErrorMessage = errorMessage("无权修改其他顾客资料")
  val ModifyOtherCustomerAddressForbidden: ErrorMessage = errorMessage("无权修改其他顾客地址")
  val RechargeOtherCustomerForbidden: ErrorMessage = errorMessage("无权为其他顾客充值")
  val ModifyOtherRiderProfileForbidden: ErrorMessage = errorMessage("无权修改其他骑手资料")
  val WithdrawOtherRiderIncomeForbidden: ErrorMessage = errorMessage("无权发起其他骑手的提现")
  val CreateOtherCustomerOrderForbidden: ErrorMessage = errorMessage("无权为其他顾客下单")
  val HandleOtherMerchantOrderForbidden: ErrorMessage = errorMessage("无权处理其他商家的订单")
  val ClaimOtherRiderOrderForbidden: ErrorMessage = errorMessage("无权为其他骑手抢单")
  val HandleOtherRiderOrderForbidden: ErrorMessage = errorMessage("无权处理其他骑手的订单")
  val ReviewOtherCustomerOrderForbidden: ErrorMessage = errorMessage("无权评价其他顾客的订单")
  val JoinOtherOrderChatForbidden: ErrorMessage = errorMessage("无权参与该订单聊天")
  val RefundOtherCustomerOrderForbidden: ErrorMessage = errorMessage("无权申请其他顾客的退款")
  val SubmitOtherCustomerAfterSalesForbidden: ErrorMessage = errorMessage("无权提交其他顾客的售后申请")
  val ResolveOtherMerchantRefundForbidden: ErrorMessage = errorMessage("无权处理其他商家的退款申请")
  val SubmitReviewAppealForbidden: ErrorMessage = errorMessage("无权发起该申诉")
  val SubmitEligibilityReviewForbidden: ErrorMessage = errorMessage("无权提交该资格复核")

def missingMultipartFile(field: DisplayText): ErrorMessage =
  errorMessage(s"缺少图片文件，请使用 ${field.raw} 字段上传")

def roleMismatch(role: UserRole): ErrorMessage =
  errorMessage(s"当前账号不是${UserRole.render(role).raw}角色")
