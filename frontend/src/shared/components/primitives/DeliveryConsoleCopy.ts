import {
  CUSTOMER_WORKSPACE_VIEW,
  type CustomerWorkspaceView,
} from '@/shared/object/core/DeliveryAppObjects'
import type {
  CustomerWorkspaceHeaderTab,
  CustomerWorkspaceViewMeta,
} from '@/shared/object/core/SharedViewObjects'

export const DELIVERY_CONSOLE_COPY = {
  metrics: {
    totalOrders: '总订单',
    activeOrders: '进行中',
    resolvedTickets: '已处理工单',
    averageRating: '综合平均分',
    missingValue: '--',
    defaultAverageRating: 0,
  },
  session: {
    eyebrow: 'Current Session',
  },
  actions: {
    refreshIdle: '刷新状态',
    refreshPending: '正在刷新...',
    logoutIdle: '退出登录',
    logoutPending: '正在退出...',
  },
  banners: {
    syncing: '正在同步业务状态...',
  },
  adminIncome: {
    kind: '平台账户',
    title: '平台收入',
    description: '商品总价扣除商家结算和骑手收入后的平台留存。',
  },
  logoutModal: {
    eyebrow: 'Signing Out',
    title: '正在退出账号',
    description: '正在安全结束当前会话，即将返回登录页。',
  },
} as const

export const CUSTOMER_WORKSPACE_HEADER_TABS = {
  order: {
    route: '/customer/order',
    label: '点餐',
  },
  orders: {
    route: '/customer/orders',
    label: '订单',
  },
  profile: {
    route: '/customer/profile',
    label: '个人信息',
  },
} as const satisfies Record<string, CustomerWorkspaceHeaderTab>

export const CUSTOMER_WORKSPACE_VIEW_META = {
  [CUSTOMER_WORKSPACE_VIEW.order]: {
    title: '点餐',
    activeTab: CUSTOMER_WORKSPACE_VIEW.order,
  },
  [CUSTOMER_WORKSPACE_VIEW.orders]: {
    title: '订单',
    activeTab: CUSTOMER_WORKSPACE_VIEW.orders,
  },
  [CUSTOMER_WORKSPACE_VIEW.orderDetail]: {
    title: '订单',
    activeTab: CUSTOMER_WORKSPACE_VIEW.orders,
  },
  [CUSTOMER_WORKSPACE_VIEW.review]: {
    title: '订单',
    activeTab: CUSTOMER_WORKSPACE_VIEW.orders,
  },
  [CUSTOMER_WORKSPACE_VIEW.profile]: {
    title: '个人信息',
    activeTab: CUSTOMER_WORKSPACE_VIEW.profile,
  },
  [CUSTOMER_WORKSPACE_VIEW.recharge]: {
    title: '充值',
    activeTab: CUSTOMER_WORKSPACE_VIEW.profile,
  },
  [CUSTOMER_WORKSPACE_VIEW.addresses]: {
    title: '地址管理',
    activeTab: CUSTOMER_WORKSPACE_VIEW.profile,
  },
  [CUSTOMER_WORKSPACE_VIEW.coupons]: {
    title: '优惠券',
    activeTab: CUSTOMER_WORKSPACE_VIEW.profile,
  },
} as const satisfies Record<CustomerWorkspaceView, CustomerWorkspaceViewMeta>
