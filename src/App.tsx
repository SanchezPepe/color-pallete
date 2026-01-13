import { Routes, Route } from 'react-router-dom'
import { Sidebar } from './components/layout/Sidebar'
import { ColorPalette } from './components/tools/ColorPalette'
import { TypographyTool } from './components/tools/TypographyTool'
import { SpacingTool } from './components/tools/SpacingTool'
import { ShadowTool } from './components/tools/ShadowTool'
import { BorderTool } from './components/tools/BorderTool'
import { GradientTool } from './components/tools/GradientTool'
import { MotionTool } from './components/tools/MotionTool'
import { PreviewTool } from './components/tools/PreviewTool'
import { AssistantTool } from './components/tools/AssistantTool'
import { ExportTool } from './components/tools/ExportTool'
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
          <Route path="/shadows" element={<ShadowTool />} />
          <Route path="/borders" element={<BorderTool />} />
          <Route path="/gradients" element={<GradientTool />} />
          <Route path="/motion" element={<MotionTool />} />
          <Route path="/preview" element={<PreviewTool />} />
          <Route path="/assistant" element={<AssistantTool />} />
          <Route path="/export" element={<ExportTool />} />
        </Routes>
      </main>
      <Toaster />
    </div>
  )
}

export default App
