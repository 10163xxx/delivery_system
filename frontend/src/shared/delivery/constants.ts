import type { Role, StoreCategory } from '@/shared/object'
import type { OrderSummary, Store } from '@/shared/object'

export const BANK_OPTIONS = [
  '中国银行',
  '工商银行',
  '建设银行',
  '农业银行',
  '招商银行',
  '交通银行',
  '邮储银行',
] as const

export const RECHARGE_PRESET_AMOUNTS = [50, 100, 200, 500] as const
export const DEFAULT_RECHARGE_PRESET_INDEX = 0
export const STORE_REVIEW_REASON_OPTIONS = ['出餐慢', '口味一般', '菜品与描述不符', '包装破损', '体验很好'] as const
export const RIDER_REVIEW_REASON_OPTIONS = ['送达太慢', '定位不准', '态度一般', '联系不及时', '服务很好'] as const
export const STATE_POLL_INTERVAL_MS = 3000
export const LOGOUT_TRANSITION_MS = 1000
export const CUSTOMER_STORE_SEARCH_HISTORY_KEY = 'customer-store-search-history'
export const MAX_CUSTOMER_STORE_SEARCH_HISTORY = 10
export const REVIEW_WINDOW_DAYS = 10
export const DELIVERY_FEE_CENTS = 1000
export const CURRENCY_CENTS_SCALE = 100
export const MIN_SCHEDULE_LEAD_MINUTES = 30
export const STANDARD_AUTO_DISPATCH_MINUTES = 15
export const MEMBER_AUTO_DISPATCH_MINUTES = 8
export const MAX_RECHARGE_AMOUNT_YUAN = 5000
export const MAX_WITHDRAW_AMOUNT_YUAN = 50000
export const MIN_RATING = 1
export const MAX_RATING = 5
export const DEFAULT_REVIEW_RATING = MAX_RATING
export const LOW_RATING_MAX = MAX_RATING - 1
export const MIN_MENU_ITEM_QUANTITY = 1
export const MIN_MENU_ITEM_STOCK = 0
export const MAX_MENU_ITEM_STOCK = 10
export const DEFAULT_PARTIAL_REFUND_QUANTITY = MIN_MENU_ITEM_QUANTITY
export const DEFAULT_MERCHANT_PREP_MINUTES = 20
export const DEFAULT_STORE_OPEN_TIME = '09:00'
export const DEFAULT_STORE_CLOSE_TIME = '21:00'
export const AFTER_SALES_APPROVED_NOTE = '售后申请核实通过'
export const AFTER_SALES_REJECTED_NOTE = '售后申请未通过审核'
export const AFTER_SALES_REJECTED_STANDARD_NOTE = '未达到售后标准，申请驳回'
export const PARTIAL_REFUND_APPROVED_NOTE = '确认缺货，已退该商品'
export const PARTIAL_REFUND_REJECTED_NOTE = '当前商品仍可正常出餐'
export const MIN_PREP_MINUTES = 1
export const MAX_PREP_MINUTES = 120
export const MIN_PHONE_LENGTH = 6
export const MAX_CONTACT_PHONE_LENGTH = 20
export const MAX_MERCHANT_NAME_LENGTH = 40
export const MAX_STORE_NAME_LENGTH = 40
export const MAX_STORE_CATEGORY_LENGTH = 20
export const MAX_BANK_NAME_LENGTH = 30
export const MAX_ACCOUNT_NUMBER_LENGTH = 60
export const MAX_ACCOUNT_HOLDER_LENGTH = 30
export const MAX_MENU_ITEM_NAME_LENGTH = 40
export const MAX_MENU_ITEM_DESCRIPTION_LENGTH = 160
export const MAX_CUSTOMER_NAME_LENGTH = 30
export const MAX_ADDRESS_LABEL_LENGTH = 20
export const MAX_ADDRESS_LENGTH = 120
export const MAX_ORDER_REMARK_LENGTH = 120
export const MAX_ORDER_CHAT_LENGTH = 240
export const MAX_REVIEW_COMMENT_LENGTH = 160
export const MAX_REVIEW_EXTRA_NOTE_LENGTH = 240
export const MAX_REVIEW_APPLICATION_NOTE_LENGTH = 120
export const MAX_TICKET_RESOLUTION_LENGTH = 60
export const MAX_TICKET_NOTE_LENGTH = 160
export const MAX_APPEAL_REASON_LENGTH = 160
export const MAX_REJECT_ORDER_REASON_LENGTH = 160
export const MAX_MENU_ITEM_PRICE_CENTS = 999999
export const MINUTES_PER_HOUR = 60
export const HOURS_PER_DAY = 24
export const SECONDS_PER_MINUTE = 60
export const MILLISECONDS_PER_SECOND = 1000
export const MILLISECONDS_PER_MINUTE =
  SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND
export const MILLISECONDS_PER_HOUR = MINUTES_PER_HOUR * MILLISECONDS_PER_MINUTE
export const MILLISECONDS_PER_DAY = HOURS_PER_DAY * MILLISECONDS_PER_HOUR
export const STORE_CATEGORIES: StoreCategory[] = [
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

export const roleLabels: Record<Role, string> = {
  customer: '顾客',
  merchant: '商家',
  rider: '骑手',
  admin: '管理员',
}

export const statusLabels: Record<OrderSummary['status'], string> = {
  PendingMerchantAcceptance: '待商家接单',
  Preparing: '备餐中',
  ReadyForPickup: '待骑手取餐',
  Delivering: '配送中',
  Completed: '已完成',
  Cancelled: '已取消',
  Escalated: '异常升级',
}

export const storeStatusLabels: Record<Store['status'], string> = {
  Open: '营业中',
  Busy: '高峰繁忙',
  Revoked: '暂停营业',
}
