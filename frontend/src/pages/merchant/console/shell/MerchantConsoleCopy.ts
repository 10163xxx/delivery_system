export const MERCHANT_CONSOLE_COPY = {
  panel: {
    title: '店铺页',
    description: '仅已审核通过的店铺可在这里维护店铺和菜品。',
    storeEmpty: '当前没有已审核通过的店铺。',
    orderEmpty: '当前没有订单。',
  },
  overview: {
    pendingOrdersOverviewTitle: '待处理订单',
    pendingOrdersOverviewBody: '请及时进入店铺处理接单和备餐状态。',
    pendingOrdersAction: '去处理',
  },
  actions: {
    enterStore: '进入店铺',
    enterPendingStore: '进入处理',
  },
  alerts: {
    newOrderAlertTitle: '有新订单待接单',
    newOrderAlertBody: '请进入订单管理处理，避免顾客长时间等待。',
    newOrderBadge: '新订单',
    pendingAppeal: '申诉处理中',
  },
  chat: {
    orderChatDisabledReason: '骑手尚未接单，当前聊天主要用于和顾客确认订单细节。',
  },
} as const
