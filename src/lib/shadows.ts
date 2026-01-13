import { Shadow } from '@/types';

// Default shadow scale (similar to Tailwind)
export const defaultShadows: Shadow[] = [
  { name: 'sm', value: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
  { name: 'DEFAULT', value: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' },
  { name: 'md', value: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' },
  { name: 'lg', value: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' },
  { name: 'xl', value: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' },
  { name: '2xl', value: '0 25px 50px -12px rgb(0 0 0 / 0.25)' },
  { name: 'inner', value: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)' },
  { name: 'none', value: 'none' },
];

// Shadow presets for different styles
export const shadowPresets = {
  subtle: [
    { name: 'sm', value: '0 1px 2px 0 rgb(0 0 0 / 0.03)' },
    { name: 'DEFAULT', value: '0 1px 3px 0 rgb(0 0 0 / 0.05)' },
    { name: 'md', value: '0 4px 6px -1px rgb(0 0 0 / 0.05)' },
    { name: 'lg', value: '0 10px 15px -3px rgb(0 0 0 / 0.05)' },
    { name: 'xl', value: '0 20px 25px -5px rgb(0 0 0 / 0.05)' },
  ],
  medium: defaultShadows.slice(0, 6),
  dramatic: [
    { name: 'sm', value: '0 2px 4px 0 rgb(0 0 0 / 0.15)' },
    { name: 'DEFAULT', value: '0 4px 6px 0 rgb(0 0 0 / 0.2)' },
    { name: 'md', value: '0 8px 12px -2px rgb(0 0 0 / 0.25)' },
    { name: 'lg', value: '0 16px 24px -4px rgb(0 0 0 / 0.3)' },
    { name: 'xl', value: '0 24px 48px -8px rgb(0 0 0 / 0.35)' },
  ],
  colored: [
    { name: 'sm', value: '0 1px 2px 0 rgb(59 130 246 / 0.2)' },
    { name: 'DEFAULT', value: '0 4px 6px -1px rgb(59 130 246 / 0.25)' },
    { name: 'md', value: '0 8px 12px -2px rgb(59 130 246 / 0.3)' },
    { name: 'lg', value: '0 16px 24px -4px rgb(59 130 246 / 0.35)' },
    { name: 'xl', value: '0 24px 48px -8px rgb(59 130 246 / 0.4)' },
  ],
};

export type ShadowPreset = keyof typeof shadowPresets;

// Generate custom shadow
export function generateShadow(
  offsetX: number,
  offsetY: number,
  blur: number,
  spread: number,
  color: string,
  opacity: number,
  inset: boolean = false
): string {
  const insetStr = inset ? 'inset ' : '';
  return `${insetStr}${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
}

// Generate CSS for shadows
export function generateShadowsCss(shadows: Shadow[]): string {
  const lines: string[] = [':root {'];

  shadows.forEach(shadow => {
    const varName = shadow.name === 'DEFAULT' ? '--shadow' : `--shadow-${shadow.name}`;
    lines.push(`  ${varName}: ${shadow.value};`);
  });

  lines.push('}');
  return lines.join('\n');
}

// Generate Tailwind config for shadows
export function generateShadowsTailwind(shadows: Shadow[]): string {
  const entries = shadows
    .map(s => `      ${s.name === 'DEFAULT' ? 'DEFAULT' : `'${s.name}'`}: '${s.value}',`)
    .join('\n');

  return `module.exports = {
  theme: {
    extend: {
      boxShadow: {
${entries}
      },
    },
  },
}`;
}
