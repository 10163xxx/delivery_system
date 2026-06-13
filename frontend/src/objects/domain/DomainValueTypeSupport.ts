declare const domainBrand: unique symbol

export type RawTextValue = ReturnType<StringConstructor>
export type RawNumericValue = ReturnType<NumberConstructor>
export type RawBooleanValue = ReturnType<BooleanConstructor>

export type DomainValue<Base, Tag> = Base & { readonly [domainBrand]: Tag }
export type TextDomainValue<Tag> = DomainValue<RawTextValue, Tag>
export type NumericDomainValue<Tag> = DomainValue<RawNumericValue, Tag>
export type BooleanDomainValue<Tag> = DomainValue<RawBooleanValue, Tag>

export function asTextDomainValue<T extends TextDomainValue<unknown>>(value: RawTextValue): T {
  return value as T
}

export function asNumericDomainValue<T extends NumericDomainValue<unknown>>(value: RawNumericValue): T {
  return value as T
}

export function asBooleanDomainValue<T extends BooleanDomainValue<unknown>>(value: RawBooleanValue): T {
  return value as T
}
