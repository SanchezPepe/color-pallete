import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  defaultDurations,
  defaultEasings,
  animationPresets,
  AnimationPreset,
  generateMotionCss,
} from '@/lib/motion'
import { Motion } from '@/types'
import { Zap, Copy, Play, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'

export function MotionTool() {
  const [durations, setDurations] = useState(defaultDurations)
  const [easings] = useState(defaultEasings)
  const [selectedAnimation, setSelectedAnimation] = useState<AnimationPreset>('fadeIn')
  const [selectedDuration, setSelectedDuration] = useState('normal')
  const [selectedEasing, setSelectedEasing] = useState('ease-out')
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({})
  const previewRef = useRef<HTMLDivElement>(null)

  const motion: Motion = { durations, easings }

  const copyCSS = () => {
    const css = generateMotionCss(motion)
    navigator.clipboard.writeText(css)
    toast.success('CSS copied to clipboard')
  }

  const updateDuration = (key: string, value: number) => {
    setDurations(prev => ({ ...prev, [key]: value }))
  }

  const playAnimation = (animationName: string) => {
    setIsPlaying(prev => ({ ...prev, [animationName]: true }))
    setTimeout(() => {
      setIsPlaying(prev => ({ ...prev, [animationName]: false }))
    }, durations[selectedDuration] + 100)
  }

  const playPreview = () => {
    if (previewRef.current) {
      previewRef.current.style.animation = 'none'
      previewRef.current.offsetHeight // Trigger reflow
      previewRef.current.style.animation = `${selectedAnimation} ${durations[selectedDuration]}ms ${easings[selectedEasing]}`
    }
  }

  // Inject animation keyframes
  useEffect(() => {
    const style = document.createElement('style')
    style.setAttribute('data-motion-keyframes', 'true')
    style.textContent = Object.values(animationPresets)
      .map(p => p.keyframes)
      .join('\n')

    const old = document.querySelector('style[data-motion-keyframes]')
    if (old) old.remove()
    document.head.appendChild(style)

    return () => {
      style.remove()
    }
  }, [])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">
            Motion
          </h1>
        </div>
        <Button onClick={copyCSS} variant="outline" className="gap-2">
          <Copy className="w-4 h-4" />
          Export CSS
        </Button>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6 space-y-8">
          {/* Duration Scale */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Duration Scale</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {Object.entries(durations).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">{key}</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="2000"
                      step="50"
                      value={value}
                      onChange={(e) => updateDuration(key, Number(e.target.value))}
                      className="w-full px-2 py-1.5 border rounded text-sm"
                    />
                    <span className="text-xs text-gray-400">ms</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Visual duration bars */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              {Object.entries(durations).map(([key, value]) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="w-16 text-xs font-mono text-gray-500 text-right">{key}</span>
                  <div className="flex-1 h-4 bg-gray-200 rounded overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 rounded transition-all"
                      style={{ width: `${Math.min(value / 10, 100)}%` }}
                    />
                  </div>
                  <span className="w-12 text-xs text-gray-400">{value}ms</span>
                </div>
              ))}
            </div>
          </section>

          {/* Easing Functions */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Easing Functions</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(easings).map(([key, value]) => (
                <div
                  key={key}
                  className={cn(
                    "p-4 rounded-lg border transition-all cursor-pointer",
                    selectedEasing === key
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-gray-200 hover:border-yellow-300"
                  )}
                  onClick={() => setSelectedEasing(key)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-800">{key}</span>
                  </div>
                  {/* Easing curve visualization */}
                  <div className="h-16 bg-gray-100 rounded relative overflow-hidden">
                    <div
                      className={cn(
                        "absolute w-4 h-4 bg-yellow-500 rounded-full -translate-x-1/2 -translate-y-1/2",
                        isPlaying[key] && "animate-easing-demo"
                      )}
                      style={{
                        left: isPlaying[key] ? '100%' : '0%',
                        top: '50%',
                        transition: isPlaying[key] ? `left ${durations.normal}ms ${value}` : 'none',
                      }}
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      playAnimation(key)
                    }}
                    className="mt-2 text-xs text-yellow-600 hover:text-yellow-700 flex items-center gap-1"
                  >
                    <Play className="w-3 h-3" /> Preview
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Animation Presets */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Animation Presets</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(Object.keys(animationPresets) as AnimationPreset[]).map((name) => (
                <div
                  key={name}
                  className={cn(
                    "p-4 rounded-lg border transition-all cursor-pointer",
                    selectedAnimation === name
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-gray-200 hover:border-yellow-300"
                  )}
                  onClick={() => setSelectedAnimation(name)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-800">{name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        playAnimation(`preset-${name}`)
                      }}
                      className="text-yellow-600 hover:text-yellow-700"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="h-20 bg-gray-100 rounded flex items-center justify-center">
                    <div
                      className="w-12 h-12 bg-yellow-500 rounded-lg"
                      style={{
                        animation: isPlaying[`preset-${name}`]
                          ? `${name} ${durations.normal}ms ${easings['ease-out']}`
                          : 'none',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Interactive Preview */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Interactive Preview</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Animation</label>
                  <Select value={selectedAnimation} onValueChange={(v) => setSelectedAnimation(v as AnimationPreset)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(animationPresets) as AnimationPreset[]).map(name => (
                        <SelectItem key={name} value={name}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Duration</label>
                  <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(durations).map(name => (
                        <SelectItem key={name} value={name}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Easing</label>
                  <Select value={selectedEasing} onValueChange={setSelectedEasing}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(easings).map(name => (
                        <SelectItem key={name} value={name}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end gap-2">
                  <Button onClick={playPreview} className="gap-2 bg-yellow-500 hover:bg-yellow-600">
                    <Play className="w-4 h-4" /> Play
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (previewRef.current) {
                        previewRef.current.style.animation = 'none'
                      }
                    }}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="h-48 bg-white rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
                <div
                  ref={previewRef}
                  className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg flex items-center justify-center"
                >
                  <Zap className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-100 rounded font-mono text-sm text-gray-600">
                animation: {selectedAnimation} {durations[selectedDuration]}ms {selectedEasing};
              </div>
            </div>
          </section>

          {/* Transition Examples */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Transition Examples</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Hover Scale */}
              <div className="bg-white border rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-600 mb-3">Hover Scale</h3>
                <button
                  className="w-full py-3 bg-yellow-500 text-white rounded-lg font-medium transform transition-transform hover:scale-105"
                  style={{ transitionDuration: `${durations.fast}ms` }}
                >
                  Hover me
                </button>
              </div>

              {/* Hover Color */}
              <div className="bg-white border rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-600 mb-3">Hover Color</h3>
                <button
                  className="w-full py-3 bg-gray-200 hover:bg-yellow-500 hover:text-white rounded-lg font-medium transition-colors"
                  style={{ transitionDuration: `${durations.normal}ms` }}
                >
                  Hover me
                </button>
              </div>

              {/* Hover Shadow */}
              <div className="bg-white border rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-600 mb-3">Hover Shadow</h3>
                <button
                  className="w-full py-3 bg-white border border-gray-200 rounded-lg font-medium transition-shadow hover:shadow-lg"
                  style={{ transitionDuration: `${durations.normal}ms` }}
                >
                  Hover me
                </button>
              </div>

              {/* Hover Lift */}
              <div className="bg-white border rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-600 mb-3">Hover Lift</h3>
                <button
                  className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg font-medium transform transition-all hover:-translate-y-1 hover:shadow-lg"
                  style={{ transitionDuration: `${durations.normal}ms` }}
                >
                  Hover me
                </button>
              </div>

              {/* Active Press */}
              <div className="bg-white border rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-600 mb-3">Active Press</h3>
                <button
                  className="w-full py-3 bg-yellow-500 text-white rounded-lg font-medium transform transition-transform active:scale-95"
                  style={{ transitionDuration: `${durations.fast}ms` }}
                >
                  Click me
                </button>
              </div>

              {/* Focus Ring */}
              <div className="bg-white border rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-600 mb-3">Focus Ring</h3>
                <button
                  className="w-full py-3 bg-white border border-gray-300 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                  style={{ transitionDuration: `${durations.fast}ms` }}
                >
                  Focus me
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
