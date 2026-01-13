import { Routes, Route } from 'react-router-dom'
import { Sidebar } from './components/layout/Sidebar'
import { ColorPalette } from './components/tools/ColorPalette'
import { TypographyTool } from './components/tools/TypographyTool'
import { SpacingTool } from './components/tools/SpacingTool'
import { Toaster } from './components/ui/sonner'

function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<ColorPalette />} />
          <Route path="/colors" element={<ColorPalette />} />
          <Route path="/typography" element={<TypographyTool />} />
          <Route path="/spacing" element={<SpacingTool />} />
        </Routes>
      </main>
      <Toaster />
    </div>
  )
}

export default App
