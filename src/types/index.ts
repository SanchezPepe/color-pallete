// Color types
export type ColorRole = 'primary' | 'secondary' | 'accent' | 'neutral' | 'success' | 'warning' | 'error';

export type ShadeKey = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

export interface Color {
  id: string;
  hex: string;
  locked: boolean;
  role?: ColorRole;
}

export interface ColorWithShades {
  role: ColorRole;
  baseHex: string;
  shades: Record<ShadeKey, string>;
}

export interface ColorPalette {
  id: string;
  name: string;
  colors: Color[];
  createdAt: string;
  updatedAt: string;
}

// Category types
export type ColorCategory = 'random' | 'professional' | 'vibrant' | 'pastel' | 'warm' | 'cool' | 'earthy' | 'neon';

export interface CategoryRule {
  hueRanges: [number, number][];
  saturation: [number, number];
  lightness: [number, number];
}

// Typography types
export type FontRole = 'heading' | 'body' | 'mono' | 'accent';

export interface FontConfig {
  role: FontRole;
  family: string;
  weights: number[];
  fallback: string;
}

export interface TypeSize {
  name: string;
  size: number;
  lineHeight: number;
  letterSpacing: number;
}

export interface Typography {
  fonts: FontConfig[];
  scale: {
    ratio: number;
    baseSize: number;
    sizes: TypeSize[];
  };
}

// Spacing types
export interface Spacing {
  baseUnit: number;
  scale: Record<string, number>;
  containers: Record<string, number>;
  breakpoints: Record<string, number>;
}

// Border types
export interface Borders {
  radii: Record<string, number>;
  widths: number[];
  defaultRadius: string;
}

// Shadow types
export interface Shadow {
  name: string;
  value: string;
}

export interface Shadows {
  scale: Shadow[];
}

// Gradient types
export interface Gradient {
  id: string;
  name: string;
  type: 'linear' | 'radial';
  direction: string;
  stops: { color: string; position: number }[];
}

// Motion types
export interface Motion {
  durations: Record<string, number>;
  easings: Record<string, string>;
}

// Visual Identity (complete)
export interface VisualIdentity {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  colors: ColorPalette;
  typography: Typography;
  spacing: Spacing;
  borders: Borders;
  shadows: Shadows;
  gradients: Gradient[];
  motion: Motion;
}

// Export formats
export type ExportFormat = 'hex' | 'rgb' | 'css' | 'json' | 'tailwind' | 'scss';
