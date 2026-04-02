import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import type {
  AddCustomerAddressRequest,
  AddMenuItemRequest,
  AuthSession,
  CreateOrderRequest,
  DeliveryAppState,
  MenuItem,
  MerchantRegistrationRequest,
  OrderSummary,
  RechargeBalanceRequest,
  ResolvePartialRefundRequest,
  ResolveTicketRequest,
  ReviewMerchantApplicationRequest,
  ReviewOrderRequest,
  Role,
  SendOrderChatMessageRequest,
  SubmitPartialRefundRequest,
  StoreCategory,
  Store,
  UpdateCustomerProfileRequest,
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
  imageUrl: string
  uploadedImageName: string
}

type PartialRefundDraft = {
  quantity: number
  reason: string
}

type CustomerWorkspaceView =
  | 'order'
  | 'orders'
  | 'profile'
  | 'review'
  | 'recharge'
  | 'addresses'
  | 'coupons'
type MerchantWorkspaceView = 'application' | 'console'
type MerchantApplicationView = 'pending' | 'reviewed' | 'submit'

type CustomerAddressDraft = {
  label: string
  address: string
}

type CustomerAddressField = 'label' | 'address'

type MerchantFormField = 'merchantName' | 'storeName' | 'category' | 'imageUrl'
type MenuItemFormField = 'name' | 'description' | 'priceYuan' | 'imageUrl'

type HeaderAction = 'refresh' | 'logout' | 'clearOrders' | null

const RECHARGE_PRESET_AMOUNTS = [50, 100, 200, 500] as const
const STORE_REVIEW_REASON_OPTIONS = ['出餐慢', '口味一般', '菜品与描述不符', '包装破损', '体验很好'] as const
const RIDER_REVIEW_REASON_OPTIONS = ['送达太慢', '定位不准', '态度一般', '联系不及时', '服务很好'] as const
const STATE_POLL_INTERVAL_MS = 3000
const LOGOUT_TRANSITION_MS = 1000
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

  return {
    name,
    description,
    priceCents: Number.isFinite(price) ? Math.round(price * 100) : 0,
    imageUrl: imageUrl || undefined,
  }
}

function validateMerchantDraft(draft: MerchantDraft): Partial<Record<MerchantFormField, string>> {
  const merchantName = normalizeTextInput(draft.merchantName, 40)
  const storeName = normalizeTextInput(draft.storeName, 40)
  const category = normalizeTextInput(draft.category, 20)
  const imageUrl = draft.imageUrl.trim()

  return {
    merchantName: merchantName ? undefined : '请填写商家名称',
    storeName: storeName ? undefined : '请填写店铺名称',
    category: category ? undefined : '请选择店铺大类',
    imageUrl: imageUrl ? undefined : '请上传店铺展示图或填写可访问的图片 URL',
  }
}

function validateMenuItemDraft(
  draft: MenuItemDraft,
): Partial<Record<MenuItemFormField, string>> {
  const payload = buildMenuItemPayload(draft)
  const price = Number(draft.priceYuan.trim())

  return {
    name: payload.name ? undefined : '请填写菜品名称',
    description: payload.description ? undefined : '请填写菜品说明',
    priceYuan:
      Number.isFinite(price) && payload.priceCents > 0 && payload.priceCents <= 999999
        ? undefined
        : '请填写 0.01 到 9999.99 元之间的价格',
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
  const [selectedRiderId, setSelectedRiderId] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [scheduledDeliveryTime, setScheduledDeliveryTime] = useState('')
  const [scheduledDeliveryError, setScheduledDeliveryError] = useState<string | null>(null)
  const [scheduledDeliveryTouched, setScheduledDeliveryTouched] = useState(false)
  const [remark, setRemark] = useState('')
  const [isCheckoutExpanded, setIsCheckoutExpanded] = useState(false)
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
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [orderChatDrafts, setOrderChatDrafts] = useState<Record<string, string>>({})
  const [reviewDrafts, setReviewDrafts] = useState<Record<string, ReviewDraft>>({})
  const [reviewErrors, setReviewErrors] = useState<Record<string, string>>({})
  const [partialRefundDrafts, setPartialRefundDrafts] = useState<Record<string, PartialRefundDraft>>({})
  const [partialRefundErrors, setPartialRefundErrors] = useState<Record<string, string>>({})
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
  const role = session?.user.role ?? 'customer'
  const customerWorkspaceView: CustomerWorkspaceView =
    location.pathname.startsWith('/customer/review/')
      ? 'review'
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
    location.pathname === '/merchant/application' ? 'application' : 'console'
  const merchantApplicationView = (searchParams.get('merchantView') ??
    'submit') as MerchantApplicationView

  useEffect(() => {
    void restoreSession()
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
      }
    } else if (!selectedCustomerId && state.customers.length > 0) {
      const customer = state.customers[0]
      setSelectedCustomerId(customer.id)
      setDeliveryAddress(customer.defaultAddress)
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
  const visibleStores =
    state?.stores
      .slice()
      .sort((left, right) =>
        right.averageRating - left.averageRating || right.ratingCount - left.ratingCount,
      ) ?? []
  const storeCategories = STORE_CATEGORIES
  const categoryStores = visibleStores.filter((store) => store.category === selectedStoreCategory)

  useEffect(() => {
    if (!selectedCustomer) return
    if (lastCustomerDraftSyncIdRef.current === selectedCustomer.id) return
    lastCustomerDraftSyncIdRef.current = selectedCustomer.id
    setCustomerNameDraft(selectedCustomer.name)
  }, [selectedCustomer])

  useEffect(() => {
    if (!session) return

    const timer = window.setInterval(() => {
      void syncStateSilently()
    }, STATE_POLL_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [session])

  useEffect(() => {
    if (customerWorkspaceView !== 'review') return
    if (activeReviewOrder && canReviewOrder(activeReviewOrder)) {
      return
    }
    navigate('/customer/orders', { replace: true })
  }, [activeReviewOrder, customerWorkspaceView, navigate])

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

  async function clearOrders() {
    setHeaderAction('clearOrders')
    setBusy(true)
    try {
      const nextState = await deliveryApi.clearOrders()
      setState(nextState)
      setError(null)
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : '清空订单失败')
    } finally {
      setBusy(false)
      setHeaderAction(null)
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

  function updateQuantity(menuItem: MenuItem, nextValue: number) {
    setQuantities((current) => ({
      ...current,
      [menuItem.id]: Math.max(0, nextValue),
    }))
  }

  async function submitOrder() {
    if (!selectedStore || !selectedCustomer) return

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
          setError(message)
          return
        }
      } else {
        setScheduledDeliveryError(scheduleError)
        setError(scheduleError)
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
      quantities,
    )

    if (payload.items.length === 0) {
      setError('请至少选择一份菜品')
      return
    }

    if (!payload.deliveryAddress) {
      setError('请选择配送地址')
      return
    }

    if (!payload.scheduledDeliveryAt) {
      setScheduledDeliveryError('请选择有效的配送时间')
      setError('请选择有效的配送时间')
      return
    }

    if (selectedCustomer.balanceCents < cartTotal) {
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
  }

  async function submitOrderChatMessage(orderId: string) {
    const payload = buildOrderChatPayload(orderChatDrafts[orderId] ?? '')
    if (!payload.body) {
      setError('消息内容不能为空')
      return
    }

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
      setError(message)
      return
    }

    if (payload.quantity > remainingQuantity) {
      const message = `该菜品最多还能申请退款 ${remainingQuantity} 份`
      setPartialRefundErrors((current) => ({ ...current, [draftKey]: message }))
      setError(message)
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
      ['merchantName', 'storeName', 'category', 'imageUrl'] as MerchantFormField[]
    ).find((field) => nextErrors[field])

    setMerchantFormErrors(nextErrors)

    if (firstInvalidField) {
      setError('请完整填写商家、店铺和所属大类信息')
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
      setError(message)
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
      ['name', 'description', 'priceYuan', 'imageUrl'] as MenuItemFormField[]
    ).find((field) => nextErrors[field])

    setMenuItemFormErrors((current) => ({
      ...current,
      [storeId]: nextErrors,
    }))

    if (firstInvalidField) {
      setError('请完整填写菜品名称、说明、价格和图片')
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
      setError('请完整填写地址标签和地址内容')
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
      setError('请输入有效充值金额')
      return
    }

    if (amountYuan > 5000) {
      setError('单次充值金额不能超过 5000 元')
      return
    }

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

  function openRechargePage() {
    setCustomRechargeAmount(String(RECHARGE_PRESET_AMOUNTS[0]))
    setSelectedRechargeAmount(RECHARGE_PRESET_AMOUNTS[0])
    setError(null)
    navigate('/customer/profile/recharge')
  }

  function selectRechargeAmount(amount: number) {
    setSelectedRechargeAmount(amount)
    setCustomRechargeAmount(String(amount))
    setError(null)
  }

  async function submitRechargeFromPage() {
    const amount = parseRechargeAmount(customRechargeAmount)
    if (amount === null) {
      setError('请输入有效充值金额')
      return
    }

    setSelectedRechargeAmount(amount)
    await rechargeCustomerBalance(amount)
  }

  const parsedRechargeAmount = parseRechargeAmount(customRechargeAmount)
  const rechargeAmountError =
    parsedRechargeAmount !== null && parsedRechargeAmount > 5000
      ? '自定义金额不能超过 5000 元'
      : null
  const rechargeAmountPreview = parsedRechargeAmount ?? selectedRechargeAmount

  const cartSubtotal = selectedStore
    ? selectedStore.menu.reduce(
        (sum, item) => sum + item.priceCents * (quantities[item.id] ?? 0),
        0,
      )
    : 0
  const cartTotal = cartSubtotal > 0 ? cartSubtotal + DELIVERY_FEE_CENTS : 0
  const selectedStoreHasMenu = Boolean(selectedStore && selectedStore.menu.length > 0)
  const remainingBalanceAfterCheckout =
    selectedCustomer && cartTotal > 0 ? selectedCustomer.balanceCents - cartTotal : null
  const todayDeliveryWindow = getTodayDeliveryWindow()
  const isRefreshing = headerAction === 'refresh'
  const isLoggingOut = headerAction === 'logout'
  const isClearingOrders = headerAction === 'clearOrders'

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
          {role === 'admin' ? (
            <button
              className={`secondary-button action-feedback-button${isClearingOrders ? ' is-pending' : ''}`}
              disabled={busy}
              onClick={() => void clearOrders()}
              type="button"
            >
              <span className={`button-indicator${isClearingOrders ? ' is-spinning' : ''}`} />
              {isClearingOrders ? '正在清空订单...' : '清空全部订单'}
            </button>
          ) : null}
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
              addCustomerAddress={addCustomerAddress}
              addressDraft={addressDraft}
              addressFormErrors={addressFormErrors}
              canReviewOrder={canReviewOrder}
              cartSubtotal={cartSubtotal}
              cartTotal={cartTotal}
              categoryStores={categoryStores}
              chooseStoreCategory={chooseStoreCategory}
              completedCustomerOrders={completedCustomerOrders}
              customRechargeAmount={customRechargeAmount}
              customerNameDraft={customerNameDraft}
              customerOrders={customerOrders}
              customerWorkspaceView={customerWorkspaceView}
              DELIVERY_FEE_CENTS={DELIVERY_FEE_CENTS}
              deliveryAddress={deliveryAddress}
              enterStore={enterStore}
              formatAggregateRating={formatAggregateRating}
              formatPrice={formatPrice}
              formatStoreStatus={formatStoreStatus}
              formatTime={formatTime}
              getCategoryMeta={getCategoryMeta}
              getRemainingReviewDays={getRemainingReviewDays}
              hasPendingRiderReview={hasPendingRiderReview}
              hasPendingStoreReview={hasPendingStoreReview}
              isCheckoutExpanded={isCheckoutExpanded}
              leaveStore={leaveStore}
              navigate={navigate}
              openCheckout={openCheckout}
              openRechargePage={openRechargePage}
              orderChatDrafts={orderChatDrafts}
              partialRefundDrafts={partialRefundDrafts}
              partialRefundErrors={partialRefundErrors}
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
              selectedRechargeAmount={selectedRechargeAmount}
              scheduledDeliveryError={scheduledDeliveryError}
              selectedStore={selectedStore}
              selectedStoreCategory={selectedStoreCategory}
              selectedStoreHasMenu={selectedStoreHasMenu}
              selectRechargeAmount={selectRechargeAmount}
              setAddressDraft={setAddressDraft}
              setAddressFormErrors={setAddressFormErrors}
              setCustomRechargeAmount={setCustomRechargeAmount}
              setCustomerNameDraft={setCustomerNameDraft}
              setDeliveryAddress={setDeliveryAddress}
              setError={setError}
              setIsCheckoutExpanded={setIsCheckoutExpanded}
              setOrderChatDrafts={setOrderChatDrafts}
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
              isMenuComposerExpanded={isMenuComposerExpanded}
              isMenuItemImageUploading={isMenuItemImageUploading}
              isMerchantImageUploading={isMerchantImageUploading}
              menuItemFormErrors={menuItemFormErrors}
              merchantAppealDrafts={merchantAppealDrafts}
              merchantApplicationView={merchantApplicationView}
              merchantDraft={merchantDraft}
              merchantFormErrors={merchantFormErrors}
              merchantPendingApplications={merchantPendingApplications}
              merchantReviewedApplications={merchantReviewedApplications}
              merchantStores={merchantStores}
              merchantWorkspaceView={merchantWorkspaceView}
              navigate={navigate}
              orderChatDrafts={orderChatDrafts}
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
              setOrderChatDrafts={setOrderChatDrafts}
              setPartialRefundResolutionDrafts={setPartialRefundResolutionDrafts}
              state={state}
              statusLabels={statusLabels}
              STORE_CATEGORIES={STORE_CATEGORIES}
              submitOrderChatMessage={submitOrderChatMessage}
              submitMerchantApplication={submitMerchantApplication}
              submitStoreMenuItem={submitStoreMenuItem}
              uploadMerchantImage={uploadMerchantImage}
              uploadStoreMenuImage={uploadStoreMenuImage}
            />
          ) : null}

          {role === 'rider' && state ? (
            <RiderRoleView
              buildEligibilityReviewPayload={buildEligibilityReviewPayload}
              buildReviewAppealPayload={buildReviewAppealPayload}
              deliveryApi={deliveryApi}
              eligibilityReviewDrafts={eligibilityReviewDrafts}
              formatAggregateRating={formatAggregateRating}
              formatPrice={formatPrice}
              formatTime={formatTime}
              currentDisplayName={currentDisplayName}
              orderChatDrafts={orderChatDrafts}
              riderAppealDrafts={riderAppealDrafts}
              riderOrders={riderOrders}
              role={role}
              runAction={runAction}
              selectedRider={selectedRider}
              selectedRiderId={selectedRiderId}
              session={session}
              setEligibilityReviewDrafts={setEligibilityReviewDrafts}
              setOrderChatDrafts={setOrderChatDrafts}
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
