import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  defaultShadows,
  shadowPresets,
  ShadowPreset,
  generateShadowsCss,
} from '@/lib/shadows'
import { Shadow } from '@/types'
import { Layers, Copy } from 'lucide-react'
import { toast } from 'sonner'

export function ShadowTool() {
  const [preset, setPreset] = useState<ShadowPreset>('medium')
  const [shadows, setShadows] = useState<Shadow[]>(shadowPresets.medium)

  const handlePresetChange = (value: ShadowPreset) => {
    setPreset(value)
    setShadows(shadowPresets[value])
  }

  const copyCSS = () => {
    const css = generateShadowsCss(shadows)
    navigator.clipboard.writeText(css)
    toast.success('CSS copied to clipboard')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">
            Shadows
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Select value={preset} onValueChange={handlePresetChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="subtle">Subtle</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="dramatic">Dramatic</SelectItem>
              <SelectItem value="colored">Colored</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={copyCSS} variant="outline" className="gap-2">
            <Copy className="w-4 h-4" />
            Export CSS
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6 space-y-8">
          {/* Shadow Scale */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Shadow Scale</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {shadows.filter(s => s.name !== 'none' && s.name !== 'inner').map((shadow) => (
                <div key={shadow.name} className="space-y-3">
                  <div
                    className="bg-white rounded-lg p-8 flex items-center justify-center h-32"
                    style={{ boxShadow: shadow.value }}
                  >
                    <span className="text-gray-400 text-sm font-mono">
                      shadow-{shadow.name === 'DEFAULT' ? '' : shadow.name}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {shadow.name === 'DEFAULT' ? 'Default' : shadow.name.toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400 font-mono truncate" title={shadow.value}>
                      {shadow.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Elevation Preview */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Elevation Preview</h2>
            <div className="bg-gray-100 rounded-lg p-8">
              <div className="flex items-end justify-center gap-6 h-64">
                {shadows.filter(s => s.name !== 'none' && s.name !== 'inner').map((shadow, i) => (
                  <div
                    key={shadow.name}
                    className="bg-white rounded-lg w-20 flex items-center justify-center text-xs text-gray-500 font-mono"
                    style={{
                      boxShadow: shadow.value,
                      height: 60 + i * 30,
                    }}
                  >
                    {shadow.name === 'DEFAULT' ? 'def' : shadow.name}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Card Examples */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Card Examples</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['sm', 'DEFAULT', 'lg'].map(name => {
                const shadow = shadows.find(s => s.name === name)
                return shadow ? (
                  <div
                    key={name}
                    className="bg-white rounded-xl p-6 space-y-4"
                    style={{ boxShadow: shadow.value }}
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" />
                    <div>
                      <h3 className="font-semibold text-gray-800">Card Title</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        This is an example card using shadow-{name === 'DEFAULT' ? 'default' : name}.
                      </p>
                    </div>
                    <Button size="sm" className="w-full">Action</Button>
                  </div>
                ) : null
              })}
            </div>
          </section>

          {/* Inner Shadow */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Inner Shadow</h2>
            <div className="grid grid-cols-2 gap-6">
              <div
                className="bg-gray-200 rounded-lg p-8 h-32 flex items-center justify-center"
                style={{ boxShadow: defaultShadows.find(s => s.name === 'inner')?.value }}
              >
                <span className="text-gray-500 text-sm">Inset shadow</span>
              </div>
              <div className="bg-white rounded-lg p-8 h-32 flex items-center justify-center border">
                <span className="text-gray-400 text-sm">No shadow</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
