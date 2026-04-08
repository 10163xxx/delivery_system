import type { Store, StoreCategory } from '@/domain'
import { storeStatusLabels } from './constants'
import { isStoreCurrentlyOpen } from './schedule'

export function formatPrice(priceCents: number) {
  return `¥${(priceCents / 100).toFixed(2)}`
}

export function formatTime(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function getCategoryMeta(category: StoreCategory | string) {
  const visuals: Record<StoreCategory, { subtitle: string; imageSrc: string }> = {
    中式快餐: { subtitle: '现炒现做，适合工作日快速点餐', imageSrc: '/category-images/chinese-fast-food.svg' },
    盖饭简餐: { subtitle: '盖饭便当一类，分量稳定', imageSrc: '/category-images/rice-meals.svg' },
    面馆粉档: { subtitle: '汤面拌面米粉档口集中', imageSrc: '/category-images/noodles.svg' },
    麻辣香锅: { subtitle: '重口味下饭，高峰期也常见', imageSrc: '/category-images/spicy-hotpot.svg' },
    饺子馄饨: { subtitle: '饺子、锅贴、馄饨等轻主食', imageSrc: '/category-images/dumplings.svg' },
    轻食沙拉: { subtitle: '低脂轻食、能量碗与沙拉', imageSrc: '/category-images/salad.svg' },
    咖啡甜点: { subtitle: '咖啡、蛋糕、烘焙下午茶', imageSrc: '/category-images/coffee-dessert.svg' },
    奶茶果饮: { subtitle: '奶茶果饮，适合加单补饮品', imageSrc: '/category-images/milk-tea.svg' },
    夜宵小吃: { subtitle: '烧烤炸物与夜间加餐', imageSrc: '/category-images/night-snacks.svg' },
  }

  return visuals[category as StoreCategory] ?? {
    subtitle: '浏览该分类下的可下单餐厅',
    imageSrc: '/category-images/chinese-fast-food.svg',
  }
}

export function formatStoreStatus(status: Store['status']) {
  return storeStatusLabels[status] ?? status
}

export function formatStoreAvailability(store: Store) {
  if (store.status === 'Revoked') return formatStoreStatus(store.status)
  return isStoreCurrentlyOpen(store) ? formatStoreStatus(store.status) : '休息中'
}
