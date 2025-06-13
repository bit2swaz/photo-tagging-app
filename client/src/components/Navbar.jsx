import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-10 bg-white shadow-sm flex justify-between items-center px-6 py-3">
      <Link to="/" className="text-xl font-bold tracking-tight">WaldoQuest</Link>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/instructions" className="hover:underline">How to Play</Link>
        <Link to="/play" className="hover:underline">Play</Link>
      </div>
    </nav>
  );
} 