// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
export const STORE_CATEGORY = {
  chineseFastFood: '中式快餐',
  westernFastFood: '西式快餐',
  riceMeals: '盖饭简餐',
  pizzaWestern: '披萨西餐',
  noodles: '面馆粉档',
  spicyPot: '麻辣香锅',
  dumplings: '饺子馄饨',
  salads: '轻食沙拉',
  cafeDesserts: '咖啡甜点',
  teaDrinks: '奶茶果饮',
  lateNightSnacks: '夜宵小吃',
} as const

export type StoreCategory = (typeof STORE_CATEGORY)[keyof typeof STORE_CATEGORY]
