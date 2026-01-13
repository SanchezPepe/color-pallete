import { useState, useEffect } from 'react'
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
  typeScaleRatios,
  TypeScaleRatio,
  generateTypeScale,
  popularFonts,
  fontPairings,
  generateGoogleFontsUrl,
  defaultFonts,
} from '@/lib/typography'
import { FontConfig, TypeSize } from '@/types'
import { Type, Copy } from 'lucide-react'
import { toast } from 'sonner'

export function TypographyTool() {
  const [headingFont, setHeadingFont] = useState(defaultFonts[0].family)
  const [bodyFont, setBodyFont] = useState(defaultFonts[1].family)
  const [monoFont, setMonoFont] = useState(defaultFonts[2].family)
  const [scaleRatio, setScaleRatio] = useState<TypeScaleRatio>('Major Third')
  const [baseSize, setBaseSize] = useState(16)
  const [typeSizes, setTypeSizes] = useState<TypeSize[]>([])

  // Generate type scale when ratio or base size changes
  useEffect(() => {
    const ratio = typeScaleRatios[scaleRatio]
    setTypeSizes(generateTypeScale(baseSize, ratio))
  }, [scaleRatio, baseSize])

  // Load Google Fonts
  useEffect(() => {
    const fonts: FontConfig[] = [
      { role: 'heading', family: headingFont, weights: [400, 500, 600, 700, 800], fallback: '' },
      { role: 'body', family: bodyFont, weights: [400, 500, 600], fallback: '' },
      { role: 'mono', family: monoFont, weights: [400, 500], fallback: '' },
    ]

    const link = document.createElement('link')
    link.href = generateGoogleFontsUrl(fonts)
    link.rel = 'stylesheet'

    // Remove old font link if exists
    const oldLink = document.querySelector('link[data-typography-fonts]')
    if (oldLink) oldLink.remove()

    link.setAttribute('data-typography-fonts', 'true')
    document.head.appendChild(link)

    return () => {
      link.remove()
    }
  }, [headingFont, bodyFont, monoFont])

  const applyPairing = (pairing: { heading: string; body: string }) => {
    setHeadingFont(pairing.heading)
    setBodyFont(pairing.body)
    toast.success(`Applied ${pairing.heading} + ${pairing.body}`)
  }

  const copyCSS = () => {
    const css = `:root {
  --font-heading: "${headingFont}", ui-sans-serif, system-ui, sans-serif;
  --font-body: "${bodyFont}", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "${monoFont}", ui-monospace, monospace;

${typeSizes.map(s => `  --text-${s.name}: ${s.size}px;
  --leading-${s.name}: ${s.lineHeight};
  --tracking-${s.name}: ${s.letterSpacing}em;`).join('\n')}
}`
    navigator.clipboard.writeText(css)
    toast.success('CSS copied to clipboard')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Type className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">
            Typography
          </h1>
        </div>
        <Button onClick={copyCSS} variant="outline" className="gap-2">
          <Copy className="w-4 h-4" />
          Export CSS
        </Button>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6 space-y-8">
          {/* Font Selection */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Font Families</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Heading Font */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Heading Font</label>
                <Select value={headingFont} onValueChange={setHeadingFont}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {popularFonts.heading.map(font => (
                      <SelectItem key={font.name} value={font.name}>
                        {font.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p
                  className="text-2xl font-bold text-gray-800"
                  style={{ fontFamily: `"${headingFont}", sans-serif` }}
                >
                  The quick brown fox
                </p>
              </div>

              {/* Body Font */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Body Font</label>
                <Select value={bodyFont} onValueChange={setBodyFont}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {popularFonts.body.map(font => (
                      <SelectItem key={font.name} value={font.name}>
                        {font.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p
                  className="text-base text-gray-600"
                  style={{ fontFamily: `"${bodyFont}", sans-serif` }}
                >
                  The quick brown fox jumps over the lazy dog. This is how body text will appear.
                </p>
              </div>

              {/* Mono Font */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Monospace Font</label>
                <Select value={monoFont} onValueChange={setMonoFont}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {popularFonts.mono.map(font => (
                      <SelectItem key={font.name} value={font.name}>
                        {font.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p
                  className="text-sm text-gray-600"
                  style={{ fontFamily: `"${monoFont}", monospace` }}
                >
                  const greeting = "Hello";
                </p>
              </div>
            </div>
          </section>

          {/* Font Pairings */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Suggested Pairings</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {fontPairings.map((pairing, i) => (
                <button
                  key={i}
                  onClick={() => applyPairing(pairing)}
                  className={cn(
                    "p-4 rounded-lg border text-left transition-all hover:border-blue-500 hover:bg-blue-50",
                    headingFont === pairing.heading && bodyFont === pairing.body
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  )}
                >
                  <p className="text-sm font-medium text-gray-800">{pairing.heading}</p>
                  <p className="text-xs text-gray-500">+ {pairing.body}</p>
                  <p className="text-xs text-gray-400 mt-1">{pairing.description}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Type Scale */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Type Scale</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Base Size:</label>
                  <Select value={String(baseSize)} onValueChange={(v) => setBaseSize(Number(v))}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[12, 14, 16, 18, 20].map(size => (
                        <SelectItem key={size} value={String(size)}>
                          {size}px
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Ratio:</label>
                  <Select value={scaleRatio} onValueChange={(v) => setScaleRatio(v as TypeScaleRatio)}>
                    <SelectTrigger className="w-44">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(typeScaleRatios).map(([name, value]) => (
                        <SelectItem key={name} value={name}>
                          {name} ({value})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4 bg-gray-50 rounded-lg p-6">
              {typeSizes.slice().reverse().map((size) => (
                <div key={size.name} className="flex items-baseline gap-4">
                  <div className="w-16 text-right">
                    <span className="text-xs font-mono text-gray-500">{size.name}</span>
                  </div>
                  <div className="w-20 text-right">
                    <span className="text-xs font-mono text-gray-400">{size.size}px</span>
                  </div>
                  <p
                    className="text-gray-800"
                    style={{
                      fontFamily: size.name.includes('xl') || size.name === 'lg'
                        ? `"${headingFont}", sans-serif`
                        : `"${bodyFont}", sans-serif`,
                      fontSize: `${size.size}px`,
                      lineHeight: size.lineHeight,
                      letterSpacing: `${size.letterSpacing}em`,
                      fontWeight: size.name.includes('xl') ? 700 : 400,
                    }}
                  >
                    The quick brown fox jumps over the lazy dog
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Preview */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Preview</h2>
            <div className="bg-white rounded-lg border p-8 space-y-6">
              <h1
                className="text-4xl font-bold text-gray-900"
                style={{ fontFamily: `"${headingFont}", sans-serif` }}
              >
                Design your visual identity
              </h1>
              <h2
                className="text-2xl font-semibold text-gray-800"
                style={{ fontFamily: `"${headingFont}", sans-serif` }}
              >
                Create consistent, beautiful typography
              </h2>
              <p
                className="text-base text-gray-600 max-w-2xl"
                style={{ fontFamily: `"${bodyFont}", sans-serif`, lineHeight: 1.7 }}
              >
                Typography is the art and technique of arranging type to make written language
                legible, readable, and appealing when displayed. The arrangement of type involves
                selecting typefaces, point sizes, line lengths, line-spacing, and letter-spacing.
              </p>
              <pre
                className="bg-gray-100 p-4 rounded-lg text-sm text-gray-800"
                style={{ fontFamily: `"${monoFont}", monospace` }}
              >
{`function createIdentity(config) {
  return {
    fonts: config.fonts,
    colors: config.colors,
    spacing: config.spacing,
  };
}`}
              </pre>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
