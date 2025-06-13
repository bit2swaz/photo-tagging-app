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
      <div className="w-full max-w-[95%] mx-auto flex justify-between items-center">
        <Link to="/" className="text-4xl md:text-5xl font-extrabold tracking-tight text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
          WaldoQuest
        </Link>
        
        <div className="flex items-center gap-x-12">
          <button 
            onClick={() => scrollToSection('home')}
            className="text-white hover:text-indigo-400 text-lg font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-indigo-400 pb-1"
          >
            Home
          </button>
          <button 
            onClick={() => scrollToSection('how-to-play')}
            className="text-white hover:text-indigo-400 text-lg font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-indigo-400 pb-1"
          >
            How to Play
          </button>
          <button 
            onClick={() => scrollToSection('play')}
            className="text-indigo-400 hover:text-indigo-300 text-lg font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-indigo-300 pb-1"
          >
            Play the Game
          </button>
        </div>
      </div>
    </nav>
  );
} 