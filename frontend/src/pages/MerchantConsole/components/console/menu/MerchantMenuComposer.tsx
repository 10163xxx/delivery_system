import type {
  MenuComposerOpenState,
} from '@/pages/MerchantConsole/hooks/MerchantConsoleState'
import type { MerchantMenuSectionComposerProps } from '@/pages/MerchantConsole/objects/MerchantPageObjects'
import {
  MerchantMenuBasicFields,
} from '@/pages/MerchantConsole/components/console/menu/MerchantMenuBasicFields'
import { MerchantMenuFooter } from '@/pages/MerchantConsole/components/console/menu/MerchantMenuFooter'
import { MerchantMenuImageFields } from '@/pages/MerchantConsole/components/console/menu/MerchantMenuImageFields'

export function MerchantMenuComposer({
  store,
  props,
}: MerchantMenuSectionComposerProps) {
  const {
    isMenuComposerExpanded,
    setMenuComposerOpen,
  } = props
  const isMenuComposerVisible = isMenuComposerExpanded(store.id)

  return (
    <>
      <div className="merchant-menu-actions">
        <button
          className={isMenuComposerVisible ? 'primary-button' : 'secondary-button'}
          onClick={() =>
            setMenuComposerOpen((current: MenuComposerOpenState) => ({
              ...current,
              [store.id]: !isMenuComposerExpanded(store.id),
            }))
          }
          type="button"
        >
          {isMenuComposerVisible ? '收起新增菜品' : '新增菜品'}
        </button>
      </div>
      {isMenuComposerVisible ? (
        <div className="merchant-menu-composer">
          <div className="form-grid">
            <MerchantMenuBasicFields props={props} storeId={store.id} />
            <MerchantMenuImageFields props={props} storeId={store.id} storeName={store.name} />
          </div>
          <MerchantMenuFooter props={props} storeId={store.id} />
        </div>
      ) : null}
    </>
  )
}
