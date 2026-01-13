import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Download, Copy, Check, FileJson, FileCode, Palette, Type, Maximize, Layers, Blend, Zap, Package, ChevronDown, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'

type ExportFormat = 'css' | 'scss' | 'tailwind' | 'json' | 'figma'
type ExportSection = 'colors' | 'typography' | 'spacing' | 'shadows' | 'gradients' | 'motion' | 'all'

interface FormatInfo {
  name: string
  description: string
  extension: string
  icon: typeof FileCode
}

const formats: Record<ExportFormat, FormatInfo> = {
  css: { name: 'CSS Variables', description: 'Native CSS custom properties', extension: '.css', icon: FileCode },
  scss: { name: 'SCSS Variables', description: 'Sass/SCSS variable definitions', extension: '.scss', icon: FileCode },
  tailwind: { name: 'Tailwind Config', description: 'Tailwind CSS configuration', extension: '.js', icon: FileCode },
  json: { name: 'JSON Tokens', description: 'Design tokens in JSON format', extension: '.json', icon: FileJson },
  figma: { name: 'Figma Tokens', description: 'Figma tokens plugin format', extension: '.json', icon: Package },
}

const sections: { id: ExportSection; name: string; icon: typeof Palette }[] = [
  { id: 'all', name: 'All Tokens', icon: Package },
  { id: 'colors', name: 'Colors', icon: Palette },
  { id: 'typography', name: 'Typography', icon: Type },
  { id: 'spacing', name: 'Spacing', icon: Maximize },
  { id: 'shadows', name: 'Shadows', icon: Layers },
  { id: 'gradients', name: 'Gradients', icon: Blend },
  { id: 'motion', name: 'Motion', icon: Zap },
]

// Generate mock export content
function generateExport(format: ExportFormat, section: ExportSection): string {
  const timestamp = new Date().toISOString()

  if (format === 'css') {
    return `/* Visual Identity Toolkit Export
 * Generated: ${timestamp}
 * Section: ${section}
 */

:root {
  /* Colors */
  --color-primary-50: #fdf2f8;
  --color-primary-100: #fce7f3;
  --color-primary-200: #fbcfe8;
  --color-primary-300: #f9a8d4;
  --color-primary-400: #f472b6;
  --color-primary-500: #ec4899;
  --color-primary-600: #db2777;
  --color-primary-700: #be185d;
  --color-primary-800: #9d174d;
  --color-primary-900: #831843;
  --color-primary-950: #500724;

  /* Typography */
  --font-heading: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-body: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;

  /* Spacing */
  --spacing-0: 0;
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-5: 1.25rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-10: 2.5rem;
  --spacing-12: 3rem;
  --spacing-16: 4rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

  /* Border Radius */
  --radius-none: 0;
  --radius-sm: 0.125rem;
  --radius: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-full: 9999px;

  /* Motion */
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
}`
  }

  if (format === 'scss') {
    return `// Visual Identity Toolkit Export
// Generated: ${timestamp}
// Section: ${section}

// Colors
$color-primary-50: #fdf2f8;
$color-primary-100: #fce7f3;
$color-primary-200: #fbcfe8;
$color-primary-300: #f9a8d4;
$color-primary-400: #f472b6;
$color-primary-500: #ec4899;
$color-primary-600: #db2777;
$color-primary-700: #be185d;
$color-primary-800: #9d174d;
$color-primary-900: #831843;
$color-primary-950: #500724;

// Typography
$font-heading: "Inter", ui-sans-serif, system-ui, sans-serif;
$font-body: "Inter", ui-sans-serif, system-ui, sans-serif;
$font-mono: "JetBrains Mono", ui-monospace, monospace;

$text-sizes: (
  xs: 0.75rem,
  sm: 0.875rem,
  base: 1rem,
  lg: 1.125rem,
  xl: 1.25rem,
  2xl: 1.5rem,
  3xl: 1.875rem,
  4xl: 2.25rem,
);

// Spacing
$spacing: (
  0: 0,
  1: 0.25rem,
  2: 0.5rem,
  3: 0.75rem,
  4: 1rem,
  5: 1.25rem,
  6: 1.5rem,
  8: 2rem,
  10: 2.5rem,
  12: 3rem,
  16: 4rem,
);

// Shadows
$shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
$shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
$shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
$shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
$shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

// Border Radius
$radius: (
  none: 0,
  sm: 0.125rem,
  default: 0.25rem,
  md: 0.375rem,
  lg: 0.5rem,
  xl: 0.75rem,
  2xl: 1rem,
  full: 9999px,
);

// Motion
$duration-fast: 150ms;
$duration-normal: 200ms;
$duration-slow: 300ms;
$ease-default: cubic-bezier(0.4, 0, 0.2, 1);
$ease-in: cubic-bezier(0.4, 0, 1, 1);
$ease-out: cubic-bezier(0, 0, 0.2, 1);`
  }

  if (format === 'tailwind') {
    return `// Visual Identity Toolkit - Tailwind Config
// Generated: ${timestamp}

module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
          950: '#500724',
        },
      },
      fontFamily: {
        heading: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
      transitionDuration: {
        fast: '150ms',
        normal: '200ms',
        slow: '300ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
      },
    },
  },
}`
  }

  if (format === 'json' || format === 'figma') {
    return JSON.stringify({
      meta: {
        generator: 'Visual Identity Toolkit',
        version: '1.0.0',
        generated: timestamp,
        section: section,
      },
      tokens: {
        colors: {
          primary: {
            50: { value: '#fdf2f8', type: 'color' },
            100: { value: '#fce7f3', type: 'color' },
            200: { value: '#fbcfe8', type: 'color' },
            300: { value: '#f9a8d4', type: 'color' },
            400: { value: '#f472b6', type: 'color' },
            500: { value: '#ec4899', type: 'color' },
            600: { value: '#db2777', type: 'color' },
            700: { value: '#be185d', type: 'color' },
            800: { value: '#9d174d', type: 'color' },
            900: { value: '#831843', type: 'color' },
            950: { value: '#500724', type: 'color' },
          },
        },
        typography: {
          fontFamily: {
            heading: { value: 'Inter', type: 'fontFamily' },
            body: { value: 'Inter', type: 'fontFamily' },
            mono: { value: 'JetBrains Mono', type: 'fontFamily' },
          },
          fontSize: {
            xs: { value: '12px', type: 'fontSize' },
            sm: { value: '14px', type: 'fontSize' },
            base: { value: '16px', type: 'fontSize' },
            lg: { value: '18px', type: 'fontSize' },
            xl: { value: '20px', type: 'fontSize' },
            '2xl': { value: '24px', type: 'fontSize' },
            '3xl': { value: '30px', type: 'fontSize' },
            '4xl': { value: '36px', type: 'fontSize' },
          },
        },
        spacing: {
          0: { value: '0', type: 'spacing' },
          1: { value: '4px', type: 'spacing' },
          2: { value: '8px', type: 'spacing' },
          3: { value: '12px', type: 'spacing' },
          4: { value: '16px', type: 'spacing' },
          6: { value: '24px', type: 'spacing' },
          8: { value: '32px', type: 'spacing' },
          12: { value: '48px', type: 'spacing' },
          16: { value: '64px', type: 'spacing' },
        },
        shadows: {
          sm: { value: '0 1px 2px 0 rgb(0 0 0 / 0.05)', type: 'boxShadow' },
          default: { value: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', type: 'boxShadow' },
          md: { value: '0 4px 6px -1px rgb(0 0 0 / 0.1)', type: 'boxShadow' },
          lg: { value: '0 10px 15px -3px rgb(0 0 0 / 0.1)', type: 'boxShadow' },
          xl: { value: '0 20px 25px -5px rgb(0 0 0 / 0.1)', type: 'boxShadow' },
        },
        motion: {
          duration: {
            fast: { value: '150ms', type: 'duration' },
            normal: { value: '200ms', type: 'duration' },
            slow: { value: '300ms', type: 'duration' },
          },
          easing: {
            default: { value: 'cubic-bezier(0.4, 0, 0.2, 1)', type: 'cubicBezier' },
            in: { value: 'cubic-bezier(0.4, 0, 1, 1)', type: 'cubicBezier' },
            out: { value: 'cubic-bezier(0, 0, 0.2, 1)', type: 'cubicBezier' },
          },
        },
      },
    }, null, 2)
  }

  return ''
}

export function ExportTool() {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('css')
  const [selectedSection, setSelectedSection] = useState<ExportSection>('all')
  const [copied, setCopied] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ all: true })

  const exportContent = generateExport(selectedFormat, selectedSection)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(exportContent)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadFile = () => {
    const format = formats[selectedFormat]
    const blob = new Blob([exportContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `visual-identity-tokens${format.extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(`Downloaded ${a.download}`)
  }

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Download className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">
            Export
          </h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={copyToClipboard} variant="outline" className="gap-2">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button onClick={downloadFile} className="gap-2 bg-emerald-500 hover:bg-emerald-600">
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Options */}
        <div className="w-80 border-r bg-gray-50 overflow-auto">
          <div className="p-4 space-y-6">
            {/* Format Selection */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Export Format</h2>
              <div className="space-y-2">
                {(Object.entries(formats) as [ExportFormat, FormatInfo][]).map(([key, format]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedFormat(key)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
                      selectedFormat === key
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-200 bg-white hover:border-emerald-300"
                    )}
                  >
                    <format.icon className={cn(
                      "w-5 h-5",
                      selectedFormat === key ? "text-emerald-600" : "text-gray-500"
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm font-medium",
                        selectedFormat === key ? "text-emerald-900" : "text-gray-800"
                      )}>
                        {format.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{format.description}</p>
                    </div>
                    <span className="text-xs text-gray-400">{format.extension}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Section Selection */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Include Sections</h2>
              <div className="space-y-1">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setSelectedSection(section.id)
                      toggleSection(section.id)
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left",
                      selectedSection === section.id
                        ? "bg-emerald-100 text-emerald-900"
                        : "hover:bg-gray-100 text-gray-700"
                    )}
                  >
                    {expandedSections[section.id] ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                    <section.icon className={cn(
                      "w-4 h-4",
                      selectedSection === section.id ? "text-emerald-600" : "text-gray-500"
                    )} />
                    <span className="text-sm font-medium">{section.name}</span>
                    {selectedSection === section.id && (
                      <Check className="w-4 h-4 ml-auto text-emerald-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Export Summary</h2>
              <div className="bg-white rounded-lg border p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Format</span>
                  <span className="font-medium text-gray-800">{formats[selectedFormat].name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Sections</span>
                  <span className="font-medium text-gray-800">{selectedSection === 'all' ? 'All' : '1'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Size</span>
                  <span className="font-medium text-gray-800">{(exportContent.length / 1024).toFixed(1)} KB</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-900">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
            <span className="text-sm text-gray-400">
              visual-identity-tokens{formats[selectedFormat].extension}
            </span>
            <span className="text-xs text-gray-500">
              {exportContent.split('\n').length} lines
            </span>
          </div>
          <pre className="flex-1 overflow-auto p-4 text-sm font-mono text-gray-300">
            <code>{exportContent}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
