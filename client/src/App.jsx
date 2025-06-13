import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Instructions from './pages/Instructions';
import Play from './pages/Play';
import Game from './pages/Game';
import Navbar from './components/Navbar';
import './App.css'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/play" element={<Play />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App;
