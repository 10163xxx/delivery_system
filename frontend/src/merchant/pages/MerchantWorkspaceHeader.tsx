import type { MerchantRoleProps } from '@/shared/AppBuildRoleProps'
import type { MerchantWorkspaceView } from '@/shared/delivery-app/DeliveryAppObjects'

const MERCHANT_WORKSPACE_VIEW_META: Record<
  MerchantWorkspaceView,
  { title: string; path: string; resetStoreSelection: boolean }
> = {
  application: {
    title: '店家申请',
    path: '/merchant/application?merchantView=submit',
    resetStoreSelection: true,
  },
  console: {
    title: '控制台',
    path: '/merchant/console',
    resetStoreSelection: false,
  },
  profile: {
    title: '个人信息',
    path: '/merchant/profile',
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
          className={merchantWorkspaceView === 'application' ? 'primary-button' : 'secondary-button'}
          onClick={() => goToView('application')}
          type="button"
        >
          店家申请
        </button>
        <button
          className={merchantWorkspaceView === 'console' ? 'primary-button' : 'secondary-button'}
          onClick={() => goToView('console')}
          type="button"
        >
          控制台
        </button>
        <button
          className={merchantWorkspaceView === 'profile' ? 'primary-button' : 'secondary-button'}
          onClick={() => goToView('profile')}
          type="button"
        >
          个人信息
        </button>
      </div>
    </div>
  )
}
