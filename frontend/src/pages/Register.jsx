import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, MapPin, UserPlus, Shield, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const { register, verifyOTP, googleLogin } = useAuth();
  
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      await googleLogin(credentialResponse.credential);
      navigate('/');
    } catch (error) {
      console.error('Google login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google Login Failed');
    console.error('Google Login Failed');
  };


  const [step, setStep] = useState(1); // 1: Registration form, 2: OTP verification
  const [formData, setFormData] = useState({
    username: '',
    fullname: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    applyForAdmin: false,
  });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (step === 1) {
        await register(formData);
        setStep(2);
      } else {
        await verifyOTP(formData.email, otp);
        navigate('/');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToForm = () => {
    setStep(1);
    setOtp('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full glass-card"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-6xl mb-4"
          >
            {step === 1 ? '🎉' : '📧'}
          </motion.div>
          <h2 className="text-3xl font-bold mb-2">
            {step === 1 ? 'Create Account' : 'Verify Email'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {step === 1 ? 'Join us and start your journey' : `Enter the 6-digit OTP sent to ${formData.email}`}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSendOTP} className={step === 1 ? "grid md:grid-cols-2 gap-6" : "space-y-6"}>
          {step === 1 ? (
             <>
          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="input-field pl-10"
                placeholder="johndoe"
                required
              />
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={formData.fullname}
                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                className="input-field pl-10"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field pl-10"
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input-field pl-10"
                placeholder="9876543210"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field pl-10"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="input-field pl-10"
                placeholder="Delhi, India"
                required
              />
            </div>
          </div>

          {/* Apply for Admin Checkbox */}
          <div className="md:col-span-2 flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="applyForAdmin"
              checked={formData.applyForAdmin || false}
              onChange={(e) => setFormData({ ...formData, applyForAdmin: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="applyForAdmin" className="text-gray-700 dark:text-gray-300 font-medium cursor-pointer">
              Apply for Admin Access (Requires Approval)
            </label>
          </div>
          </>
          ) : (
             <div>
                <label className="block text-sm font-medium mb-2">Enter OTP</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="input-field pl-10 text-center tracking-[0.5em] text-xl font-bold"
                    placeholder="------"
                    maxLength={6}
                    required
                  />
                </div>
             </div>
          )}

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`${step === 1 ? "md:col-span-2" : "w-full"} btn-primary flex items-center justify-center gap-2`}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                {step === 1 ? (
                  <>
                    <UserPlus className="h-5 w-5" />
                    Send OTP
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    Verify && Create Account
                  </>
                )}
              </>
            )}
          </motion.button>
        </form>
        {step === 1 && (
          <>
            <div className="mt-6 flex items-center justify-between">
              <span className="border-b dark:border-gray-600 w-1/5 lg:w-1/4"></span>
              <span className="text-xs text-center text-gray-500 uppercase dark:text-gray-400">or sign up with</span>
              <span className="border-b dark:border-gray-600 w-1/5 lg:w-1/4"></span>
            </div>

            <div className="mt-6 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="filled_blue"
                shape="rectangular"
                text="continue_with"
              />
            </div>
          </>
        )}

        {/* Back Button for step 2 */}
        {step === 2 && (
           <p className="mt-4 text-center">
              <button 
                 type="button" 
                 onClick={() => setStep(1)} 
                 className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm underline"
                 disabled={loading}
              >
                 Back to details
              </button>
           </p>
        )}

        {/* Footer */}
        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
            Login
          </Link>
        </p>
        {step === 2 && (
          <p className="mt-2 text-center text-sm text-gray-500">
            Didn't receive OTP?{' '}
            <button
              onClick={() => sendOTP(formData.email)}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              disabled={loading}
            >
              Resend
            </button>
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default Register;