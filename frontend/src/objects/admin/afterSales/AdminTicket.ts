import type { AdminTicketIdentity } from '@/objects/admin/afterSales/AdminTicketIdentity'
import type { AdminTicketLifecycle } from '@/objects/admin/afterSales/AdminTicketLifecycle'
import type { AdminTicketResolution } from '@/objects/admin/afterSales/AdminTicketResolution'
import type { AdminTicketSubmission } from '@/objects/admin/afterSales/AdminTicketSubmission'

export type { AdminTicketIdentity } from '@/objects/admin/afterSales/AdminTicketIdentity'
export type { AdminTicketLifecycle } from '@/objects/admin/afterSales/AdminTicketLifecycle'
export type { AdminTicketResolution } from '@/objects/admin/afterSales/AdminTicketResolution'
export type { AdminTicketSubmission } from '@/objects/admin/afterSales/AdminTicketSubmission'

export type AdminTicket = AdminTicketIdentity &
  AdminTicketLifecycle & {
    identity: AdminTicketIdentity
    submission: AdminTicketSubmission
    resolution: AdminTicketResolution
    lifecycle: AdminTicketLifecycle
  } & AdminTicketSubmission &
  AdminTicketResolution
