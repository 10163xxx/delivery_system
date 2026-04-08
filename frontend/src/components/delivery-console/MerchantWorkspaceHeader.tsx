export function MerchantWorkspaceHeader(props: any) {
  const { merchantWorkspaceView, setMerchantWorkspaceViewState, navigate, leaveMerchantStore } = props

  function getMerchantWorkspacePath(view: 'application' | 'console' | 'profile') {
    return view === 'application' ? '/merchant/application?merchantView=submit' : view === 'profile' ? '/merchant/profile' : '/merchant/console'
  }

  function goToPath(path: string, resetStoreSelection = false) {
    if (resetStoreSelection) leaveMerchantStore()
    navigate(path)
  }

  return (
    <div className="summary-bar">
      <div>
        <p>商家工作台</p>
        <strong>{merchantWorkspaceView === 'application' ? '店家申请' : merchantWorkspaceView === 'profile' ? '个人信息' : '控制台'}</strong>
      </div>
      <div className="action-row">
        <button
          className={merchantWorkspaceView === 'application' ? 'primary-button' : 'secondary-button'}
          onClick={() => {
            setMerchantWorkspaceViewState('application')
            goToPath(getMerchantWorkspacePath('application'), true)
          }}
          type="button"
        >
          店家申请
        </button>
        <button
          className={merchantWorkspaceView === 'console' ? 'primary-button' : 'secondary-button'}
          onClick={() => {
            setMerchantWorkspaceViewState('console')
            goToPath(getMerchantWorkspacePath('console'))
          }}
          type="button"
        >
          控制台
        </button>
        <button
          className={merchantWorkspaceView === 'profile' ? 'primary-button' : 'secondary-button'}
          onClick={() => {
            setMerchantWorkspaceViewState('profile')
            goToPath(getMerchantWorkspacePath('profile'), true)
          }}
          type="button"
        >
          个人信息
        </button>
      </div>
    </div>
  )
}
