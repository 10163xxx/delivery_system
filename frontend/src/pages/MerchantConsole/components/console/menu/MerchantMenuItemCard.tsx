import { DisplayImageSlot } from '@/pages/DeliveryConsole/components/primitives/DisplayImageSlot'
import type { MerchantMenuSectionItemCardProps } from '@/pages/MerchantConsole/objects/MerchantConsoleObjects'
import { getMenuItemDisplayPriceText } from '@/pages/DeliveryConsole/functions/cart/DeliveryMenuPricing'
import type { EntityCount } from '@/objects/core/SharedObjects'
import { asDomainNumber } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import {
  MerchantMenuSectionItemActions,
  MerchantMenuSectionItemInfo,
} from '@/pages/MerchantConsole/components/console/menu/MerchantMenuItemSections'

export function MerchantMenuItemCard({
  item,
  props,
  store,
}: MerchantMenuSectionItemCardProps) {
  const monthlySales = props.monthlySalesByMenuItem[item.id] ?? asDomainNumber<EntityCount>(0)

  return (
    <article className="menu-card">
      <DisplayImageSlot
        alt={`${item.name} 展示图`}
        className="menu-image"
        label="菜品展示图"
        src={item.imageUrl}
      />
      <MerchantMenuSectionItemInfo item={item} monthlySales={monthlySales} />
      <div className="menu-footer">
        <strong>{getMenuItemDisplayPriceText(item, props.formatPrice)}</strong>
        <MerchantMenuSectionItemActions item={item} props={props} storeId={store.id} />
      </div>
    </article>
  )
}
