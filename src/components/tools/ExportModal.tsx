import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useIdentityStore } from '@/store/identity'
import { generateExportOutput } from '@/lib/export'
import { ExportFormat } from '@/types'
import { Copy, Hash, Palette, Code, FileJson, FileCode } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ExportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const exportFormats: { value: ExportFormat; label: string; icon: React.ReactNode }[] = [
  { value: 'hex', label: 'HEX', icon: <Hash className="w-5 h-5" /> },
  { value: 'rgb', label: 'RGB', icon: <Palette className="w-5 h-5" /> },
  { value: 'css', label: 'CSS', icon: <Code className="w-5 h-5" /> },
  { value: 'json', label: 'JSON', icon: <FileJson className="w-5 h-5" /> },
  { value: 'tailwind', label: 'Tailwind', icon: <FileCode className="w-5 h-5" /> },
  { value: 'scss', label: 'SCSS', icon: <FileCode className="w-5 h-5" /> },
]

export function ExportModal({ open, onOpenChange }: ExportModalProps) {
  const { colors, currentExportFormat, setExportFormat } = useIdentityStore()
  const [format, setFormat] = useState<ExportFormat>(currentExportFormat)

  const output = generateExportOutput(colors, format)

  const handleFormatChange = (newFormat: ExportFormat) => {
    setFormat(newFormat)
    setExportFormat(newFormat)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output).then(() => {
      toast.success('Copied to clipboard')
    }).catch(() => {
      toast.error('Failed to copy')
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Export Palette</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Format Selector */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {exportFormats.map((fmt) => (
              <button
                key={fmt.value}
                onClick={() => handleFormatChange(fmt.value)}
                className={cn(
                  "flex flex-col items-center gap-1 p-3 rounded-lg transition-all",
                  format === fmt.value
                    ? "bg-rose-500 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                )}
              >
                {fmt.icon}
                <span className="text-xs font-medium">{fmt.label}</span>
              </button>
            ))}
          </div>

          {/* Output */}
          <textarea
            readOnly
            value={output}
            className="w-full h-40 p-4 bg-slate-800 border-0 rounded-lg text-sm font-mono text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-rose-500"
          />

          {/* Copy Button */}
          <Button
            onClick={copyToClipboard}
            className="w-full bg-rose-500 hover:bg-rose-600"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy to Clipboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
