import type { CustomerRoleProps } from '@/shared/app/role-props'
import type { CheckoutPanelProps } from '@/pages/customer/object/CustomerPageObjects'
import { STORE_STATUS } from '@/shared/object/core/SharedObjects'
import { MIN_SCHEDULE_LEAD_MINUTES } from '@/shared/delivery/DeliveryServices'

export const CUSTOMER_CHECKOUT_COPY = {
  panel: {
    checkoutDescription: '在购物车中填写配送信息，并确认本单余额支付。',
    checkoutTicketKind: '结算台',
    checkoutTitle: '确认订单并完成余额支付',
    removePanel: '收起',
  },
  cart: {
    backToMenu: '返回继续点餐',
    cartTitle: '购物车',
    cartTitleWithStore: (storeName: string) => `${storeName} · 购物车结算`,
    defaultSelectionSummary: '标准出餐',
    headerDescription: '在这里确认已选餐品、配送时间、优惠券和支付信息。',
    itemListTitle: '已选餐品',
    itemCountSuffix: ' 款已选',
    requiredCategoryMissingHint: '下单前还需要从“必选品”分区至少选择 1 件商品。',
    requiredCategorySelectedHint: '已满足“必选品”分区选择要求。',
    decreaseQuantityButton: '-',
    increaseQuantityButton: '+',
    pageDescription: '确认购物车内容后，在这里下单并完成支付。',
  },
  store: {
    expandDisabledForClosedStore: '非营业时间',
    expandDisabledForIncompleteAddress: '先完善默认地址',
    expandDisabledForNoMenu: '暂无菜品可下单',
    expandDisabledForRevokedStore: '当前不可下单',
    storeOrderReady: '去购物车结算',
  },
  menu: {
    categoryRequiredBadge: '必选 1 件',
    categoryItemCountSuffix: ' 款',
    categoryFallback: '店铺推荐',
    categoryNavAriaLabel: '菜品分类导航',
    categorySectionLabel: '菜品大类',
    categoryRequiredHint: '该分区至少需要选择 1 件商品才能提交订单。',
    configurationButtonSelect: '选配置',
    configurationButtonUpdate: '改配置',
    configurationDialogConfirmButton: '确认并加入',
    configurationDialogDescription: '先选好这份商品的配置，再加入购物车。',
    configurationDialogCancelButton: '取消',
    configurationGroupRequiredSingle: ' · 必选 1 项',
    configurationGroupSelectionRange: (minSelections: number, maxSelections: number) =>
      ` · 选择 ${minSelections}-${maxSelections} 项`,
    configurationSummaryLabel: '已选：',
    configurationSummaryRequiredLabel: '需选配置：',
    configurationSummarySingleSelectSuffix: ' 1项',
    configurationSummaryRangeSuffix: (minSelections: number, maxSelections: number) =>
      ` ${minSelections}-${maxSelections}项`,
    inStockPattern: (quantity: number) => `限量供应，剩余 ${quantity} 份`,
    menuImageLabel: '菜品图片',
    menuItemImageAlt: (itemName: string) => `${itemName} 菜品图`,
    menuSalesPrefix: '月售',
    noStock: '当前已售罄',
    selectionSummarySeparator: ' · ',
  },
  address: {
    addressPlaceholderError: '默认地址还是占位地址，请先到“个人信息”里修改默认地址后再下单。',
    deliveryAddressTitle: '配送地址',
    unavailableAddress: '默认地址未完善，当前不能提交订单。',
  },
  schedule: {
    deliveryTimeTitle: '配送时间',
    scheduleHint: `仅可预约今天内的配送时间，且不得早于下单后 ${MIN_SCHEDULE_LEAD_MINUTES} 分钟。`,
  },
  coupon: {
    couponDiscountTitle: '优惠券抵扣',
    couponEmptyHint: '当前没有满足本单金额门槛的优惠券。',
    couponExistsHint: '当前有可用优惠券，可在这里选择后抵扣。',
    couponFieldTitle: '优惠券',
    removeCoupon: '不使用优惠券',
  },
  payment: {
    balanceInsufficient: '当前余额不足，先到“顾客信息”页充值后再提交订单。',
    balancePay: '余额支付并提交',
    balancePayMethod: '账户余额支付',
    balanceStatusEnough: '余额充足',
    balanceStatusInsufficient: '余额不足',
    deliveryFeeTitle: '配送费',
    noneDisplay: '--',
    orderAmountTitle: '订单金额',
    payAfterBalanceTitle: '支付后余额',
    payStatusTitle: '支付状态',
    payStoreTitle: '店铺',
    paymentMethodTitle: '付款方式',
    rechargeAction: '去充值',
    subtotalTitle: '餐品金额',
    walletBalanceTitle: '账户余额',
  },
  remark: {
    orderRemarkPlaceholder: '比如少辣、放门口',
    orderRemarkTitle: '订单备注',
  },
} as const

export const CUSTOMER_CHECKOUT_FIELDS = {
  customerAddressOptionsId: 'customer-address-options',
} as const

export const CUSTOMER_CHECKOUT_LAYOUT = {
  configurationGroupSpacing: 8,
  configurationOptionGap: 8,
} as const

export function getMenuItemQuantity(quantities: CustomerRoleProps['quantities'], itemId: string) {
  return quantities[itemId] ?? 0
}

export function getCheckoutPrimaryActionLabel(props: CheckoutPanelProps) {
  const {
    customerRequiresDefaultAddressUpdate,
    isStoreCurrentlyOpen,
    selectedStore,
    selectedStoreHasMenu,
  } = props

  if (!selectedStore) return CUSTOMER_CHECKOUT_COPY.store.expandDisabledForNoMenu
  if (customerRequiresDefaultAddressUpdate) return CUSTOMER_CHECKOUT_COPY.store.expandDisabledForIncompleteAddress
  if (selectedStore.status === STORE_STATUS.revoked) return CUSTOMER_CHECKOUT_COPY.store.expandDisabledForRevokedStore
  if (!isStoreCurrentlyOpen(selectedStore)) return CUSTOMER_CHECKOUT_COPY.store.expandDisabledForClosedStore
  return selectedStoreHasMenu
    ? CUSTOMER_CHECKOUT_COPY.store.storeOrderReady
    : CUSTOMER_CHECKOUT_COPY.store.expandDisabledForNoMenu
}

export function canBalancePay(props: CheckoutPanelProps) {
  const {
    customerRequiresDefaultAddressUpdate,
    payableTotalCents,
    selectedCustomer,
    selectedStoreCanOrder,
  } = props

  return Boolean(
    selectedCustomer &&
      selectedStoreCanOrder &&
      !customerRequiresDefaultAddressUpdate &&
      selectedCustomer.balanceCents >= payableTotalCents,
  )
}

export function getCouponHint(props: CheckoutPanelProps) {
  const { availableCheckoutCoupons, couponDiscountCents, formatPrice, selectedCoupon } = props
  if (selectedCoupon) return `已选 ${selectedCoupon.title}，本单可抵扣 ${formatPrice(couponDiscountCents)}。`
  if (availableCheckoutCoupons.length > 0) return CUSTOMER_CHECKOUT_COPY.coupon.couponExistsHint
  return CUSTOMER_CHECKOUT_COPY.coupon.couponEmptyHint
}
