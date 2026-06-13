export type Decoder<T> = (value: unknown, path?: string) => T

export function fail(path: string, message: string): never {
  throw new Error(`Invalid response at ${path}: ${message}`)
}

export function decodeRecord(value: unknown, path = '$'): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) fail(path, 'expected object')
  return value as Record<string, unknown>
}

export function decodeString<T extends string>(value: unknown, path = '$'): T {
  if (typeof value !== 'string') fail(path, 'expected string')
  return value as T
}

export function decodeNumber<T extends number>(value: unknown, path = '$'): T {
  if (typeof value !== 'number' || !Number.isFinite(value)) fail(path, 'expected finite number')
  return value as T
}

export function decodeBoolean<T extends boolean>(value: unknown, path = '$'): T {
  if (typeof value !== 'boolean') fail(path, 'expected boolean')
  return value as T
}

export function decodeArray<T>(value: unknown, path = '$', itemDecoder: Decoder<T>): T[] {
  if (!Array.isArray(value)) fail(path, 'expected array')
  return value.map((item, index) => itemDecoder(item, `${path}[${index}]`))
}

export function decodeEnum<T extends string>(value: unknown, path = '$', members: readonly T[]): T {
  const decoded = decodeString<T>(value, path)
  if (!members.includes(decoded)) fail(path, `expected one of ${members.join(', ')}`)
  return decoded
}

export function decodeField<T>(value: unknown, path: string, key: string, decoder: Decoder<unknown>): T {
  return decoder(decodeRecord(value, path)[key], `${path}.${key}`) as T
}

export function decodeOptionalField<T>(
  value: unknown,
  path: string,
  key: string,
  decoder: Decoder<unknown>,
): T | undefined {
  const entry = decodeRecord(value, path)[key]
  return entry === undefined || entry === null ? undefined : decoder(entry, `${path}.${key}`) as T
}

export function decodeOptionalArrayField<T>(
  value: unknown,
  path: string,
  key: string,
  itemDecoder: Decoder<T>,
): T[] {
  const entry = decodeRecord(value, path)[key]
  return entry === undefined || entry === null ? [] : decodeArray(entry, `${path}.${key}`, itemDecoder)
}
