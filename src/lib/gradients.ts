import { Gradient } from '@/types';

// Gradient directions for linear gradients
export const gradientDirections = [
  { value: 'to right', label: 'Right', angle: 90 },
  { value: 'to left', label: 'Left', angle: 270 },
  { value: 'to bottom', label: 'Down', angle: 180 },
  { value: 'to top', label: 'Up', angle: 0 },
  { value: 'to bottom right', label: 'Bottom Right', angle: 135 },
  { value: 'to bottom left', label: 'Bottom Left', angle: 225 },
  { value: 'to top right', label: 'Top Right', angle: 45 },
  { value: 'to top left', label: 'Top Left', angle: 315 },
];

// Preset gradients
export const presetGradients: Gradient[] = [
  {
    id: 'sunset',
    name: 'Sunset',
    type: 'linear',
    direction: 'to right',
    stops: [
      { color: '#f97316', position: 0 },
      { color: '#ec4899', position: 50 },
      { color: '#8b5cf6', position: 100 },
    ],
  },
  {
    id: 'ocean',
    name: 'Ocean',
    type: 'linear',
    direction: 'to right',
    stops: [
      { color: '#06b6d4', position: 0 },
      { color: '#3b82f6', position: 50 },
      { color: '#6366f1', position: 100 },
    ],
  },
  {
    id: 'forest',
    name: 'Forest',
    type: 'linear',
    direction: 'to right',
    stops: [
      { color: '#22c55e', position: 0 },
      { color: '#10b981', position: 50 },
      { color: '#14b8a6', position: 100 },
    ],
  },
  {
    id: 'rose',
    name: 'Rose',
    type: 'linear',
    direction: 'to right',
    stops: [
      { color: '#f43f5e', position: 0 },
      { color: '#ec4899', position: 100 },
    ],
  },
  {
    id: 'midnight',
    name: 'Midnight',
    type: 'linear',
    direction: 'to bottom right',
    stops: [
      { color: '#1e1b4b', position: 0 },
      { color: '#312e81', position: 50 },
      { color: '#4338ca', position: 100 },
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    type: 'linear',
    direction: 'to right',
    stops: [
      { color: '#fbbf24', position: 0 },
      { color: '#f59e0b', position: 50 },
      { color: '#d97706', position: 100 },
    ],
  },
  {
    id: 'aurora',
    name: 'Aurora',
    type: 'linear',
    direction: 'to right',
    stops: [
      { color: '#a855f7', position: 0 },
      { color: '#6366f1', position: 33 },
      { color: '#0ea5e9', position: 66 },
      { color: '#10b981', position: 100 },
    ],
  },
  {
    id: 'fire',
    name: 'Fire',
    type: 'radial',
    direction: 'circle',
    stops: [
      { color: '#fbbf24', position: 0 },
      { color: '#f97316', position: 50 },
      { color: '#dc2626', position: 100 },
    ],
  },
];

// Generate unique ID
export function generateGradientId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Generate CSS gradient string
export function generateGradientCss(gradient: Gradient): string {
  const stops = gradient.stops
    .map(stop => `${stop.color} ${stop.position}%`)
    .join(', ');

  if (gradient.type === 'linear') {
    return `linear-gradient(${gradient.direction}, ${stops})`;
  } else {
    return `radial-gradient(${gradient.direction}, ${stops})`;
  }
}

// Generate CSS for all gradients
export function generateGradientsCss(gradients: Gradient[]): string {
  const lines: string[] = [':root {'];

  gradients.forEach(gradient => {
    const css = generateGradientCss(gradient);
    lines.push(`  --gradient-${gradient.id}: ${css};`);
  });

  lines.push('}');
  return lines.join('\n');
}

// Generate Tailwind config for gradients
export function generateGradientsTailwind(gradients: Gradient[]): string {
  const entries = gradients
    .map(g => `      '${g.id}': '${generateGradientCss(g)}',`)
    .join('\n');

  return `module.exports = {
  theme: {
    extend: {
      backgroundImage: {
${entries}
      },
    },
  },
}`;
}

// Create gradient from palette colors
export function createGradientFromColors(
  colors: string[],
  direction: string = 'to right',
  type: 'linear' | 'radial' = 'linear'
): Gradient {
  const stops = colors.map((color, index) => ({
    color,
    position: Math.round((index / (colors.length - 1)) * 100),
  }));

  return {
    id: generateGradientId(),
    name: 'Custom',
    type,
    direction,
    stops,
  };
}
