// Business note: frontend browser runtime boundary for environment-dependent API behavior.
export function delay(delayMs: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, delayMs))
}

export function scheduleTimeout(callback: () => void, delayMs: number) {
  const timer = window.setTimeout(callback, delayMs)
  return () => window.clearTimeout(timer)
}

export function requestNextPaint() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => resolve())
  })
}

export function startInterval(callback: () => void, intervalMs: number) {
  const timer = window.setInterval(callback, intervalMs)
  return () => window.clearInterval(timer)
}
