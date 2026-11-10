import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Shield, ShieldAlert, Mail, Lock, ArrowRight } from 'lucide-react';

const StaffLogin = () => {
  const { loginStaff } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const res = await loginStaff(email, password);

      if (res.success) {
        navigate('/staff/dashboard');
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
          <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full border-[1px] border-[#f59e0b] opacity-30"></div>
          <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] rounded-full border-[1px] border-[#f59e0b] opacity-20"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-[#f59e0b] to-transparent rounded-full blur-[100px] opacity-20"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-[#f59e0b]" />
            </div>
            <div>
              <h1 className="font-black text-2xl tracking-tighter text-white uppercase">SMART<span className="text-[#f59e0b]">GARAGE</span></h1>
            </div>
          </div>
          <h2 className="text-5xl font-black text-white leading-tight mt-10">
            Garage Manager<br />
            <span className="text-[#f59e0b]">Workspace</span><br />
            Portal.
          </h2>
          <p className="text-gray-400 mt-6 text-lg max-w-md leading-relaxed font-medium">
            Secure manager access to view your garage tasks, update service statuses, and oversee workflow.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-sm font-bold text-gray-500 uppercase tracking-widest">
          <span>Garage Manager Portal</span>
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
                <h1 className="font-black text-2xl tracking-tighter text-[#111827] uppercase">SMART<span className="text-[#f59e0b]">GARAGE</span></h1>
              </div>
            </div>

            <h2 className="text-3xl font-black text-[#111827] mb-2 tracking-tight">Staff Login</h2>
            <p className="text-gray-500 font-medium mb-8">Enter your credentials to access your workspace.</p>

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
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#f59e0b] transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="staff@garage.com"
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white focus:bg-white focus:border-[#f59e0b] focus:ring-4 focus:ring-[#f59e0b]/10 outline-none transition-all font-bold text-[#111827]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#f59e0b] transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white focus:bg-white focus:border-[#f59e0b] focus:ring-4 focus:ring-[#f59e0b]/10 outline-none transition-all font-bold text-[#111827]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#f59e0b] focus:ring-[#f59e0b]" />
                  <span className="text-sm font-medium text-gray-600 group-hover:text-[#111827] transition-colors">Remember me</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-[#111827] text-white flex items-center justify-center gap-2 font-black uppercase tracking-widest text-sm hover:bg-[#f59e0b] transition-all duration-300 shadow-xl shadow-gray-200"
              >
                {loading ? (
                  <span className="animate-pulse">Authenticating...</span>
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-sm font-medium text-gray-500">
                Don't have a staff account?{' '}
                <Link to="/staff/register" className="text-[#f59e0b] font-black hover:underline uppercase tracking-wider text-xs ml-1">
                  Apply Now
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;
