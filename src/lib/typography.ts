import { TypeSize, FontConfig } from '@/types';

// Type scale ratios
export const typeScaleRatios = {
  'Minor Second': 1.067,
  'Major Second': 1.125,
  'Minor Third': 1.2,
  'Major Third': 1.25,
  'Perfect Fourth': 1.333,
  'Augmented Fourth': 1.414,
  'Perfect Fifth': 1.5,
  'Golden Ratio': 1.618,
} as const;

export type TypeScaleRatio = keyof typeof typeScaleRatios;

// Size names for the type scale
const sizeNames = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'];

// Generate a type scale based on ratio and base size
export function generateTypeScale(
  baseSize: number = 16,
  ratio: number = 1.25
): TypeSize[] {
  const sizes: TypeSize[] = [];
  const baseIndex = 2; // 'base' is at index 2

  for (let i = 0; i < sizeNames.length; i++) {
    const power = i - baseIndex;
    const size = Math.round(baseSize * Math.pow(ratio, power) * 100) / 100;

    sizes.push({
      name: sizeNames[i],
      size,
      lineHeight: calculateLineHeight(size),
      letterSpacing: calculateLetterSpacing(size),
    });
  }

  return sizes;
}

// Calculate optimal line height based on font size
export function calculateLineHeight(fontSize: number): number {
  // Smaller text needs more line height, larger text needs less
  if (fontSize <= 12) return 1.75;
  if (fontSize <= 16) return 1.625;
  if (fontSize <= 20) return 1.5;
  if (fontSize <= 28) return 1.4;
  if (fontSize <= 36) return 1.3;
  if (fontSize <= 48) return 1.2;
  return 1.1;
}

// Calculate letter spacing based on font size
export function calculateLetterSpacing(fontSize: number): number {
  // Larger text typically needs tighter tracking
  if (fontSize <= 12) return 0.025;
  if (fontSize <= 16) return 0;
  if (fontSize <= 24) return -0.01;
  if (fontSize <= 36) return -0.02;
  if (fontSize <= 48) return -0.025;
  return -0.03;
}

// Popular Google Fonts for different roles
export const popularFonts: Record<string, { name: string; category: string; weights: number[] }[]> = {
  heading: [
    { name: 'Inter', category: 'sans-serif', weights: [400, 500, 600, 700, 800] },
    { name: 'Poppins', category: 'sans-serif', weights: [400, 500, 600, 700, 800] },
    { name: 'Montserrat', category: 'sans-serif', weights: [400, 500, 600, 700, 800, 900] },
    { name: 'Playfair Display', category: 'serif', weights: [400, 500, 600, 700, 800, 900] },
    { name: 'Roboto', category: 'sans-serif', weights: [400, 500, 700, 900] },
    { name: 'Open Sans', category: 'sans-serif', weights: [400, 500, 600, 700, 800] },
    { name: 'Lato', category: 'sans-serif', weights: [400, 700, 900] },
    { name: 'Oswald', category: 'sans-serif', weights: [400, 500, 600, 700] },
    { name: 'Raleway', category: 'sans-serif', weights: [400, 500, 600, 700, 800] },
    { name: 'Merriweather', category: 'serif', weights: [400, 700, 900] },
  ],
  body: [
    { name: 'Inter', category: 'sans-serif', weights: [400, 500, 600] },
    { name: 'Roboto', category: 'sans-serif', weights: [400, 500] },
    { name: 'Open Sans', category: 'sans-serif', weights: [400, 500, 600] },
    { name: 'Lato', category: 'sans-serif', weights: [400, 700] },
    { name: 'Source Sans Pro', category: 'sans-serif', weights: [400, 600] },
    { name: 'Nunito', category: 'sans-serif', weights: [400, 500, 600] },
    { name: 'PT Sans', category: 'sans-serif', weights: [400, 700] },
    { name: 'Noto Sans', category: 'sans-serif', weights: [400, 500, 600, 700] },
    { name: 'Work Sans', category: 'sans-serif', weights: [400, 500, 600] },
    { name: 'IBM Plex Sans', category: 'sans-serif', weights: [400, 500, 600] },
  ],
  mono: [
    { name: 'JetBrains Mono', category: 'monospace', weights: [400, 500, 600, 700] },
    { name: 'Fira Code', category: 'monospace', weights: [400, 500, 600, 700] },
    { name: 'Source Code Pro', category: 'monospace', weights: [400, 500, 600, 700] },
    { name: 'Roboto Mono', category: 'monospace', weights: [400, 500, 600, 700] },
    { name: 'IBM Plex Mono', category: 'monospace', weights: [400, 500, 600, 700] },
    { name: 'Space Mono', category: 'monospace', weights: [400, 700] },
    { name: 'Inconsolata', category: 'monospace', weights: [400, 500, 600, 700] },
    { name: 'Ubuntu Mono', category: 'monospace', weights: [400, 700] },
  ],
};

// Font pairing suggestions
export const fontPairings: { heading: string; body: string; description: string }[] = [
  { heading: 'Playfair Display', body: 'Source Sans Pro', description: 'Classic editorial style' },
  { heading: 'Montserrat', body: 'Open Sans', description: 'Modern and clean' },
  { heading: 'Poppins', body: 'Inter', description: 'Contemporary tech feel' },
  { heading: 'Oswald', body: 'Lato', description: 'Bold headlines with readable body' },
  { heading: 'Raleway', body: 'Roboto', description: 'Elegant with professional body' },
  { heading: 'Merriweather', body: 'Nunito', description: 'Traditional meets friendly' },
  { heading: 'Inter', body: 'Inter', description: 'Consistent and minimal' },
  { heading: 'Roboto', body: 'Roboto', description: 'Google Material style' },
];

// Default font configurations
export const defaultFonts: FontConfig[] = [
  {
    role: 'heading',
    family: 'Inter',
    weights: [600, 700, 800],
    fallback: 'ui-sans-serif, system-ui, sans-serif',
  },
  {
    role: 'body',
    family: 'Inter',
    weights: [400, 500, 600],
    fallback: 'ui-sans-serif, system-ui, sans-serif',
  },
  {
    role: 'mono',
    family: 'JetBrains Mono',
    weights: [400, 500],
    fallback: 'ui-monospace, monospace',
  },
];

// Generate Google Fonts URL
export function generateGoogleFontsUrl(fonts: FontConfig[]): string {
  const fontParams = fonts.map(font => {
    const weights = font.weights.join(';');
    return `family=${font.family.replace(/ /g, '+')}:wght@${weights}`;
  }).join('&');

  return `https://fonts.googleapis.com/css2?${fontParams}&display=swap`;
}

// Generate CSS for typography
export function generateTypographyCss(fonts: FontConfig[], sizes: TypeSize[]): string {
  const lines: string[] = [':root {'];

  // Font families
  fonts.forEach(font => {
    lines.push(`  --font-${font.role}: "${font.family}", ${font.fallback};`);
  });

  lines.push('');

  // Type sizes
  sizes.forEach(size => {
    lines.push(`  --text-${size.name}: ${size.size}px;`);
    lines.push(`  --leading-${size.name}: ${size.lineHeight};`);
    lines.push(`  --tracking-${size.name}: ${size.letterSpacing}em;`);
  });

  lines.push('}');

  return lines.join('\n');
}
