import type {
  MenuComposerOpenState,
} from '@/merchant/app/state/MerchantConsoleState'
import type { MerchantMenuSectionComposerProps } from '@/pages/merchant/object/MerchantPageObjects'
import {
  MerchantMenuBasicFields,
} from '@/pages/merchant/console/menu/MerchantMenuBasicFields'
import { MerchantMenuFooter } from '@/pages/merchant/console/menu/MerchantMenuFooter'
import { MerchantMenuImageFields } from '@/pages/merchant/console/menu/MerchantMenuImageFields'

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
