import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowLeft, KeyRound, Mail, Lock, ShieldCheck, ShieldAlert, Wrench, ArrowRight } from 'lucide-react';

const ForgotPassword = () => {
  const { forgotPassword, resetPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get('role') || 'user';

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1 = send email, 2 = enter code and new password
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await forgotPassword(email, role);
      if (res.success) {
        setMessage(res.message);
        setStep(2);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Failed to send recovery code.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await resetPassword(email, code, newPassword, role);
      if (res.success) {
        setMessage(res.message);
        setTimeout(() => {
          navigate('/auth/login');
        }, 3000);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Password reset failed. Make sure the code is correct.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex font-sans">
      {/* Left side: Premium Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#111827] flex-col justify-between p-12 relative overflow-hidden">
        {/* Abstract Background Design */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full border-[1px] border-[#FF3B30] opacity-30"></div>
          <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] rounded-full border-[1px] border-[#FF3B30] opacity-20"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-[#FF3B30] to-transparent rounded-full blur-[100px] opacity-20"></div>
        </div>

        <div className="relative z-10">
          <Link to="/auth/login" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors mb-12">
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </Link>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-lg">
              <Wrench className="w-6 h-6 text-[#FF3B30]" />
            </div>
            <div>
              <h1 className="font-black text-2xl tracking-tighter text-white uppercase">SMART<span className="text-[#FF3B30]">GARAGE</span></h1>
            </div>
          </div>
          <h2 className="text-5xl font-black text-white leading-tight mt-10">
            Secure<br />
            <span className="text-[#FF3B30]">Recovery</span><br />
            Process.
          </h2>
          <p className="text-gray-400 mt-6 text-lg max-w-md leading-relaxed font-medium">
            Reset your password securely to regain access to your dashboard and services.
          </p>
        </div>
      </div>

      {/* Right side: Recovery Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="lg:hidden flex justify-between items-center mb-10">
              <Link to="/auth/login" className="p-2 rounded-full bg-gray-100 text-gray-500 hover:text-[#111827]">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#111827] flex items-center justify-center shadow-lg">
                  <Wrench className="w-4 h-4 text-white" />
                </div>
                <h1 className="font-black text-xl tracking-tighter text-[#111827] uppercase">SMART<span className="text-[#FF3B30]">GARAGE</span></h1>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                <KeyRound className="w-6 h-6 text-[#111827]" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-[#111827] tracking-tight">Recovery</h2>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{role === 'admin' ? 'Admin Access' : 'User Access'}</p>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-red-50 border-l-4 border-[#FF3B30] text-red-700 text-sm font-bold flex items-center gap-3 rounded-r-xl"
              >
                <ShieldAlert className="w-5 h-5 flex-shrink-0 text-[#FF3B30]" />
                <span>{error}</span>
              </motion.div>
            )}

            {message && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm font-bold flex items-center gap-3 rounded-r-xl"
              >
                <ShieldCheck className="w-5 h-5 flex-shrink-0 text-green-500" />
                <span>{message}</span>
              </motion.div>
            )}

            {step === 1 ? (
              <form onSubmit={handleRequestCode} className="space-y-6">
                <p className="text-sm font-medium text-gray-500 leading-relaxed mb-6">
                  Provide your registered email address below. We'll send you a recovery key to securely reset your password.
                </p>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                    Account Email
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#FF3B30] transition-colors" />
                    <input
                      type="email"
                      required
                      placeholder="user@garage.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white focus:bg-white focus:border-[#FF3B30] focus:ring-4 focus:ring-[#FF3B30]/10 outline-none transition-all font-bold text-[#111827] placeholder-gray-300"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-[#111827] text-white flex items-center justify-center gap-2 font-black uppercase tracking-widest text-sm hover:bg-[#FF3B30] transition-all duration-300 shadow-xl shadow-gray-200"
                >
                  {loading ? (
                    <span className="animate-pulse">Processing...</span>
                  ) : (
                    <>
                      <span>Request Key</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleReset} className="space-y-6">
                <p className="text-sm font-medium text-gray-500 leading-relaxed mb-6">
                  Enter the recovery code sent to your email (use <strong className="text-[#FF3B30] font-black">123456</strong> for this demo) and choose a new password.
                </p>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                    Recovery Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="123456"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full py-4 rounded-xl border border-gray-200 bg-white focus:bg-white focus:border-[#FF3B30] focus:ring-4 focus:ring-[#FF3B30]/10 outline-none transition-all font-mono font-bold tracking-[0.5em] text-center text-xl text-[#111827] placeholder-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                    New Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#FF3B30] transition-colors" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white focus:bg-white focus:border-[#FF3B30] focus:ring-4 focus:ring-[#FF3B30]/10 outline-none transition-all font-bold text-[#111827] placeholder-gray-300"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-[#111827] text-white flex items-center justify-center gap-2 font-black uppercase tracking-widest text-sm hover:bg-[#FF3B30] transition-all duration-300 shadow-xl shadow-gray-200"
                >
                  {loading ? (
                    <span className="animate-pulse">Updating...</span>
                  ) : (
                    <>
                      <span>Save Password</span>
                      <ShieldCheck className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
