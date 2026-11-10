import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  ScanQrCode, 
  PackageCheck, 
  FileCheck2, 
  BellRing, 
  LogOut, 
  Menu, 
  X,
  ShieldCheck,
  User,
  Wrench,
  Building2,
  ShieldAlert
} from 'lucide-react';

const StaffLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/staff/dashboard', icon: LayoutDashboard },
    { name: 'Emergencies', path: '/staff/emergencies', icon: ShieldAlert },
    { name: 'Service Requests', path: '/staff/services', icon: FileCheck2 },
    { name: 'Fleet Monitor', path: '/staff/vehicles', icon: Car },
    { name: 'Customers', path: '/staff/customers', icon: Users },
    { name: 'Announcements', path: '/staff/notifications', icon: BellRing },
  ];

  const getPageTitle = () => {
    const active = menuItems.find(item => location.pathname.startsWith(item.path));
    return active ? active.name : 'Terminal';
  };

  return (
    <div className="min-h-screen flex bg-[#F9FAFB] text-[#111827] font-sans">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-[#111827]/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Premium Dark Sidebar Drawer */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0B0F19] border-r border-[#1F2937] transform transition-transform duration-300 ease-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl lg:shadow-none`}>
        <div className="h-full flex flex-col justify-between p-6">
          <div>
            {/* Brand Identity */}
            <div className="flex items-center gap-4 px-2 py-4 mb-8 border-b border-[#1F2937]/50">
              <div className="w-10 h-10 rounded-xl bg-[#111827] border border-[#1F2937] flex items-center justify-center shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#FF3B30]/20 to-transparent"></div>
                <Wrench className="w-5 h-5 text-[#FF3B30] relative z-10" />
              </div>
              <div>
                <h1 className="font-black text-lg tracking-tighter text-white uppercase">SMART<span className="text-[#FF3B30]">GARAGE</span></h1>
                <p className="text-[9px] text-[#FF3B30] font-bold tracking-[0.2em] uppercase mt-0.5">Staff Portal</p>
              </div>
            </div>

            {/* Menu Links */}
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 relative group ${
                      isActive 
                        ? 'text-white bg-[#1F2937]' 
                        : 'text-gray-400 hover:text-white hover:bg-[#111827]'
                    }`}
                  >
                    {isActive && (
                      <motion.div layoutId="activeTab" className="absolute left-0 w-1.5 h-6 bg-[#FF3B30] rounded-r-full" />
                    )}
                    <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-[#FF3B30]' : 'text-gray-500 group-hover:text-gray-300'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Admin Profile & Exit */}
          <div className="pt-6 border-t border-[#1F2937]/50 mt-8">
            <div className="flex items-center gap-3 px-3 py-3 mb-4 bg-[#111827] rounded-2xl border border-[#1F2937]">
              <div className="w-10 h-10 rounded-xl bg-[#0B0F19] border border-[#1F2937] flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-gray-400" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-black text-white truncate uppercase tracking-wider">{user?.name || 'Staff Member'}</p>
                <p className="text-[10px] text-gray-500 font-bold tracking-widest mt-0.5">
                  {user?.role === 'admin' ? 'Administrator' : (user?.assignedGarage?.name || 'Garage Staff')}
                </p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center gap-3 w-full px-4 py-3.5 rounded-xl text-xs font-black text-gray-400 uppercase tracking-widest hover:bg-[#FF3B30]/10 hover:text-[#FF3B30] transition-all duration-300 group"
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200 px-6 sm:px-10 py-5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl bg-gray-50 text-[#111827] hover:bg-gray-100 border border-gray-200"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-black tracking-tight text-[#111827]">{getPageTitle()}</h2>
          </div>

          {/* User Widget */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-full bg-green-50 border border-green-200 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-green-700">Systems Online</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#111827] text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 sm:p-10 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
