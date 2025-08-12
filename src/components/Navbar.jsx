import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom'

// ...




export default function ChatterbyteNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bugGlow, setBugGlow] = useState(true);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const location = useLocation();

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/30 backdrop-blur-xl border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center transition-all duration-300 ${bugGlow
                    ? "shadow-lg shadow-cyan-400/50 scale-110"
                    : "shadow-md shadow-cyan-400/30"
                  }`}
              >
                <span className="text-black font-bold text-sm">👾</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Chatterbyte
              </span>
            </Link>
          </div>


          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            {['Features', 'Apps', 'Enterprise', 'Docs'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}

            {location.pathname !== '/login' && location.pathname !== '/register' && (
              <button
                onClick={() => navigate('/login')}
                className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-semibold py-2 px-5 rounded-full transition duration-300"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-cyan-400 hover:text-cyan-300 transition duration-300"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-black/90 backdrop-blur-xl border-b border-cyan-500/20 transition-all duration-300 ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
      >
        <div className="px-6 py-8 space-y-6">
          {['Features', 'Apps', 'Enterprise', 'Docs'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setIsMenuOpen(false)}
              className="block text-gray-300 hover:text-cyan-400 transition-colors duration-300 text-lg"
            >
              {item}
            </a>
          ))}

          <div className="pt-4 border-t border-cyan-500/20">
            {location.pathname !== '/login' && location.pathname !== '/register' && (
              <button
                onClick={() => navigate('/login')}
                className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-semibold py-2 px-5 rounded-full transition duration-300"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}