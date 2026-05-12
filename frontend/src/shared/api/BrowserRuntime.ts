export const browserRuntime = {
  delay(delayMs: number) {
    return new Promise<void>((resolve) => window.setTimeout(resolve, delayMs))
  },
  scheduleTimeout(callback: () => void, delayMs: number) {
    const timer = window.setTimeout(callback, delayMs)
    return () => window.clearTimeout(timer)
  },
  requestNextPaint() {
    return new Promise<void>((resolve) => {
      window.requestAnimationFrame(() => resolve())
    })
  },
  startInterval(callback: () => void, intervalMs: number) {
    const timer = window.setInterval(callback, intervalMs)
    return () => window.clearInterval(timer)
  },
}
