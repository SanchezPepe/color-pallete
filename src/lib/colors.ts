import { ColorCategory, CategoryRule, ShadeKey } from '@/types';

// Category color generation rules (HSL ranges)
export const categoryRules: Record<Exclude<ColorCategory, 'random'>, CategoryRule> = {
  professional: {
    hueRanges: [[200, 230], [0, 20], [220, 250]], // Blues, burgundy, navy
    saturation: [20, 45],
    lightness: [25, 55]
  },
  vibrant: {
    hueRanges: [[0, 360]], // Full spectrum
    saturation: [70, 100],
    lightness: [45, 60]
  },
  pastel: {
    hueRanges: [[0, 360]], // Full spectrum
    saturation: [40, 70],
    lightness: [75, 90]
  },
  warm: {
    hueRanges: [[0, 60], [340, 360]], // Reds, oranges, yellows
    saturation: [50, 85],
    lightness: [40, 65]
  },
  cool: {
    hueRanges: [[180, 280]], // Cyan, blue, purple
    saturation: [40, 75],
    lightness: [35, 60]
  },
  earthy: {
    hueRanges: [[20, 50], [80, 140]], // Browns, greens, olives
    saturation: [25, 55],
    lightness: [30, 55]
  },
  neon: {
    hueRanges: [[280, 320], [160, 190], [50, 70]], // Magenta, cyan, lime
    saturation: [90, 100],
    lightness: [50, 65]
  }
};

// Preset color palettes
export const presetPalettes: Record<string, string[]> = {
  // Design Systems
  material: ['#F44336', '#E91E63', '#9C27B0', '#3F51B5', '#2196F3'],
  tailwind: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
  bootstrap: ['#0D6EFD', '#6610F2', '#D63384', '#FD7E14', '#20C997'],
  // Editor Themes
  nord: ['#5E81AC', '#81A1C1', '#88C0D0', '#8FBCBB', '#B48EAD'],
  dracula: ['#FF79C6', '#BD93F9', '#8BE9FD', '#50FA7B', '#FFB86C'],
  monokai: ['#F92672', '#FD971F', '#E6DB74', '#A6E22E', '#66D9EF'],
  solarized: ['#B58900', '#CB4B16', '#DC322F', '#D33682', '#6C71C4'],
  // Nature
  sunset: ['#FF6B6B', '#FFA06D', '#FFD93D', '#C9B037', '#6BCB77'],
  ocean: ['#0077B6', '#00B4D8', '#48CAE4', '#90E0EF', '#CAF0F8'],
  forest: ['#2D5A27', '#4A7C59', '#6B8E23', '#8FBC8F', '#A8D5BA'],
  autumn: ['#8B4513', '#CD853F', '#DAA520', '#B8860B', '#D2691E'],
  // Trendy
  synthwave: ['#FF00FF', '#00FFFF', '#FF1493', '#9400D3', '#FF6347'],
  coffee: ['#4A3728', '#6F4E37', '#A67B5B', '#C4A484', '#E8D4B8'],
  candy: ['#FF69B4', '#FF85A2', '#FFA3B5', '#FFB6C1', '#FFC0CB']
};

// Utility functions
export function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }

  const toHex = (n: number): string => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const color = hex.replace('#', '');
  const r = parseInt(color.substr(0, 2), 16) / 255;
  const g = parseInt(color.substr(2, 2), 16) / 255;
  const b = parseInt(color.substr(4, 2), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;

  if (d === 0) {
    return { h: 0, s: 0, l: l * 100 };
  }

  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h: number;
  if (max === r) {
    h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  } else if (max === g) {
    h = ((b - r) / d + 2) / 6;
  } else {
    h = ((r - g) / d + 4) / 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const color = hex.replace('#', '');
  return {
    r: parseInt(color.substr(0, 2), 16),
    g: parseInt(color.substr(2, 2), 16),
    b: parseInt(color.substr(4, 2), 16)
  };
}

export function getContrastColor(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#1a1a2e' : '#ffffff';
}

export function getColorName(hex: string): string {
  const { h, s, l } = hexToHsl(hex);
  const hue = h;

  // Low saturation = grayscale
  if (s < 10) {
    if (l < 20) return 'Black';
    if (l > 80) return 'White';
    return 'Gray';
  }

  // Very dark or light
  if (l < 20) return 'Dark';
  if (l > 85) return 'Light';

  // Color names based on hue
  if (hue < 15) return l < 50 ? 'Maroon' : 'Red';
  if (hue < 45) return l < 50 ? 'Brown' : 'Orange';
  if (hue < 70) return l < 50 ? 'Olive' : 'Yellow';
  if (hue < 150) return l < 50 ? 'Forest' : 'Green';
  if (hue < 190) return l < 50 ? 'Teal' : 'Cyan';
  if (hue < 260) return l < 50 ? 'Navy' : 'Blue';
  if (hue < 290) return l < 50 ? 'Indigo' : 'Purple';
  if (hue < 330) return l < 50 ? 'Plum' : 'Pink';
  return l < 50 ? 'Maroon' : 'Red';
}

export function generateRandomColor(category: ColorCategory = 'random'): string {
  if (category === 'random') {
    // Pure random generation
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Category-based generation using HSL
  const rules = categoryRules[category];
  const hueRange = rules.hueRanges[Math.floor(Math.random() * rules.hueRanges.length)];
  const h = randomInRange(hueRange[0], hueRange[1]);
  const s = randomInRange(rules.saturation[0], rules.saturation[1]);
  const l = randomInRange(rules.lightness[0], rules.lightness[1]);

  return hslToHex(h, s, l);
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Shade generation for Tailwind-like 50-950 scale
export function generateShades(baseHex: string): Record<ShadeKey, string> {
  const { h, s } = hexToHsl(baseHex);

  // Shade lightness values (50 is lightest, 950 is darkest)
  const shadeLightness: Record<ShadeKey, number> = {
    50: 97,
    100: 94,
    200: 86,
    300: 77,
    400: 66,
    500: 55,
    600: 45,
    700: 37,
    800: 27,
    900: 20,
    950: 12
  };

  const shades: Partial<Record<ShadeKey, string>> = {};

  for (const [key, lightness] of Object.entries(shadeLightness)) {
    // Adjust saturation slightly for very light/dark shades
    let adjustedSat = s;
    if (lightness > 90) adjustedSat = Math.min(s, 30);
    if (lightness < 20) adjustedSat = Math.min(s * 0.8, s);

    shades[Number(key) as ShadeKey] = hslToHex(h, adjustedSat, lightness);
  }

  return shades as Record<ShadeKey, string>;
}

// Color harmony functions
export function getComplementary(hex: string): string {
  const { h, s, l } = hexToHsl(hex);
  return hslToHex((h + 180) % 360, s, l);
}

export function getTriadic(hex: string): [string, string] {
  const { h, s, l } = hexToHsl(hex);
  return [
    hslToHex((h + 120) % 360, s, l),
    hslToHex((h + 240) % 360, s, l)
  ];
}

export function getSplitComplementary(hex: string): [string, string] {
  const { h, s, l } = hexToHsl(hex);
  return [
    hslToHex((h + 150) % 360, s, l),
    hslToHex((h + 210) % 360, s, l)
  ];
}

export function getAnalogous(hex: string): [string, string] {
  const { h, s, l } = hexToHsl(hex);
  return [
    hslToHex((h + 30) % 360, s, l),
    hslToHex((h - 30 + 360) % 360, s, l)
  ];
}

// WCAG contrast ratio calculation
export function getContrastRatio(hex1: string, hex2: string): number {
  const getLuminance = (hex: string): number => {
    const { r, g, b } = hexToRgb(hex);
    const [rs, gs, bs] = [r, g, b].map(c => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

export function getWcagLevel(contrastRatio: number): 'AAA' | 'AA' | 'fail' {
  if (contrastRatio >= 7) return 'AAA';
  if (contrastRatio >= 4.5) return 'AA';
  return 'fail';
}
