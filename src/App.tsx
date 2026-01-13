import { Routes, Route } from 'react-router-dom'
import { Sidebar } from './components/layout/Sidebar'
import { ColorPalette } from './components/tools/ColorPalette'
import { Toaster } from './components/ui/sonner'

function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<ColorPalette />} />
          <Route path="/colors" element={<ColorPalette />} />
        </Routes>
      </main>
      <Toaster />
    </div>
  )
}

export default App
