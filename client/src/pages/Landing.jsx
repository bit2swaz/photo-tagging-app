import { Link } from 'react-router-dom';

export default function Landing() {
  const scrollToHowToPlay = () => {
    document.getElementById("how-to-play").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-16 px-6 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Waldo Quest</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          Find the characters. Beat the clock. Rule the leaderboard.
        </p>
        <button 
          onClick={scrollToHowToPlay}
          className="px-6 py-3 bg-indigo-500 text-white rounded-md font-medium"
        >
          Play the Game
        </button>
      </section>

      {/* How To Play Section */}
      <section id="how-to-play" className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Play</h2>
          <ul className="space-y-4 text-lg">
            <li className="flex items-start">
              <span className="bg-indigo-100 text-indigo-800 rounded-full w-8 h-8 flex items-center justify-center mr-3 shrink-0">1</span>
              <span>Choose a difficulty.</span>
            </li>
            <li className="flex items-start">
              <span className="bg-indigo-100 text-indigo-800 rounded-full w-8 h-8 flex items-center justify-center mr-3 shrink-0">2</span>
              <span>Find all characters in the image.</span>
            </li>
            <li className="flex items-start">
              <span className="bg-indigo-100 text-indigo-800 rounded-full w-8 h-8 flex items-center justify-center mr-3 shrink-0">3</span>
              <span>Click accurately and fast.</span>
            </li>
            <li className="flex items-start">
              <span className="bg-indigo-100 text-indigo-800 rounded-full w-8 h-8 flex items-center justify-center mr-3 shrink-0">4</span>
              <span>Get on the leaderboard!</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Waldo Quest?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Real-time Tagging</h3>
              <p className="text-gray-600">Instant feedback on your character finds with our real-time tagging system.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Hints When You Need Them</h3>
              <p className="text-gray-600">Stuck? Get strategic hints to help you find those tricky characters.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Competitive Leaderboard</h3>
              <p className="text-gray-600">Compare your times with players worldwide and climb the rankings.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-2xl font-bold mb-6">Ready to test your skills?</h2>
        <button 
          onClick={scrollToHowToPlay}
          className="px-6 py-3 bg-indigo-500 text-white rounded-md font-medium inline-block"
        >
          Play the Game
        </button>
      </section>
    </div>
  );
}
