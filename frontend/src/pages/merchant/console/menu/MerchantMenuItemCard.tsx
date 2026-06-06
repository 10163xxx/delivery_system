import { DisplayImageSlot } from '@/components/primitives/DisplayImageSlot'
import type { MerchantMenuSectionItemCardProps } from '@/pages/merchant/objects/MerchantConsoleObjects'
import { getMenuItemDisplayPriceText } from '@/features/delivery/DeliveryServices'
import type { EntityCount } from '@/objects/core/SharedObjects'
import { asDomainNumber } from '@/features/delivery/DeliveryShared'
import {
  MerchantMenuSectionItemActions,
  MerchantMenuSectionItemInfo,
} from '@/pages/merchant/console/menu/MerchantMenuItemSections'

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
