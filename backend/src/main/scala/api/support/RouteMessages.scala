package api.support

import domain.shared.given

import domain.shared.{DisplayText, ErrorMessage, UserRole}

object RouteMessages:
  val LoginExpired: ErrorMessage = new ErrorMessage("登录已失效")
  val LoginRequired: ErrorMessage = new ErrorMessage("未登录")
  val StoreImageNotFound: ErrorMessage = new ErrorMessage("图片不存在")
  val ModifyOtherMerchantProfileForbidden: ErrorMessage = new ErrorMessage("无权修改其他商家资料")
  val WithdrawOtherMerchantIncomeForbidden: ErrorMessage = new ErrorMessage("无权发起其他商家的提现")
  val ModifyOtherMerchantMenuForbidden: ErrorMessage = new ErrorMessage("无权修改其他商家的菜品")
  val ModifyOtherMerchantStoreForbidden: ErrorMessage = new ErrorMessage("无权修改其他商家的店铺信息")
  val ModifyOtherCustomerProfileForbidden: ErrorMessage = new ErrorMessage("无权修改其他顾客资料")
  val ModifyOtherCustomerAddressForbidden: ErrorMessage = new ErrorMessage("无权修改其他顾客地址")
  val RechargeOtherCustomerForbidden: ErrorMessage = new ErrorMessage("无权为其他顾客充值")
  val ModifyOtherRiderProfileForbidden: ErrorMessage = new ErrorMessage("无权修改其他骑手资料")
  val WithdrawOtherRiderIncomeForbidden: ErrorMessage = new ErrorMessage("无权发起其他骑手的提现")
  val CreateOtherCustomerOrderForbidden: ErrorMessage = new ErrorMessage("无权为其他顾客下单")
  val HandleOtherMerchantOrderForbidden: ErrorMessage = new ErrorMessage("无权处理其他商家的订单")
  val ClaimOtherRiderOrderForbidden: ErrorMessage = new ErrorMessage("无权为其他骑手抢单")
  val HandleOtherRiderOrderForbidden: ErrorMessage = new ErrorMessage("无权处理其他骑手的订单")
  val ReviewOtherCustomerOrderForbidden: ErrorMessage = new ErrorMessage("无权评价其他顾客的订单")
  val JoinOtherOrderChatForbidden: ErrorMessage = new ErrorMessage("无权参与该订单聊天")
  val RefundOtherCustomerOrderForbidden: ErrorMessage = new ErrorMessage("无权申请其他顾客的退款")
  val SubmitOtherCustomerAfterSalesForbidden: ErrorMessage = new ErrorMessage("无权提交其他顾客的售后申请")
  val ResolveOtherMerchantRefundForbidden: ErrorMessage = new ErrorMessage("无权处理其他商家的退款申请")
  val SubmitReviewAppealForbidden: ErrorMessage = new ErrorMessage("无权发起该申诉")
  val SubmitEligibilityReviewForbidden: ErrorMessage = new ErrorMessage("无权提交该资格复核")

def missingMultipartFile(field: DisplayText): ErrorMessage =
  new ErrorMessage(s"缺少图片文件，请使用 ${field.raw} 字段上传")

def roleMismatch(role: UserRole): ErrorMessage =
  new ErrorMessage(s"当前账号不是${role.toString}角色")
