import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Shield, ShieldAlert, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Input Validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await loginAdmin(email, password);

      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
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
          <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full border-[1px] border-[#8b5cf6] opacity-30"></div>
          <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] rounded-full border-[1px] border-[#8b5cf6] opacity-20"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-[#8b5cf6] to-transparent rounded-full blur-[100px] opacity-20"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-[#8b5cf6]" />
            </div>
            <div>
              <h1 className="font-black text-2xl tracking-tighter text-white uppercase">SMART<span className="text-[#8b5cf6]">GARAGE</span></h1>
            </div>
          </div>
          <h2 className="text-5xl font-black text-white leading-tight mt-10">
            Admin<br />
            <span className="text-[#8b5cf6]">Command</span><br />
            Center.
          </h2>
          <p className="text-gray-400 mt-6 text-lg max-w-md leading-relaxed font-medium">
            Secure administrative access to manage operations, users, and oversee the complete ecosystem.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-sm font-bold text-gray-500 uppercase tracking-widest">
          <span>Admin Portal</span>
          <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
          <span>Enterprise Grade</span>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
              <div className="w-12 h-12 rounded-xl bg-[#111827] flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-black text-2xl tracking-tighter text-[#111827] uppercase">SMART<span className="text-[#8b5cf6]">GARAGE</span></h1>
              </div>
            </div>

            <h2 className="text-3xl font-black text-[#111827] mb-2 tracking-tight">Admin Portal</h2>
            <p className="text-gray-500 font-medium mb-8">Enter your credentials to access the command center.</p>

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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                  Admin Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#8b5cf6] transition-colors" />
                  <input
                    type="email"
                    required
                    placeholder="admin@garage.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white focus:bg-white focus:border-[#8b5cf6] focus:ring-4 focus:ring-[#8b5cf6]/10 outline-none transition-all font-bold text-[#111827] placeholder-gray-300"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                    Password
                  </label>
                  <Link
                    to="/auth/forgot-password?role=admin"
                    className="text-xs font-bold text-[#8b5cf6] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#8b5cf6] transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 rounded-xl border border-gray-200 bg-white focus:bg-white focus:border-[#8b5cf6] focus:ring-4 focus:ring-[#8b5cf6]/10 outline-none transition-all font-bold text-[#111827] placeholder-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8b5cf6] transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-[#111827] text-white flex items-center justify-center gap-2 font-black uppercase tracking-widest text-sm hover:bg-[#8b5cf6] transition-all duration-300 shadow-xl shadow-gray-200"
              >
                {loading ? (
                  <span className="animate-pulse">Verifying Identity...</span>
                ) : (
                  <>
                    <span>Access Command Center</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-10 text-center">
              <p className="text-sm font-medium text-gray-500">
                Are you a customer?{' '}
                <Link to="/auth/login" className="text-[#8b5cf6] font-black hover:underline uppercase tracking-wider text-xs ml-1">
                  Customer Login
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
