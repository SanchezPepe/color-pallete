import { Color, ExportFormat } from '@/types'
import { getColorName, hexToRgb, generateShades } from './colors'

export function generateExportOutput(colors: Color[], format: ExportFormat): string {
  switch (format) {
    case 'hex':
      return colors.map(c => c.hex).join('\n')

    case 'rgb':
      return colors.map(c => {
        const { r, g, b } = hexToRgb(c.hex)
        return `rgb(${r}, ${g}, ${b})`
      }).join('\n')

    case 'css':
      const cssVars = colors.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join('\n')
      return `:root {\n${cssVars}\n}`

    case 'json':
      return JSON.stringify({
        palette: colors.map(c => ({
          hex: c.hex,
          name: getColorName(c.hex)
        }))
      }, null, 2)

    case 'tailwind':
      return generateTailwindConfig(colors)

    case 'scss':
      return colors.map((c, i) => `$color-${i + 1}: ${c.hex};`).join('\n')

    default:
      return colors.map(c => c.hex).join('\n')
  }
}

function generateTailwindConfig(colors: Color[]): string {
  const colorEntries: string[] = []

  colors.forEach((color, index) => {
    const shades = generateShades(color.hex)
    const name = `color${index + 1}`
    const shadeLines = Object.entries(shades)
      .map(([shade, hex]) => `        ${shade}: '${hex}',`)
      .join('\n')

    colorEntries.push(`      '${name}': {\n${shadeLines}\n      },`)
  })

  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
${colorEntries.join('\n')}
      },
    },
  },
}`
}

export function generateCssVariablesWithShades(colors: Color[]): string {
  const lines: string[] = [':root {']

  colors.forEach((color, index) => {
    const shades = generateShades(color.hex)
    const name = `color-${index + 1}`

    Object.entries(shades).forEach(([shade, hex]) => {
      lines.push(`  --${name}-${shade}: ${hex};`)
    })
  })

  lines.push('}')
  return lines.join('\n')
}
