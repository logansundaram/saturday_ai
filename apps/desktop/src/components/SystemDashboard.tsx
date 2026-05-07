import { useEffect, useState } from 'react'
import type { SystemMetrics } from '@saturday-ai/shared'

const MAX_HISTORY = 60

function Bar({ value }: { value: number }) {
  return (
    <div className="h-1 bg-neutral-700 rounded-full overflow-hidden mt-1">
      <div
        className="h-full bg-blue-600 transition-all duration-500 ease-out"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  )
}

function toGB(bytes: number) {
  return (bytes / 1024 ** 3).toFixed(1)
}

export default function SystemDashboard() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [, setHistory] = useState<SystemMetrics[]>([])

  useEffect(() => {
    const cleanup = window.saturday.onSystemMetrics((m) => {
      setMetrics(m)
      setHistory((prev) => [...prev.slice(-(MAX_HISTORY - 1)), m])
    })
    return cleanup
  }, [])

  return (
    <div className="flex flex-col w-60 flex-shrink-0 bg-neutral-900">
      <div className="px-3 py-1.5 text-xs text-neutral-500 uppercase tracking-widest border-b border-neutral-700 bg-neutral-800">
        System
      </div>

      <div className="flex-1 overflow-auto p-3 space-y-5">
        {!metrics ? (
          <p className="text-xs text-neutral-600">Waiting for metrics...</p>
        ) : (
          <>
            <div>
              <p className="text-xs text-neutral-600 mb-2 truncate" title={metrics.cpuModel}>
                {metrics.cpuModel}
              </p>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">CPU</span>
                <span className="tabular-nums">{metrics.cpuUsage}%</span>
              </div>
              <Bar value={metrics.cpuUsage} />
              <p className="text-xs text-neutral-700 mt-1">{metrics.cpuCores} cores</p>
            </div>

            <div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">RAM</span>
                <span className="tabular-nums text-neutral-400">
                  {toGB(metrics.memoryUsed)} / {toGB(metrics.memoryTotal)} GB
                </span>
              </div>
              <Bar value={(metrics.memoryUsed / metrics.memoryTotal) * 100} />
            </div>

            <div>
              <p className="text-xs text-neutral-600 mb-2 truncate" title={metrics.gpuModel ?? 'No GPU detected'}>
                {metrics.gpuModel ?? 'No GPU detected'}
              </p>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">GPU</span>
                <span className="tabular-nums">
                  {metrics.gpuUsage != null ? `${metrics.gpuUsage}%` : 'N/A'}
                </span>
              </div>
              {metrics.gpuUsage != null && <Bar value={metrics.gpuUsage} />}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
