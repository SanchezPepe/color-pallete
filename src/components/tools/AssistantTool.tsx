import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MessageSquare, Send, Sparkles, Palette, Type, Maximize, Layers, Blend, Zap, Copy, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: Suggestion[]
}

interface Suggestion {
  type: 'color' | 'typography' | 'spacing' | 'shadow' | 'gradient' | 'motion'
  title: string
  value: string
  preview?: string
}

const suggestionPrompts = [
  { icon: Palette, text: "Suggest a color palette for a fintech app", category: 'colors' },
  { icon: Type, text: "Recommend font pairings for a modern website", category: 'typography' },
  { icon: Maximize, text: "What spacing scale works best for mobile apps?", category: 'spacing' },
  { icon: Layers, text: "Create subtle shadow presets for cards", category: 'shadows' },
  { icon: Blend, text: "Generate gradient ideas for dark mode", category: 'gradients' },
  { icon: Zap, text: "Suggest micro-animation timings", category: 'motion' },
]

// Mock AI responses (in production, this would call an actual API)
const mockResponses: Record<string, { content: string; suggestions?: Suggestion[] }> = {
  colors: {
    content: "For a fintech app, I recommend a professional color palette that conveys trust and stability. Here's a suggested palette:",
    suggestions: [
      { type: 'color', title: 'Primary Blue', value: '#0066FF', preview: '#0066FF' },
      { type: 'color', title: 'Success Green', value: '#10B981', preview: '#10B981' },
      { type: 'color', title: 'Warning Amber', value: '#F59E0B', preview: '#F59E0B' },
      { type: 'color', title: 'Neutral Gray', value: '#64748B', preview: '#64748B' },
    ]
  },
  typography: {
    content: "For a modern website, I recommend these font pairings that balance readability with contemporary aesthetics:",
    suggestions: [
      { type: 'typography', title: 'Headings', value: 'Inter', preview: 'Inter' },
      { type: 'typography', title: 'Body', value: 'Source Sans Pro', preview: 'Source Sans Pro' },
      { type: 'typography', title: 'Alternative Pairing', value: 'Poppins + Roboto', preview: 'Poppins + Roboto' },
    ]
  },
  spacing: {
    content: "For mobile apps, a 4px base unit with a consistent scale works well. Here are my recommendations:",
    suggestions: [
      { type: 'spacing', title: 'Base Unit', value: '4px' },
      { type: 'spacing', title: 'Compact Gap', value: '8px (2 units)' },
      { type: 'spacing', title: 'Standard Gap', value: '16px (4 units)' },
      { type: 'spacing', title: 'Section Gap', value: '32px (8 units)' },
    ]
  },
  shadows: {
    content: "For subtle card shadows, I suggest these presets that add depth without being too prominent:",
    suggestions: [
      { type: 'shadow', title: 'sm', value: '0 1px 2px rgba(0,0,0,0.05)' },
      { type: 'shadow', title: 'md', value: '0 4px 6px rgba(0,0,0,0.07)' },
      { type: 'shadow', title: 'lg', value: '0 10px 15px rgba(0,0,0,0.1)' },
    ]
  },
  gradients: {
    content: "For dark mode gradients, subtle shifts work best. Here are some suggestions:",
    suggestions: [
      { type: 'gradient', title: 'Midnight', value: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', preview: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' },
      { type: 'gradient', title: 'Deep Purple', value: 'linear-gradient(135deg, #2d1b4e 0%, #1a1a2e 100%)', preview: 'linear-gradient(135deg, #2d1b4e 0%, #1a1a2e 100%)' },
      { type: 'gradient', title: 'Ocean Night', value: 'linear-gradient(135deg, #0a192f 0%, #112240 100%)', preview: 'linear-gradient(135deg, #0a192f 0%, #112240 100%)' },
    ]
  },
  motion: {
    content: "For micro-animations, keep things snappy. Here are optimal timing suggestions:",
    suggestions: [
      { type: 'motion', title: 'Instant', value: '50ms - Button feedback' },
      { type: 'motion', title: 'Fast', value: '150ms - Hover states' },
      { type: 'motion', title: 'Normal', value: '200ms - Transitions' },
      { type: 'motion', title: 'Slow', value: '300ms - Complex animations' },
    ]
  },
  default: {
    content: "I can help you with various design decisions. Try asking about color palettes, typography, spacing, shadows, gradients, or motion design. What aspect of your visual identity would you like to explore?",
  }
}

export function AssistantTool() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI design assistant. I can help you create cohesive visual identities by suggesting colors, typography, spacing, and more. What would you like to explore?",
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const detectCategory = (text: string): string => {
    const lower = text.toLowerCase()
    if (lower.includes('color') || lower.includes('palette') || lower.includes('hex') || lower.includes('rgb')) return 'colors'
    if (lower.includes('font') || lower.includes('typo') || lower.includes('text') || lower.includes('heading')) return 'typography'
    if (lower.includes('spacing') || lower.includes('margin') || lower.includes('padding') || lower.includes('gap')) return 'spacing'
    if (lower.includes('shadow') || lower.includes('elevation') || lower.includes('depth')) return 'shadows'
    if (lower.includes('gradient') || lower.includes('blend')) return 'gradients'
    if (lower.includes('motion') || lower.includes('animation') || lower.includes('transition') || lower.includes('timing')) return 'motion'
    return 'default'
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

    const category = detectCategory(input)
    const response = mockResponses[category] || mockResponses.default

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response.content,
      timestamp: new Date(),
      suggestions: response.suggestions,
    }

    setMessages(prev => [...prev, assistantMessage])
    setIsTyping(false)
  }

  const handlePromptClick = (text: string) => {
    setInput(text)
  }

  const copySuggestion = (value: string) => {
    navigator.clipboard.writeText(value)
    toast.success('Copied to clipboard')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">
              AI Assistant
            </h1>
            <p className="text-xs text-gray-500">Powered by AI design intelligence</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMessages([{
            id: '1',
            role: 'assistant',
            content: "Hi! I'm your AI design assistant. I can help you create cohesive visual identities by suggesting colors, typography, spacing, and more. What would you like to explore?",
            timestamp: new Date(),
          }])}
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          New Chat
        </Button>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {/* Messages */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3",
                  message.role === 'user'
                    ? 'bg-violet-500 text-white rounded-br-md'
                    : 'bg-white border shadow-sm rounded-bl-md'
                )}
              >
                <p className={cn(
                  "text-sm",
                  message.role === 'assistant' && 'text-gray-700'
                )}>
                  {message.content}
                </p>

                {/* Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.suggestions.map((suggestion, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg group"
                      >
                        {suggestion.type === 'color' && suggestion.preview && (
                          <div
                            className="w-8 h-8 rounded-md border shadow-sm"
                            style={{ backgroundColor: suggestion.preview }}
                          />
                        )}
                        {suggestion.type === 'gradient' && suggestion.preview && (
                          <div
                            className="w-8 h-8 rounded-md border shadow-sm"
                            style={{ background: suggestion.preview }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-800">{suggestion.title}</p>
                          <p className="text-xs text-gray-500 truncate">{suggestion.value}</p>
                        </div>
                        <button
                          onClick={() => copySuggestion(suggestion.value)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                        >
                          <Copy className="w-3 h-3 text-gray-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border shadow-sm rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-gray-500 mb-2">Try asking about:</p>
            <div className="flex flex-wrap gap-2">
              {suggestionPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handlePromptClick(prompt.text)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs bg-white border rounded-full hover:bg-gray-50 transition-colors text-gray-700"
                >
                  <prompt.icon className="w-3 h-3 text-violet-500" />
                  {prompt.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 bg-white border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about colors, typography, spacing..."
              className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              className="rounded-full bg-violet-500 hover:bg-violet-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
