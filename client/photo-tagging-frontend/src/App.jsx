import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'
import HowToPlayPage from './pages/HowToPlayPage'
import PlayGameStartPage from './pages/PlayGameStartPage'
import GamePage from './pages/GamePage'

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
            <Route path="/play/game" element={<GamePage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
