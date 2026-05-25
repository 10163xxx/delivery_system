import { DisplayImageSlot } from '@/shared/components/primitives/DisplayImageSlot'
import type { MerchantMenuSectionItemCardProps } from '@/pages/merchant/object/MerchantConsoleObjects'
import {
  MerchantMenuSectionItemActions,
  MerchantMenuSectionItemInfo,
} from '@/pages/merchant/console/menu/MerchantMenuItemSections'

export function MerchantMenuItemCard({
  item,
  props,
  store,
}: MerchantMenuSectionItemCardProps) {
  const monthlySales = props.monthlySalesByMenuItem[item.id] ?? 0

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
        <strong>{props.formatPrice(item.priceCents)}</strong>
        <MerchantMenuSectionItemActions item={item} props={props} storeId={store.id} />
      </div>
    </article>
  )
}
