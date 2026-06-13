import {
  RIDER_CONSOLE_COPY,
  RIDER_WORKSPACE_VIEW,
  type RiderWorkspaceView,
} from '@/pages/RiderConsole/objects/RiderWorkspaceObjects'

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
          {workspaceView === RIDER_WORKSPACE_VIEW.console
            ? RIDER_CONSOLE_COPY.workspace.console
            : workspaceView === RIDER_WORKSPACE_VIEW.acceptance
              ? RIDER_CONSOLE_COPY.workspace.acceptance
            : RIDER_CONSOLE_COPY.workspace.profile}
        </strong>
      </div>
      <div className="action-row">
        <button
          className={workspaceView === RIDER_WORKSPACE_VIEW.console ? 'primary-button' : 'secondary-button'}
          onClick={() => setWorkspaceView(RIDER_WORKSPACE_VIEW.console)}
          type="button"
        >
          配送台
        </button>
        <button
          className={workspaceView === RIDER_WORKSPACE_VIEW.acceptance ? 'primary-button' : 'secondary-button'}
          onClick={() => setWorkspaceView(RIDER_WORKSPACE_VIEW.acceptance)}
          type="button"
        >
          接单台
        </button>
        <button
          className={workspaceView === RIDER_WORKSPACE_VIEW.profile ? 'primary-button' : 'secondary-button'}
          onClick={() => setWorkspaceView(RIDER_WORKSPACE_VIEW.profile)}
          type="button"
        >
          个人信息
        </button>
      </div>
    </div>
  )
}
