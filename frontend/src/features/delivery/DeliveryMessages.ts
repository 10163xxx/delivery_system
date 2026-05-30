import { MAX_RECHARGE_AMOUNT_YUAN, MAX_WITHDRAW_AMOUNT_YUAN } from './DeliveryConstants'

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
    remainingQuantityHint: '可选填写 1 到 10，表示当前仅剩这么多件。',
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
    menuItemRemainingQuantityInvalid: '限量库存可留空，或填写 1 到 10 的整数',
    menuItemImageRequired: '请上传菜品图片或填写可访问的图片 URL',
    menuItemSelectionGroupsInvalid: '商品选项格式不正确，请按示例填写',
    orderRejectReasonRequired: '请填写拒单理由',
    prepMinutesInvalid: '预计出餐时间需在 1 到 120 分钟之间',
    stockQuantityInvalid: '库存需为 0 到 10，留空表示不限量',
    menuItemPriceUpdateInvalid: '价格需在 0.01 到 9999.99 元之间',
    businessHoursInvalid: '请填写有效的营业时间',
    businessHoursOrderInvalid: '打烊时间需晚于开业时间',
  },
  profile: {
    notConfigured: '未配置',
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

export function formatRequiredCategorySelectionMessage(categoryName: string): string {
  return `当前店铺要求至少选择 1 件“${categoryName}”分区商品后才能下单`
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

export const CUSTOMER_STORE_BROWSE_COPY = {
  customerStatusActive: '正常',
  customerStatusLabel: '顾客状态',
  customerStatusSuspended: '已封号',
  recentFrequentCountSuffix: ' 次下单',
  recentFrequentAddToCartButton: '加入购物车',
  recentFrequentCardTitle: '最近常点',
  recentFrequentEmptyHint: '可直接再次下单或回店铺挑选。',
  recentFrequentEnterStoreButton: '进入店铺',
  recentFrequentLastOrderedLabel: '最近一次',
  recentFrequentRepeatOrderButton: '再来一单',
  recentFrequentSectionSubtitle: '按你最近的下单习惯整理',
  recentFrequentTopItemsLabel: '常点菜品',
  recentFrequentTopItemsPrefix: '常点：',
  reviewRevokedCountLabel: '评价撤销次数',
  searchButton: '搜索',
  searchHistoryClearButton: '清空记录',
  searchHistoryDeleteLabel: (keyword: string) => `删除搜索记录 ${keyword}`,
  searchHistoryLabel: '搜索记录',
  searchHistoryRemoveButton: 'x',
  searchInputLabel: '搜索店家',
  searchInputPlaceholder: '输入店铺名或商家名',
  searchClearButton: '清空搜索',
  showAllStoresButton: '查看全部餐厅',
  showOrderableOnlyButton: '只看可下单',
  switchToAllStoresHint: '当前筛选下没有可下单店铺，可以切换到“查看全部餐厅”。',
  categoryImageAlt: (category: string) => `${category} 分类插图`,
  categoryTicketKind: '餐厅大类',
  categoryStoreCountSuffix: ' 家',
  categoryOrderableCoverageSummary: (openStoreCount: number, totalStoreCount: number) =>
    `可下单 ${openStoreCount} 家 · 覆盖 ${totalStoreCount} 家餐厅`,
  chooseCategoryButton: '选择此分类',
  chooseDistanceCategoryButton: '查看这个距离段',
  currentCategoryLabel: '当前分类',
  distanceCategoryDescription: (category: string) =>
    category === '10公里外' ? '超出当前配送范围，只能浏览菜单。' : `按 ${category} 的配送范围查看店铺。`,
  distanceCategoryResultSummary: (category: string, storeCount: number) =>
    `${category} 共 ${storeCount} 家店铺${category === '10公里外' ? '，当前不可配送。' : '。'}`,
  distanceCategoryTicketKind: '距离分组',
  distanceCategoryTitle: '按距离查看',
  searchResultLabel: '搜索结果',
  searchResultKeyword: (keyword: string) => `“${keyword}”`,
  searchResultSummary: (storeCount: number) =>
    `共 ${storeCount} 家餐厅，请选择已有菜品的店铺进入点餐。`,
  backToAllCategoriesButton: '返回全部分类',
  clearSearchResultButton: '清空搜索',
  resultToolbarButtonMinWidth: '240px',
  resultToolbarButtonMinHeight: '64px',
  resultToolbarButtonFontSize: '1.1rem',
  emptySearchResult: '没有找到匹配的店铺，请换个关键词试试。',
  emptyCategoryResult: '当前分类下没有可浏览的店铺。',
  backToCategoryListButton: '返回分类列表',
  favoriteCategoryTicketKind: '我的店铺',
  favoriteCategoryDescription: '把你常点、想回购的店铺集中到一个分类里。',
  favoriteCategoryButton: '查看收藏店铺',
  favoriteCategoryEmptyHint: '收藏后会出现在这里。',
  emptyFavoriteCategoryResult: '你还没有收藏店铺，先去逛逛其它分类吧。',
} as const

export const CUSTOMER_STORE_BROWSE_LAYOUT = {
  searchInputMinWidth: '280px',
  searchHistoryGap: '0.75rem',
  searchHistoryCardPadding: '0.75rem 1rem',
  searchHistoryCardRadius: '18px',
  searchHistoryFontSize: '1rem',
  searchHistoryTextColor: 'rgba(15, 23, 42, 0.6)',
  searchHistoryBackground: 'rgba(15, 23, 42, 0.04)',
  searchHistoryBorder: '1px solid rgba(15, 23, 42, 0.08)',
} as const

export const CUSTOMER_ORDER_WORKSPACE_COPY = {
  activeSectionTitle: '待完成',
  addToCartButton: '加入购物车',
  allSectionTitle: '所有订单',
  allSectionToggleCollapse: '收起所有订单',
  allSectionToggleExpand: '查看所有订单',
  completedOrdersLabel: '已完成订单',
  emptySelection: '请选择上方一个订单分类后再查看具体订单。',
  historyOrderCountLabel: '历史订单数',
  noActiveOrders: '当前没有待完成订单。',
  noOrders: '当前顾客还没有订单。',
  noReviewOrders: (reviewWindowDays: number) =>
    `当前没有待评价订单。仅最近 ${reviewWindowDays} 天内完成的订单支持评价。`,
  orderDetailPanelDescription: '查看单个订单的完整商品、费用、进度和售后信息。',
  orderDetailPanelTitle: '订单详情',
  orderWorkspacePanelDescription: (reviewWindowDays: number) =>
    `查看历史订单；仅最近 ${reviewWindowDays} 天内完成的订单可评价商家和骑手，并补充额外文字说明。`,
  orderWorkspacePanelTitle: '顾客订单视图',
  reviewSectionTitle: '待评价',
  reviewSectionToggleCollapse: '收起待评价',
  reviewSectionToggleExpand: '查看待评价',
  repeatOrderButton: '再来一单',
  sectionCountSuffix: ' 单',
  activeSectionToggleCollapse: '收起待完成',
  activeSectionToggleExpand: '查看待完成',
  pendingReviewBanner: (pendingCount: number, reviewWindowDays: number) =>
    `当前有 ${pendingCount} 个最近 ${reviewWindowDays} 天内完成且未评价的订单，可在对应订单卡片中点击“去评价”。`,
  noPendingReviewBanner: (reviewWindowDays: number) =>
    `当前没有待评价订单。仅最近 ${reviewWindowDays} 天内完成的订单支持评价；若订单刚送达，请等待几秒自动同步或点击“刷新状态”。`,
} as const

export const CUSTOMER_STORE_RESULT_COPY = {
  unavailableStoreHint: '当前店铺不可下单，详情进入店铺后可查看。',
  closedStoreHint: '当前不在营业时间内，更多营业信息进入店铺后查看。',
  emptyMenuHint: '当前暂未上架菜品，详细信息进入店铺后查看。',
  availableStoreHint: '更多营业时间、商家信息和完整菜单需进入店铺后查看。',
  unavailableStoreButton: '当前不可下单',
  closedStoreButton: '非营业时间',
  emptyMenuButton: '待上架菜品',
  enterStoreButton: '进入店铺',
  storeImageAlt: (storeName: string) => `${storeName} 展示图`,
  storeImageLabel: '餐厅展示图',
  storeRatingLabel: '店铺评分',
  menuCountLabel: '可点菜品',
  menuCountSuffix: ' 道',
  recentMonthOrderLabel: '近 30 天',
  recentMonthOrderSuffix: ' 单',
  prepSpeedLabel: '出餐速度',
  prepSpeedSuffix: ' 分钟',
  deliveryDistanceLabel: '配送距离',
  deliveryFeeLabel: '配送费',
  highlightListAriaLabel: (storeName: string) => `${storeName} 亮点提示`,
  reviewSectionLabel: '顾客评价',
  reviewEmptyText: '暂无顾客评价。',
  favoriteStoreButton: '收藏店铺',
  unfavoriteStoreButton: '取消收藏',
  blockStoreButton: '拉黑店铺',
  outOfRangeStoreButton: '超出配送范围',
  outOfRangeStoreHint: '当前地址距离店铺超过 10 公里，暂不支持配送。',
} as const

export const SELECTED_STORE_COPY = {
  closedBanner: (businessHoursText: string) =>
    `当前不在营业时间内，店铺营业时间为 ${businessHoursText}。`,
  menuTicketKind: '店内点餐',
  menuTabHint: '切换到“评价”即可查看这家店铺的全部顾客评价。',
  reviewCommentFallback: '顾客没有填写文字评价。',
  reviewExtraNotePrefix: '顾客补充：',
  reviewMerchantReplyTitle: '商家追加评论',
  reviewReplyTimePrefix: '回复时间 ',
  reviewCompletedAtPrefix: '订单完成于 ',
  favoriteStoreButton: '收藏店铺',
  unfavoriteStoreButton: '取消收藏',
  blockStoreButton: '拉黑店铺',
} as const

export const ORDER_LIST_COPY = {
  storeToCustomerSeparator: ' -> ',
  viewDetailButton: '查看详情',
  createdAtPrefix: '下单于 ',
  scheduledDeliveryPrefix: '预约送达 ',
  deliveryAddressPrefix: '配送地址 ',
  totalItemCountSuffix: ' 件商品',
  storeRatingPrefix: '商家 ',
  riderRatingPrefix: '骑手 ',
  starSuffix: ' 星',
  ratingSeparator: ' / ',
  missingRating: '-',
} as const

export const SELECTED_STORE_SECTIONS_COPY = {
  reviewDayFilterAllLabel: '全部时间',
  reviewDayFilterRecentWeekLabel: '近 7 日',
  reviewDayFilterRecentMonthLabel: '近 30 日',
  reviewDayFilterRecentQuarterLabel: '近 90 日',
  reviewAllStarLabel: '全部星级',
  reviewStarOptionLabel: (rating: number) => `${rating} 星`,
  currentStoreLabel: '当前店铺',
  businessHoursPrefix: '营业时间 ',
  selectedItemsLabel: '已选菜品',
  backToCurrentCategoryButton: '返回当前分类',
  resetCategoryButton: '重新选择分类',
  tabListAriaLabel: (storeName: string) => `${storeName} 页面切换`,
  menuTabButton: '点餐',
  reviewTabButton: '评价',
  reviewPanelTicketKind: '商家评价',
  reviewPanelDescription: '展示全部有效顾客评价，管理员撤销的评价不会显示。',
  reviewCountSuffix: ' 条',
  reviewRatingFilterLabel: '筛选星级',
  reviewTimeFilterLabel: '筛选时间',
  reviewCurrentResultLabel: '当前结果',
  filteredReviewEmptyText: '当前筛选条件下没有顾客评价。',
} as const

export const SELECTED_STORE_SECTIONS_LAYOUT = {
  toolbarButtonMinWidth: '220px',
  toolbarButtonMinHeight: '64px',
  toolbarButtonFontSize: '1.1rem',
} as const
