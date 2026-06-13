package domain.shared

import domain.shared.given

import io.circe.{Decoder, Encoder}

enum StoreCategory:
  case ChineseFastFood, WesternFastFood, RiceMeals, PizzaWestern, Noodles, SpicyPot, Dumplings, Salads, CafeDesserts, TeaDrinks, LateNightSnacks

object StoreCategory:
  private val enumLabel = text("StoreCategory")
  def render(value: StoreCategory): DisplayText = value match
    case StoreCategory.ChineseFastFood => text("中式快餐")
    case StoreCategory.WesternFastFood => text("西式快餐")
    case StoreCategory.RiceMeals => text("盖饭简餐")
    case StoreCategory.PizzaWestern => text("披萨西餐")
    case StoreCategory.Noodles => text("面馆粉档")
    case StoreCategory.SpicyPot => text("麻辣香锅")
    case StoreCategory.Dumplings => text("饺子馄饨")
    case StoreCategory.Salads => text("轻食沙拉")
    case StoreCategory.CafeDesserts => text("咖啡甜点")
    case StoreCategory.TeaDrinks => text("奶茶果饮")
    case StoreCategory.LateNightSnacks => text("夜宵小吃")
  def parse(value: DisplayText): Option[StoreCategory] =
    StoreCategory.values.find(category => render(category).raw == value.raw)
  given Encoder[StoreCategory] = Encoder.encodeString.contramap(value => render(value).raw)
  given Decoder[StoreCategory] =
    Decoder.decodeString.emap(value => parse(text(value)).toRight(s"Invalid $enumLabel: $value"))
