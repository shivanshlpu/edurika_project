import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-sm bg-white/90 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl" role="img" aria-label="stethoscope">🩺</span>
          <span className="text-xl font-bold text-gray-900">SymptomSense</span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8">
          <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Home</Link>
          <Link to="/how-it-works" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">How It Works</Link>
          <Link to="/performance" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Performance</Link>
          <Link to="/about" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">About</Link>
        </nav>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-500 hover:text-gray-900 focus:outline-none p-2" 
          aria-label="Menu"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 absolute w-full left-0 shadow-lg">
          <nav className="flex flex-col px-4 pt-2 pb-6 space-y-4">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium text-lg">Home</Link>
            <Link to="/how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium text-lg">How It Works</Link>
            <Link to="/performance" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium text-lg">Performance</Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium text-lg">About</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
