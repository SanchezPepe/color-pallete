"use client"

import { useState, useRef } from 'react'
import { Copy, Lock, LockOpen, Trash2, GripVertical } from 'lucide-react'
import { Color } from '@/types'
import { getContrastColor, getColorName } from '@/lib/colors'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ColorBarProps {
  color: Color
  onToggleLock: (id: string) => void
  onRemove: (id: string) => void
  onUpdateColor: (id: string, hex: string) => void
  onDragStart: (e: React.DragEvent, index: number) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, index: number) => void
  index: number
  canRemove: boolean
}

export function ColorBar({
  color,
  onToggleLock,
  onRemove,
  onUpdateColor,
  onDragStart,
  onDragOver,
  onDrop,
  index,
  canRemove
}: ColorBarProps) {
  const [isDragging, setIsDragging] = useState(false)
  const colorInputRef = useRef<HTMLInputElement>(null)
  const textColor = getContrastColor(color.hex)
  const colorName = getColorName(color.hex)

  const copyColor = () => {
    navigator.clipboard.writeText(color.hex).then(() => {
      toast.success(`Copied ${color.hex}`)
    }).catch(() => {
      toast.error('Failed to copy')
    })
  }

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true)
    onDragStart(e, index)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    setIsDragging(false)
    onDrop(e, index)
  }

  return (
    <div
      className={cn(
        "group relative flex flex-1 flex-col items-center justify-end min-w-[120px] p-8 cursor-pointer transition-all duration-200",
        "hover:flex-[1.1]",
        isDragging && "opacity-50",
        color.locked && "cursor-default"
      )}
      style={{
        backgroundColor: color.hex,
        color: textColor
      }}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={onDragOver}
      onDrop={handleDrop}
      onClick={copyColor}
    >
      {/* Locked pattern overlay */}
      {color.locked && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(0,0,0,0.03) 10px,
              rgba(0,0,0,0.03) 20px
            )`
          }}
        />
      )}

      {/* Drag Handle */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-50 hover:!opacity-100 cursor-grab transition-opacity">
        <GripVertical className="w-5 h-5" />
      </div>

      {/* Action Buttons */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation()
            copyColor()
          }}
          className="w-10 h-10 rounded-full bg-white/90 text-gray-700 flex items-center justify-center hover:scale-110 transition-transform"
          title="Copy hex code"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleLock(color.id)
          }}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform",
            color.locked
              ? "bg-rose-500 text-white"
              : "bg-white/90 text-gray-700"
          )}
          title={color.locked ? "Unlock color" : "Lock color"}
        >
          {color.locked ? <Lock className="w-4 h-4" /> : <LockOpen className="w-4 h-4" />}
        </button>
        {canRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRemove(color.id)
            }}
            className="w-10 h-10 rounded-full bg-white/90 text-gray-700 flex items-center justify-center hover:scale-110 hover:bg-red-500 hover:text-white transition-all"
            title="Remove color"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Color Picker */}
      <div className="absolute bottom-24 opacity-0 group-hover:opacity-100 transition-opacity">
        <input
          ref={colorInputRef}
          type="color"
          value={color.hex}
          onChange={(e) => onUpdateColor(color.id, e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="w-10 h-10 rounded-full cursor-pointer bg-white/90 p-1 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-0"
          title="Pick a color"
        />
      </div>

      {/* Color Info */}
      <div className="text-center z-10">
        <div className="text-xl font-bold uppercase tracking-wider mb-1 drop-shadow-sm">
          {color.hex.replace('#', '')}
        </div>
        <div className="text-sm font-medium opacity-90 capitalize">
          {colorName}
        </div>
      </div>
    </div>
  )
}
