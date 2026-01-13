import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { Eye, Check, AlertCircle, Info, X, Bell, Mail, Search, ChevronRight, Star, Heart, Plus } from 'lucide-react'

type ThemeColor = 'rose' | 'blue' | 'green' | 'purple' | 'orange'
type BorderStyle = 'sharp' | 'rounded' | 'pill'

const themeColors: Record<ThemeColor, { primary: string; hover: string; light: string; ring: string }> = {
  rose: { primary: 'bg-rose-500', hover: 'hover:bg-rose-600', light: 'bg-rose-50', ring: 'ring-rose-500' },
  blue: { primary: 'bg-blue-500', hover: 'hover:bg-blue-600', light: 'bg-blue-50', ring: 'ring-blue-500' },
  green: { primary: 'bg-green-500', hover: 'hover:bg-green-600', light: 'bg-green-50', ring: 'ring-green-500' },
  purple: { primary: 'bg-purple-500', hover: 'hover:bg-purple-600', light: 'bg-purple-50', ring: 'ring-purple-500' },
  orange: { primary: 'bg-orange-500', hover: 'hover:bg-orange-600', light: 'bg-orange-50', ring: 'ring-orange-500' },
}

const borderStyles: Record<BorderStyle, string> = {
  sharp: 'rounded-none',
  rounded: 'rounded-lg',
  pill: 'rounded-full',
}

export function PreviewTool() {
  const [theme, setTheme] = useState<ThemeColor>('rose')
  const [border, setBorder] = useState<BorderStyle>('rounded')
  const [darkMode, setDarkMode] = useState(false)

  const colors = themeColors[theme]
  const radius = borderStyles[border]

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Eye className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">
            Component Preview
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Theme:</label>
            <Select value={theme} onValueChange={(v) => setTheme(v as ThemeColor)}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rose">Rose</SelectItem>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="purple">Purple</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Border:</label>
            <Select value={border} onValueChange={(v) => setBorder(v as BorderStyle)}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sharp">Sharp</SelectItem>
                <SelectItem value="rounded">Rounded</SelectItem>
                <SelectItem value="pill">Pill</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
              darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-700"
            )}
          >
            {darkMode ? 'Dark' : 'Light'}
          </button>
        </div>
      </header>

      <div className={cn("flex-1 overflow-auto transition-colors", darkMode ? "bg-gray-900" : "bg-gray-50")}>
        <div className="max-w-6xl mx-auto p-6 space-y-8">
          {/* Buttons */}
          <section className="space-y-4">
            <h2 className={cn("text-lg font-semibold", darkMode ? "text-white" : "text-gray-800")}>Buttons</h2>
            <div className={cn("p-6 border", radius, darkMode ? "bg-gray-800 border-gray-700" : "bg-white")}>
              <div className="flex flex-wrap gap-4">
                <button className={cn("px-4 py-2 text-white font-medium transition-colors", colors.primary, colors.hover, radius)}>
                  Primary
                </button>
                <button className={cn("px-4 py-2 border font-medium transition-colors hover:bg-gray-50", radius, darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-700")}>
                  Secondary
                </button>
                <button className={cn("px-4 py-2 font-medium transition-colors", colors.light, radius, darkMode ? "text-white bg-opacity-20" : `text-${theme}-700`)}>
                  Ghost
                </button>
                <button className={cn("px-4 py-2 text-white font-medium opacity-50 cursor-not-allowed", colors.primary, radius)}>
                  Disabled
                </button>
                <button className={cn("p-2 transition-colors", colors.primary, colors.hover, radius)}>
                  <Plus className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <button className={cn("px-3 py-1 text-sm text-white font-medium transition-colors", colors.primary, colors.hover, radius)}>
                  Small
                </button>
                <button className={cn("px-4 py-2 text-white font-medium transition-colors", colors.primary, colors.hover, radius)}>
                  Medium
                </button>
                <button className={cn("px-6 py-3 text-lg text-white font-medium transition-colors", colors.primary, colors.hover, radius)}>
                  Large
                </button>
              </div>
            </div>
          </section>

          {/* Form Inputs */}
          <section className="space-y-4">
            <h2 className={cn("text-lg font-semibold", darkMode ? "text-white" : "text-gray-800")}>Form Inputs</h2>
            <div className={cn("p-6 border", radius, darkMode ? "bg-gray-800 border-gray-700" : "bg-white")}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className={cn("text-sm font-medium", darkMode ? "text-gray-300" : "text-gray-700")}>Text Input</label>
                  <input
                    type="text"
                    placeholder="Enter text..."
                    className={cn(
                      "w-full px-3 py-2 border transition-all focus:outline-none focus:ring-2",
                      radius,
                      colors.ring,
                      darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900"
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <label className={cn("text-sm font-medium", darkMode ? "text-gray-300" : "text-gray-700")}>With Icon</label>
                  <div className="relative">
                    <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4", darkMode ? "text-gray-400" : "text-gray-500")} />
                    <input
                      type="text"
                      placeholder="Search..."
                      className={cn(
                        "w-full pl-10 pr-3 py-2 border transition-all focus:outline-none focus:ring-2",
                        radius,
                        colors.ring,
                        darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900"
                      )}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={cn("text-sm font-medium", darkMode ? "text-gray-300" : "text-gray-700")}>Select</label>
                  <select
                    className={cn(
                      "w-full px-3 py-2 border transition-all focus:outline-none focus:ring-2",
                      radius,
                      colors.ring,
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                    )}
                  >
                    <option>Option 1</option>
                    <option>Option 2</option>
                    <option>Option 3</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className={cn("text-sm font-medium", darkMode ? "text-gray-300" : "text-gray-700")}>Textarea</label>
                  <textarea
                    placeholder="Enter description..."
                    rows={3}
                    className={cn(
                      "w-full px-3 py-2 border transition-all focus:outline-none focus:ring-2 resize-none",
                      radius,
                      colors.ring,
                      darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900"
                    )}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Cards */}
          <section className="space-y-4">
            <h2 className={cn("text-lg font-semibold", darkMode ? "text-white" : "text-gray-800")}>Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Basic Card */}
              <div className={cn("border overflow-hidden", radius, darkMode ? "bg-gray-800 border-gray-700" : "bg-white")}>
                <div className={cn("h-32", colors.primary)} />
                <div className="p-4">
                  <h3 className={cn("font-semibold", darkMode ? "text-white" : "text-gray-800")}>Card Title</h3>
                  <p className={cn("text-sm mt-1", darkMode ? "text-gray-400" : "text-gray-600")}>
                    This is a basic card with a colored header.
                  </p>
                  <button className={cn("mt-4 px-4 py-2 text-white text-sm font-medium transition-colors w-full", colors.primary, colors.hover, radius)}>
                    Action
                  </button>
                </div>
              </div>

              {/* Interactive Card */}
              <div className={cn("border p-4 transition-all hover:shadow-lg cursor-pointer", radius, darkMode ? "bg-gray-800 border-gray-700" : "bg-white")}>
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 flex items-center justify-center", colors.light, radius)}>
                    <Mail className={cn("w-5 h-5", `text-${theme}-600`)} />
                  </div>
                  <div>
                    <h3 className={cn("font-semibold", darkMode ? "text-white" : "text-gray-800")}>Messages</h3>
                    <p className={cn("text-sm", darkMode ? "text-gray-400" : "text-gray-600")}>12 unread</p>
                  </div>
                  <ChevronRight className={cn("ml-auto w-5 h-5", darkMode ? "text-gray-500" : "text-gray-400")} />
                </div>
              </div>

              {/* Stats Card */}
              <div className={cn("border p-4", radius, darkMode ? "bg-gray-800 border-gray-700" : "bg-white")}>
                <div className="flex items-center justify-between">
                  <span className={cn("text-sm", darkMode ? "text-gray-400" : "text-gray-600")}>Total Users</span>
                  <span className="text-xs text-green-500 font-medium">+12.5%</span>
                </div>
                <p className={cn("text-3xl font-bold mt-2", darkMode ? "text-white" : "text-gray-800")}>24,589</p>
                <div className={cn("mt-4 h-2 bg-gray-200 overflow-hidden", radius)}>
                  <div className={cn("h-full w-3/4", colors.primary)} />
                </div>
              </div>
            </div>
          </section>

          {/* Alerts */}
          <section className="space-y-4">
            <h2 className={cn("text-lg font-semibold", darkMode ? "text-white" : "text-gray-800")}>Alerts</h2>
            <div className="space-y-3">
              <div className={cn("flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200", radius)}>
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <p className="text-sm text-blue-800">This is an informational alert message.</p>
              </div>
              <div className={cn("flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200", radius)}>
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <p className="text-sm text-green-800">Success! Your changes have been saved.</p>
              </div>
              <div className={cn("flex items-center gap-3 px-4 py-3 bg-yellow-50 border border-yellow-200", radius)}>
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <p className="text-sm text-yellow-800">Warning: Please review before proceeding.</p>
              </div>
              <div className={cn("flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200", radius)}>
                <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-800">Error: Something went wrong. Please try again.</p>
              </div>
            </div>
          </section>

          {/* Badges */}
          <section className="space-y-4">
            <h2 className={cn("text-lg font-semibold", darkMode ? "text-white" : "text-gray-800")}>Badges</h2>
            <div className={cn("p-6 border", radius, darkMode ? "bg-gray-800 border-gray-700" : "bg-white")}>
              <div className="flex flex-wrap gap-3">
                <span className={cn("px-2.5 py-0.5 text-xs font-medium text-white", colors.primary, radius)}>Primary</span>
                <span className={cn("px-2.5 py-0.5 text-xs font-medium bg-gray-500 text-white", radius)}>Secondary</span>
                <span className={cn("px-2.5 py-0.5 text-xs font-medium bg-green-500 text-white", radius)}>Success</span>
                <span className={cn("px-2.5 py-0.5 text-xs font-medium bg-yellow-500 text-white", radius)}>Warning</span>
                <span className={cn("px-2.5 py-0.5 text-xs font-medium bg-red-500 text-white", radius)}>Error</span>
                <span className={cn("px-2.5 py-0.5 text-xs font-medium border", radius, darkMode ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-700")}>Outline</span>
              </div>
            </div>
          </section>

          {/* Avatar & List */}
          <section className="space-y-4">
            <h2 className={cn("text-lg font-semibold", darkMode ? "text-white" : "text-gray-800")}>List Items</h2>
            <div className={cn("border divide-y overflow-hidden", radius, darkMode ? "bg-gray-800 border-gray-700 divide-gray-700" : "bg-white divide-gray-200")}>
              {[
                { name: 'Sarah Johnson', role: 'Product Designer', status: 'online' },
                { name: 'Mike Chen', role: 'Frontend Developer', status: 'away' },
                { name: 'Emily Davis', role: 'Project Manager', status: 'offline' },
              ].map((user, i) => (
                <div key={i} className={cn("flex items-center gap-4 px-4 py-3 transition-colors", darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50")}>
                  <div className={cn("w-10 h-10 flex items-center justify-center text-white font-medium", colors.primary, border === 'pill' ? 'rounded-full' : radius)}>
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className={cn("font-medium", darkMode ? "text-white" : "text-gray-800")}>{user.name}</p>
                    <p className={cn("text-sm", darkMode ? "text-gray-400" : "text-gray-600")}>{user.role}</p>
                  </div>
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    user.status === 'online' ? 'bg-green-500' : user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                  )} />
                </div>
              ))}
            </div>
          </section>

          {/* Navigation */}
          <section className="space-y-4">
            <h2 className={cn("text-lg font-semibold", darkMode ? "text-white" : "text-gray-800")}>Navigation</h2>
            <div className={cn("border overflow-hidden", radius, darkMode ? "bg-gray-800 border-gray-700" : "bg-white")}>
              <div className="flex items-center gap-1 p-2">
                {['Dashboard', 'Projects', 'Team', 'Settings'].map((item, i) => (
                  <button
                    key={item}
                    className={cn(
                      "px-4 py-2 text-sm font-medium transition-colors",
                      radius,
                      i === 0
                        ? `${colors.primary} text-white`
                        : darkMode
                        ? "text-gray-400 hover:text-white hover:bg-gray-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Toggle & Checkbox */}
          <section className="space-y-4">
            <h2 className={cn("text-lg font-semibold", darkMode ? "text-white" : "text-gray-800")}>Toggles & Checkboxes</h2>
            <div className={cn("p-6 border", radius, darkMode ? "bg-gray-800 border-gray-700" : "bg-white")}>
              <div className="flex flex-wrap gap-8">
                {/* Toggle */}
                <div className="flex items-center gap-3">
                  <button
                    className={cn(
                      "relative w-12 h-6 rounded-full transition-colors",
                      colors.primary
                    )}
                  >
                    <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform" />
                  </button>
                  <span className={cn("text-sm", darkMode ? "text-gray-300" : "text-gray-700")}>Enabled</span>
                </div>
                <div className="flex items-center gap-3">
                  <button className="relative w-12 h-6 bg-gray-300 rounded-full transition-colors">
                    <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform" />
                  </button>
                  <span className={cn("text-sm", darkMode ? "text-gray-300" : "text-gray-700")}>Disabled</span>
                </div>
                {/* Checkbox */}
                <div className="flex items-center gap-3">
                  <div className={cn("w-5 h-5 flex items-center justify-center text-white", colors.primary, radius === 'rounded-full' ? 'rounded' : radius)}>
                    <Check className="w-3 h-3" />
                  </div>
                  <span className={cn("text-sm", darkMode ? "text-gray-300" : "text-gray-700")}>Checked</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={cn("w-5 h-5 border-2", radius === 'rounded-full' ? 'rounded' : radius, darkMode ? "border-gray-600" : "border-gray-300")} />
                  <span className={cn("text-sm", darkMode ? "text-gray-300" : "text-gray-700")}>Unchecked</span>
                </div>
              </div>
            </div>
          </section>

          {/* Rating */}
          <section className="space-y-4">
            <h2 className={cn("text-lg font-semibold", darkMode ? "text-white" : "text-gray-800")}>Rating & Social</h2>
            <div className={cn("p-6 border", radius, darkMode ? "bg-gray-800 border-gray-700" : "bg-white")}>
              <div className="flex flex-wrap items-center gap-8">
                {/* Stars */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-6 h-6 cursor-pointer transition-colors",
                        i <= 4 ? "text-yellow-400 fill-yellow-400" : darkMode ? "text-gray-600" : "text-gray-300"
                      )}
                    />
                  ))}
                  <span className={cn("ml-2 text-sm", darkMode ? "text-gray-400" : "text-gray-600")}>4.0</span>
                </div>
                {/* Like */}
                <button className="flex items-center gap-2 text-red-500 transition-colors hover:text-red-600">
                  <Heart className="w-6 h-6 fill-red-500" />
                  <span className="font-medium">256</span>
                </button>
                {/* Notification */}
                <button className="relative p-2 rounded-full bg-gray-100 dark:bg-gray-700 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600">
                  <Bell className={cn("w-5 h-5", darkMode ? "text-gray-300" : "text-gray-600")} />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
