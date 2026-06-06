import type { PageView } from '@/pages/delivery/objects/AppBuildRolePropsObjects'

export function getSharedFormattingProps(pageView: PageView) {
  return {
    formatAggregateRating: pageView.formatAggregateRating,
    formatBusinessHours: pageView.formatBusinessHours,
    formatPrice: pageView.formatPrice,
    formatStoreAvailability: pageView.formatStoreAvailability,
    formatStoreStatus: pageView.formatStoreStatus,
    formatTime: pageView.formatTime,
    getCategoryMeta: pageView.getCategoryMeta,
  }
}
