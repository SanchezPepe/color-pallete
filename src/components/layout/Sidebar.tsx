import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  Palette,
  Type,
  Maximize,
  Square,
  Layers,
  Blend,
  Zap,
  Eye,
  MessageSquare,
  Download
} from 'lucide-react'

const navItems = [
  {
    label: 'Colors',
    href: '/colors',
    icon: Palette,
    description: 'Color palette & shades'
  },
  {
    label: 'Typography',
    href: '/typography',
    icon: Type,
    description: 'Fonts & type scale'
  },
  {
    label: 'Spacing',
    href: '/spacing',
    icon: Maximize,
    description: 'Spacing system'
  },
  {
    label: 'Shadows',
    href: '/shadows',
    icon: Layers,
    description: 'Shadow scale'
  },
  {
    label: 'Borders',
    href: '/borders',
    icon: Square,
    description: 'Border radius & widths'
  },
  {
    label: 'Gradients',
    href: '/gradients',
    icon: Blend,
    description: 'Gradient builder'
  },
  {
    label: 'Motion',
    href: '/motion',
    icon: Zap,
    description: 'Animation presets'
  },
  {
    label: 'Preview',
    href: '/preview',
    icon: Eye,
    description: 'Component preview'
  },
  {
    label: 'AI Assistant',
    href: '/assistant',
    icon: MessageSquare,
    description: 'AI-powered suggestions'
  },
  {
    label: 'Export',
    href: '/export',
    icon: Download,
    description: 'Export design tokens'
  }
]

export function Sidebar() {
  const location = useLocation()
  const pathname = location.pathname

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-slate-800">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white">Visual Identity</h1>
            <p className="text-xs text-slate-400">Toolkit</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname === '/' && item.href === '/colors')
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive
                  ? "bg-rose-500/10 text-rose-400"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <p className="text-xs text-slate-500 text-center">
          Visual Identity Toolkit v1.0
        </p>
      </div>
    </aside>
  )
}
