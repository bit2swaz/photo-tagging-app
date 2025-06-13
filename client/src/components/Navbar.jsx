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
    <nav className="sticky top-0 z-50 bg-white shadow-md py-4">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="text-2xl md:text-3xl font-bold tracking-tight text-indigo-600">
          WaldoQuest
        </Link>
        
        <div className="flex items-center space-x-6 md:space-x-10">
          <button 
            onClick={() => scrollToSection('home')}
            className="text-gray-700 hover:text-indigo-600 text-base md:text-lg font-medium transition-colors duration-200"
          >
            Home
          </button>
          <button 
            onClick={() => scrollToSection('how-to-play')}
            className="text-gray-700 hover:text-indigo-600 text-base md:text-lg font-medium transition-colors duration-200"
          >
            How to Play
          </button>
          <Link 
            to="/play"
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-base md:text-lg font-medium transition-colors duration-200"
          >
            Play the Game
          </Link>
        </div>
      </div>
    </nav>
  );
} 