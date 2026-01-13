import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  generateSpacingScale,
  defaultContainers,
  defaultBreakpoints,
  displaySpacingSizes,
  generateSpacingCss,
  BaseUnit,
} from '@/lib/spacing'
import { Spacing } from '@/types'
import { Maximize, Copy, Grid3X3 } from 'lucide-react'
import { toast } from 'sonner'

export function SpacingTool() {
  const [baseUnit, setBaseUnit] = useState<BaseUnit>(4)
  const [containers, setContainers] = useState(defaultContainers)
  const [breakpoints, setBreakpoints] = useState(defaultBreakpoints)

  const spacingScale = useMemo(() => generateSpacingScale(baseUnit), [baseUnit])

  const spacing: Spacing = useMemo(() => ({
    baseUnit,
    scale: spacingScale,
    containers,
    breakpoints,
  }), [baseUnit, spacingScale, containers, breakpoints])

  const copyCSS = () => {
    const css = generateSpacingCss(spacing)
    navigator.clipboard.writeText(css)
    toast.success('CSS copied to clipboard')
  }

  const updateContainer = (key: string, value: number) => {
    setContainers(prev => ({ ...prev, [key]: value }))
  }

  const updateBreakpoint = (key: string, value: number) => {
    setBreakpoints(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
            <Maximize className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">
            Spacing
          </h1>
        </div>
        <Button onClick={copyCSS} variant="outline" className="gap-2">
          <Copy className="w-4 h-4" />
          Export CSS
        </Button>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6 space-y-8">
          {/* Base Unit Selection */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Base Unit</h2>
                <p className="text-sm text-gray-500">The foundation of your spacing scale</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={baseUnit === 4 ? 'default' : 'outline'}
                  onClick={() => setBaseUnit(4)}
                  className={cn(baseUnit === 4 && 'bg-green-600 hover:bg-green-700')}
                >
                  4px
                </Button>
                <Button
                  variant={baseUnit === 8 ? 'default' : 'outline'}
                  onClick={() => setBaseUnit(8)}
                  className={cn(baseUnit === 8 && 'bg-green-600 hover:bg-green-700')}
                >
                  8px
                </Button>
              </div>
            </div>
          </section>

          {/* Spacing Scale Visual */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Spacing Scale</h2>
            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
              {displaySpacingSizes.map(({ key, label }) => {
                const value = spacingScale[key] || 0
                return (
                  <div key={key} className="flex items-center gap-4">
                    <div className="w-12 text-right">
                      <span className="text-sm font-mono text-gray-600">{label}</span>
                    </div>
                    <div className="w-16 text-right">
                      <span className="text-xs font-mono text-gray-400">{value}px</span>
                    </div>
                    <div className="flex-1 h-6 bg-gray-200 rounded overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded transition-all"
                        style={{ width: Math.min(value, 400) }}
                      />
                    </div>
                    <div
                      className="bg-green-500 rounded"
                      style={{ width: Math.min(value, 64), height: Math.min(value, 64), minWidth: 4, minHeight: 4 }}
                    />
                  </div>
                )
              })}
            </div>
          </section>

          {/* Container Widths */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Grid3X3 className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-800">Container Widths</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(containers).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">{key}</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => updateContainer(key, Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    />
                    <span className="text-xs text-gray-400">px</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Visual container preview */}
            <div className="bg-gray-100 rounded-lg p-4 overflow-x-auto">
              <div className="relative h-8 min-w-[800px]">
                {Object.entries(containers).map(([key, value], index) => (
                  <div
                    key={key}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 border-2 border-green-500 rounded"
                    style={{
                      width: value / 2,
                      height: 8 + index * 4,
                      opacity: 0.3 + index * 0.15,
                    }}
                  >
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-gray-500">
                      {key}: {value}px
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Breakpoints */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Responsive Breakpoints</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(breakpoints).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">{key}</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => updateBreakpoint(key, Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    />
                    <span className="text-xs text-gray-400">px</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Breakpoint visualization */}
            <div className="bg-gray-100 rounded-lg p-4 overflow-x-auto">
              <div className="flex items-end gap-1 min-w-[600px]">
                {Object.entries(breakpoints).map(([key, value]) => (
                  <div key={key} className="flex flex-col items-center">
                    <span className="text-xs text-gray-500 mb-1">{key}</span>
                    <div
                      className="bg-green-500 rounded-t"
                      style={{ width: 60, height: value / 20 }}
                    />
                    <span className="text-xs text-gray-400 mt-1">{value}px</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Usage Examples */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Usage Examples</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Padding example */}
              <div className="bg-white border rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-600 mb-3">Padding</h3>
                <div className="space-y-2">
                  {[2, 4, 6, 8].map(mult => (
                    <div key={mult} className="flex items-center gap-2">
                      <span className="text-xs font-mono text-gray-400 w-8">p-{mult}</span>
                      <div className="bg-green-100 rounded">
                        <div
                          className="bg-white border border-dashed border-green-400 rounded text-xs text-gray-500 flex items-center justify-center"
                          style={{
                            padding: mult * baseUnit,
                            minWidth: 60,
                          }}
                        >
                          Content
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{mult * baseUnit}px</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gap example */}
              <div className="bg-white border rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-600 mb-3">Gap</h3>
                <div className="space-y-4">
                  {[2, 4, 6].map(mult => (
                    <div key={mult}>
                      <span className="text-xs font-mono text-gray-400">gap-{mult} ({mult * baseUnit}px)</span>
                      <div className="flex mt-1" style={{ gap: mult * baseUnit }}>
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="w-8 h-8 bg-green-500 rounded" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
