import { useLocation, Link } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const scrollToSection = (sectionId) => {
    // Only scroll if we're on the home page
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Navigate to home page and then scroll
      window.location.href = `/#${sectionId}`;
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 shadow-md py-4">
      <div className="container mx-auto px-8 flex justify-between items-center">
        <Link to="/" className="text-3xl md:text-4xl font-extrabold tracking-tight text-indigo-400">
          WaldoQuest
        </Link>
        
        <div className="flex items-center space-x-8 md:space-x-12">
          <button 
            onClick={() => scrollToSection('home')}
            className="text-white hover:text-indigo-400 text-base md:text-lg font-medium transition-colors duration-200 px-4 py-2"
          >
            Home
          </button>
          <button 
            onClick={() => scrollToSection('how-to-play')}
            className="text-white hover:text-indigo-400 text-base md:text-lg font-medium transition-colors duration-200 px-4 py-2"
          >
            How to Play
          </button>
          <Link 
            to="/play"
            className="text-white hover:text-indigo-400 text-base md:text-lg font-medium transition-colors duration-200 px-4 py-2"
          >
            Play the Game
          </Link>
        </div>
      </div>
    </nav>
  );
} 