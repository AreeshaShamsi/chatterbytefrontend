import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { Eye, EyeOff } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import Bg from '../components/Bg';
import Footer from '../components/Footer';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';

const LoginPage = () => {
  const navigate = useNavigate();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getPupilStyle = (eyeRef) => {
    if (!eyeRef.current) return {};
    const rect = eyeRef.current.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width / 2;
    const eyeCenterY = rect.top + rect.height / 2;
    const dx = mouse.x - eyeCenterX;
    const dy = mouse.y - eyeCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxMove = 3;
    const moveX = (dx / distance) * maxMove || 0;
    const moveY = (dy / distance) * maxMove || 0;

    return {
      transform: `translate(${moveX}px, ${moveY}px)`,
      transition: 'transform 0.1s linear',
    };
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value.trim();
    const newErrors = {};

    // Validation with toast notifications
    if (!email) {
      newErrors.email = 'Email is required';
      toast.error('Please enter your email address');
    }
    if (!password) {
      newErrors.password = 'Password is required';
      toast.error('Please enter your password');
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Login successful! Redirecting to dashboard...');
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } catch (error) {
        console.error('Login Error:', error.message);
        
        // Handle specific Firebase auth errors with user-friendly messages
        let errorMessage = 'Login failed. Please try again.';
        
        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email address. Please check your email or create a new account.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password. Please check your password and try again.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'This account has been disabled. Please contact support for assistance.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed login attempts. Please try again later or reset your password.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your internet connection and try again.';
            break;
          case 'auth/invalid-credential':
            errorMessage = 'Invalid email or password. Please check your credentials and try again.';
            break;
          default:
            errorMessage = error.message || errorMessage;
        }
        
        toast.error(errorMessage);
        setErrors({ firebase: errorMessage });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Google sign-in successful! Redirecting to dashboard...');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Google Login Error:', error.message);
      
      // Handle specific Google sign-in errors
      let errorMessage = 'Google sign-in failed. Please try again.';
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign-in was cancelled. Please try again.';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Popup was blocked by your browser. Please allow popups and try again.';
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage = 'An account already exists with this email using a different sign-in method. Please try logging in with email and password.';
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = 'Sign-in request was cancelled. Please try again.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection and try again.';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white relative overflow-hidden">
      <Navbar />
      <Bg />

      <div className="flex-1 pt-24 px-4 pb-10 flex items-center justify-center">
        <div className="flex flex-col md:flex-row items-center max-w-4xl w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          {/* Mascot Section */}
          <div className="w-full md:w-1/2 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10">
            <div className="relative w-32 h-28 md:w-36 md:h-32 animate-bounce drop-shadow-xl">
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
              <div className="w-full h-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-full shadow-lg shadow-cyan-400/30 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full animate-pulse"></div>

                {/* Eyes */}
                <div className="absolute top-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  <div ref={leftEyeRef} className="w-4 h-4 bg-white rounded-full relative flex items-center justify-center overflow-hidden">
                    <div className="w-2 h-2 bg-black rounded-full" style={getPupilStyle(leftEyeRef)}></div>
                  </div>
                  <div ref={rightEyeRef} className="w-4 h-4 bg-white rounded-full relative flex items-center justify-center overflow-hidden">
                    <div className="w-2 h-2 bg-black rounded-full" style={getPupilStyle(rightEyeRef)}></div>
                  </div>
                </div>

                {/* Smile */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-5 h-1 border-b-2 border-white rounded-full"></div>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-semibold mt-6 text-cyan-300">Welcome to Chatterbyte</h2>
            <p className="text-sm text-gray-300 mt-1 text-center max-w-[250px]">Securely centralize your inbox with smart tools</p>
          </div>

          {/* Login Form Section */}
          <div className="w-full md:w-1/2 p-8">
            <h2 className="text-3xl font-bold text-center mb-4 text-cyan-400">Login</h2>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm text-cyan-300 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  disabled={loading}
                  className="w-full bg-black/40 text-white px-4 py-2 rounded-lg border border-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>

              <div className="relative">
                <label className="block text-sm text-cyan-300 mb-1">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  disabled={loading}
                  className="w-full bg-black/40 text-white px-4 py-2 pr-10 rounded-lg border border-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 top-9 text-white disabled:opacity-50"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing In...' : 'Log In'}
              </button>
            </form>

            <div className="my-4 text-center text-gray-400">or</div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-2 rounded-full shadow-md hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <FcGoogle size={22} />
              {loading ? 'Signing In...' : 'Sign in with Google'}
            </button>

            <p className="text-sm text-center mt-5 text-gray-400">
              Don't have an account?{' '}
              <span
                className="text-cyan-400 hover:underline cursor-pointer"
                onClick={() => !loading && navigate('/register')}
              >
                Register
              </span>
            </p>
          </div>
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

      <Footer />
    </div>
  );
};

export default LoginPage;