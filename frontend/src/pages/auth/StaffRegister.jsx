import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Wrench, ShieldAlert, Mail, Lock, User, Phone, ArrowRight, ArrowLeft } from 'lucide-react';

const StaffRegister = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Input Validations
    if (!name || name.trim().length < 2) {
      setError('Name must be at least 2 characters long.');
      return;
    }
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!phone || !/^\d{10}$/.test(phone.trim())) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await register(name, email, password, phone, 'staff');
      if (res.success) {
        navigate('/staff/dashboard');
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Registration failed. Please check input parameters.');
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
          <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] rounded-full border-[1px] border-[#f59e0b] opacity-30"></div>
          <div className="absolute top-[20%] left-[10%] w-[600px] h-[600px] rounded-full border-[1px] border-[#f59e0b] opacity-20"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-tl from-[#f59e0b] to-transparent rounded-full blur-[100px] opacity-20"></div>
        </div>

        <div className="relative z-10">
          <Link to="/staff/login" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors mb-12">
            <ArrowLeft className="w-4 h-4" /> Back to Staff Login
          </Link>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-lg">
              <Wrench className="w-6 h-6 text-[#f59e0b]" />
            </div>
            <div>
              <h1 className="font-black text-2xl tracking-tighter text-white uppercase">SMART<span className="text-[#f59e0b]">GARAGE</span></h1>
            </div>
          </div>
          <h2 className="text-5xl font-black text-white leading-tight mt-10">
            Join the<br />
            <span className="text-[#f59e0b]">Mechanic</span><br />
            Team.
          </h2>
          <p className="text-gray-400 mt-6 text-lg max-w-md leading-relaxed font-medium">
            Register for your staff account to view assignments and update service workflows.
          </p>
        </div>
      </div>

      {/* Right side: Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto max-h-screen py-16">
        <div className="w-full max-w-md">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="lg:hidden flex justify-between items-center mb-10">
              <Link to="/staff/login" className="p-2 rounded-full bg-gray-100 text-gray-500 hover:text-[#111827]">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#111827] flex items-center justify-center shadow-lg">
                  <Wrench className="w-4 h-4 text-white" />
                </div>
                <h1 className="font-black text-xl tracking-tighter text-[#111827] uppercase">SMART<span className="text-[#f59e0b]">GARAGE</span></h1>
              </div>
            </div>

            <h2 className="text-3xl font-black text-[#111827] mb-2 tracking-tight">Staff Registration</h2>
            <p className="text-gray-500 font-medium mb-8">Fill in your details to create your staff account.</p>

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

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#f59e0b] transition-colors" />
                  <input
                    type="text"
                    required
                    placeholder="Alex Mercer"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white focus:bg-white focus:border-[#f59e0b] focus:ring-4 focus:ring-[#f59e0b]/10 outline-none transition-all font-bold text-[#111827] placeholder-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#f59e0b] transition-colors" />
                  <input
                    type="email"
                    required
                    placeholder="staff@garage.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white focus:bg-white focus:border-[#f59e0b] focus:ring-4 focus:ring-[#f59e0b]/10 outline-none transition-all font-bold text-[#111827] placeholder-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                  Phone Number
                </label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#f59e0b] transition-colors" />
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white focus:bg-white focus:border-[#f59e0b] focus:ring-4 focus:ring-[#f59e0b]/10 outline-none transition-all font-bold text-[#111827] placeholder-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                  Choose Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#f59e0b] transition-colors" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white focus:bg-white focus:border-[#f59e0b] focus:ring-4 focus:ring-[#f59e0b]/10 outline-none transition-all font-bold text-[#111827] placeholder-gray-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-[#111827] text-white flex items-center justify-center gap-2 font-black uppercase tracking-widest text-sm hover:bg-[#f59e0b] transition-all duration-300 shadow-xl shadow-gray-200 mt-8"
              >
                {loading ? (
                  <span className="animate-pulse">Provisioning Staff Account...</span>
                ) : (
                  <>
                    <span>Create Staff Account</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm font-medium text-gray-500">
                Already have an account?{' '}
                <Link to="/staff/login" className="text-[#f59e0b] font-black hover:underline uppercase tracking-wider text-xs ml-1">
                  Staff Sign In
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StaffRegister;
