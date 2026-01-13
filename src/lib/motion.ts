import { Motion } from '@/types';

// Default duration scale (in milliseconds)
export const defaultDurations: Record<string, number> = {
  fastest: 50,
  faster: 100,
  fast: 150,
  normal: 200,
  slow: 300,
  slower: 500,
  slowest: 700,
};

// Default easing functions
export const defaultEasings: Record<string, string> = {
  linear: 'linear',
  ease: 'ease',
  'ease-in': 'ease-in',
  'ease-out': 'ease-out',
  'ease-in-out': 'ease-in-out',
  'ease-in-sine': 'cubic-bezier(0.47, 0, 0.745, 0.715)',
  'ease-out-sine': 'cubic-bezier(0.39, 0.575, 0.565, 1)',
  'ease-in-out-sine': 'cubic-bezier(0.445, 0.05, 0.55, 0.95)',
  'ease-in-cubic': 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  'ease-out-cubic': 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  'ease-in-out-cubic': 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  'ease-in-back': 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
  'ease-out-back': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  'ease-in-out-back': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  spring: 'cubic-bezier(0.5, 1.5, 0.5, 1)',
  bounce: 'cubic-bezier(0.5, -0.5, 0.5, 1.5)',
};

// Animation presets
export const animationPresets = {
  fadeIn: {
    keyframes: `@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}`,
    class: 'animation: fadeIn var(--duration-normal) var(--ease-out);',
  },
  fadeOut: {
    keyframes: `@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}`,
    class: 'animation: fadeOut var(--duration-normal) var(--ease-in);',
  },
  slideInUp: {
    keyframes: `@keyframes slideInUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}`,
    class: 'animation: slideInUp var(--duration-normal) var(--ease-out);',
  },
  slideInDown: {
    keyframes: `@keyframes slideInDown {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}`,
    class: 'animation: slideInDown var(--duration-normal) var(--ease-out);',
  },
  scaleIn: {
    keyframes: `@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}`,
    class: 'animation: scaleIn var(--duration-fast) var(--ease-out);',
  },
  scaleOut: {
    keyframes: `@keyframes scaleOut {
  from { transform: scale(1); opacity: 1; }
  to { transform: scale(0.95); opacity: 0; }
}`,
    class: 'animation: scaleOut var(--duration-fast) var(--ease-in);',
  },
  spin: {
    keyframes: `@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`,
    class: 'animation: spin 1s linear infinite;',
  },
  pulse: {
    keyframes: `@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}`,
    class: 'animation: pulse 2s ease-in-out infinite;',
  },
  bounce: {
    keyframes: `@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}`,
    class: 'animation: bounce 1s ease-in-out infinite;',
  },
};

export type AnimationPreset = keyof typeof animationPresets;

// Create default motion configuration
export function createDefaultMotion(): Motion {
  return {
    durations: { ...defaultDurations },
    easings: { ...defaultEasings },
  };
}

// Generate CSS for motion
export function generateMotionCss(motion: Motion): string {
  const lines: string[] = [':root {'];

  // Durations
  Object.entries(motion.durations).forEach(([key, value]) => {
    lines.push(`  --duration-${key}: ${value}ms;`);
  });

  lines.push('');

  // Easings
  Object.entries(motion.easings).forEach(([key, value]) => {
    lines.push(`  --ease-${key}: ${value};`);
  });

  lines.push('}');
  lines.push('');

  // Animation keyframes
  Object.values(animationPresets).forEach(preset => {
    lines.push(preset.keyframes);
    lines.push('');
  });

  return lines.join('\n');
}

// Generate Tailwind config for motion
export function generateMotionTailwind(motion: Motion): string {
  const durationEntries = Object.entries(motion.durations)
    .map(([key, value]) => `      '${key}': '${value}ms',`)
    .join('\n');

  const easingEntries = Object.entries(motion.easings)
    .map(([key, value]) => `      '${key}': '${value}',`)
    .join('\n');

  return `module.exports = {
  theme: {
    extend: {
      transitionDuration: {
${durationEntries}
      },
      transitionTimingFunction: {
${easingEntries}
      },
    },
  },
}`;
}
