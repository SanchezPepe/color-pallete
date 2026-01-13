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
  defaultRadii,
  defaultWidths,
  radiusPresets,
  RadiusPreset,
  generateBordersCss,
} from '@/lib/borders'
import { Borders } from '@/types'
import { Square, Copy } from 'lucide-react'
import { toast } from 'sonner'

export function BorderTool() {
  const [preset, setPreset] = useState<RadiusPreset | 'default'>('default')
  const [radii, setRadii] = useState<Record<string, number>>(defaultRadii)
  const [widths] = useState<number[]>(defaultWidths)

  const handlePresetChange = (value: RadiusPreset | 'default') => {
    setPreset(value)
    if (value === 'default') {
      setRadii(defaultRadii)
    } else {
      setRadii(radiusPresets[value])
    }
  }

  const borders: Borders = {
    radii,
    widths,
    defaultRadius: 'DEFAULT',
  }

  const copyCSS = () => {
    const css = generateBordersCss(borders)
    navigator.clipboard.writeText(css)
    toast.success('CSS copied to clipboard')
  }

  const radiusKeys = ['none', 'sm', 'DEFAULT', 'md', 'lg', 'xl', '2xl', '3xl']

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <Square className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">
            Borders & Radius
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Select value={preset} onValueChange={handlePresetChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="sharp">Sharp</SelectItem>
              <SelectItem value="rounded">Rounded</SelectItem>
              <SelectItem value="pill">Pill</SelectItem>
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
          {/* Border Radius Scale */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Border Radius Scale</h2>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {radiusKeys.map((key) => {
                const value = radii[key]
                return (
                  <div key={key} className="space-y-2 text-center">
                    <div
                      className="bg-orange-500 w-20 h-20 mx-auto"
                      style={{ borderRadius: value }}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {key === 'DEFAULT' ? 'default' : key}
                      </p>
                      <p className="text-xs text-gray-400">{value}px</p>
                    </div>
                  </div>
                )
              })}
              <div className="space-y-2 text-center">
                <div
                  className="bg-orange-500 w-20 h-20 mx-auto"
                  style={{ borderRadius: radii.full }}
                />
                <div>
                  <p className="text-sm font-medium text-gray-700">full</p>
                  <p className="text-xs text-gray-400">9999px</p>
                </div>
              </div>
            </div>
          </section>

          {/* Border Widths */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Border Widths</h2>
            <div className="flex flex-wrap gap-6">
              {widths.map((width) => (
                <div key={width} className="space-y-2 text-center">
                  <div
                    className="w-20 h-20 bg-white"
                    style={{
                      border: `${width}px solid #f97316`,
                      borderRadius: radii.DEFAULT,
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700">border-{width}</p>
                    <p className="text-xs text-gray-400">{width}px</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Component Examples */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Component Examples</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Buttons */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h3 className="text-sm font-medium text-gray-600">Buttons</h3>
                <div className="flex flex-wrap gap-2">
                  {['sm', 'DEFAULT', 'lg', 'full'].map(key => (
                    <button
                      key={key}
                      className="px-4 py-2 bg-orange-500 text-white text-sm font-medium"
                      style={{ borderRadius: radii[key] }}
                    >
                      {key === 'DEFAULT' ? 'Default' : key}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cards */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h3 className="text-sm font-medium text-gray-600">Cards</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['sm', 'DEFAULT', 'lg', 'xl'].map(key => (
                    <div
                      key={key}
                      className="bg-white p-3 shadow-sm"
                      style={{ borderRadius: radii[key] }}
                    >
                      <p className="text-xs text-gray-500">{key === 'DEFAULT' ? 'Default' : key}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inputs */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h3 className="text-sm font-medium text-gray-600">Inputs</h3>
                <div className="space-y-2">
                  {['sm', 'DEFAULT', 'lg'].map(key => (
                    <input
                      key={key}
                      type="text"
                      placeholder={`rounded-${key === 'DEFAULT' ? 'default' : key}`}
                      className="w-full px-3 py-2 border text-sm"
                      style={{ borderRadius: radii[key] }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Avatars */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Avatar Shapes</h2>
            <div className="flex flex-wrap gap-6">
              {['none', 'sm', 'DEFAULT', 'lg', 'xl', 'full'].map(key => (
                <div key={key} className="text-center space-y-2">
                  <div
                    className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 mx-auto"
                    style={{ borderRadius: radii[key] }}
                  />
                  <p className="text-xs text-gray-500">{key === 'DEFAULT' ? 'default' : key}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
