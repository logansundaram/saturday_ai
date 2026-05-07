import type { SystemMetrics } from '@saturday-ai/shared'

declare global {
  interface Window {
    saturday: {
      getSystemMetrics: () => Promise<SystemMetrics>
      onSystemMetrics: (callback: (metrics: SystemMetrics) => void) => () => void
    }
  }
}

export {}
