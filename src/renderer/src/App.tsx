import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Clips from './pages/Clips/Clips'
import Trim from './pages/Trim/Trim'
import Upload from './pages/Upload/Upload'

function App(): React.JSX.Element {
  return (
    <div className="flex h-full bg-neutral-900 text-white">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Clips />} />
          <Route path="/trim" element={<Trim />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
