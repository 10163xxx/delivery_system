import type { CustomerRoleProps } from '@/pages/delivery/app/roleProps'
import type { OrderSummary } from '@/objects/core/SharedObjects'
import type { ReactNode } from 'react'

export type CustomerOrderHelpersProps = CustomerRoleProps

export type CustomerOrderDetailSectionProps = {
  order: OrderSummary
  props: CustomerOrderHelpersProps
}

export type CustomerOrderDetailHeaderProps = {
  order: OrderSummary
  navigate: CustomerOrderHelpersProps['navigate']
  statusLabels: CustomerOrderHelpersProps['statusLabels']
}

export type CustomerOrderSummaryBarProps = {
  order: OrderSummary
  formatPrice: CustomerOrderHelpersProps['formatPrice']
  formatTime: CustomerOrderHelpersProps['formatTime']
}

export type CustomerOrderPriceBreakdownProps = {
  order: OrderSummary
  formatPrice: CustomerOrderHelpersProps['formatPrice']
}

export type OrderItemsListProps = {
  order: OrderSummary
  formatPrice: CustomerOrderHelpersProps['formatPrice']
}

export type OrderTimelineProps = {
  order: OrderSummary
  formatTime: CustomerOrderHelpersProps['formatTime']
  statusLabels: CustomerOrderHelpersProps['statusLabels']
}

export type PartialRefundActionRowProps = {
  order: OrderSummary
  item: OrderSummary['items'][number]
  props: CustomerOrderHelpersProps
}

type OrderListRenderProps = {
  orders: OrderSummary[]
  emptyText: string
  footer?: (order: OrderSummary) => ReactNode
  formatPrice: (priceCents: number) => string
  formatTime: (value: string) => string
}

type OrderListBehaviorProps = {
  getOrderCardClassName?: (order: OrderSummary) => string | undefined
  getOrderStatusBadgeClassName?: (order: OrderSummary) => string | undefined
  headerMeta?: (order: OrderSummary) => ReactNode
  onOpenOrder?: (orderId: string) => void
  statusLabels: Record<OrderSummary['status'], string>
}

export type OrderListProps = OrderListRenderProps & OrderListBehaviorProps

type OrderChatParticipantProps = {
  order: OrderSummary
  currentRole: import('@/objects/core/SharedObjects').Role
  currentDisplayName: string
}

type OrderChatDraftProps = {
  draft: string
  errorText?: string
  disabled?: boolean
  disabledReason?: string
}

type OrderChatActionProps = {
  formatTime: (value: string) => string
  onChangeDraft: (value: string) => void
  onSubmit: () => void
}

export type OrderChatPanelProps = OrderChatParticipantProps &
  OrderChatDraftProps &
  OrderChatActionProps
