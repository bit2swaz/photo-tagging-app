import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar'
import LandingPage from './pages/LandingPage'
import HowToPlayPage from './pages/HowToPlayPage'
import PlayGameStartPage from './pages/PlayGameStartPage'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <NavBar />
        <div className="content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/how-to-play" element={<HowToPlayPage />} />
            <Route path="/play" element={<PlayGameStartPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
