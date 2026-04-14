import { MAX_RECHARGE_AMOUNT_YUAN, MAX_WITHDRAW_AMOUNT_YUAN } from './constants'

export const DELIVERY_CONSOLE_MESSAGES = {
  rechargeAmountTooLarge: `自定义金额不能超过 ${MAX_RECHARGE_AMOUNT_YUAN} 元`,
  singleRechargeAmountTooLarge: `单次充值金额不能超过 ${MAX_RECHARGE_AMOUNT_YUAN} 元`,
  withdrawAmountTooLarge: `单次提现金额不能超过 ${MAX_WITHDRAW_AMOUNT_YUAN} 元`,
  withdrawExceedsAvailableBalance: '提现金额不能超过当前可提现余额',
  insufficientBalanceForOrder: '账户余额不足，请先充值后再提交订单',
  invalidWithdrawAmount: '请输入有效提现金额',
  invalidRechargeAmount: '请输入有效充值金额',
  noMenuItemSelected: '请至少选择一份菜品',
  noSameDayDeliveryWindow: '今天剩余时间不足 30 分钟，无法再预约当天配送',
  uploadInProgress: '图片仍在上传，请稍后再提交',
  menuImageUploadInProgress: '菜品图片仍在上传，请稍后再提交',
  imageUploadFailed: '图片上传失败',
  menuImageUploadFailed: '菜品图片上传失败',
  remainingQuantityHint: '可选填写 1 到 10，表示当前仅剩这么多件。',
  merchantNameRequired: '请填写商家名称',
  storeNameRequired: '请填写店铺名称',
  storeCategoryRequired: '请选择店铺大类',
  storeImageRequired: '请上传店铺展示图或填写可访问的图片 URL',
  menuItemNameRequired: '请填写菜品名称',
  menuItemDescriptionRequired: '请填写菜品说明',
  menuItemPriceInvalid: '请填写 0.01 到 9999.99 元之间的价格',
  menuItemRemainingQuantityInvalid: '限量库存可留空，或填写 1 到 10 的整数',
  menuItemImageRequired: '请上传菜品图片或填写可访问的图片 URL',
  addressLabelRequired: '请填写地址标签',
  addressContentRequired: '请填写地址内容',
  contactPhoneRequired: '请填写联系电话',
  contactPhoneInvalid: '联系电话格式不正确',
  bankNameRequired: '请选择开户银行',
  bankOptionPlaceholder: '请选择银行',
  bankCardNumberRequired: '请填写银行卡号',
  payoutAccountNumberRequired: '请填写收款账号',
  alipayAccountRequired: '请填写支付宝账号',
  bankAccountHolderRequired: '请填写持卡人姓名',
  payoutAccountHolderRequired: '请填写收款人姓名',
  genericAccountHolderRequired: '请填写账户姓名',
  alipayAccountInvalid: '支付宝账号格式不正确',
  bankAccountInvalid: '银行卡号格式不正确',
  businessHoursInvalid: '请填写有效的营业时间',
  businessHoursOrderInvalid: '打烊时间需晚于开业时间',
  deliveryTimeRequired: '请选择配送时间',
  deliveryAddressRequired: '请选择配送地址',
  deliveryTimeSelectionRequired: '请选择有效的配送时间',
  deliveryTimeFormatInvalid: '配送时间格式不正确',
  deliveryTimeTooEarly: '配送时间不得早于下单后 30 分钟',
  deliveryTimeOutOfRange: '配送时间仅支持预约到当天 23:59',
  deliveryTimeTodayOnly: '配送时间仅支持选择当天',
  orderNotFound: '订单不存在',
  orderChatMessageRequired: '消息内容不能为空',
  partialRefundUnavailable: '当前订单阶段不能申请缺货退款',
  partialRefundReasonRequired: '请先填写退款原因，再提交申请',
  afterSalesReasonRequired: '请先填写售后原因',
  expectedCompensationRequired: '请填写期望赔偿金额',
  reviewOrderUnavailable: '只能评价最近 10 天内完成且仍有待评价项的订单',
  storeReviewAlreadySubmitted: '商家评价已经提交过了',
  riderReviewUnavailable: '当前没有待提交的骑手评价',
  lowRatingCommentRequired: '当前是非 5 星评价，必须填写理由才能提交',
  customerNameRequired: '用户名不能为空',
  orderRejectReasonRequired: '请填写拒单理由',
  prepMinutesInvalid: '预计出餐时间需在 1 到 120 分钟之间',
  stockQuantityInvalid: '库存需为 0 到 10，留空表示不限量',
  menuItemPriceUpdateInvalid: '价格需在 0.01 到 9999.99 元之间',
} as const

export function formatRemainingQuantityMessage(
  itemName: string,
  remainingQuantity: number,
): string {
  return `${itemName} 当前仅剩 ${remainingQuantity} 份`
}

export function formatStoreClosedMessage(businessHoursText: string): string {
  return `当前店铺营业时间为 ${businessHoursText}，暂不可下单`
}

export function formatDeliveryTimeAdjustedMessage(dateTimeText: string): string {
  return `你选择的配送时间已失效，已顺延到当前最早可选时间 ${dateTimeText}，请确认后再次提交`
}

export function formatMaxPartialRefundQuantityMessage(remainingQuantity: number): string {
  return `该菜品最多还能申请退款 ${remainingQuantity} 份`
}
