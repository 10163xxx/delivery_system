import {
  RIDER_CONSOLE_COPY,
  type RiderWorkspaceView,
} from '@/rider/app/rider-support'

export function RiderWorkspaceTabs({
  workspaceView,
  setWorkspaceView,
}: {
  workspaceView: RiderWorkspaceView
  setWorkspaceView: (view: RiderWorkspaceView) => void
}) {
  return (
    <div className="summary-bar">
      <div>
        <p>{RIDER_CONSOLE_COPY.workspace.title}</p>
        <strong>
          {workspaceView === 'console'
            ? RIDER_CONSOLE_COPY.workspace.console
            : RIDER_CONSOLE_COPY.workspace.profile}
        </strong>
      </div>
      <div className="action-row">
        <button
          className={workspaceView === 'console' ? 'primary-button' : 'secondary-button'}
          onClick={() => setWorkspaceView('console')}
          type="button"
        >
          配送台
        </button>
        <button
          className={workspaceView === 'profile' ? 'primary-button' : 'secondary-button'}
          onClick={() => setWorkspaceView('profile')}
          type="button"
        >
          个人信息
        </button>
      </div>
    </div>
  )
}
