import { useState } from 'react'
import type { ChatResponse } from '@saturday-ai/shared'

interface Props {
  onResponse: (r: ChatResponse) => void
}

export default function ChatPanel({ onResponse }: Props) {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState<ChatResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function send() {
    const text = message.trim()
    if (!text || loading) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      if (!res.ok) throw new Error(`API error ${res.status}`)
      const data: ChatResponse = await res.json()
      setResponse(data)
      onResponse(data)
      setMessage('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col w-80 flex-shrink-0 border-r border-neutral-700">
      <div className="px-3 py-1.5 text-xs text-neutral-500 uppercase tracking-widest border-b border-neutral-700 bg-neutral-800">
        Chat
      </div>

      <div className="flex-1 overflow-auto p-3 space-y-2">
        {!response && !error && (
          <p className="text-xs text-neutral-600">Send a message to start a workflow.</p>
        )}
        {error && (
          <div className="text-xs text-red-400 bg-neutral-800 border border-neutral-700 rounded p-2">
            {error}
          </div>
        )}
        {response && (
          <div className="text-sm text-neutral-300 bg-neutral-800 border border-neutral-700 rounded p-2 leading-relaxed">
            {response.answer}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-neutral-700 space-y-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              send()
            }
          }}
          placeholder="Message... (Enter to send)"
          rows={3}
          className="w-full bg-neutral-800 border border-neutral-700 rounded text-sm text-neutral-300 p-2 resize-none focus:outline-none focus:border-blue-600 placeholder-neutral-600"
        />
        <button
          onClick={send}
          disabled={loading || !message.trim()}
          className="w-full py-1.5 text-xs bg-blue-700 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed rounded text-white transition-colors"
        >
          {loading ? 'Running...' : 'Send'}
        </button>
      </div>
    </div>
  )
}
