import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { Eye, EyeOff } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import Bg from '../components/Bg';
import Footer from '../components/Footer';
import { auth, db, googleProvider } from '../firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleMouseMove = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getPupilStyle = (eyeRef) => {
    if (!eyeRef.current) return {};
    const rect = eyeRef.current.getBoundingClientRect();
    const dx = mouse.x - (rect.left + rect.width / 2);
    const dy = mouse.y - (rect.top + rect.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxMove = 3;
    const moveX = (dx / distance) * maxMove || 0;
    const moveY = (dy / distance) * maxMove || 0;
    return {
      transform: `translate(${moveX}px, ${moveY}px)`,
      transition: 'transform 0.1s linear',
    };
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      toast.error('First name is required');
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      toast.error('Last name is required');
    }
    if (!formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email address';
      toast.error('Please enter a valid email address');
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
      toast.error('Password must be at least 6 characters long');
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      toast.error('Passwords do not match');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enhanced function to store user data in Firestore
  const storeUserData = async (user, additionalData = {}) => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      
      // Prepare user data object with all fields
      const userData = {
        uid: user.uid,
        firstName: additionalData.firstName || formData.firstName || '',
        lastName: additionalData.lastName || formData.lastName || '',
        email: user.email || formData.email,
        displayName: user.displayName || `${formData.firstName} ${formData.lastName}`.trim(),
        photoURL: user.photoURL || null,
        emailVerified: user.emailVerified || false,
        phoneNumber: user.phoneNumber || null,
        // Authentication provider info
        providerId: additionalData.providerId || 'email',
        providerData: user.providerData || [],
        // Timestamps
        createdAt: new Date(),
        lastLoginAt: new Date(),
        updatedAt: new Date(),
        // User preferences and settings
        preferences: {
          theme: 'dark',
          notifications: true,
          language: 'en'
        },
        // User status and metadata
        isActive: true,
        accountStatus: 'active',
        role: 'user',
        // Profile completion status
        profileComplete: !!(formData.firstName && formData.lastName),
        // Additional metadata
        metadata: {
          registrationIP: null, // You can add IP tracking if needed
          userAgent: navigator.userAgent,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          registrationSource: additionalData.registrationSource || 'direct'
        }
      };

      await setDoc(userDocRef, userData, { merge: true });
      console.log('User data stored successfully in Firestore');
      return userData;
    } catch (error) {
      console.error('Error storing user data:', error);
      throw error;
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Store all user data in Firestore
      await storeUserData(user, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        providerId: 'email',
        registrationSource: 'email_registration'
      });

      console.log('Firebase user created and data stored:', user);
      toast.success('Account created successfully! Redirecting...');
      
      setTimeout(() => {
        navigate('/gmail-connect');
      }, 1500);
    } catch (error) {
      console.error('Firebase registration error:', error.message);
      
      // Handle specific Firebase auth errors with user-friendly messages
      let errorMessage = 'Registration failed. Please try again.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email address is already registered. Please use a different email or try logging in.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please choose a stronger password.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password registration is not enabled. Please contact support.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      
      toast.error(errorMessage);
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user already exists
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      const displayNameParts = user.displayName?.split(' ') || [];
      
      if (!userDoc.exists()) {
        // New user - store all data
        await storeUserData(user, {
          firstName: displayNameParts[0] || '',
          lastName: displayNameParts.slice(1).join(' ') || '',
          providerId: 'google',
          registrationSource: 'google_signup'
        });
        toast.success('Account created successfully with Google! Redirecting...');
      } else {
        // Existing user - update last login
        await setDoc(userDocRef, {
          lastLoginAt: new Date(),
          updatedAt: new Date()
        }, { merge: true });
        toast.success('Welcome back! Redirecting...');
      }

      console.log('Google user signed in and data updated:', user);
      
      setTimeout(() => {
        navigate('/gmail-connect');
      }, 1500);
    } catch (error) {
      console.error('Google sign-in error:', error.message);
      
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
          errorMessage = 'An account already exists with this email using a different sign-in method.';
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = 'Sign-in request was cancelled. Please try again.';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      
      toast.error(errorMessage);
      setErrors({ general: errorMessage });
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

          {/* Mascot */}
          <div className="w-full md:w-1/2 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10">
            <div className="relative w-32 h-28 md:w-36 md:h-32 animate-bounce drop-shadow-xl">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
                {[0, 0.5].map((delay, i) => (
                  <div key={i} className="w-0.5 h-8 bg-cyan-400 relative">
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: `${delay}s` }}></div>
                    <div className="absolute top-2 -left-0.5 w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: `${delay + 0.3}s` }}></div>
                  </div>
                ))}
              </div>
              <div className="w-full h-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-full relative shadow-lg shadow-cyan-400/30">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full animate-pulse"></div>
                <div className="absolute top-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  <div ref={leftEyeRef} className="w-4 h-4 bg-white rounded-full flex items-center justify-center overflow-hidden">
                    <div className="w-2 h-2 bg-black rounded-full" style={getPupilStyle(leftEyeRef)}></div>
                  </div>
                  <div ref={rightEyeRef} className="w-4 h-4 bg-white rounded-full flex items-center justify-center overflow-hidden">
                    <div className="w-2 h-2 bg-black rounded-full" style={getPupilStyle(rightEyeRef)}></div>
                  </div>
                </div>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-5 h-1 border-b-2 border-white rounded-full"></div>
                </div>
              </div>
            </div>
            <h2 className="text-xl font-semibold mt-6 text-cyan-300">Let's Get Started</h2>
            <p className="text-sm text-gray-300 mt-1 text-center max-w-[250px]">Create your secure Chatterbyte account</p>
          </div>

          {/* Form */}
          <div className="w-full md:w-1/2 p-8">
            <h2 className="text-3xl font-bold text-center mb-4 text-cyan-400">Register</h2>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label className="block text-sm text-cyan-300 mb-1">First Name</label>
                  <input 
                    name="firstName" 
                    value={formData.firstName} 
                    onChange={handleChange} 
                    disabled={loading}
                    className="w-full bg-black/40 text-white px-4 py-2 rounded-lg border border-cyan-500/20 disabled:opacity-50" 
                  />
                  {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
                </div>
                <div className="w-1/2">
                  <label className="block text-sm text-cyan-300 mb-1">Last Name</label>
                  <input 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleChange} 
                    disabled={loading}
                    className="w-full bg-black/40 text-white px-4 py-2 rounded-lg border border-cyan-500/20 disabled:opacity-50" 
                  />
                  {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm text-cyan-300 mb-1">Email</label>
                <input 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  disabled={loading}
                  className="w-full bg-black/40 text-white px-4 py-2 rounded-lg border border-cyan-500/20 disabled:opacity-50" 
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>

              <div className="relative">
                <label className="block text-sm text-cyan-300 mb-1">Password</label>
                <input 
                  name="password" 
                  type={showPassword ? 'text' : 'password'} 
                  value={formData.password} 
                  onChange={handleChange} 
                  disabled={loading}
                  className="w-full bg-black/40 text-white px-4 py-2 pr-10 rounded-lg border border-cyan-500/20 disabled:opacity-50" 
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

              <div className="relative">
                <label className="block text-sm text-cyan-300 mb-1">Confirm Password</label>
                <input 
                  name="confirmPassword" 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  disabled={loading}
                  className="w-full bg-black/40 text-white px-4 py-2 pr-10 rounded-lg border border-cyan-500/20 disabled:opacity-50" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                  disabled={loading}
                  className="absolute right-3 top-9 text-white disabled:opacity-50"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-2 rounded-full shadow-md hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Register'}
              </button>
            </form>

            <div className="my-4 text-center text-gray-400">or</div>
            <button
              onClick={handleGoogleSignup}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-2 rounded-full shadow-md hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <FcGoogle size={22} />
              {loading ? 'Signing up...' : 'Sign up with Google'}
            </button>

            <p className="text-sm text-center mt-5 text-gray-400">
              Already have an account?{' '}
              <span 
                className="text-cyan-400 hover:underline cursor-pointer" 
                onClick={() => !loading && navigate('/login')}
              >
                Log in
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

export default RegisterPage;