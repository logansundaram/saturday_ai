import { useState } from 'react'
import type { ChatResponse } from '@saturday-ai/shared'
import Sidebar from './components/Sidebar'
import ChatPanel from './components/ChatPanel'
import WorkflowPanel from './components/WorkflowPanel'
import SystemDashboard from './components/SystemDashboard'

export default function App() {
  const [lastResponse, setLastResponse] = useState<ChatResponse | null>(null)

  return (
    <div className="flex h-full bg-neutral-900 text-neutral-300 font-mono overflow-hidden">
      <Sidebar />
      <ChatPanel onResponse={setLastResponse} />
      <div className="w-px bg-neutral-700 flex-shrink-0" />
      <WorkflowPanel
        workflow={lastResponse?.workflow ?? null}
        logs={lastResponse?.logs ?? []}
      />
      <div className="w-px bg-neutral-700 flex-shrink-0" />
      <SystemDashboard />
    </div>
  )
}
