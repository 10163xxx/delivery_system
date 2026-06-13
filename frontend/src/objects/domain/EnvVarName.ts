import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type EnvVarNameTag = { readonly envVarNameBrand: never }

export type EnvVarName = TextDomainValue<EnvVarNameTag>
