import { Link, useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  
  const goToPlay = () => {
    navigate('/play');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section id="home" className="pt-28 pb-20 px-8 flex flex-col items-center text-center">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Welcome to Waldo Quest</h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-4xl mx-auto">
            Find the characters. Beat the clock. Rule the leaderboard.
          </p>
          <button 
            onClick={goToPlay}
            className="px-8 py-4 bg-gray-800 text-white rounded-md text-lg font-medium hover:bg-gray-700 transition duration-200 border border-gray-700"
          >
            Play the Game
          </button>
        </div>
      </section>

      {/* How To Play Section */}
      <section id="how-to-play" className="pt-28 pb-20 px-8 bg-gray-800">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-4xl md:text-6xl font-bold mb-12 text-center">How to Play</h2>
          <ul className="space-y-6 text-lg max-w-5xl mx-auto">
            <li className="flex items-start">
              <span className="bg-gray-700 text-indigo-400 rounded-full w-10 h-10 flex items-center justify-center mr-4 shrink-0">1</span>
              <span className="text-xl">Choose a difficulty.</span>
            </li>
            <li className="flex items-start">
              <span className="bg-gray-700 text-indigo-400 rounded-full w-10 h-10 flex items-center justify-center mr-4 shrink-0">2</span>
              <span className="text-xl">Find all characters in the image.</span>
            </li>
            <li className="flex items-start">
              <span className="bg-gray-700 text-indigo-400 rounded-full w-10 h-10 flex items-center justify-center mr-4 shrink-0">3</span>
              <span className="text-xl">Click accurately and fast.</span>
            </li>
            <li className="flex items-start">
              <span className="bg-gray-700 text-indigo-400 rounded-full w-10 h-10 flex items-center justify-center mr-4 shrink-0">4</span>
              <span className="text-xl">Get on the leaderboard!</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-8 bg-gray-900">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-4xl md:text-6xl font-bold mb-16 text-center">Why Waldo Quest?</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
              <h3 className="text-2xl font-semibold mb-4 text-indigo-400">Real-time Tagging</h3>
              <p className="text-gray-300 text-lg">Instant feedback on your character finds with our real-time tagging system.</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
              <h3 className="text-2xl font-semibold mb-4 text-indigo-400">Hints When You Need Them</h3>
              <p className="text-gray-300 text-lg">Stuck? Get strategic hints to help you find those tricky characters.</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
              <h3 className="text-2xl font-semibold mb-4 text-indigo-400">Competitive Leaderboard</h3>
              <p className="text-gray-300 text-lg">Compare your times with players worldwide and climb the rankings.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8 text-center bg-gray-800">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to test your skills?</h2>
          <button 
            onClick={goToPlay}
            className="px-8 py-4 bg-gray-900 text-white rounded-md text-lg font-medium inline-block hover:bg-gray-700 transition duration-200 border border-gray-700"
          >
            Play the Game
          </button>
        </div>
      </section>
    </div>
  );
}
