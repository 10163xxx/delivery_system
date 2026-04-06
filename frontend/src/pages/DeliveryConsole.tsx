import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import type {
  AddCustomerAddressRequest,
  AddMenuItemRequest,
  AuthSession,
  BusinessHours,
  CreateOrderRequest,
  DeliveryAppState,
  MenuItem,
  MerchantPayoutAccountType,
  MerchantProfile,
  MerchantRegistrationRequest,
  OrderSummary,
  RechargeBalanceRequest,
  ResolvePartialRefundRequest,
  ResolveTicketRequest,
  ReviewMerchantApplicationRequest,
  ReviewOrderRequest,
  Role,
  SendOrderChatMessageRequest,
  SubmitAfterSalesRequest,
  SubmitPartialRefundRequest,
  StoreCategory,
  Store,
  UpdateMerchantProfileRequest,
  UpdateCustomerProfileRequest,
  WithdrawMerchantIncomeRequest,
} from '@/domain-types/delivery'
import AuthScreen from '@/components/AuthScreen'
import { MetricCard } from '@/components/delivery-console/LayoutPrimitives'
import { AdminRoleView } from '@/components/delivery-console/AdminRoleView'
import { CustomerRoleView } from '@/components/delivery-console/CustomerRoleView'
import { MerchantRoleView } from '@/components/delivery-console/MerchantRoleView'
import { RiderRoleView } from '@/components/delivery-console/RiderRoleView'
import { clearSessionToken, deliveryApi } from '@/lib/delivery-api'

type ReviewDraft = {
  rating: number
  comment: string
  extraNote: string
}

type MerchantDraft = {
  merchantName: string
  storeName: string
  category: StoreCategory | ''
  openTime: string
  closeTime: string
  avgPrepMinutes: number
  imageUrl: string
  uploadedImageName: string
  note: string
}

type AppealResolutionDraft = {
  approved: boolean
  resolutionNote: string
}

type MenuItemDraft = {
  name: string
  description: string
  priceYuan: string
  remainingQuantity: string
  imageUrl: string
  uploadedImageName: string
}

type PartialRefundDraft = {
  quantity: number
  reason: string
}

type AfterSalesDraft = {
  requestType: 'ReturnRequest' | 'CompensationRequest'
  reason: string
  expectedCompensationYuan: string
}

type CustomerWorkspaceView =
  | 'order'
  | 'orders'
  | 'order-detail'
  | 'profile'
  | 'review'
  | 'recharge'
  | 'addresses'
  | 'coupons'
type MerchantWorkspaceView = 'application' | 'console' | 'profile'
type MerchantApplicationView = 'pending' | 'reviewed' | 'submit'
type MerchantProfileDraft = {
  contactPhone: string
  payoutAccountType: MerchantPayoutAccountType
  bankName: string
  accountNumber: string
  accountHolder: string
}
type MerchantProfileFormField =
  | 'contactPhone'
  | 'bankName'
  | 'accountNumber'
  | 'accountHolder'

const BANK_OPTIONS = ['中国银行', '工商银行', '建设银行', '农业银行', '招商银行', '交通银行', '邮储银行'] as const

type CustomerAddressDraft = {
  label: string
  address: string
}

type CustomerAddressField = 'label' | 'address'

type MerchantFormField = 'merchantName' | 'storeName' | 'category' | 'openTime' | 'closeTime' | 'imageUrl'
type MenuItemFormField = 'name' | 'description' | 'priceYuan' | 'remainingQuantity' | 'imageUrl'

type HeaderAction = 'refresh' | 'logout' | null

const RECHARGE_PRESET_AMOUNTS = [50, 100, 200, 500] as const
const STORE_REVIEW_REASON_OPTIONS = ['出餐慢', '口味一般', '菜品与描述不符', '包装破损', '体验很好'] as const
const RIDER_REVIEW_REASON_OPTIONS = ['送达太慢', '定位不准', '态度一般', '联系不及时', '服务很好'] as const
const STATE_POLL_INTERVAL_MS = 3000
const LOGOUT_TRANSITION_MS = 1000
const CUSTOMER_STORE_SEARCH_HISTORY_KEY = 'customer-store-search-history'
const REVIEW_WINDOW_DAYS = 10
const DELIVERY_FEE_CENTS = 1000
const MIN_SCHEDULE_LEAD_MINUTES = 30
const STORE_CATEGORIES: StoreCategory[] = [
  '中式快餐',
  '盖饭简餐',
  '面馆粉档',
  '麻辣香锅',
  '饺子馄饨',
  '轻食沙拉',
  '咖啡甜点',
  '奶茶果饮',
  '夜宵小吃',
]

function waitForNextPaint() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => resolve())
  })
}

const roleLabels: Record<Role, string> = {
  customer: '顾客',
  merchant: '商家',
  rider: '骑手',
  admin: '管理员',
}

const statusLabels: Record<OrderSummary['status'], string> = {
  PendingMerchantAcceptance: '待商家接单',
  Preparing: '备餐中',
  ReadyForPickup: '待骑手取餐',
  Delivering: '配送中',
  Completed: '已完成',
  Cancelled: '已取消',
  Escalated: '异常升级',
}

function formatPrice(priceCents: number) {
  return `¥${(priceCents / 100).toFixed(2)}`
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function normalizeTextInput(value: string, maxLength: number) {
  return value.replace(/\s+/g, ' ').trim().slice(0, maxLength)
}

function clampRating(value: number) {
  return Math.max(1, Math.min(5, value))
}

function getInitialQuantities(store?: Store): Record<string, number> {
  return Object.fromEntries(store?.menu.map((item) => [item.id, 0]) ?? [])
}

function createInitialMerchantDraft(merchantName = ''): MerchantDraft {
  return {
    merchantName,
    storeName: '',
    category: '',
    openTime: '09:00',
    closeTime: '21:00',
    avgPrepMinutes: 20,
    imageUrl: '',
    uploadedImageName: '',
    note: '',
  }
}

function createInitialReviewDraft(): ReviewDraft {
  return {
    rating: 5,
    comment: '',
    extraNote: '',
  }
}

function createInitialMenuItemDraft(): MenuItemDraft {
  return {
    name: '',
    description: '',
    priceYuan: '',
    remainingQuantity: '',
    imageUrl: '',
    uploadedImageName: '',
  }
}

function createInitialPartialRefundDraft(): PartialRefundDraft {
  return {
    quantity: 1,
    reason: '',
  }
}

function createInitialAfterSalesDraft(): AfterSalesDraft {
  return {
    requestType: 'CompensationRequest',
    reason: '',
    expectedCompensationYuan: '',
  }
}

function createInitialMerchantProfileDraft(): MerchantProfileDraft {
  return {
    contactPhone: '',
    payoutAccountType: 'alipay',
    bankName: '',
    accountNumber: '',
    accountHolder: '',
  }
}

function buildMerchantRegistrationPayload(
  draft: MerchantDraft,
): MerchantRegistrationRequest {
  const merchantName = normalizeTextInput(draft.merchantName, 40)
  const storeName = normalizeTextInput(draft.storeName, 40)
  const category = normalizeTextInput(draft.category, 20)
  const imageUrl = draft.imageUrl.trim()
  const note = normalizeTextInput(draft.note, 160)

  return {
    merchantName,
    storeName,
    category: category as MerchantRegistrationRequest['category'],
    businessHours: {
      openTime: draft.openTime,
      closeTime: draft.closeTime,
    },
    avgPrepMinutes: Math.max(1, Math.min(120, Math.round(draft.avgPrepMinutes))),
    imageUrl: imageUrl || undefined,
    note: note || undefined,
  }
}

function buildMenuItemPayload(draft: MenuItemDraft): AddMenuItemRequest {
  const name = normalizeTextInput(draft.name, 40)
  const description = normalizeTextInput(draft.description, 160)
  const imageUrl = draft.imageUrl.trim()
  const price = Number(draft.priceYuan.trim())
  const remainingQuantity = draft.remainingQuantity.trim()
  const parsedRemainingQuantity = Number(remainingQuantity)

  return {
    name,
    description,
    priceCents: Number.isFinite(price) ? Math.round(price * 100) : 0,
    imageUrl: imageUrl || undefined,
    remainingQuantity:
      remainingQuantity === ''
        ? undefined
        : Number.isInteger(parsedRemainingQuantity)
          ? parsedRemainingQuantity
          : undefined,
  }
}

function validateMerchantDraft(draft: MerchantDraft): Partial<Record<MerchantFormField, string>> {
  const merchantName = normalizeTextInput(draft.merchantName, 40)
  const storeName = normalizeTextInput(draft.storeName, 40)
  const category = normalizeTextInput(draft.category, 20)
  const imageUrl = draft.imageUrl.trim()
  const businessHoursError = validateBusinessHours({
    openTime: draft.openTime,
    closeTime: draft.closeTime,
  })

  return {
    merchantName: merchantName ? undefined : '请填写商家名称',
    storeName: storeName ? undefined : '请填写店铺名称',
    category: category ? undefined : '请选择店铺大类',
    openTime: businessHoursError,
    closeTime: businessHoursError,
    imageUrl: imageUrl ? undefined : '请上传店铺展示图或填写可访问的图片 URL',
  }
}

function validateMenuItemDraft(
  draft: MenuItemDraft,
): Partial<Record<MenuItemFormField, string>> {
  const payload = buildMenuItemPayload(draft)
  const price = Number(draft.priceYuan.trim())
  const remainingQuantityText = draft.remainingQuantity.trim()
  const parsedRemainingQuantity = Number(remainingQuantityText)
  const hasValidRemainingQuantity =
    remainingQuantityText === '' ||
    (Number.isInteger(parsedRemainingQuantity) &&
      parsedRemainingQuantity >= 1 &&
      parsedRemainingQuantity <= 10)

  return {
    name: payload.name ? undefined : '请填写菜品名称',
    description: payload.description ? undefined : '请填写菜品说明',
    priceYuan:
      Number.isFinite(price) && payload.priceCents > 0 && payload.priceCents <= 999999
        ? undefined
        : '请填写 0.01 到 9999.99 元之间的价格',
    remainingQuantity: hasValidRemainingQuantity ? undefined : '限量库存可留空，或填写 1 到 10 的整数',
    imageUrl: payload.imageUrl ? undefined : '请上传菜品图片或填写可访问的图片 URL',
  }
}

function getMerchantFieldId(field: MerchantFormField) {
  return `merchant-application-${field}`
}

function getMenuItemFieldId(storeId: string, field: MenuItemFormField) {
  return `store-menu-${storeId}-${field}`
}

function getMerchantFieldClassName(hasError: boolean, className = '') {
  const classes = [className, hasError ? 'field-error' : ''].filter(Boolean)
  return classes.join(' ')
}

function padDateTimePart(value: number) {
  return String(value).padStart(2, '0')
}

function isValidBusinessTime(value: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value)
}

function businessTimeToMinutes(value: string) {
  if (!isValidBusinessTime(value)) return Number.NaN
  const [hours, minutes] = value.split(':').map(Number)
  return hours * 60 + minutes
}

function validateBusinessHours(businessHours: BusinessHours) {
  if (!isValidBusinessTime(businessHours.openTime) || !isValidBusinessTime(businessHours.closeTime)) {
    return '请填写有效的营业时间'
  }

  if (businessTimeToMinutes(businessHours.openTime) >= businessTimeToMinutes(businessHours.closeTime)) {
    return '打烊时间需晚于开业时间'
  }

  return undefined
}

function formatBusinessHours(businessHours: BusinessHours) {
  return `${businessHours.openTime} - ${businessHours.closeTime}`
}

function isStoreCurrentlyOpen(store: Store, currentTime = new Date()) {
  if (store.status === 'Revoked') {
    return false
  }

  const minutes = currentTime.getHours() * 60 + currentTime.getMinutes()
  const openMinutes = businessTimeToMinutes(store.businessHours.openTime)
  const closeMinutes = businessTimeToMinutes(store.businessHours.closeTime)
  if (!Number.isFinite(openMinutes) || !Number.isFinite(closeMinutes)) {
    return false
  }

  return minutes >= openMinutes && minutes < closeMinutes
}

function toDateTimeLocalValue(date: Date) {
  return `${date.getFullYear()}-${padDateTimePart(date.getMonth() + 1)}-${padDateTimePart(date.getDate())}T${padDateTimePart(date.getHours())}:${padDateTimePart(date.getMinutes())}`
}

function formatDateTimeLocalValue(value: string) {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed)
}

function ceilToMinute(date: Date) {
  const next = new Date(date)
  if (
    next.getSeconds() === 0 &&
    next.getMilliseconds() === 0
  ) {
    return next
  }

  next.setSeconds(0, 0)
  next.setMinutes(next.getMinutes() + 1)
  return next
}

function getTodayDeliveryWindow(now = new Date()) {
  const minimum = ceilToMinute(new Date(now.getTime() + MIN_SCHEDULE_LEAD_MINUTES * 60 * 1000))
  const cutoff = new Date(now)
  cutoff.setHours(23, 59, 0, 0)

  return {
    minimum,
    cutoff,
    isAvailable: minimum.getTime() <= cutoff.getTime(),
    minimumValue: toDateTimeLocalValue(minimum),
    cutoffValue: toDateTimeLocalValue(cutoff),
  }
}

function normalizeScheduledDeliveryAt(value: string) {
  if (!value) return ''
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString()
}

function validateScheduledDeliveryTime(value: string, now = new Date()) {
  if (!value) {
    return '请选择配送时间'
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return '配送时间格式不正确'
  }

  const { minimum, cutoff } = getTodayDeliveryWindow(now)

  if (parsed.getTime() < minimum.getTime()) {
    return '配送时间不得早于下单后 30 分钟'
  }

  if (parsed.getTime() > cutoff.getTime()) {
    return '配送时间仅支持预约到当天 23:59'
  }

  if (parsed.toDateString() !== now.toDateString()) {
    return '配送时间仅支持选择当天'
  }

  return null
}

function buildOrderPayload(
  customerId: string,
  store: Store,
  deliveryAddress: string,
  scheduledDeliveryTime: string,
  remark: string,
  couponId: string,
  quantities: Record<string, number>,
): CreateOrderRequest {
  const items = store.menu
    .map((item) => ({
      menuItemId: item.id,
      quantity: quantities[item.id] ?? 0,
    }))
    .filter((item) => item.quantity > 0)

  return {
    customerId,
    storeId: store.id,
    deliveryAddress: normalizeTextInput(deliveryAddress, 120),
    scheduledDeliveryAt: normalizeScheduledDeliveryAt(scheduledDeliveryTime),
    remark: normalizeTextInput(remark, 120) || undefined,
    couponId: couponId || undefined,
    items,
  }
}

function buildCustomerProfilePayload(name: string): UpdateCustomerProfileRequest {
  return {
    name: normalizeTextInput(name, 30),
  }
}

function buildCustomerAddressPayload(
  draft: CustomerAddressDraft,
): AddCustomerAddressRequest {
  return {
    label: normalizeTextInput(draft.label, 20),
    address: normalizeTextInput(draft.address, 120),
  }
}

function buildOrderChatPayload(body: string): SendOrderChatMessageRequest {
  return {
    body: normalizeTextInput(body, 240),
  }
}

function buildPartialRefundPayload(
  menuItemId: string,
  draft?: PartialRefundDraft,
): SubmitPartialRefundRequest {
  const nextDraft = draft ?? createInitialPartialRefundDraft()

  return {
    menuItemId,
    quantity: Math.max(1, Math.round(nextDraft.quantity)),
    reason: normalizeTextInput(nextDraft.reason, 160),
  }
}

function buildPartialRefundResolutionPayload(
  approved: boolean,
  resolutionNote: string,
): ResolvePartialRefundRequest {
  return {
    approved,
    resolutionNote:
      normalizeTextInput(resolutionNote, 160) ||
      (approved ? '确认缺货，已退该商品' : '当前商品仍可正常出餐'),
  }
}

function buildAfterSalesPayload(draft?: AfterSalesDraft): SubmitAfterSalesRequest {
  const nextDraft = draft ?? createInitialAfterSalesDraft()
  const expectedCompensationYuan = Number(nextDraft.expectedCompensationYuan)
  const expectedCompensationCents =
    nextDraft.requestType === 'CompensationRequest' &&
    Number.isFinite(expectedCompensationYuan) &&
    expectedCompensationYuan > 0
      ? Math.round(expectedCompensationYuan * 100)
      : undefined

  return {
    requestType: nextDraft.requestType,
    reason: normalizeTextInput(nextDraft.reason, 160),
    expectedCompensationCents,
  }
}

function validateCustomerAddressDraft(
  draft: CustomerAddressDraft,
): Partial<Record<CustomerAddressField, string>> {
  const payload = buildCustomerAddressPayload(draft)

  return {
    label: payload.label ? undefined : '请填写地址标签',
    address: payload.address ? undefined : '请填写地址内容',
  }
}

function buildRechargePayload(amountYuan: number): RechargeBalanceRequest {
  return {
    amountCents: Math.round(amountYuan * 100),
  }
}

function buildMerchantProfilePayload(
  draft: MerchantProfileDraft,
): UpdateMerchantProfileRequest {
  return {
    contactPhone: normalizeTextInput(draft.contactPhone, 20),
    payoutAccount: {
      accountType: draft.payoutAccountType,
      bankName:
        draft.payoutAccountType === 'bank'
          ? normalizeTextInput(draft.bankName, 30) || undefined
          : undefined,
      accountNumber: normalizeTextInput(draft.accountNumber, 60),
      accountHolder: normalizeTextInput(draft.accountHolder, 30),
    },
  }
}

function validateMerchantProfileDraft(
  draft: MerchantProfileDraft,
): Partial<Record<MerchantProfileFormField, string>> {
  const contactPhone = normalizeTextInput(draft.contactPhone, 20)
  const bankName = normalizeTextInput(draft.bankName, 30)
  const accountNumber = normalizeTextInput(draft.accountNumber, 60)
  const accountHolder = normalizeTextInput(draft.accountHolder, 30)

  return {
    contactPhone: !contactPhone
      ? '请填写联系电话'
      : /^[0-9+\- ]{6,20}$/.test(contactPhone)
        ? undefined
        : '联系电话格式不正确',
    bankName:
      draft.payoutAccountType === 'bank'
        ? bankName
          ? undefined
          : '请选择开户银行'
        : undefined,
    accountNumber: accountNumber ? undefined : draft.payoutAccountType === 'bank' ? '请填写银行卡号' : '请填写支付宝账号',
    accountHolder: accountHolder ? undefined : draft.payoutAccountType === 'bank' ? '请填写持卡人姓名' : '请填写账户姓名',
  }
}

function buildMerchantWithdrawPayload(amountYuan: number): WithdrawMerchantIncomeRequest {
  return {
    amountCents: Math.round(amountYuan * 100),
  }
}

function parseMerchantWithdrawAmount(value: string) {
  const sanitized = value.trim().replaceAll('，', ',').replaceAll(',', '')
  if (!sanitized) return null

  const amount = Number(sanitized)
  if (!Number.isFinite(amount)) return null

  return Math.round(amount * 100) / 100
}

function parseRechargeAmount(value: string) {
  const sanitized = value.trim().replaceAll('，', ',').replaceAll(',', '')
  if (!sanitized) return null

  const amount = Number(sanitized)
  if (!Number.isFinite(amount)) return null

  return Math.round(amount * 100) / 100
}

function buildReviewPayload(
  target: 'store' | 'rider',
  draft?: ReviewDraft,
): ReviewOrderRequest {
  const nextDraft = draft ?? createInitialReviewDraft()
  const comment = normalizeTextInput(nextDraft.comment, 160)
  const extraNote = normalizeTextInput(nextDraft.extraNote, 240)
  const submission = {
    rating: clampRating(nextDraft.rating),
    comment: comment || undefined,
    extraNote: extraNote || undefined,
  }

  return target === 'store'
    ? { storeReview: submission }
    : { riderReview: submission }
}

function buildReviewApplicationPayload(
  reviewNote: string,
): ReviewMerchantApplicationRequest {
  return {
    reviewNote: normalizeTextInput(reviewNote, 120) || '资料已核验',
  }
}

function buildResolutionPayload(
  draft?: ResolveTicketRequest,
): ResolveTicketRequest {
  const resolution = normalizeTextInput(draft?.resolution ?? '已回访用户', 60)
  const note = normalizeTextInput(draft?.note ?? '已联系相关角色并记录', 160)

  return {
    resolution: resolution || '已回访用户',
    note: note || '已联系相关角色并记录',
  }
}

function buildReviewAppealPayload(appellantRole: 'Merchant' | 'Rider', reason: string) {
  return {
    appellantRole,
    reason: normalizeTextInput(reason, 160) || '评价描述与实际履约情况不符',
  }
}

function buildAppealResolutionPayload(
  draft?: AppealResolutionDraft,
): AppealResolutionDraft {
  return {
    approved: draft?.approved ?? true,
    resolutionNote:
      normalizeTextInput(draft?.resolutionNote ?? '申诉成立，已撤销评价', 160) ||
      '申诉成立，已撤销评价',
  }
}

function buildEligibilityReviewPayload(
  target: 'Store' | 'Rider',
  targetId: string,
  reason: string,
) {
  return {
    target,
    targetId,
    reason: normalizeTextInput(reason, 160) || '已完成整改，希望发起复核',
  }
}

function formatAggregateRating(average: number, count: number) {
  return count > 0 ? `${average.toFixed(1)} / 5 (${count} 条)` : '暂无评分'
}

function getCategoryMeta(category: StoreCategory | string) {
  const visuals: Record<
    StoreCategory,
    {
      subtitle: string
      imageSrc: string
    }
  > = {
    中式快餐: {
      subtitle: '现炒现做，适合工作日快速点餐',
      imageSrc: '/category-images/chinese-fast-food.svg',
    },
    盖饭简餐: {
      subtitle: '盖饭便当一类，分量稳定',
      imageSrc: '/category-images/rice-meals.svg',
    },
    面馆粉档: {
      subtitle: '汤面拌面米粉档口集中',
      imageSrc: '/category-images/noodles.svg',
    },
    麻辣香锅: {
      subtitle: '重口味下饭，高峰期也常见',
      imageSrc: '/category-images/spicy-hotpot.svg',
    },
    饺子馄饨: {
      subtitle: '饺子、锅贴、馄饨等轻主食',
      imageSrc: '/category-images/dumplings.svg',
    },
    轻食沙拉: {
      subtitle: '低脂轻食、能量碗与沙拉',
      imageSrc: '/category-images/salad.svg',
    },
    咖啡甜点: {
      subtitle: '咖啡、蛋糕、烘焙下午茶',
      imageSrc: '/category-images/coffee-dessert.svg',
    },
    奶茶果饮: {
      subtitle: '奶茶果饮，适合加单补饮品',
      imageSrc: '/category-images/milk-tea.svg',
    },
    夜宵小吃: {
      subtitle: '烧烤炸物与夜间加餐',
      imageSrc: '/category-images/night-snacks.svg',
    },
  }

  const fallback = {
    subtitle: '浏览该分类下的可下单餐厅',
    imageSrc: '/category-images/chinese-fast-food.svg',
  }

  return visuals[category as StoreCategory] ?? fallback
}

function formatStoreStatus(status: Store['status']) {
  switch (status) {
    case 'Open':
      return '营业中'
    case 'Busy':
      return '高峰繁忙'
    case 'Revoked':
      return '暂停营业'
    default:
      return status
  }
}

function formatStoreAvailability(store: Store) {
  if (store.status === 'Revoked') {
    return formatStoreStatus(store.status)
  }

  return isStoreCurrentlyOpen(store) ? formatStoreStatus(store.status) : '休息中'
}

function isOrderReviewed(order: OrderSummary) {
  return order.storeRating != null && (order.riderId ? order.riderRating != null : true)
}

function hasPendingStoreReview(order: OrderSummary) {
  return order.storeRating == null
}

function hasPendingRiderReview(order: OrderSummary) {
  return order.riderId != null && order.riderRating == null
}

function getOrderReviewEligibilityTime(order: OrderSummary) {
  return (
    [...order.timeline].reverse().find((entry) => entry.status === 'Completed')?.at ?? order.updatedAt
  )
}

function canReviewOrder(order: OrderSummary, currentTime = Date.now()) {
  if (order.status !== 'Completed' || isOrderReviewed(order)) {
    return false
  }

  const reviewDeadline = new Date(getOrderReviewEligibilityTime(order)).getTime()
  const reviewWindowMs = REVIEW_WINDOW_DAYS * 24 * 60 * 60 * 1000
  return Number.isFinite(reviewDeadline) && currentTime - reviewDeadline <= reviewWindowMs
}

function getRemainingReviewDays(order: OrderSummary, currentTime = Date.now()) {
  const reviewStartTime = new Date(getOrderReviewEligibilityTime(order)).getTime()
  const reviewDeadline = reviewStartTime + REVIEW_WINDOW_DAYS * 24 * 60 * 60 * 1000
  if (!Number.isFinite(reviewStartTime)) {
    return 0
  }

  return Math.max(0, Math.ceil((reviewDeadline - currentTime) / (24 * 60 * 60 * 1000)))
}

export default function DeliveryConsole() {
  const location = useLocation()
  const navigate = useNavigate()
  const { orderId: routeOrderId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [session, setSession] = useState<AuthSession | null>(null)
  const [state, setState] = useState<DeliveryAppState | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [headerAction, setHeaderAction] = useState<HeaderAction>(null)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [selectedStoreCategory, setSelectedStoreCategory] = useState('')
  const [selectedStoreId, setSelectedStoreId] = useState('')
  const [selectedMerchantStoreId, setSelectedMerchantStoreId] = useState('')
  const [selectedRiderId, setSelectedRiderId] = useState('')
  const [customerStoreSearchDraft, setCustomerStoreSearchDraft] = useState('')
  const [customerStoreSearch, setCustomerStoreSearch] = useState('')
  const [customerStoreSearchHistory, setCustomerStoreSearchHistory] = useState<string[]>([])
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [deliveryAddressError, setDeliveryAddressError] = useState<string | null>(null)
  const [scheduledDeliveryTime, setScheduledDeliveryTime] = useState('')
  const [scheduledDeliveryError, setScheduledDeliveryError] = useState<string | null>(null)
  const [scheduledDeliveryTouched, setScheduledDeliveryTouched] = useState(false)
  const [remark, setRemark] = useState('')
  const [isCheckoutExpanded, setIsCheckoutExpanded] = useState(false)
  const [selectedCouponId, setSelectedCouponId] = useState('')
  const [customerNameDraft, setCustomerNameDraft] = useState('')
  const [addressDraft, setAddressDraft] = useState<CustomerAddressDraft>({
    label: '',
    address: '',
  })
  const [addressFormErrors, setAddressFormErrors] = useState<
    Partial<Record<CustomerAddressField, string>>
  >({})
  const [customRechargeAmount, setCustomRechargeAmount] = useState('')
  const [selectedRechargeAmount, setSelectedRechargeAmount] = useState<number | null>(null)
  const [merchantProfileDraft, setMerchantProfileDraft] = useState<MerchantProfileDraft>(
    createInitialMerchantProfileDraft(),
  )
  const [merchantProfileFormErrors, setMerchantProfileFormErrors] = useState<
    Partial<Record<MerchantProfileFormField, string>>
  >({})
  const [merchantWithdrawAmount, setMerchantWithdrawAmount] = useState('')
  const [merchantWithdrawFieldError, setMerchantWithdrawFieldError] = useState<string | null>(null)
  const [rechargeFieldError, setRechargeFieldError] = useState<string | null>(null)
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [orderChatDrafts, setOrderChatDrafts] = useState<Record<string, string>>({})
  const [orderChatErrors, setOrderChatErrors] = useState<Record<string, string>>({})
  const [reviewDrafts, setReviewDrafts] = useState<Record<string, ReviewDraft>>({})
  const [reviewErrors, setReviewErrors] = useState<Record<string, string>>({})
  const [partialRefundDrafts, setPartialRefundDrafts] = useState<Record<string, PartialRefundDraft>>({})
  const [partialRefundErrors, setPartialRefundErrors] = useState<Record<string, string>>({})
  const [afterSalesDrafts, setAfterSalesDrafts] = useState<Record<string, AfterSalesDraft>>({})
  const [afterSalesErrors, setAfterSalesErrors] = useState<Record<string, string>>({})
  const [partialRefundResolutionDrafts, setPartialRefundResolutionDrafts] = useState<Record<string, string>>({})
  const [merchantDraft, setMerchantDraft] = useState<MerchantDraft>(
    createInitialMerchantDraft(),
  )
  const [merchantFormErrors, setMerchantFormErrors] = useState<
    Partial<Record<MerchantFormField, string>>
  >({})
  const [isMerchantImageUploading, setIsMerchantImageUploading] = useState(false)
  const [menuItemDrafts, setMenuItemDrafts] = useState<Record<string, MenuItemDraft>>({})
  const [menuComposerOpen, setMenuComposerOpen] = useState<Record<string, boolean>>({})
  const [menuItemFormErrors, setMenuItemFormErrors] = useState<
    Record<string, Partial<Record<MenuItemFormField, string>>>
  >({})
  const [menuItemImageUploading, setMenuItemImageUploading] = useState<Record<string, boolean>>({})
  const [applicationReviewDrafts, setApplicationReviewDrafts] = useState<
    Record<string, string>
  >({})
  const [resolutionDrafts, setResolutionDrafts] = useState<
    Record<string, ResolveTicketRequest>
  >({})
  const [merchantAppealDrafts, setMerchantAppealDrafts] = useState<Record<string, string>>({})
  const [riderAppealDrafts, setRiderAppealDrafts] = useState<Record<string, string>>({})
  const [appealResolutionDrafts, setAppealResolutionDrafts] = useState<
    Record<string, AppealResolutionDraft>
  >({})
  const [eligibilityReviewDrafts, setEligibilityReviewDrafts] = useState<
    Record<string, string>
  >({})
  const [eligibilityResolutionDrafts, setEligibilityResolutionDrafts] = useState<
    Record<string, AppealResolutionDraft>
  >({})
  const lastCustomerDraftSyncIdRef = useRef<string | null>(null)
  const lastMerchantProfileDraftSyncIdRef = useRef<string | null>(null)
  const role = session?.user.role ?? 'customer'
  const customerWorkspaceView: CustomerWorkspaceView =
    location.pathname.startsWith('/customer/review/')
      ? 'review'
      : location.pathname.startsWith('/customer/orders/')
        ? 'order-detail'
      : location.pathname === '/customer/profile/recharge'
        ? 'recharge'
      : location.pathname === '/customer/profile/coupons'
        ? 'coupons'
      : location.pathname === '/customer/profile/addresses'
        ? 'addresses'
      : location.pathname === '/customer/profile'
        ? 'profile'
      : location.pathname === '/customer/orders'
        ? 'orders'
        : 'order'
  const merchantWorkspaceView: MerchantWorkspaceView =
    location.pathname === '/merchant/application'
      ? 'application'
      : location.pathname === '/merchant/profile'
        ? 'profile'
        : 'console'
  const merchantApplicationView = (searchParams.get('merchantView') ??
    'submit') as MerchantApplicationView

  useEffect(() => {
    void restoreSession()
  }, [])

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CUSTOMER_STORE_SEARCH_HISTORY_KEY)
      if (!stored) return

      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        setCustomerStoreSearchHistory(
          parsed.filter((entry): entry is string => typeof entry === 'string').slice(0, 10),
        )
      }
    } catch {
      window.localStorage.removeItem(CUSTOMER_STORE_SEARCH_HISTORY_KEY)
    }
  }, [])

  useEffect(() => {
    if (!session) return
    void loadState()
  }, [session])

  useEffect(() => {
    if (!state || !session) return

    if (session.user.role === 'customer' && session.user.linkedProfileId) {
      const customer = state.customers.find(
        (entry) => entry.id === session.user.linkedProfileId,
      )
      if (customer) {
        setSelectedCustomerId(customer.id)
        setDeliveryAddress(customer.defaultAddress)
        setDeliveryAddressError(null)
      }
    } else if (!selectedCustomerId && state.customers.length > 0) {
      const customer = state.customers[0]
      setSelectedCustomerId(customer.id)
      setDeliveryAddress(customer.defaultAddress)
      setDeliveryAddressError(null)
    }

    if (session.user.role === 'merchant') {
      setMerchantDraft((current) => ({
        ...current,
        merchantName: session.user.displayName,
      }))
    }

    if (session.user.role !== 'customer' && !selectedStoreId && state.stores.length > 0) {
      const store = state.stores[0]
      setSelectedStoreId(store.id)
      setQuantities(getInitialQuantities(store))
    }

    if (session.user.role === 'rider' && session.user.linkedProfileId) {
      setSelectedRiderId(session.user.linkedProfileId)
    } else if (!selectedRiderId && state.riders.length > 0) {
      setSelectedRiderId(state.riders[0].id)
    }
  }, [selectedCustomerId, selectedRiderId, selectedStoreId, session, state])

  useEffect(() => {
    if (!session) return

    if (session.user.role === 'customer') {
      if (
        location.pathname !== '/customer/profile/addresses' &&
        !location.pathname.startsWith('/customer/')
      ) {
        navigate('/customer/order', { replace: true })
      }
      return
    }

    if (session.user.role === 'merchant') {
      if (!location.pathname.startsWith('/merchant/')) {
        navigate('/merchant/application?merchantView=submit', { replace: true })
      }
      return
    }

    if (location.pathname.startsWith('/customer/') || location.pathname.startsWith('/merchant/')) {
      navigate('/', { replace: true })
    }
  }, [location.pathname, navigate, session])

  useEffect(() => {
    if (!state || !session || session.user.role !== 'customer') return
    if (location.pathname !== '/customer/order') return

    const storeIdFromUrl = searchParams.get('store') ?? ''
    const store = state.stores.find((entry) => entry.id === storeIdFromUrl)
    const nextStoreId = store?.id ?? ''

    if (nextStoreId === selectedStoreId) {
      if (store?.category && store.category !== selectedStoreCategory) {
        setSelectedStoreCategory(store.category)
      }
      return
    }

    setSelectedStoreId(nextStoreId)
    setSelectedStoreCategory(store?.category ?? '')
    setQuantities(getInitialQuantities(store))
  }, [location.pathname, searchParams, selectedStoreCategory, selectedStoreId, session, state])

  const activeCustomerId =
    session?.user.role === 'customer' && session.user.linkedProfileId
      ? session.user.linkedProfileId
      : selectedCustomerId
  const selectedStore = state?.stores.find((store) => store.id === selectedStoreId)
  const selectedCustomer = state?.customers.find((customer) => customer.id === activeCustomerId)
  const merchantStores =
    state?.stores.filter((store) =>
      session?.user.role === 'merchant'
        ? store.merchantName === session.user.displayName
        : true,
    ) ?? []
  const merchantProfile: MerchantProfile | undefined =
    state?.merchantProfiles.find(
      (profile) => profile.merchantName === session?.user.displayName,
    )
  useEffect(() => {
    if (!session || session.user.role !== 'merchant') return
    if (!selectedMerchantStoreId) return
    if (merchantWorkspaceView !== 'console') {
      setSelectedMerchantStoreId('')
      return
    }
    if (merchantStores.some((store) => store.id === selectedMerchantStoreId)) return
    setSelectedMerchantStoreId('')
  }, [merchantStores, merchantWorkspaceView, selectedMerchantStoreId, session])
  const selectedRider = state?.riders.find((rider) => rider.id === selectedRiderId)
  const riderOrders =
    state?.orders.filter((order) =>
      session?.user.role === 'rider'
        ? order.status === 'ReadyForPickup' || order.riderId === session.user.linkedProfileId
        : order.status === 'ReadyForPickup' || order.riderId === selectedRiderId,
    ) ?? []
  const customerOrders =
    state?.orders.filter((order) => order.customerId === activeCustomerId) ?? []
  const completedCustomerOrders = customerOrders.filter(
    (order) => order.status === 'Completed',
  )
  const pendingCustomerReviewOrders = completedCustomerOrders.filter(
    (order) => canReviewOrder(order),
  )
  const activeCustomerOrder =
    customerOrders.find((order) => order.id === routeOrderId) ?? null
  const activeReviewOrder =
    customerOrders.find((order) => order.id === routeOrderId) ?? null
  const pendingApplications =
    state?.merchantApplications.filter((entry) => entry.status === 'Pending') ?? []
  const merchantPendingApplications =
    state?.merchantApplications.filter(
      (entry) =>
        entry.merchantName === session?.user.displayName && entry.status === 'Pending',
    ) ?? []
  const merchantReviewedApplications =
    state?.merchantApplications.filter(
      (entry) =>
        entry.merchantName === session?.user.displayName && entry.status !== 'Pending',
    ) ?? []
  const pendingAppeals =
    state?.reviewAppeals.filter((entry) => entry.status === 'Pending') ?? []
  const pendingEligibilityReviews =
    state?.eligibilityReviews.filter((entry) => entry.status === 'Pending') ?? []
  const normalizedCustomerStoreSearch = customerStoreSearch.trim().toLowerCase()
  const visibleStores =
    state?.stores
      .filter((store) =>
        normalizedCustomerStoreSearch
          ? store.name.toLowerCase().includes(normalizedCustomerStoreSearch) ||
            store.merchantName.toLowerCase().includes(normalizedCustomerStoreSearch)
          : true,
      )
      .slice()
      .sort((left, right) =>
        right.averageRating - left.averageRating || right.ratingCount - left.ratingCount,
      ) ?? []
  const storeCategories = STORE_CATEGORIES
  const categoryStores = visibleStores.filter((store) => store.category === selectedStoreCategory)
  const selectedStoreIsOpen = selectedStore ? isStoreCurrentlyOpen(selectedStore) : false

  useEffect(() => {
    if (!selectedCustomer) return
    if (lastCustomerDraftSyncIdRef.current === selectedCustomer.id) return
    lastCustomerDraftSyncIdRef.current = selectedCustomer.id
    setCustomerNameDraft(selectedCustomer.name)
  }, [selectedCustomer])

  useEffect(() => {
    if (!merchantProfile) return
    if (lastMerchantProfileDraftSyncIdRef.current === merchantProfile.id) return
    lastMerchantProfileDraftSyncIdRef.current = merchantProfile.id
    setMerchantProfileDraft({
      contactPhone: merchantProfile.contactPhone,
      payoutAccountType: merchantProfile.payoutAccount?.accountType ?? 'alipay',
      bankName: merchantProfile.payoutAccount?.bankName ?? '',
      accountNumber: merchantProfile.payoutAccount?.accountNumber ?? '',
      accountHolder: merchantProfile.payoutAccount?.accountHolder ?? '',
    })
    setMerchantProfileFormErrors({})
  }, [merchantProfile])

  useEffect(() => {
    if (!session) return

    const timer = window.setInterval(() => {
      void syncStateSilently()
    }, STATE_POLL_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [session])

  useEffect(() => {
    const keyword = customerStoreSearch.trim()
    if (!keyword) return

    setCustomerStoreSearchHistory((current) => {
      const normalized = keyword.toLowerCase()
      const next = [keyword, ...current.filter((entry) => entry.toLowerCase() !== normalized)].slice(0, 10)
      window.localStorage.setItem(CUSTOMER_STORE_SEARCH_HISTORY_KEY, JSON.stringify(next))
      return next
    })
  }, [customerStoreSearch])

  function submitCustomerStoreSearch(keyword?: string) {
    const nextKeyword = (keyword ?? customerStoreSearchDraft).trim()
    setCustomerStoreSearchDraft(nextKeyword)
    setCustomerStoreSearch(nextKeyword)
  }

  function clearCustomerStoreSearchHistory() {
    setCustomerStoreSearchHistory([])
    window.localStorage.removeItem(CUSTOMER_STORE_SEARCH_HISTORY_KEY)
  }

  function removeCustomerStoreSearchHistoryItem(keyword: string) {
    setCustomerStoreSearchHistory((current) => {
      const next = current.filter((entry) => entry !== keyword)
      if (next.length === 0) {
        window.localStorage.removeItem(CUSTOMER_STORE_SEARCH_HISTORY_KEY)
      } else {
        window.localStorage.setItem(CUSTOMER_STORE_SEARCH_HISTORY_KEY, JSON.stringify(next))
      }
      return next
    })
  }

  useEffect(() => {
    if (customerWorkspaceView !== 'review') return
    if (activeReviewOrder && canReviewOrder(activeReviewOrder)) {
      return
    }
    navigate('/customer/orders', { replace: true })
  }, [activeReviewOrder, customerWorkspaceView, navigate])

  useEffect(() => {
    if (customerWorkspaceView !== 'order-detail') return
    if (activeCustomerOrder) {
      return
    }
    navigate('/customer/orders', { replace: true })
  }, [activeCustomerOrder, customerWorkspaceView, navigate])

  async function restoreSession() {
    try {
      const nextSession = await deliveryApi.getSession()
      setSession(nextSession)
      setError(null)
    } catch {
      clearSessionToken()
      setSession(null)
    }
  }

  async function loadState() {
    setHeaderAction('refresh')
    setBusy(true)
    try {
      const nextState = await deliveryApi.getState()
      setState(nextState)
      setError(null)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : '加载失败')
    } finally {
      setBusy(false)
      setHeaderAction(null)
    }
  }

  async function syncStateSilently() {
    try {
      const nextState = await deliveryApi.getState()
      setState(nextState)
    } catch {
      // Keep the current screen stable during background sync attempts.
    }
  }

  async function logout() {
    setHeaderAction('logout')
    setShowLogoutModal(true)
    setBusy(true)
    try {
      await waitForNextPaint()
      await deliveryApi.logout()
    } catch {
      // Ignore logout failures and clear local session anyway.
    } finally {
      await new Promise((resolve) => window.setTimeout(resolve, LOGOUT_TRANSITION_MS))
      clearSessionToken()
      setBusy(false)
      setSession(null)
      setState(null)
      setError(null)
      setHeaderAction(null)
      setShowLogoutModal(false)
    }
  }

  useEffect(() => {
    const nextCartSubtotal = selectedStore
      ? selectedStore.menu.reduce(
          (sum, item) => sum + item.priceCents * (quantities[item.id] ?? 0),
          0,
        )
      : 0

    if (!selectedCustomer || nextCartSubtotal <= 0) {
      if (selectedCouponId) {
        setSelectedCouponId('')
      }
      return
    }

    const couponStillUsable = selectedCustomer.coupons.some(
      (coupon) => coupon.id === selectedCouponId && nextCartSubtotal >= coupon.minimumSpendCents,
    )
    if (!couponStillUsable && selectedCouponId) {
      setSelectedCouponId('')
    }
  }, [quantities, selectedCouponId, selectedCustomer, selectedStore])

  if (!session) {
    return <AuthScreen onAuthenticated={setSession} />
  }

  const currentSession = session
  const currentDisplayName =
    currentSession.user.role === 'customer'
      ? (selectedCustomer?.name ?? currentSession.user.displayName)
      : currentSession.user.displayName

  async function runAction(action: () => Promise<DeliveryAppState>) {
    setBusy(true)
    try {
      const nextState = await action()
      setState(nextState)
      setError(null)
      return true
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : '操作失败')
      return false
    } finally {
      setBusy(false)
    }
  }

  function onStoreChange(storeId: string) {
    const store = state?.stores.find((entry) => entry.id === storeId)
    if (store?.category) {
      setSelectedStoreCategory(store.category)
    }
    setSelectedStoreId(storeId)
    setQuantities(getInitialQuantities(store))
  }

  function chooseStoreCategory(category: string) {
    setSelectedStoreCategory(category)
    setSelectedStoreId('')
    setQuantities({})
    setError(null)
    setSearchParams({})
  }

  function resetStoreCategory() {
    setSelectedStoreCategory('')
    setSelectedStoreId('')
    setQuantities({})
    setError(null)
    setSearchParams({})
  }

  function enterStore(storeId: string) {
    onStoreChange(storeId)
    setSearchParams({ store: storeId })
  }

  function leaveStore() {
    setSelectedStoreId('')
    setQuantities({})
    setError(null)
    setSearchParams({})
  }

  function changeMerchantApplicationView(view: MerchantApplicationView) {
    setSearchParams({ merchantView: view })
    setError(null)
  }

  function leaveMerchantStore() {
    setError(null)
    setSelectedMerchantStoreId('')
  }

  function enterMerchantStore(storeId: string) {
    setError(null)
    setSelectedMerchantStoreId(storeId)
  }

  function updateQuantity(menuItem: MenuItem, nextValue: number) {
    const nextQuantity = Math.max(0, nextValue)
    const remainingQuantity = menuItem.remainingQuantity
    const hasStockLimit = remainingQuantity != null
    const cappedQuantity =
      !hasStockLimit
        ? nextQuantity
        : Math.min(nextQuantity, Math.max(remainingQuantity, 0))

    setQuantities((current) => ({
      ...current,
      [menuItem.id]: cappedQuantity,
    }))

    if (hasStockLimit && nextQuantity > remainingQuantity) {
      setError(`${menuItem.name} 当前仅剩 ${remainingQuantity} 份`)
    } else {
      setError(null)
    }
  }

  async function submitOrder() {
    if (!selectedStore || !selectedCustomer) return
    if (!selectedStoreIsOpen) {
      setError(`当前店铺营业时间为 ${formatBusinessHours(selectedStore.businessHours)}，暂不可下单`)
      return
    }

    const latestDeliveryWindow = getTodayDeliveryWindow()
    let nextScheduledDeliveryTime = scheduledDeliveryTime || latestDeliveryWindow.minimumValue
    const scheduleError = validateScheduledDeliveryTime(nextScheduledDeliveryTime)
    if (scheduleError) {
      if (
        scheduleError === '配送时间不得早于下单后 30 分钟' &&
        latestDeliveryWindow.isAvailable
      ) {
        nextScheduledDeliveryTime = latestDeliveryWindow.minimumValue
        setScheduledDeliveryTime(nextScheduledDeliveryTime)

        if (scheduledDeliveryTouched) {
          const message = `你选择的配送时间已失效，已顺延到当前最早可选时间 ${formatDateTimeLocalValue(nextScheduledDeliveryTime)}，请确认后再次提交`
          setScheduledDeliveryError(message)
          return
        }
      } else {
        setScheduledDeliveryError(scheduleError)
        return
      }
    }
    setScheduledDeliveryError(null)

    const payload = buildOrderPayload(
      selectedCustomer.id,
      selectedStore,
      deliveryAddress,
      nextScheduledDeliveryTime,
      remark,
      selectedCoupon?.id ?? '',
      quantities,
    )

    if (payload.items.length === 0) {
      setError('请至少选择一份菜品')
      return
    }

    if (!payload.deliveryAddress) {
      setDeliveryAddressError('请选择配送地址')
      return
    }
    setDeliveryAddressError(null)

    if (!payload.scheduledDeliveryAt) {
      setScheduledDeliveryError('请选择有效的配送时间')
      return
    }

    if (selectedCustomer.balanceCents < payableTotalCents) {
      setError('账户余额不足，请先充值后再提交订单')
      return
    }

    const success = await runAction(() => deliveryApi.createOrder(payload))
    if (!success) return

    setRemark('')
    setScheduledDeliveryTime(todayDeliveryWindow.minimumValue)
    setScheduledDeliveryTouched(false)
    setQuantities(getInitialQuantities(selectedStore))
    setIsCheckoutExpanded(false)
    setSelectedCouponId('')
  }

  async function submitOrderChatMessage(orderId: string) {
    const payload = buildOrderChatPayload(orderChatDrafts[orderId] ?? '')
    if (!payload.body) {
      setOrderChatErrors((current) => ({ ...current, [orderId]: '消息内容不能为空' }))
      return
    }
    setOrderChatErrors((current) => {
      const next = { ...current }
      delete next[orderId]
      return next
    })

    const success = await runAction(() =>
      deliveryApi.sendOrderChatMessage(orderId, payload),
    )
    if (!success) return

    setOrderChatDrafts((current) => ({
      ...current,
      [orderId]: '',
    }))
  }

  function getRemainingRefundableQuantity(order: OrderSummary, menuItemId: string) {
    const item = order.items.find((entry) => entry.menuItemId === menuItemId)
    if (!item) return 0

    const pendingQuantity = order.partialRefundRequests
      .filter((refund) => refund.menuItemId === menuItemId && refund.status === 'Pending')
      .reduce((sum, refund) => sum + refund.quantity, 0)

    return Math.max(0, item.quantity - item.refundedQuantity - pendingQuantity)
  }

  function canSubmitPartialRefund(order: OrderSummary) {
    return order.status === 'PendingMerchantAcceptance' || order.status === 'Preparing'
  }

  async function submitPartialRefundRequest(orderId: string, menuItemId: string) {
    const order = state?.orders.find((entry) => entry.id === orderId)
    if (!order || !canSubmitPartialRefund(order)) {
      setError('当前订单阶段不能申请缺货退款')
      return
    }

    const draftKey = `${orderId}-${menuItemId}`
    const payload = buildPartialRefundPayload(menuItemId, partialRefundDrafts[draftKey])
    const remainingQuantity = getRemainingRefundableQuantity(order, menuItemId)

    if (!payload.reason) {
      const message = '请先填写退款原因，再提交申请'
      setPartialRefundErrors((current) => ({ ...current, [draftKey]: message }))
      return
    }

    if (payload.quantity > remainingQuantity) {
      const message = `该菜品最多还能申请退款 ${remainingQuantity} 份`
      setPartialRefundErrors((current) => ({ ...current, [draftKey]: message }))
      return
    }

    const success = await runAction(() => deliveryApi.submitPartialRefundRequest(orderId, payload))
    if (!success) return

    setPartialRefundDrafts((current) => {
      const next = { ...current }
      delete next[draftKey]
      return next
    })
    setPartialRefundErrors((current) => {
      const next = { ...current }
      delete next[draftKey]
      return next
    })
  }

  async function submitAfterSalesRequest(orderId: string) {
    const order = state?.orders.find((entry) => entry.id === orderId)
    if (!order) {
      setError('订单不存在')
      return
    }

    const draft = afterSalesDrafts[orderId] ?? createInitialAfterSalesDraft()
    const payload = buildAfterSalesPayload(draft)

    if (!payload.reason) {
      setAfterSalesErrors((current) => ({ ...current, [orderId]: '请先填写售后原因' }))
      return
    }

    if (
      payload.requestType === 'CompensationRequest' &&
      (!payload.expectedCompensationCents || payload.expectedCompensationCents <= 0)
    ) {
      setAfterSalesErrors((current) => ({ ...current, [orderId]: '请填写期望赔偿金额' }))
      return
    }

    setAfterSalesErrors((current) => {
      const next = { ...current }
      delete next[orderId]
      return next
    })

    const success = await runAction(() => deliveryApi.submitAfterSalesRequest(orderId, payload))
    if (!success) return

    setAfterSalesDrafts((current) => ({
      ...current,
      [orderId]: createInitialAfterSalesDraft(),
    }))
  }

  async function resolvePartialRefundRequest(refundId: string, approved: boolean) {
    const payload = buildPartialRefundResolutionPayload(
      approved,
      partialRefundResolutionDrafts[refundId] ?? '',
    )

    const success = await runAction(() =>
      deliveryApi.resolvePartialRefundRequest(refundId, payload),
    )
    if (!success) return

    setPartialRefundResolutionDrafts((current) => {
      const next = { ...current }
      delete next[refundId]
      return next
    })
  }

  function openCheckout() {
    if (!selectedStore || !selectedCustomer) return
    if (!selectedStoreIsOpen) {
      setError(`当前店铺营业时间为 ${formatBusinessHours(selectedStore.businessHours)}，暂不可下单`)
      return
    }
    const selectedItems = selectedStore.menu.filter((item) => (quantities[item.id] ?? 0) > 0)
    if (selectedItems.length === 0) {
      setError('请至少选择一份菜品')
      return
    }

    if (!todayDeliveryWindow.isAvailable) {
      setError('今天剩余时间不足 30 分钟，无法再预约当天配送')
      return
    }

    setError(null)
    if (validateScheduledDeliveryTime(scheduledDeliveryTime) !== null) {
      setScheduledDeliveryTime(todayDeliveryWindow.minimumValue)
      setScheduledDeliveryError(null)
      setScheduledDeliveryTouched(false)
    }
    setIsCheckoutExpanded(true)
  }

  async function submitMerchantApplication() {
    const payload = buildMerchantRegistrationPayload(merchantDraft)
    const nextErrors = validateMerchantDraft(merchantDraft)
    const firstInvalidField = (
      ['merchantName', 'storeName', 'category', 'openTime', 'closeTime', 'imageUrl'] as MerchantFormField[]
    ).find((field) => nextErrors[field])

    setMerchantFormErrors(nextErrors)

    if (firstInvalidField) {
      document
        .getElementById(getMerchantFieldId(firstInvalidField))
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    if (isMerchantImageUploading) {
      setError('图片仍在上传，请稍后再提交')
      return
    }

    await runAction(() => deliveryApi.submitMerchantApplication(payload))
    setMerchantDraft(createInitialMerchantDraft(currentSession.user.displayName))
    setMerchantFormErrors({})
  }

  function updateReviewDraft(orderId: string, patch: Partial<ReviewDraft>) {
    setReviewDrafts((current) => ({
      ...current,
      [orderId]: {
        ...(current[orderId] ?? createInitialReviewDraft()),
        ...patch,
      },
    }))
    setReviewErrors((current) => {
      if (!current[orderId]) return current
      const next = { ...current }
      delete next[orderId]
      return next
    })
  }

  async function submitReview(orderId: string, target: 'store' | 'rider') {
    const order = state?.orders.find((entry) => entry.id === orderId)
    const draftKey = `${orderId}-${target}`
    const draft = reviewDrafts[draftKey] ?? createInitialReviewDraft()
    if (!order || !canReviewOrder(order)) {
      setError(`只能评价最近 ${REVIEW_WINDOW_DAYS} 天内完成且仍有待评价项的订单`)
      navigate('/customer/orders')
      return
    }

    if (target === 'store' && !hasPendingStoreReview(order)) {
      setError('商家评价已经提交过了')
      return
    }

    if (target === 'rider' && !hasPendingRiderReview(order)) {
      setError('当前没有待提交的骑手评价')
      return
    }

    if (draft.rating < 5 && !normalizeTextInput(draft.comment, 160)) {
      const message = '当前是非 5 星评价，必须填写理由才能提交'
      setReviewErrors((current) => ({
        ...current,
        [draftKey]: message,
      }))
      return
    }

    const success = await runAction(() =>
      deliveryApi.reviewOrder(orderId, buildReviewPayload(target, draft)),
    )

    if (!success) return

    setReviewDrafts((current) => {
      const nextDrafts = { ...current }
      delete nextDrafts[draftKey]
      return nextDrafts
    })
    setReviewErrors((current) => {
      const next = { ...current }
      delete next[draftKey]
      return next
    })
  }

  function getMenuItemDraft(storeId: string) {
    return menuItemDrafts[storeId] ?? createInitialMenuItemDraft()
  }

  function isMenuItemImageUploading(storeId: string) {
    return menuItemImageUploading[storeId] ?? false
  }

  function isMenuComposerExpanded(storeId: string) {
    return menuComposerOpen[storeId] ?? false
  }

  async function submitStoreMenuItem(storeId: string) {
    const draft = getMenuItemDraft(storeId)
    const payload = buildMenuItemPayload(draft)
    const nextErrors = validateMenuItemDraft(draft)
    const firstInvalidField = (
      ['name', 'description', 'priceYuan', 'remainingQuantity', 'imageUrl'] as MenuItemFormField[]
    ).find((field) => nextErrors[field])

    setMenuItemFormErrors((current) => ({
      ...current,
      [storeId]: nextErrors,
    }))

    if (firstInvalidField) {
      document
        .getElementById(getMenuItemFieldId(storeId, firstInvalidField))
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    if (isMenuItemImageUploading(storeId)) {
      setError('菜品图片仍在上传，请稍后再提交')
      return
    }

    const success = await runAction(() => deliveryApi.addStoreMenuItem(storeId, payload))
    if (!success) return

    setMenuItemDrafts((current) => ({
      ...current,
      [storeId]: createInitialMenuItemDraft(),
    }))
    setMenuItemFormErrors((current) => ({
      ...current,
      [storeId]: {},
    }))
    setMenuComposerOpen((current) => ({
      ...current,
      [storeId]: false,
    }))
  }

  async function uploadMerchantImage(file?: File) {
    if (!file) return

    setIsMerchantImageUploading(true)
    try {
      const uploaded = await deliveryApi.uploadMerchantStoreImage(file)
      setMerchantDraft((current) => ({
        ...current,
        imageUrl: uploaded.url,
        uploadedImageName: file.name,
      }))
      setError(null)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : '图片上传失败')
    } finally {
      setIsMerchantImageUploading(false)
    }
  }

  async function uploadStoreMenuImage(storeId: string, file?: File) {
    if (!file) return

    setMenuItemImageUploading((current) => ({
      ...current,
      [storeId]: true,
    }))
    try {
      const uploaded = await deliveryApi.uploadMerchantStoreImage(file)
      setMenuItemDrafts((current) => ({
        ...current,
        [storeId]: {
          ...(current[storeId] ?? createInitialMenuItemDraft()),
          imageUrl: uploaded.url,
          uploadedImageName: file.name,
        },
      }))
      setMenuItemFormErrors((current) => ({
        ...current,
        [storeId]: {
          ...(current[storeId] ?? {}),
          imageUrl: undefined,
        },
      }))
      setError(null)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : '菜品图片上传失败')
    } finally {
      setMenuItemImageUploading((current) => ({
        ...current,
        [storeId]: false,
      }))
    }
  }

  async function saveCustomerName() {
    if (!selectedCustomer) return

    const payload = buildCustomerProfilePayload(customerNameDraft)
    if (!payload.name) {
      setError('用户名不能为空')
      return
    }

    const success = await runAction(() =>
      deliveryApi.updateCustomerProfile(selectedCustomer.id, payload),
    )
    if (!success) return

    setSession((current) =>
      current
        ? {
            ...current,
            user: {
              ...current.user,
              displayName: payload.name,
            },
          }
        : current,
    )
  }

  async function addCustomerAddress() {
    if (!selectedCustomer) return

    const payload = buildCustomerAddressPayload(addressDraft)
    const nextErrors = validateCustomerAddressDraft(addressDraft)
    setAddressFormErrors(nextErrors)

    if (nextErrors.label || nextErrors.address) {
      return
    }

    await runAction(() => deliveryApi.addCustomerAddress(selectedCustomer.id, payload))
    setAddressDraft({ label: '', address: '' })
    setAddressFormErrors({})
  }

  async function removeCustomerAddress(address: string) {
    if (!selectedCustomer) return
    if (!address.trim()) return

    const success = await runAction(() =>
      deliveryApi.removeCustomerAddress(selectedCustomer.id, {
        address,
      }),
    )
    if (!success) return
  }

  async function setDefaultCustomerAddress(address: string) {
    if (!selectedCustomer) return
    if (!address.trim() || selectedCustomer.defaultAddress === address) return

    const success = await runAction(() =>
      deliveryApi.setDefaultCustomerAddress(selectedCustomer.id, {
        address,
      }),
    )
    if (!success) return

    setDeliveryAddress(address)
  }

  async function rechargeCustomerBalance(amountYuan: number) {
    if (!selectedCustomer) return
    if (!Number.isFinite(amountYuan) || amountYuan <= 0) {
      setRechargeFieldError('请输入有效充值金额')
      return
    }

    if (amountYuan > 5000) {
      setRechargeFieldError('单次充值金额不能超过 5000 元')
      return
    }
    setRechargeFieldError(null)

    await runAction(() =>
      deliveryApi.rechargeCustomerBalance(
        selectedCustomer.id,
        buildRechargePayload(amountYuan),
      ),
    )
    setCustomRechargeAmount('')
    setSelectedRechargeAmount(null)
    navigate('/customer/profile')
  }

  async function saveMerchantProfile() {
    const payload = buildMerchantProfilePayload(merchantProfileDraft)
    const nextErrors = validateMerchantProfileDraft(merchantProfileDraft)
    setMerchantProfileFormErrors(nextErrors)

    if (nextErrors.contactPhone || nextErrors.bankName || nextErrors.accountNumber || nextErrors.accountHolder) {
      return
    }

    await runAction(() => deliveryApi.updateMerchantProfile(payload))
  }

  async function withdrawMerchantIncome() {
    if (!merchantProfile) return

    const amount = parseMerchantWithdrawAmount(merchantWithdrawAmount)
    if (amount === null || amount <= 0) {
      setMerchantWithdrawFieldError('请输入有效提现金额')
      return
    }

    if (amount > 50000) {
      setMerchantWithdrawFieldError('单次提现金额不能超过 50000 元')
      return
    }

    if (Math.round(amount * 100) > merchantProfile.availableToWithdrawCents) {
      setMerchantWithdrawFieldError('提现金额不能超过当前可提现余额')
      return
    }
    setMerchantWithdrawFieldError(null)

    const success = await runAction(() =>
      deliveryApi.withdrawMerchantIncome(buildMerchantWithdrawPayload(amount)),
    )
    if (!success) return

    setMerchantWithdrawAmount('')
  }

  function openRechargePage() {
    setCustomRechargeAmount(String(RECHARGE_PRESET_AMOUNTS[0]))
    setSelectedRechargeAmount(RECHARGE_PRESET_AMOUNTS[0])
    setRechargeFieldError(null)
    navigate('/customer/profile/recharge')
  }

  function selectRechargeAmount(amount: number) {
    setSelectedRechargeAmount(amount)
    setCustomRechargeAmount(String(amount))
    setRechargeFieldError(null)
  }

  async function submitRechargeFromPage() {
    const amount = parseRechargeAmount(customRechargeAmount)
    if (amount === null) {
      setRechargeFieldError('请输入有效充值金额')
      return
    }

    setSelectedRechargeAmount(amount)
    await rechargeCustomerBalance(amount)
  }

  const parsedRechargeAmount = parseRechargeAmount(customRechargeAmount)
  const rechargeAmountError =
    parsedRechargeAmount !== null && parsedRechargeAmount > 5000
      ? '自定义金额不能超过 5000 元'
      : rechargeFieldError
  const rechargeAmountPreview = parsedRechargeAmount ?? selectedRechargeAmount
  const parsedMerchantWithdrawAmount = parseMerchantWithdrawAmount(merchantWithdrawAmount)
  const merchantWithdrawError =
    parsedMerchantWithdrawAmount !== null && parsedMerchantWithdrawAmount > 50000
      ? '单次提现金额不能超过 50000 元'
      : parsedMerchantWithdrawAmount !== null &&
          merchantProfile != null &&
          Math.round(parsedMerchantWithdrawAmount * 100) > merchantProfile.availableToWithdrawCents
        ? '提现金额不能超过当前可提现余额'
      : merchantWithdrawFieldError

  const cartSubtotal = selectedStore
    ? selectedStore.menu.reduce(
        (sum, item) => sum + item.priceCents * (quantities[item.id] ?? 0),
        0,
      )
    : 0
  const cartTotal = cartSubtotal > 0 ? cartSubtotal + DELIVERY_FEE_CENTS : 0
  const availableCheckoutCoupons =
    selectedCustomer?.coupons.filter((coupon) => cartSubtotal >= coupon.minimumSpendCents) ?? []
  const selectedCoupon =
    availableCheckoutCoupons.find((coupon) => coupon.id === selectedCouponId) ?? null
  const couponDiscountCents =
    cartTotal > 0 && selectedCoupon ? Math.min(selectedCoupon.discountCents, cartTotal) : 0
  const payableTotalCents = Math.max(0, cartTotal - couponDiscountCents)
  const selectedStoreHasMenu = Boolean(
    selectedStore &&
      selectedStore.menu.some((item) => item.remainingQuantity == null || item.remainingQuantity > 0),
  )
  const selectedStoreCanOrder = Boolean(selectedStore && selectedStoreHasMenu && selectedStoreIsOpen)
  const remainingBalanceAfterCheckout =
    selectedCustomer && payableTotalCents > 0 ? selectedCustomer.balanceCents - payableTotalCents : null
  const todayDeliveryWindow = getTodayDeliveryWindow()
  const isRefreshing = headerAction === 'refresh'
  const isLoggingOut = headerAction === 'logout'

  return (
    <main className="delivery-app">
      {role === 'admin' ? (
        <section className="hero-panel">
          <div>
            <p className="eyebrow">Type-safe Delivery Operations</p>
            <h1>外卖业务前后端系统</h1>
            <p className="hero-copy">
              一个基于 React + TypeScript + Scala 的角色协同台，覆盖商家入驻审核、
              下单、接单、配送、双评分反馈与管理员处理。
            </p>
          </div>
          <div className="metrics-grid">
            <MetricCard label="总订单" value={String(state?.metrics.totalOrders ?? '--')} />
            <MetricCard label="进行中" value={String(state?.metrics.activeOrders ?? '--')} />
            <MetricCard
              label="已处理工单"
              value={String(state?.metrics.resolvedTickets ?? '--')}
            />
            <MetricCard
              label="综合平均分"
              value={(state?.metrics.averageRating ?? 0).toFixed(1)}
            />
          </div>
        </section>
      ) : null}

      <section className="workspace">
        <aside className="role-strip">
          <div className="session-card">
            <p className="eyebrow">Current Session</p>
            <strong>{currentDisplayName}</strong>
            <span>{roleLabels[role]}</span>
          </div>
          <button
            className={`secondary-button action-feedback-button${isRefreshing ? ' is-pending' : ''}`}
            disabled={busy}
            onClick={() => void loadState()}
            type="button"
          >
            <span className={`button-indicator${isRefreshing ? ' is-spinning' : ''}`} />
            {isRefreshing ? '正在刷新...' : '刷新状态'}
          </button>
          <button
            className={`secondary-button action-feedback-button${isLoggingOut ? ' is-pending' : ''}`}
            disabled={busy}
            onClick={() => void logout()}
            type="button"
          >
            <span className={`button-indicator${isLoggingOut ? ' is-spinning' : ''}`} />
            {isLoggingOut ? '正在退出...' : '退出登录'}
          </button>
        </aside>

        <section className="role-stage">
          {error ? <div className="banner error">{error}</div> : null}
          {busy ? <div className="banner info">正在同步业务状态...</div> : null}

          {role === 'customer' && state ? (
            <CustomerRoleView
              activeReviewOrder={activeReviewOrder}
              activeCustomerOrder={activeCustomerOrder}
              afterSalesDrafts={afterSalesDrafts}
              afterSalesErrors={afterSalesErrors}
              addCustomerAddress={addCustomerAddress}
              addressDraft={addressDraft}
              addressFormErrors={addressFormErrors}
              canReviewOrder={canReviewOrder}
              cartSubtotal={cartSubtotal}
              cartTotal={cartTotal}
              availableCheckoutCoupons={availableCheckoutCoupons}
              categoryStores={categoryStores}
              couponDiscountCents={couponDiscountCents}
              chooseStoreCategory={chooseStoreCategory}
              completedCustomerOrders={completedCustomerOrders}
              customerStoreSearch={customerStoreSearch}
              customerStoreSearchDraft={customerStoreSearchDraft}
              customerStoreSearchHistory={customerStoreSearchHistory}
              customRechargeAmount={customRechargeAmount}
              customerNameDraft={customerNameDraft}
              customerOrders={customerOrders}
              customerWorkspaceView={customerWorkspaceView}
              DELIVERY_FEE_CENTS={DELIVERY_FEE_CENTS}
              deliveryAddress={deliveryAddress}
              deliveryAddressError={deliveryAddressError}
              enterStore={enterStore}
              formatAggregateRating={formatAggregateRating}
              formatBusinessHours={formatBusinessHours}
              formatPrice={formatPrice}
              formatStoreAvailability={formatStoreAvailability}
              formatStoreStatus={formatStoreStatus}
              formatTime={formatTime}
              getCategoryMeta={getCategoryMeta}
              getRemainingReviewDays={getRemainingReviewDays}
              hasPendingRiderReview={hasPendingRiderReview}
              hasPendingStoreReview={hasPendingStoreReview}
              isStoreCurrentlyOpen={isStoreCurrentlyOpen}
              isCheckoutExpanded={isCheckoutExpanded}
              leaveStore={leaveStore}
              navigate={navigate}
              openCheckout={openCheckout}
              openRechargePage={openRechargePage}
              orderChatDrafts={orderChatDrafts}
              orderChatErrors={orderChatErrors}
              partialRefundDrafts={partialRefundDrafts}
              partialRefundErrors={partialRefundErrors}
              payableTotalCents={payableTotalCents}
              parsedRechargeAmount={parsedRechargeAmount}
              pendingCustomerReviewOrders={pendingCustomerReviewOrders}
              quantities={quantities}
              rechargeAmountError={rechargeAmountError}
              rechargeAmountPreview={rechargeAmountPreview}
              RECHARGE_PRESET_AMOUNTS={RECHARGE_PRESET_AMOUNTS}
              remainingBalanceAfterCheckout={remainingBalanceAfterCheckout}
              removeCustomerAddress={removeCustomerAddress}
              setDefaultCustomerAddress={setDefaultCustomerAddress}
              remark={remark}
              scheduledDeliveryTime={scheduledDeliveryTime}
              resetStoreCategory={resetStoreCategory}
              REVIEW_WINDOW_DAYS={REVIEW_WINDOW_DAYS}
              reviewDrafts={reviewDrafts}
              reviewErrors={reviewErrors}
              RIDER_REVIEW_REASON_OPTIONS={RIDER_REVIEW_REASON_OPTIONS}
              saveCustomerName={saveCustomerName}
              selectedCustomer={selectedCustomer}
              selectedCoupon={selectedCoupon}
              selectedCouponId={selectedCouponId}
              selectedRechargeAmount={selectedRechargeAmount}
              scheduledDeliveryError={scheduledDeliveryError}
              selectedStore={selectedStore}
              selectedStoreCategory={selectedStoreCategory}
              selectedStoreCanOrder={selectedStoreCanOrder}
              selectedStoreHasMenu={selectedStoreHasMenu}
              selectRechargeAmount={selectRechargeAmount}
              setAddressDraft={setAddressDraft}
              setAddressFormErrors={setAddressFormErrors}
              setCustomRechargeAmount={setCustomRechargeAmount}
              setCustomerStoreSearch={setCustomerStoreSearch}
              setCustomerStoreSearchDraft={setCustomerStoreSearchDraft}
              setCustomerNameDraft={setCustomerNameDraft}
              setDeliveryAddress={setDeliveryAddress}
              setDeliveryAddressError={setDeliveryAddressError}
              setError={setError}
              setAfterSalesDrafts={setAfterSalesDrafts}
              setAfterSalesErrors={setAfterSalesErrors}
              setIsCheckoutExpanded={setIsCheckoutExpanded}
              setSelectedCouponId={setSelectedCouponId}
              setOrderChatDrafts={setOrderChatDrafts}
              setOrderChatErrors={setOrderChatErrors}
              setPartialRefundDrafts={setPartialRefundDrafts}
              setPartialRefundErrors={setPartialRefundErrors}
              setRemark={setRemark}
              setScheduledDeliveryTime={setScheduledDeliveryTime}
              setScheduledDeliveryError={setScheduledDeliveryError}
              setScheduledDeliveryTouched={setScheduledDeliveryTouched}
              setSelectedRechargeAmount={setSelectedRechargeAmount}
              statusLabels={statusLabels}
              STORE_REVIEW_REASON_OPTIONS={STORE_REVIEW_REASON_OPTIONS}
              storeCategories={storeCategories}
              suggestedDeliveryTime={todayDeliveryWindow.minimumValue}
              clearCustomerStoreSearchHistory={clearCustomerStoreSearchHistory}
              removeCustomerStoreSearchHistoryItem={removeCustomerStoreSearchHistoryItem}
              stateTickets={state.tickets}
              submitAfterSalesRequest={submitAfterSalesRequest}
              submitCustomerStoreSearch={submitCustomerStoreSearch}
              submitPartialRefundRequest={submitPartialRefundRequest}
              submitOrderChatMessage={submitOrderChatMessage}
              submitOrder={submitOrder}
              todayDeliveryCutoff={todayDeliveryWindow.cutoffValue}
              submitRechargeFromPage={submitRechargeFromPage}
              submitReview={submitReview}
              getRemainingRefundableQuantity={getRemainingRefundableQuantity}
              canSubmitPartialRefund={canSubmitPartialRefund}
              updateQuantity={updateQuantity}
              updateReviewDraft={updateReviewDraft}
              visibleStores={visibleStores}
            />
          ) : null}

          {role === 'merchant' && state ? (
            <MerchantRoleView
              buildEligibilityReviewPayload={buildEligibilityReviewPayload}
              buildReviewAppealPayload={buildReviewAppealPayload}
              changeMerchantApplicationView={changeMerchantApplicationView}
              deliveryApi={deliveryApi}
              eligibilityReviewDrafts={eligibilityReviewDrafts}
              formatAggregateRating={formatAggregateRating}
              formatPrice={formatPrice}
              formatTime={formatTime}
              getMenuItemDraft={getMenuItemDraft}
              getMenuItemFieldId={getMenuItemFieldId}
              getMerchantFieldClassName={getMerchantFieldClassName}
              getMerchantFieldId={getMerchantFieldId}
              formatBusinessHours={formatBusinessHours}
              isMenuComposerExpanded={isMenuComposerExpanded}
              isMenuItemImageUploading={isMenuItemImageUploading}
              isMerchantImageUploading={isMerchantImageUploading}
              menuItemFormErrors={menuItemFormErrors}
              merchantAppealDrafts={merchantAppealDrafts}
              merchantApplicationView={merchantApplicationView}
              merchantDraft={merchantDraft}
              merchantFormErrors={merchantFormErrors}
              merchantPendingApplications={merchantPendingApplications}
              merchantProfile={merchantProfile}
              merchantProfileDraft={merchantProfileDraft}
              merchantProfileFormErrors={merchantProfileFormErrors}
              merchantReviewedApplications={merchantReviewedApplications}
              selectedMerchantStoreId={selectedMerchantStoreId}
              merchantStores={merchantStores}
              merchantWithdrawAmount={merchantWithdrawAmount}
              merchantWithdrawError={merchantWithdrawError}
              merchantWorkspaceView={merchantWorkspaceView}
              BANK_OPTIONS={BANK_OPTIONS}
              enterMerchantStore={enterMerchantStore}
              leaveMerchantStore={leaveMerchantStore}
              navigate={navigate}
              orderChatDrafts={orderChatDrafts}
              orderChatErrors={orderChatErrors}
              partialRefundResolutionDrafts={partialRefundResolutionDrafts}
              role={role}
              resolvePartialRefundRequest={resolvePartialRefundRequest}
              runAction={runAction}
              setEligibilityReviewDrafts={setEligibilityReviewDrafts}
              setMenuComposerOpen={setMenuComposerOpen}
              setMenuItemDrafts={setMenuItemDrafts}
              setMenuItemFormErrors={setMenuItemFormErrors}
              setMerchantAppealDrafts={setMerchantAppealDrafts}
              setMerchantDraft={setMerchantDraft}
              setMerchantFormErrors={setMerchantFormErrors}
              setMerchantProfileDraft={setMerchantProfileDraft}
              setMerchantProfileFormErrors={setMerchantProfileFormErrors}
              setMerchantWithdrawFieldError={setMerchantWithdrawFieldError}
              setMerchantWithdrawAmount={setMerchantWithdrawAmount}
              setOrderChatDrafts={setOrderChatDrafts}
              setOrderChatErrors={setOrderChatErrors}
              setPartialRefundResolutionDrafts={setPartialRefundResolutionDrafts}
              saveMerchantProfile={saveMerchantProfile}
              state={state}
              statusLabels={statusLabels}
              STORE_CATEGORIES={STORE_CATEGORIES}
              submitOrderChatMessage={submitOrderChatMessage}
              submitMerchantApplication={submitMerchantApplication}
              submitStoreMenuItem={submitStoreMenuItem}
              uploadMerchantImage={uploadMerchantImage}
              uploadStoreMenuImage={uploadStoreMenuImage}
              withdrawMerchantIncome={withdrawMerchantIncome}
            />
          ) : null}

          {role === 'rider' && state ? (
            <RiderRoleView
              buildEligibilityReviewPayload={buildEligibilityReviewPayload}
              buildReviewAppealPayload={buildReviewAppealPayload}
              BANK_OPTIONS={BANK_OPTIONS}
              deliveryApi={deliveryApi}
              eligibilityReviewDrafts={eligibilityReviewDrafts}
              formatAggregateRating={formatAggregateRating}
              formatPrice={formatPrice}
              formatTime={formatTime}
              currentDisplayName={currentDisplayName}
              orderChatDrafts={orderChatDrafts}
              orderChatErrors={orderChatErrors}
              riderAppealDrafts={riderAppealDrafts}
              riderOrders={riderOrders}
              role={role}
              runAction={runAction}
              selectedRider={selectedRider}
              selectedRiderId={selectedRiderId}
              session={session}
              setEligibilityReviewDrafts={setEligibilityReviewDrafts}
              setOrderChatDrafts={setOrderChatDrafts}
              setOrderChatErrors={setOrderChatErrors}
              setRiderAppealDrafts={setRiderAppealDrafts}
              setSelectedRiderId={setSelectedRiderId}
              state={state}
              statusLabels={statusLabels}
              submitOrderChatMessage={submitOrderChatMessage}
            />
          ) : null}

          {role === 'admin' && state ? (
            <AdminRoleView
              appealResolutionDrafts={appealResolutionDrafts}
              applicationReviewDrafts={applicationReviewDrafts}
              buildAppealResolutionPayload={buildAppealResolutionPayload}
              buildResolutionPayload={buildResolutionPayload}
              buildReviewApplicationPayload={buildReviewApplicationPayload}
              deliveryApi={deliveryApi}
              eligibilityResolutionDrafts={eligibilityResolutionDrafts}
              formatTime={formatTime}
              pendingAppeals={pendingAppeals}
              pendingApplications={pendingApplications}
              pendingEligibilityReviews={pendingEligibilityReviews}
              resolutionDrafts={resolutionDrafts}
              runAction={runAction}
              setAppealResolutionDrafts={setAppealResolutionDrafts}
              setApplicationReviewDrafts={setApplicationReviewDrafts}
              setEligibilityResolutionDrafts={setEligibilityResolutionDrafts}
              setResolutionDrafts={setResolutionDrafts}
              state={state}
            />
          ) : null}
        </section>
      </section>

      {showLogoutModal ? (
        <div className="logout-overlay" role="status" aria-live="polite">
          <div className="logout-modal">
            <div className="logout-spinner" />
            <p className="eyebrow">Signing Out</p>
            <h2>正在退出账号</h2>
            <p>正在安全结束当前会话，即将返回登录页。</p>
          </div>
        </div>
      ) : null}
    </main>
  )
}
