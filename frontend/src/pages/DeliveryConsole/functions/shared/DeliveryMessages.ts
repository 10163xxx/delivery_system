// Central copy and formatting helpers for delivery flows, kept together to avoid UI text drift.
import {
  CUSTOMER_STORE_TOP_ITEM_SEPARATOR,
  MAX_RECHARGE_AMOUNT_YUAN,
  MAX_WITHDRAW_AMOUNT_YUAN,
  REQUIRED_CATEGORY_EXAMPLE_LIMIT,
  ZERO_COUNT,
} from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'

export const DELIVERY_CONSOLE_MESSAGES = {
  account: {
    rechargeAmountTooLarge: `自定义金额不能超过 ${MAX_RECHARGE_AMOUNT_YUAN} 元`,
    singleRechargeAmountTooLarge: `单次充值金额不能超过 ${MAX_RECHARGE_AMOUNT_YUAN} 元`,
    withdrawAmountTooLarge: `单次提现金额不能超过 ${MAX_WITHDRAW_AMOUNT_YUAN} 元`,
    withdrawExceedsAvailableBalance: '提现金额不能超过当前可提现余额',
    invalidWithdrawAmount: '请输入有效提现金额',
    invalidRechargeAmount: '请输入有效充值金额',
    insufficientBalanceForOrder: '账户余额不足，请先充值后再提交订单',
  },
  upload: {
    uploadInProgress: '图片仍在上传，请稍后再提交',
    menuImageUploadInProgress: '菜品图片仍在上传，请稍后再提交',
    imageUploadFailed: '图片上传失败',
    menuImageUploadFailed: '菜品图片上传失败',
  },
  merchant: {
    remainingQuantityHint: '可选填写 1 到 10，超过 10 将按不限量处理。',
    merchantNameRequired: '请填写商家名称',
    storeNameRequired: '请填写店铺名称',
    storeCategoryRequired: '请选择店铺大类',
    storeAddressRequired: '请填写店铺地址',
    storeImageRequired: '请上传店铺展示图或填写可访问的图片 URL',
    menuItemNameRequired: '请填写菜品名称',
    menuItemCategoryRequired: '请填写菜品分类',
    menuItemCategoryInvalid: '菜品分类不能超过 20 个字符',
    menuItemDescriptionRequired: '请填写菜品说明',
    menuItemPriceInvalid: '请填写 0.01 到 9999.99 元之间的价格',
    menuItemRemainingQuantityInvalid: '限量库存可留空，或填写大于 0 的整数；超过 10 按不限量处理',
    menuItemImageRequired: '请上传菜品图片或填写可访问的图片 URL',
    menuItemSelectionGroupsInvalid: '商品选项格式不正确，请按示例填写',
    orderRejectReasonRequired: '请填写拒单理由',
    prepMinutesInvalid: '预计出餐时间需在 1 到 120 分钟之间',
    stockQuantityInvalid: '库存需为 0 或正整数，留空或超过 10 表示不限量',
    menuItemPriceUpdateInvalid: '价格需在 0.01 到 9999.99 元之间',
    businessHoursInvalid: '请填写有效的营业时间',
    businessHoursOrderInvalid: '打烊时间需晚于开业时间',
  },
  profile: {
    notConfigured: '未配置',
    addressLabelRequired: '请填写地址标签',
    addressContentRequired: '请填写地址内容',
    addressLocationRequired: '该地址无法被真实地图定位，请输入可识别的真实地址',
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
    customerNameRequired: '用户名不能为空',
  },
  schedule: {
    noSameDayDeliveryWindow: '今天剩余时间不足 30 分钟，无法再预约当天配送',
    deliveryTimeRequired: '请选择配送时间',
    deliveryAddressRequired: '请选择配送地址',
    deliveryAddressPendingProfileUpdate: '请先到个人信息页修改默认地址，再提交订单',
    deliveryDistanceOutOfRange: '当前配送地址距离店铺超过 10 公里，暂不支持配送',
    deliveryTimeSelectionRequired: '请选择有效的配送时间',
    deliveryTimeFormatInvalid: '配送时间格式不正确',
    deliveryTimeTooEarly: '配送时间不得早于下单后 30 分钟',
    deliveryTimeOutOfRange: '配送时间仅支持预约到当天 23:59',
    deliveryTimeTodayOnly: '配送时间仅支持选择当天',
  },
  order: {
    noMenuItemSelected: '请至少选择一份菜品',
    menuItemSelectionsRequired: '请先选完商品配置再加入购物车',
    restoreStoreUnavailable: '原订单对应店铺已不可用，暂时无法恢复商品。',
    restoreItemsUnavailable: '原订单商品已下架或当前不可点，暂时无法恢复商品。',
    orderNotFound: '订单不存在',
    orderChatMessageRequired: '消息内容不能为空',
    partialRefundUnavailable: '当前订单阶段不能申请缺货退款',
    partialRefundReasonRequired: '请先填写退款原因，再提交申请',
    afterSalesReasonRequired: '请先填写售后原因',
    expectedCompensationRequired: '请填写期望赔偿金额',
  },
  review: {
    reviewOrderUnavailable: '只能评价最近 10 天内完成且仍有待评价项的订单',
    storeReviewAlreadySubmitted: '商家评价已经提交过了',
    riderReviewUnavailable: '当前没有待提交的骑手评价',
    lowRatingCommentRequired: '当前是非 5 星评价，必须填写理由才能提交',
  },
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

export function formatRequiredCategorySelectionMessage(categoryName: string, itemNames: string[] = []): string {
  const examples = itemNames
    .slice(ZERO_COUNT, REQUIRED_CATEGORY_EXAMPLE_LIMIT)
    .join(CUSTOMER_STORE_TOP_ITEM_SEPARATOR)
  return examples
    ? `下单前必须在“${categoryName}”分区至少选择 1 件商品，例如：${examples}。请选择后再提交订单。`
    : `下单前必须在“${categoryName}”分区至少选择 1 件商品。请选择后再提交订单。`
}

export function formatDeliveryTimeAdjustedMessage(dateTimeText: string): string {
  return `你选择的配送时间已失效，已顺延到当前最早可选时间 ${dateTimeText}，请确认后再次提交`
}

export function formatMaxPartialRefundQuantityMessage(remainingQuantity: number): string {
  return `该菜品最多还能申请退款 ${remainingQuantity} 份`
}

export function formatOrderRestorePartialMessage(restoredCount: number): string {
  return `已恢复 ${restoredCount} 件商品；部分菜品可能已下架、售罄或规格发生变化。`
}

export function formatOrderRestoreCheckoutSuccessMessage(restoredCount: number): string {
  return `已恢复 ${restoredCount} 件商品，正在带你去结算。`
}

export function formatOrderRestoreCartSuccessMessage(restoredCount: number): string {
  return `已恢复 ${restoredCount} 件商品到购物车。`
}

export function searchHistoryDeleteLabel(keyword: string): string {
  return `删除搜索记录 ${keyword}`
}

export function categoryImageAlt(category: string): string {
  return `${category} 分类插图`
}

export function categoryOrderableCoverageSummary(openStoreCount: number, totalStoreCount: number): string {
  return `可下单 ${openStoreCount} 家 · 覆盖 ${totalStoreCount} 家餐厅`
}

export function searchResultKeyword(keyword: string): string {
  return `“${keyword}”`
}

export function searchResultSummary(storeCount: number): string {
  return `共 ${storeCount} 家餐厅，请选择已有菜品的店铺进入点餐。`
}

export function formatNoReviewOrdersMessage(reviewWindowDays: number): string {
  return `当前没有待评价订单。仅最近 ${reviewWindowDays} 天内完成的订单支持评价。`
}

export function formatOrderWorkspacePanelDescription(reviewWindowDays: number): string {
  return `查看历史订单；仅最近 ${reviewWindowDays} 天内完成的订单可评价商家和骑手，并补充额外文字说明。`
}

export function formatPendingReviewBanner(pendingCount: number, reviewWindowDays: number): string {
  return `当前有 ${pendingCount} 个最近 ${reviewWindowDays} 天内完成且未评价的订单，可在对应订单卡片中点击“去评价”。`
}

export function formatNoPendingReviewBanner(reviewWindowDays: number): string {
  return `当前没有待评价订单。仅最近 ${reviewWindowDays} 天内完成的订单支持评价；若订单刚送达，请等待几秒自动同步或点击“刷新状态”。`
}

export function formatStoreImageAlt(storeName: string): string {
  return `${storeName} 展示图`
}

export function formatStoreHighlightListAriaLabel(storeName: string): string {
  return `${storeName} 亮点提示`
}

export function formatSelectedStoreClosedBanner(businessHoursText: string): string {
  return `当前不在营业时间内，店铺营业时间为 ${businessHoursText}。`
}

export function formatReviewStarOptionLabel(rating: number): string {
  return `${rating} 星`
}

export function formatSelectedStoreTabListAriaLabel(storeName: string): string {
  return `${storeName} 页面切换`
}

export * from '@/pages/DeliveryConsole/functions/store/DeliveryStoreMessages'
