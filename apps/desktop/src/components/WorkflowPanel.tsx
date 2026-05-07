import type { Workflow, StepLog } from '@saturday-ai/shared'

interface Props {
  workflow: Workflow | null
  logs: StepLog[]
}

const STATUS_STYLE: Record<string, string> = {
  pending: 'text-neutral-600 bg-neutral-800',
  running: 'text-yellow-400 bg-yellow-400/10',
  done: 'text-green-400 bg-green-400/10',
  error: 'text-red-400 bg-red-400/10',
}

export default function WorkflowPanel({ workflow, logs }: Props) {
  return (
    <div className="flex flex-col flex-1 min-w-0">
      <div className="px-3 py-1.5 text-xs text-neutral-500 uppercase tracking-widest border-b border-neutral-700 bg-neutral-800">
        Workflow
      </div>

      <div className="flex-1 overflow-auto p-3 space-y-2">
        {!workflow && (
          <p className="text-xs text-neutral-600">No workflow yet. Send a message.</p>
        )}

        {workflow?.nodes.map((node) => (
          <div
            key={node.id}
            className="bg-neutral-800 border border-neutral-700 rounded p-2.5"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-neutral-200">{node.label}</span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded ${STATUS_STYLE[node.status] ?? STATUS_STYLE.pending}`}
              >
                {node.status}
              </span>
            </div>
            {node.output && (
              <p className="text-xs text-neutral-500 leading-relaxed">{node.output}</p>
            )}
          </div>
        ))}

        {logs.length > 0 && (
          <div className="mt-4">
            <div className="text-xs text-neutral-600 uppercase tracking-widest mb-2">
              Logs
            </div>
            {logs.map((log, i) => (
              <div key={i} className="text-xs text-neutral-600 py-0.5 leading-relaxed">
                <span className="text-neutral-700">
                  [{new Date(log.timestamp).toLocaleTimeString()}]
                </span>{' '}
                <span className="text-neutral-500">{log.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
