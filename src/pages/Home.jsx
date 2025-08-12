import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Bg from '../components/Bg';
import LiveBugStats from './Stats';
import Footer from '../components/Footer';

import ChatterbyteGuide from './Features';
// import BugFace from '../components/BestBug';

// import BugIntro from '../components/BestBug';

const ChatterbytePage = () => {
  const [bugGlow, setBugGlow] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 1,
          speed: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBugGlow(true);
      setMessageCount((prev) => prev + 1);
      setTimeout(() => setBugGlow(false), 1500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleBugClick = () => {
    setBugGlow(true);
    setMessageCount((prev) => prev + 1);
    setTimeout(() => setBugGlow(false), 1500);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white relative overflow-hidden">
      <Bg particles={particles} />
      <Navbar bugGlow={bugGlow} isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-20">

        {/* Bug Mascot */}
        <div className="flex justify-center mb-16">
          <div
            className="relative cursor-pointer transform transition-all duration-300 hover:scale-110"
            onClick={handleBugClick}
          >
            <div className={`relative w-20 h-16 sm:w-32 sm:h-32 transition-all duration-500 ${bugGlow ? 'animate-pulse' : ''}`}>
              {/* Antennae */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
                {[0, 0.5].map((delay, i) => (
                  <div key={i} className="w-0.5 h-8 bg-cyan-400 relative">
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: `${delay}s` }}></div>
                    <div className="absolute top-2 -left-0.5 w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: `${delay + 0.3}s` }}></div>
                  </div>
                ))}
              </div>

              {/* Bug Body */}
              <div className={`w-16 h-14 sm:w-24 sm:h-20 mx-auto bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-full relative transition-all duration-500 ${bugGlow ? 'shadow-2xl shadow-cyan-400/50 scale-105' : 'shadow-lg shadow-cyan-400/30'}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full animate-pulse"></div>

                {/* Eyes */}
                <div className="absolute top-2 sm:top-4 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3">
                  {[0, 0.2].map((delay, i) => (
                    <div key={i} className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full relative overflow-hidden">
                      <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-black rounded-full"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/50 to-transparent animate-pulse" style={{ animationDelay: `${delay}s` }}></div>
                    </div>
                  ))}
                </div>

                {/* Mouth */}
                <div className="absolute bottom-2 sm:bottom-3 left-1/2 transform -translate-x-1/2">
                  <div className="w-4 sm:w-6 h-1 sm:h-2 border-b-2 border-white rounded-full"></div>
                </div>

                {/* Feeding Indicator */}
                {bugGlow && (
                  <>
                    <div className="absolute inset-0 bg-cyan-400/20 rounded-full animate-ping"></div>
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-xs text-cyan-400 animate-bounce">
                      FEEDING...
                    </div>
                  </>
                )}
              </div>

              {/* Wings */}
              <div className="absolute top-1 sm:top-2 -left-3 sm:-left-4 w-6 h-10 sm:w-8 sm:h-12 bg-gradient-to-b from-cyan-300/20 to-transparent rounded-full transform -rotate-12">
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/10 to-transparent rounded-full animate-pulse"></div>
              </div>
              <div className="absolute top-1 sm:top-2 -right-3 sm:-right-4 w-6 h-10 sm:w-8 sm:h-12 bg-gradient-to-b from-cyan-300/20 to-transparent rounded-full transform rotate-12">
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/10 to-transparent rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Message Counter */}
            {messageCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center animate-bounce border-2 border-white/20">
                {messageCount > 99 ? '99+' : messageCount}
              </div>
            )}
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-16 px-4">
          <h1 className="text-5xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-6">

            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Centralize Your 
            </span>
            <span className="text-white ml-2 sm:ml-4 relative">
               Emails
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-purple-400 animate-pulse"></div>
            </span>
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            No more switching tabs — <span className="text-cyan-400 font-semibold">all your messages, </span>always accessible.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mb-16 px-4">
          <button className="w-full sm:w-auto group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden">
            <span className="relative z-10">Feed the Bug Now</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          <button className="w-full sm:w-auto group border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-full transition-all duration-300 transform hover:scale-105 relative overflow-hidden">
            <span className="relative z-10">Watch Demo</span>
            <div className="absolute inset-0 bg-cyan-400/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 mt-20">
          {[
            {
              icon: '💬',
              title: 'Chat Feeding',
              desc: 'Your cyber bug grows stronger with every message, creating a digital companion that evolves with you.',
            },
            {
              icon: '⚡',
              title: 'Real-time Glow',
              desc: 'Watch your bug light up and respond to conversations with dynamic visual feedback.',
            },
            {
              icon: '🚀',
              title: 'Productivity Boost',
              desc: 'Gamify your workspace and increase engagement with our unique digital ecosystem.',
            },
          ].map((f, i) => (
            <div
              key={i}
              className="group bg-black/20 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6 sm:p-8 hover:border-cyan-400/40 transition-all duration-300 hover:bg-black/30 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-400/10 to-transparent rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="text-3xl sm:text-4xl mb-4 relative z-10">{f.icon}</div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-cyan-400 relative z-10">{f.title}</h3>
              <p className="text-sm sm:text-base text-gray-400 relative z-10">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        ${particles
          .map(
            (particle) => `
          @keyframes float-${particle.id} {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            25% { transform: translateY(-20px) translateX(10px); }
            50% { transform: translateY(-10px) translateX(-5px); }
            75% { transform: translateY(-30px) translateX(5px); }
          }`
          )
          .join('')}
      `}</style>
      <LiveBugStats />
    
       <ChatterbyteGuide />
       {/* <BugFace/> */}


 
<Footer />


    </div>
  );
};

export default ChatterbytePage;
