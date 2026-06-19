package system.objects

import scala.annotation.targetName

extension (left: CurrencyCents)
  @targetName("addCurrencyCents")
  def +(right: CurrencyCents): CurrencyCents =
    new CurrencyCents(left.raw + right.raw)

  @targetName("subtractCurrencyCents")
  def -(right: CurrencyCents): CurrencyCents =
    new CurrencyCents(left.raw - right.raw)

  @targetName("multiplyCurrencyCentsByQuantity")
  def *(quantity: Quantity): CurrencyCents =
    new CurrencyCents(left.raw * quantity.raw)

  @targetName("multiplyCurrencyCentsByEntityCount")
  def *(count: EntityCount): CurrencyCents =
    new CurrencyCents(left.raw * count.raw)

  @targetName("divideCurrencyCentsByEntityCount")
  def /(count: EntityCount): CurrencyCents =
    new CurrencyCents(left.raw / count.raw)

  @targetName("divideCurrencyCentsByCurrencyCents")
  def /(right: CurrencyCents): EntityCount =
    new EntityCount(left.raw / right.raw)

extension (left: Quantity)
  @targetName("addQuantity")
  def +(right: Quantity): Quantity =
    new Quantity(left.raw + right.raw)

  @targetName("subtractQuantity")
  def -(right: Quantity): Quantity =
    new Quantity(left.raw - right.raw)

def maxCurrencyCents(left: CurrencyCents, right: CurrencyCents): CurrencyCents =
  new CurrencyCents(Math.max(left.raw, right.raw))

def minCurrencyCents(left: CurrencyCents, right: CurrencyCents): CurrencyCents =
  new CurrencyCents(Math.min(left.raw, right.raw))

def maxQuantity(left: Quantity, right: Quantity): Quantity =
  new Quantity(Math.max(left.raw, right.raw))
