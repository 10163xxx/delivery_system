import type {
  ResolveTicketRequest,
  ReviewMerchantApplicationRequest,
} from '@/objects/core/SharedObjects'
import {
  APPEAL_ROLE,
  ELIGIBILITY_REVIEW_TARGET,
} from '@/objects/core/SharedObjects'
import {
  MAX_APPEAL_REASON_LENGTH,
  MAX_REJECT_ORDER_REASON_LENGTH,
  MAX_REVIEW_APPLICATION_NOTE_LENGTH,
  MAX_TICKET_NOTE_LENGTH,
  MAX_TICKET_RESOLUTION_LENGTH,
} from './DeliveryConstants'
import { normalizeTextInput } from './DeliveryShared'
import type {
  AppealResolutionDraft,
} from '@/objects/page/DeliveryAppObjects'

const REVIEW_ADMIN_DEFAULTS = {
  appealReason: '评价描述与实际履约情况不符',
  appealResolutionNote: '申诉成立，已撤销评价',
  eligibilityReason: '已完成整改，希望发起复核',
  resolution: '已回访用户',
  resolutionNote: '已联系相关角色并记录',
  reviewApplicationNote: '资料已核验',
} as const

export function buildReviewApplicationPayload(
  reviewNote: string,
): ReviewMerchantApplicationRequest {
  return {
    reviewNote:
      normalizeTextInput(reviewNote, MAX_REVIEW_APPLICATION_NOTE_LENGTH) ||
      REVIEW_ADMIN_DEFAULTS.reviewApplicationNote,
  }
}

export function buildResolutionPayload(
  draft?: ResolveTicketRequest,
): ResolveTicketRequest {
  const resolution = normalizeTextInput(
    draft?.resolution ?? REVIEW_ADMIN_DEFAULTS.resolution,
    MAX_TICKET_RESOLUTION_LENGTH,
  )
  const note = normalizeTextInput(
    draft?.note ?? REVIEW_ADMIN_DEFAULTS.resolutionNote,
    MAX_TICKET_NOTE_LENGTH,
  )

  return {
    resolution: resolution || REVIEW_ADMIN_DEFAULTS.resolution,
    note: note || REVIEW_ADMIN_DEFAULTS.resolutionNote,
  }
}

export function buildReviewAppealPayload(
  appellantRole: typeof APPEAL_ROLE.merchant | typeof APPEAL_ROLE.rider,
  reason: string,
) {
  return {
    appellantRole,
    reason:
      normalizeTextInput(reason, MAX_APPEAL_REASON_LENGTH) ||
      REVIEW_ADMIN_DEFAULTS.appealReason,
  }
}

export function buildAppealResolutionPayload(
  draft?: AppealResolutionDraft,
): AppealResolutionDraft {
  return {
    approved: draft?.approved ?? true,
    resolutionNote:
      normalizeTextInput(
        draft?.resolutionNote ?? REVIEW_ADMIN_DEFAULTS.appealResolutionNote,
        MAX_TICKET_NOTE_LENGTH,
      ) || REVIEW_ADMIN_DEFAULTS.appealResolutionNote,
  }
}

export function buildEligibilityReviewPayload(
  target: typeof ELIGIBILITY_REVIEW_TARGET.store | typeof ELIGIBILITY_REVIEW_TARGET.rider,
  targetId: string,
  reason: string,
) {
  return {
    target,
    targetId,
    reason:
      normalizeTextInput(reason, MAX_REJECT_ORDER_REASON_LENGTH) ||
      REVIEW_ADMIN_DEFAULTS.eligibilityReason,
  }
}
