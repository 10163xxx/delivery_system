import type { MenuComposerOpenState } from '@/pages/MerchantConsole/hooks/MerchantConsoleState'
import type { MerchantMenuComposerFooterProps } from '@/pages/MerchantConsole/objects/MerchantConsoleObjects'

export function MerchantMenuFooter({
  storeId,
  props,
}: MerchantMenuComposerFooterProps) {
  const { isMenuItemImageUploading, setMenuComposerOpen, submitStoreMenuItem } = props
  const storeMenuImageUploading = isMenuItemImageUploading(storeId)

  return (
    <div className="summary-bar merchant-menu-submit-bar">
      <div>
        <p>新增说明</p>
        <strong>每道菜需包含图片、价格和说明</strong>
      </div>
      <div className="merchant-menu-submit-actions">
        <button
          className="secondary-button"
          onClick={() =>
            setMenuComposerOpen((current: MenuComposerOpenState) => ({
              ...current,
              [storeId]: false,
            }))
          }
          type="button"
        >
          取消
        </button>
        <button
          className="primary-button"
          disabled={storeMenuImageUploading}
          onClick={() => void submitStoreMenuItem(storeId)}
          type="button"
        >
          {storeMenuImageUploading ? '图片上传中...' : '确认新增'}
        </button>
      </div>
    </div>
  )
}
