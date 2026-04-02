type DisplayImageSlotProps = {
  alt: string
  label: string
  src?: string
  className?: string
}

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

export function DisplayImageSlot({
  alt,
  label,
  src,
  className = '',
}: DisplayImageSlotProps) {
  const displaySrc = toDisplayImageSrc(src)

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
