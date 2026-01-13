import { Borders } from '@/types';

// Default border radius scale
export const defaultRadii: Record<string, number> = {
  none: 0,
  sm: 2,
  DEFAULT: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  full: 9999,
};

// Default border widths
export const defaultWidths: number[] = [0, 1, 2, 4, 8];

// Border radius presets
export const radiusPresets = {
  sharp: {
    none: 0,
    sm: 0,
    DEFAULT: 2,
    md: 2,
    lg: 4,
    xl: 4,
    '2xl': 6,
    '3xl': 8,
    full: 9999,
  },
  rounded: {
    none: 0,
    sm: 4,
    DEFAULT: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    full: 9999,
  },
  pill: {
    none: 0,
    sm: 8,
    DEFAULT: 16,
    md: 24,
    lg: 32,
    xl: 48,
    '2xl': 64,
    '3xl': 96,
    full: 9999,
  },
};

export type RadiusPreset = keyof typeof radiusPresets;

// Create default borders configuration
export function createDefaultBorders(): Borders {
  return {
    radii: { ...defaultRadii },
    widths: [...defaultWidths],
    defaultRadius: 'DEFAULT',
  };
}

// Generate CSS for borders
export function generateBordersCss(borders: Borders): string {
  const lines: string[] = [':root {'];

  // Border radii
  Object.entries(borders.radii).forEach(([key, value]) => {
    const varName = key === 'DEFAULT' ? '--radius' : `--radius-${key}`;
    lines.push(`  ${varName}: ${value}px;`);
  });

  lines.push('');

  // Border widths
  borders.widths.forEach(width => {
    lines.push(`  --border-${width}: ${width}px;`);
  });

  lines.push('}');
  return lines.join('\n');
}

// Generate Tailwind config for borders
export function generateBordersTailwind(borders: Borders): string {
  const radiusEntries = Object.entries(borders.radii)
    .map(([key, value]) => `      ${key === 'DEFAULT' ? 'DEFAULT' : `'${key}'`}: '${value}px',`)
    .join('\n');

  const widthEntries = borders.widths
    .map(w => `      '${w}': '${w}px',`)
    .join('\n');

  return `module.exports = {
  theme: {
    borderRadius: {
${radiusEntries}
    },
    borderWidth: {
${widthEntries}
    },
  },
}`;
}
