import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import Navbar from '../components/Navbar'

const MODELS = [
  { id: 'claude-haiku-4-5-20251001', label: 'Haiku', description: 'Fast' },
  { id: 'claude-sonnet-4-6', label: 'Sonnet', description: 'Smart' },
]

export default function ChatPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const video = location.state?.video

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || streaming) return

    const userMsg = { role: 'user', content: text }
    const history = [...messages, userMsg]
    setMessages(history)
    setInput('')
    setStreaming(true)

    setMessages(prev => [...prev, { role: 'assistant', content: '', streaming: true }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.map(m => ({ role: m.role, content: m.content })),
          transcript: video.transcript,
          model: selectedModel,
        }),
      })

      if (!res.ok) throw new Error('Chat request failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        setMessages(prev => {
          const last = prev[prev.length - 1]
          return [...prev.slice(0, -1), { ...last, content: last.content + chunk }]
        })
      }
    } catch (err) {
      setMessages(prev => {
        const last = prev[prev.length - 1]
        return [...prev.slice(0, -1), { ...last, content: 'Something went wrong. Please try again.', error: true }]
      })
    } finally {
      setMessages(prev => {
        const last = prev[prev.length - 1]
        return [...prev.slice(0, -1), { ...last, streaming: false }]
      })
      setStreaming(false)
    }
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-white antialiased">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <p className="text-gray-500 text-sm">No video selected.</p>
          <button
            onClick={() => navigate('/highlights')}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold text-sm"
          >
            Analyze a Video
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-white antialiased">
      <Navbar />

      <div className="flex-none mt-16 px-6 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-sky-50/40">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-14 h-9 object-cover rounded flex-shrink-0 bg-gray-100"
            onError={e => { e.target.style.display = 'none' }}
          />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-800 truncate">{video.title}</p>
            <a
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-sky-600 hover:text-sky-700"
            >
              Open on YouTube
            </a>
          </div>
          <div className="ml-auto flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              {MODELS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedModel(m.id)}
                  disabled={streaming}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedModel === m.id
                      ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {m.label}
                  <span className={`ml-1 text-xs ${selectedModel === m.id ? 'text-sky-100' : 'text-gray-400'}`}>
                    {m.description}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => navigate('/highlights')}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Change video
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-sm mb-1">Ask anything about the video</p>
              <p className="text-gray-300 text-xs">Powered by Claude {MODELS.find(m => m.id === selectedModel)?.label}</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'user' ? (
                <div className="max-w-xl px-4 py-2.5 rounded-2xl rounded-tr-sm bg-gradient-to-br from-sky-500 to-indigo-500 text-white text-sm leading-relaxed shadow-sm">
                  {msg.content}
                </div>
              ) : (
                <div className={`max-w-xl px-4 py-3 rounded-2xl rounded-tl-sm border text-sm leading-relaxed ${
                  msg.error
                    ? 'border-red-200 bg-red-50 text-red-700'
                    : 'border-gray-200 bg-white text-gray-700 shadow-sm'
                }`}>
                  <ReactMarkdown
                    components={{
                      h1: ({children}) => <p className="font-bold text-base mb-1">{children}</p>,
                      h2: ({children}) => <p className="font-bold mb-1">{children}</p>,
                      h3: ({children}) => <p className="font-semibold mb-0.5">{children}</p>,
                      p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                      strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                      ul: ({children}) => <ul className="list-disc pl-4 mb-2 space-y-0.5">{children}</ul>,
                      ol: ({children}) => <ol className="list-decimal pl-4 mb-2 space-y-0.5">{children}</ol>,
                      li: ({children}) => <li>{children}</li>,
                      code: ({children}) => <code className="bg-gray-100 px-1 rounded text-xs font-mono">{children}</code>,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                  {msg.streaming && (
                    <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-sky-400 rounded-sm animate-pulse align-middle" />
                  )}
                </div>
              )}
            </div>
          ))}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="flex-none px-6 py-4 border-t border-gray-100 bg-white">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about the video..."
            disabled={streaming}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={streaming || !input.trim()}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-semibold text-sm transition-all shadow-md shadow-sky-200/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
