import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Color, ColorCategory, ExportFormat } from '@/types';
import { generateRandomColor, generateId, presetPalettes } from '@/lib/colors';

interface IdentityState {
  // Color palette state
  colors: Color[];
  category: ColorCategory;
  currentExportFormat: ExportFormat;

  // Actions
  generatePalette: (count: number) => void;
  generateNewColors: () => void;
  addColor: () => boolean;
  removeColor: (id: string) => boolean;
  toggleLock: (id: string) => void;
  updateColor: (id: string, hex: string) => void;
  reorderColors: (fromIndex: number, toIndex: number) => void;
  applyPreset: (presetName: string) => void;
  setCategory: (category: ColorCategory) => void;
  setExportFormat: (format: ExportFormat) => void;
}

const STORAGE_KEY = 'visual-identity-store';

export const useIdentityStore = create<IdentityState>()(
  persist(
    (set, get) => ({
      // Initial state
      colors: [],
      category: 'random',
      currentExportFormat: 'hex',

      // Generate a new palette from scratch
      generatePalette: (count: number) => {
        const { category } = get();
        const colors: Color[] = [];
        for (let i = 0; i < count; i++) {
          colors.push({
            hex: generateRandomColor(category),
            locked: false,
            id: generateId()
          });
        }
        set({ colors });
      },

      // Generate new colors for unlocked slots
      generateNewColors: () => {
        const { colors, category } = get();
        const newColors = colors.map(color => {
          if (color.locked) {
            return color;
          }
          return {
            ...color,
            hex: generateRandomColor(category)
          };
        });
        set({ colors: newColors });
      },

      // Add a new color (max 10)
      addColor: () => {
        const { colors, category } = get();
        if (colors.length >= 10) {
          return false;
        }
        const newColor: Color = {
          hex: generateRandomColor(category),
          locked: false,
          id: generateId()
        };
        set({ colors: [...colors, newColor] });
        return true;
      },

      // Remove a color (min 2)
      removeColor: (id: string) => {
        const { colors } = get();
        if (colors.length <= 2) {
          return false;
        }
        set({ colors: colors.filter(c => c.id !== id) });
        return true;
      },

      // Toggle lock on a color
      toggleLock: (id: string) => {
        const { colors } = get();
        set({
          colors: colors.map(color =>
            color.id === id ? { ...color, locked: !color.locked } : color
          )
        });
      },

      // Update a color's hex value
      updateColor: (id: string, hex: string) => {
        const { colors } = get();
        set({
          colors: colors.map(color =>
            color.id === id ? { ...color, hex: hex.toUpperCase() } : color
          )
        });
      },

      // Reorder colors via drag and drop
      reorderColors: (fromIndex: number, toIndex: number) => {
        const { colors } = get();
        const newColors = [...colors];
        const [removed] = newColors.splice(fromIndex, 1);
        newColors.splice(toIndex, 0, removed);
        set({ colors: newColors });
      },

      // Apply a preset palette
      applyPreset: (presetName: string) => {
        const preset = presetPalettes[presetName];
        if (!preset) return;

        const colors: Color[] = preset.map(hex => ({
          hex: hex.toUpperCase(),
          locked: false,
          id: generateId()
        }));
        set({ colors });
      },

      // Set the color category for generation
      setCategory: (category: ColorCategory) => {
        set({ category });
      },

      // Set export format
      setExportFormat: (format: ExportFormat) => {
        set({ currentExportFormat: format });
      }
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        colors: state.colors,
        category: state.category
      })
    }
  )
);
