import { useState } from 'react'
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
  presetGradients,
  gradientDirections,
  generateGradientCss,
} from '@/lib/gradients'
import { Gradient } from '@/types'
import { Blend, Copy, Plus } from 'lucide-react'
import { toast } from 'sonner'

export function GradientTool() {
  const [gradients, setGradients] = useState<Gradient[]>(presetGradients)
  const [selectedId, setSelectedId] = useState<string>(presetGradients[0].id)

  const selected = gradients.find(g => g.id === selectedId) || gradients[0]

  const updateGradient = (updates: Partial<Gradient>) => {
    setGradients(prev => prev.map(g =>
      g.id === selectedId ? { ...g, ...updates } : g
    ))
  }

  const updateStop = (index: number, updates: { color?: string; position?: number }) => {
    const newStops = [...selected.stops]
    newStops[index] = { ...newStops[index], ...updates }
    updateGradient({ stops: newStops })
  }

  const addStop = () => {
    if (selected.stops.length >= 5) {
      toast.error('Maximum 5 color stops')
      return
    }
    const lastPos = selected.stops[selected.stops.length - 1]?.position || 0
    const newPos = Math.min(100, lastPos + 20)
    updateGradient({
      stops: [...selected.stops, { color: '#6366f1', position: newPos }]
    })
  }

  const removeStop = (index: number) => {
    if (selected.stops.length <= 2) {
      toast.error('Minimum 2 color stops required')
      return
    }
    updateGradient({
      stops: selected.stops.filter((_, i) => i !== index)
    })
  }

  const copyCss = () => {
    const css = `background: ${generateGradientCss(selected)};`
    navigator.clipboard.writeText(css)
    toast.success('CSS copied')
  }

  const copyAllCss = () => {
    const css = gradients.map(g =>
      `.gradient-${g.id} {\n  background: ${generateGradientCss(g)};\n}`
    ).join('\n\n')
    navigator.clipboard.writeText(css)
    toast.success('All gradients CSS copied')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-violet-600 flex items-center justify-center">
            <Blend className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">
            Gradients
          </h1>
        </div>
        <Button onClick={copyAllCss} variant="outline" className="gap-2">
          <Copy className="w-4 h-4" />
          Export All
        </Button>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6 space-y-8">
          {/* Gradient Presets */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Gradient Presets</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gradients.map(gradient => (
                <button
                  key={gradient.id}
                  onClick={() => setSelectedId(gradient.id)}
                  className={cn(
                    "h-24 rounded-lg transition-all",
                    selectedId === gradient.id
                      ? "ring-2 ring-offset-2 ring-violet-500"
                      : "hover:scale-105"
                  )}
                  style={{ background: generateGradientCss(gradient) }}
                >
                  <span className="text-white text-sm font-medium drop-shadow-md">
                    {gradient.name}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Selected Gradient Editor */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Edit Gradient</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Preview */}
              <div
                className="h-64 rounded-xl flex items-center justify-center"
                style={{ background: generateGradientCss(selected) }}
              >
                <span className="text-white text-2xl font-bold drop-shadow-lg">
                  {selected.name}
                </span>
              </div>

              {/* Controls */}
              <div className="space-y-4">
                {/* Type & Direction */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Type</label>
                    <Select
                      value={selected.type}
                      onValueChange={(v) => updateGradient({ type: v as 'linear' | 'radial' })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linear">Linear</SelectItem>
                        <SelectItem value="radial">Radial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Direction</label>
                    <Select
                      value={selected.direction}
                      onValueChange={(v) => updateGradient({ direction: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {selected.type === 'linear' ? (
                          gradientDirections.map(d => (
                            <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                          ))
                        ) : (
                          <>
                            <SelectItem value="circle">Circle</SelectItem>
                            <SelectItem value="ellipse">Ellipse</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Color Stops */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-600">Color Stops</label>
                    <Button size="sm" variant="outline" onClick={addStop}>
                      <Plus className="w-3 h-3 mr-1" /> Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {selected.stops.map((stop, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="color"
                          value={stop.color}
                          onChange={(e) => updateStop(i, { color: e.target.value })}
                          className="w-10 h-10 rounded border cursor-pointer"
                        />
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={stop.position}
                          onChange={(e) => updateStop(i, { position: Number(e.target.value) })}
                          className="w-20 px-2 py-1 border rounded text-sm"
                        />
                        <span className="text-xs text-gray-400">%</span>
                        {selected.stops.length > 2 && (
                          <button
                            onClick={() => removeStop(i)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Copy Button */}
                <Button onClick={copyCss} className="w-full gap-2">
                  <Copy className="w-4 h-4" />
                  Copy CSS
                </Button>
              </div>
            </div>
          </section>

          {/* Usage Examples */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Usage Examples</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Button */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h3 className="text-sm font-medium text-gray-600">Button</h3>
                <button
                  className="w-full py-3 rounded-lg text-white font-medium shadow-lg"
                  style={{ background: generateGradientCss(selected) }}
                >
                  Gradient Button
                </button>
              </div>

              {/* Card */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h3 className="text-sm font-medium text-gray-600">Card Header</h3>
                <div className="rounded-lg overflow-hidden shadow">
                  <div
                    className="h-20"
                    style={{ background: generateGradientCss(selected) }}
                  />
                  <div className="bg-white p-4">
                    <p className="text-sm text-gray-600">Card content here</p>
                  </div>
                </div>
              </div>

              {/* Text */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h3 className="text-sm font-medium text-gray-600">Text Gradient</h3>
                <h2
                  className="text-3xl font-bold bg-clip-text text-transparent"
                  style={{ backgroundImage: generateGradientCss(selected) }}
                >
                  Gradient Text
                </h2>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
