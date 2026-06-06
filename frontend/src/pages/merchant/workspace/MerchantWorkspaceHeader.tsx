import type { MerchantRoleProps } from '@/pages/delivery/app/roleProps'
import {
  buildMerchantApplicationSubmitRoute,
  MERCHANT_WORKSPACE_VIEW,
  type MerchantWorkspaceRouteMeta,
  type MerchantWorkspaceView,
} from '@/pages/delivery/objects/DeliveryAppObjects'
import { ROUTE_PATH, type DisplayText } from '@/objects/core/SharedObjects'
import { asDomainText } from '@/features/delivery/DeliveryShared'

const MERCHANT_WORKSPACE_VIEW_META: Record<MerchantWorkspaceView, MerchantWorkspaceRouteMeta> = {
  [MERCHANT_WORKSPACE_VIEW.application]: {
    title: asDomainText<DisplayText>('店家申请'),
    path: buildMerchantApplicationSubmitRoute(),
    resetStoreSelection: true,
  },
  [MERCHANT_WORKSPACE_VIEW.store]: {
    title: asDomainText<DisplayText>('店铺页'),
    path: ROUTE_PATH.merchantStore,
    resetStoreSelection: false,
  },
  [MERCHANT_WORKSPACE_VIEW.orders]: {
    title: asDomainText<DisplayText>('订单页'),
    path: ROUTE_PATH.merchantOrders,
    resetStoreSelection: false,
  },
  [MERCHANT_WORKSPACE_VIEW.profile]: {
    title: asDomainText<DisplayText>('个人信息'),
    path: ROUTE_PATH.merchantProfile,
    resetStoreSelection: true,
  },
}

export function MerchantWorkspaceHeader(props: MerchantRoleProps) {
  const { merchantWorkspaceView, setMerchantWorkspaceViewState, navigate, leaveMerchantStore } = props

  function goToView(view: MerchantWorkspaceView) {
    const target = MERCHANT_WORKSPACE_VIEW_META[view]
    if (target.resetStoreSelection) leaveMerchantStore()
    setMerchantWorkspaceViewState(view)
    navigate(target.path)
  }

  return (
    <div className="summary-bar">
      <div>
        <p>商家工作台</p>
        <strong>{MERCHANT_WORKSPACE_VIEW_META[merchantWorkspaceView].title}</strong>
      </div>
      <div className="action-row">
        <button
          className={merchantWorkspaceView === MERCHANT_WORKSPACE_VIEW.application ? 'primary-button' : 'secondary-button'}
          onClick={() => goToView(MERCHANT_WORKSPACE_VIEW.application)}
          type="button"
        >
          店家申请
        </button>
        <button
          className={merchantWorkspaceView === MERCHANT_WORKSPACE_VIEW.store ? 'primary-button' : 'secondary-button'}
          onClick={() => goToView(MERCHANT_WORKSPACE_VIEW.store)}
          type="button"
        >
          店铺页
        </button>
        <button
          className={merchantWorkspaceView === MERCHANT_WORKSPACE_VIEW.orders ? 'primary-button' : 'secondary-button'}
          onClick={() => goToView(MERCHANT_WORKSPACE_VIEW.orders)}
          type="button"
        >
          订单页
        </button>
        <button
          className={merchantWorkspaceView === MERCHANT_WORKSPACE_VIEW.profile ? 'primary-button' : 'secondary-button'}
          onClick={() => goToView(MERCHANT_WORKSPACE_VIEW.profile)}
          type="button"
        >
          个人信息
        </button>
      </div>
    </div>
  )
}
