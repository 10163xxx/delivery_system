import { useState } from 'react'

export const ADMIN_WORKSPACE_VIEW = {
  overview: 'overview',
  review: 'review',
  tickets: 'tickets',
} as const

export type AdminWorkspaceView = (typeof ADMIN_WORKSPACE_VIEW)[keyof typeof ADMIN_WORKSPACE_VIEW]

export const ADMIN_WORKSPACE_TABS: Array<{ label: string; value: AdminWorkspaceView }> = [
  { label: '运营总览', value: ADMIN_WORKSPACE_VIEW.overview },
  { label: '审核处理', value: ADMIN_WORKSPACE_VIEW.review },
  { label: '售后工单', value: ADMIN_WORKSPACE_VIEW.tickets },
]

export const DEFAULT_ADMIN_WORKSPACE_TAB = ADMIN_WORKSPACE_TABS[0] as {
  label: string
  value: AdminWorkspaceView
}

export function useAdminWorkspaceState() {
  const [activeView, setActiveView] = useState<AdminWorkspaceView>(ADMIN_WORKSPACE_VIEW.overview)
  return { activeView, setActiveView }
}
