import { useEffect, useState } from 'react'
import { scheduleTimeout } from '@/system/api/SharedApi'
import type { DisplayImageSlotProps } from '@/objects/core/SharedViewObjects'

const IMAGE_PREVIEW_DELAY_MS = 300

function toDisplayImageSrc(value?: string) {
  const source = value?.trim()
  if (!source) return undefined

  if (
    source.startsWith('http://') ||
    source.startsWith('https://') ||
    source.startsWith('data:') ||
    source.startsWith('blob:') ||
    source.startsWith('file://')
  ) {
    return source
  }

  if (source.startsWith('/')) {
    return source
  }

  return source
}

function useDebouncedImageSrc(src?: string) {
  const [debouncedSrc, setDebouncedSrc] = useState(src)

  useEffect(() => {
    const delayMs = src?.trim() ? IMAGE_PREVIEW_DELAY_MS : 0
    return scheduleTimeout(() => setDebouncedSrc(src), delayMs)
  }, [src])

  return debouncedSrc
}

export function DisplayImageSlot({
  alt,
  label,
  src,
  className = '',
}: DisplayImageSlotProps) {
  const displaySrc = toDisplayImageSrc(useDebouncedImageSrc(src))

  if (displaySrc) {
    return (
      <img
        alt={alt}
        className={className ? `display-image-slot ${className}` : 'display-image-slot'}
        src={displaySrc}
      />
    )
  }

  return (
    <div
      aria-label={alt}
      className={
        className
          ? `display-image-slot image-placeholder ${className}`
          : 'display-image-slot image-placeholder'
      }
      role="img"
    >
      <span>{label}</span>
    </div>
  )
}
