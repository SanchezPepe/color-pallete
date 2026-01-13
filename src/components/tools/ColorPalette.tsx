import { useEffect, useRef, useState } from 'react'
import { useIdentityStore } from '@/store/identity'
import { ColorBar } from './ColorBar'
import { ExportModal } from './ExportModal'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Shuffle, Plus, Download } from 'lucide-react'
import { ColorCategory } from '@/types'
import { toast } from 'sonner'

const categories: { value: ColorCategory; label: string }[] = [
  { value: 'random', label: 'Random' },
  { value: 'professional', label: 'Professional' },
  { value: 'vibrant', label: 'Vibrant' },
  { value: 'pastel', label: 'Pastel' },
  { value: 'warm', label: 'Warm' },
  { value: 'cool', label: 'Cool' },
  { value: 'earthy', label: 'Earthy' },
  { value: 'neon', label: 'Neon' },
]

const presetGroups = [
  {
    label: 'Design Systems',
    presets: ['material', 'tailwind', 'bootstrap']
  },
  {
    label: 'Editor Themes',
    presets: ['nord', 'dracula', 'monokai', 'solarized']
  },
  {
    label: 'Nature',
    presets: ['sunset', 'ocean', 'forest', 'autumn']
  },
  {
    label: 'Trendy',
    presets: ['synthwave', 'coffee', 'candy']
  }
]

export function ColorPalette() {
  const [exportOpen, setExportOpen] = useState(false)
  const [presetValue, setPresetValue] = useState<string>('')
  const draggedIndex = useRef<number | null>(null)

  const {
    colors,
    category,
    generatePalette,
    generateNewColors,
    addColor,
    removeColor,
    toggleLock,
    updateColor,
    reorderColors,
    applyPreset,
    setCategory
  } = useIdentityStore()

  // Initialize palette if empty
  useEffect(() => {
    if (colors.length === 0) {
      generatePalette(5)
    }
  }, [colors.length, generatePalette])

  // Keyboard shortcut for spacebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault()
        generateNewColors()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [generateNewColors])

  const handleDragStart = (e: React.DragEvent, index: number) => {
    draggedIndex.current = index
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    if (draggedIndex.current !== null && draggedIndex.current !== targetIndex) {
      reorderColors(draggedIndex.current, targetIndex)
    }
    draggedIndex.current = null
  }

  const handleAddColor = () => {
    const success = addColor()
    if (!success) {
      toast.error('Maximum 10 colors allowed')
    }
  }

  const handleRemoveColor = (id: string) => {
    const success = removeColor(id)
    if (!success) {
      toast.error('Minimum 2 colors required')
    }
  }

  const handlePresetChange = (value: string) => {
    if (value) {
      applyPreset(value)
      toast.success(`Applied ${value} palette`)
      setPresetValue('')
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b">
        <h1 className="text-xl font-bold text-rose-500 tracking-tight">
          Visual Identity Toolkit
        </h1>

        <div className="flex items-center gap-2">
          {/* Generate button with category */}
          <div className="flex">
            <Button
              onClick={() => generateNewColors()}
              className="rounded-r-none bg-gray-100 text-gray-700 hover:bg-rose-500 hover:text-white"
            >
              <Shuffle className="w-4 h-4" />
              <span className="hidden sm:inline">Generate</span>
            </Button>
            <Select value={category} onValueChange={(v) => setCategory(v as ColorCategory)}>
              <SelectTrigger className="w-[130px] rounded-l-none border-l bg-gray-100 text-gray-700 hover:bg-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preset selector */}
          <Select value={presetValue} onValueChange={handlePresetChange}>
            <SelectTrigger className="w-[120px] bg-gray-100 text-gray-700 hover:bg-gray-200">
              <SelectValue placeholder="Presets" />
            </SelectTrigger>
            <SelectContent>
              {presetGroups.map((group) => (
                <SelectGroup key={group.label}>
                  <SelectLabel className="text-rose-500">{group.label}</SelectLabel>
                  {group.presets.map((preset) => (
                    <SelectItem key={preset} value={preset}>
                      {preset.charAt(0).toUpperCase() + preset.slice(1)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={handleAddColor}
            variant="outline"
            className="bg-gray-100 text-gray-700 hover:bg-rose-500 hover:text-white border-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Color</span>
          </Button>

          <Button
            onClick={() => setExportOpen(true)}
            variant="outline"
            className="bg-gray-100 text-gray-700 hover:bg-rose-500 hover:text-white border-0"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>

        <div className="text-sm text-gray-500 hidden md:block">
          Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs text-rose-500 border">Spacebar</kbd> to generate new palette
        </div>
      </header>

      {/* Color Palette */}
      <main className="flex flex-1 overflow-hidden">
        {colors.map((color, index) => (
          <ColorBar
            key={color.id}
            color={color}
            index={index}
            onToggleLock={toggleLock}
            onRemove={handleRemoveColor}
            onUpdateColor={updateColor}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            canRemove={colors.length > 2}
          />
        ))}
      </main>

      {/* Export Modal */}
      <ExportModal open={exportOpen} onOpenChange={setExportOpen} />
    </div>
  )
}
