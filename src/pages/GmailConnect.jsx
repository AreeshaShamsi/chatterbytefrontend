import React, { useState, useEffect } from 'react';
import { X, Mail, Shield, Check } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GmailConnectPopup = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  // API Configuration
  const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://talkportbackend.vercel.app';

  const api = {
    connectGoogle: () => {
      setIsConnecting(true);
      // toast.info('Redirecting to Google Authentication...');
      
      // Small delay to show the connecting state before redirect
      setTimeout(() => {
        window.location.href = `${API_BASE_URL}/api/auth/google`;
      }, 500);
    },
  };

  // Check if user returned from OAuth (look for success/error params in URL)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    const email = urlParams.get('email');

    if (success === 'true') {
      setIsConnected(true);
      setIsConnecting(false);
      if (email) {
        setUserEmail(decodeURIComponent(email));
      }
      toast.success('Gmail connected successfully!');
      
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (error) {
      setIsConnecting(false);
      const errorMessage = decodeURIComponent(error);
      toast.error(`Connection failed: ${errorMessage}`);
      
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleConnect = () => {
    try {
      api.connectGoogle();
    } catch (error) {
      console.error('Error initiating Google OAuth:', error);
      setIsConnecting(false);
      toast.error('Failed to initiate Google authentication. Please try again.');
    }
  };

  // const closePopup = () => {
  //   setShowPopup(false);
  // };

  const handleSkip = () => {
    toast.info('You can connect Gmail later from your dashboard settings.');
    setShowPopup(false);
    // You might want to navigate to dashboard or another page here
    // navigate('/dashboard');
  };

  if (!showPopup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 flex items-center justify-center p-4">
        <div className="text-center">
          <button 
            onClick={() => setShowPopup(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 mb-4"
          >
            Open Gmail Connection
          </button>
          <p className="text-gray-400 text-sm">
            Connect your Gmail to get started with Chatterbyte
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
   
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.6 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="relative bg-black/20 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Close button */}
          

          {/* Gmail icon with glow effect */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-400/30 animate-pulse">
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-2xl flex items-center justify-center text-4xl">
  👾
</div>
</div>

              {/* Glow rings */}
              <div className="absolute inset-0 bg-cyan-400/20 rounded-2xl animate-ping"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/10 via-blue-500/10 to-purple-600/10 rounded-3xl blur-lg"></div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-2">
            <h2 className="text-2xl font-bold mb-2">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Connect Your Gmail
              </span>
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Centralize your emails and feed the bug with every message. 
              <span className="text-cyan-400"> Never miss important communications.</span>
            </p>
          </div>

          {/* Connection Status */}
          {isConnected && (
            <div className="bg-cyan-400/10 border border-cyan-400/30 rounded-xl p-3 mb-6 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-cyan-400 font-semibold text-sm">Connected Successfully!</p>
                  <p className="text-gray-400 text-xs">
                    {userEmail || 'Gmail account connected'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Connecting Status */}
          {isConnecting && (
            <div className="bg-blue-400/10 border border-blue-400/30 rounded-xl p-3 mb-6 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
                <div>
                  <p className="text-blue-400 font-semibold text-sm">Redirecting to Google...</p>
                  <p className="text-gray-400 text-xs">Please complete authentication in the popup window</p>
                </div>
              </div>
            </div>
          )}

          {/* Connect Button */}
          <button
            onClick={handleConnect}
            disabled={isConnecting || isConnected}
            className="w-full group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 shadow-lg hover:shadow-cyan-500/25 relative overflow-hidden mb-4"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="flex items-center justify-center gap-3 relative z-10">
              {isConnecting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Redirecting...</span>
                </>
              ) : isConnected ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Connected!</span>
                </>
              ) : (
                <>
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-xs">G</span>
                  </div>
                  <span>Connect with Google</span>
                </>
              )}
            </div>
          </button>

          

          {/* Security Note */}
          <div className="bg-black/30 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Shield className="w-3 h-3 text-white" />
              </div>
              <div>
                <h4 className="text-cyan-400 font-semibold text-sm mb-1">Your Privacy is Protected</h4>
                <p className="text-gray-400 text-xs leading-relaxed">
                  We use Google's secure OAuth 2.0 authentication. We never store your password and you can revoke access anytime from your Google account settings.
                </p>
              </div>
            </div>
          </div>

          {/* Subtle bottom glow */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent blur-sm"></div>
        </div>
      </div>

      {/* Toast Container with custom styling */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          backgroundColor: '#1e3a8a', // Dark blue background
          color: '#ffffff', // White text
          border: '1px solid #3b82f6', // Blue border
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '500'
        }}
        progressStyle={{
          backgroundColor: '#06b6d4' // Cyan progress bar
        }}
      />
    </div>
    </>
  );
};

export default GmailConnectPopup;