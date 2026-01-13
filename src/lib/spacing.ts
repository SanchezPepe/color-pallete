import { Spacing } from '@/types';

// Base unit options
export const baseUnitOptions = [4, 8] as const;
export type BaseUnit = typeof baseUnitOptions[number];

// Generate spacing scale based on base unit
export function generateSpacingScale(baseUnit: number = 4): Record<string, number> {
  const multipliers = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96];

  const scale: Record<string, number> = {};

  multipliers.forEach(m => {
    const key = m === 0 ? '0' : m % 1 === 0 ? String(m) : m.toString().replace('.', '\\.');
    scale[key] = m * baseUnit;
  });

  return scale;
}

// Default container widths (in pixels)
export const defaultContainers: Record<string, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// Default breakpoints (in pixels)
export const defaultBreakpoints: Record<string, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// Create default spacing configuration
export function createDefaultSpacing(baseUnit: BaseUnit = 4): Spacing {
  return {
    baseUnit,
    scale: generateSpacingScale(baseUnit),
    containers: { ...defaultContainers },
    breakpoints: { ...defaultBreakpoints },
  };
}

// Common spacing presets
export const spacingPresets = {
  compact: {
    name: 'Compact',
    description: 'Tighter spacing for dense UIs',
    baseUnit: 4 as BaseUnit,
  },
  comfortable: {
    name: 'Comfortable',
    description: 'Standard spacing for most applications',
    baseUnit: 4 as BaseUnit,
  },
  spacious: {
    name: 'Spacious',
    description: 'More breathing room, good for marketing sites',
    baseUnit: 8 as BaseUnit,
  },
};

// Generate CSS for spacing
export function generateSpacingCss(spacing: Spacing): string {
  const lines: string[] = [':root {'];

  // Base unit
  lines.push(`  --spacing-unit: ${spacing.baseUnit}px;`);
  lines.push('');

  // Spacing scale
  Object.entries(spacing.scale).forEach(([key, value]) => {
    const cssKey = key.replace('\\.', '-');
    lines.push(`  --spacing-${cssKey}: ${value}px;`);
  });

  lines.push('');

  // Containers
  Object.entries(spacing.containers).forEach(([key, value]) => {
    lines.push(`  --container-${key}: ${value}px;`);
  });

  lines.push('');

  // Breakpoints
  Object.entries(spacing.breakpoints).forEach(([key, value]) => {
    lines.push(`  --breakpoint-${key}: ${value}px;`);
  });

  lines.push('}');

  return lines.join('\n');
}

// Generate Tailwind config for spacing
export function generateSpacingTailwindConfig(spacing: Spacing): string {
  const scaleEntries = Object.entries(spacing.scale)
    .map(([key, value]) => `      '${key.replace('\\.', '.')}': '${value}px',`)
    .join('\n');

  return `module.exports = {
  theme: {
    spacing: {
${scaleEntries}
    },
    screens: {
      sm: '${spacing.breakpoints.sm}px',
      md: '${spacing.breakpoints.md}px',
      lg: '${spacing.breakpoints.lg}px',
      xl: '${spacing.breakpoints.xl}px',
      '2xl': '${spacing.breakpoints['2xl']}px',
    },
    container: {
      screens: {
        sm: '${spacing.containers.sm}px',
        md: '${spacing.containers.md}px',
        lg: '${spacing.containers.lg}px',
        xl: '${spacing.containers.xl}px',
        '2xl': '${spacing.containers['2xl']}px',
      },
    },
  },
}`;
}

// Visual spacing sizes to display
export const displaySpacingSizes = [
  { key: '1', label: '1' },
  { key: '2', label: '2' },
  { key: '3', label: '3' },
  { key: '4', label: '4' },
  { key: '5', label: '5' },
  { key: '6', label: '6' },
  { key: '8', label: '8' },
  { key: '10', label: '10' },
  { key: '12', label: '12' },
  { key: '16', label: '16' },
  { key: '20', label: '20' },
  { key: '24', label: '24' },
  { key: '32', label: '32' },
  { key: '40', label: '40' },
  { key: '48', label: '48' },
  { key: '64', label: '64' },
];
