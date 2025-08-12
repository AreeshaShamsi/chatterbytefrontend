import React from 'react';

const Bg = ({ particles = [] }) => (
  <div className="fixed inset-0 pointer-events-none">
    {/* Circuit Pattern Background */}
    <div className="absolute inset-0 opacity-10">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="circuit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M10 0v20M0 10h20" stroke="cyan" strokeWidth="0.5" opacity="0.3"/>
            <circle cx="10" cy="10" r="1" fill="cyan" opacity="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit)" />
      </svg>
    </div>

    {/* Floating Digital Particles */}
    <div className="absolute inset-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-cyan-400 animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animation: `float-${particle.id} ${particle.speed + 3}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>

    {/* Glitch Lines */}
    <div className="absolute inset-0 opacity-20">
      <div 
        className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
        style={{ 
          top: '20%',
          animation: 'glitch-line 8s infinite linear',
        }}
      />
      <div 
        className="absolute w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"
        style={{ 
          top: '60%',
          animation: 'glitch-line 12s infinite linear reverse',
        }}
      />
      <div 
        className="absolute w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"
        style={{ 
          top: '80%',
          animation: 'glitch-line 10s infinite linear',
        }}
      />
    </div>

    {/* Data Stream Effect */}
    <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-cyan-400 via-transparent to-cyan-400 opacity-30 animate-pulse"/>
    <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-purple-400 via-transparent to-purple-400 opacity-30 animate-pulse" style={{ animationDelay: '1s' }}/>
  </div>
);

export default Bg;