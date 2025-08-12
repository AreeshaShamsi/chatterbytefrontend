import React from 'react';
import { Twitter, Linkedin, Github, Instagram } from 'lucide-react';

export default function MinimalTransparentFooter() {
  return (
    <div>

      {/* Minimal Transparent Footer */}
      <footer className="relative">
        {/* Transparent background with subtle border */}
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm border-t border-white/10"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
            
            {/* Brand */}
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold text-white mb-2">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  ChatterByte
                </span>
              </h3>
              <p className="text-gray-400 text-sm">No more switching tabs</p>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {[
                { icon: Twitter, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Github, href: '#' },
                { icon: Instagram, href: '#' }
              ].map(({ icon: Icon, href }, index) => (
                <a
                  key={index}
                  href={href}
                  className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-blue-400 hover:bg-white/10 hover:border-blue-400/30 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-gray-500 text-sm">© 2025 All rights reserved</p>
              <div className="flex items-center justify-center md:justify-end space-x-4 mt-1 text-xs text-gray-600">
                <a href="#" className="hover:text-gray-400 transition-colors duration-200">Privacy</a>
                <a href="#" className="hover:text-gray-400 transition-colors duration-200">Terms</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}