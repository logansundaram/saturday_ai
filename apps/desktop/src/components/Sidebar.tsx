import { MessageSquare, GitBranch, Monitor, Settings } from 'lucide-react'

const ICONS = [
  { Icon: MessageSquare, label: 'Chat' },
  { Icon: GitBranch, label: 'Workflows' },
  { Icon: Monitor, label: 'System' },
  { Icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  return (
    <div className="flex flex-col items-center gap-1 w-12 flex-shrink-0 bg-neutral-900 border-r border-neutral-700 py-2">
      {ICONS.map(({ Icon, label }) => (
        <button
          key={label}
          title={label}
          className="p-2.5 rounded text-neutral-600 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
        >
          <Icon size={17} strokeWidth={1.5} />
        </button>
      ))}
    </div>
  )
}
