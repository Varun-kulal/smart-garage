import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, 
  ScanQrCode, 
  History, 
  User, 
  LogOut, 
  Bell, 
  Menu, 
  X,
  Wrench,
  ShoppingBag,
  Info,
  LayoutDashboard,
  Building2
} from 'lucide-react';

const UserLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Global Garage Selection
  const [garages, setGarages] = useState([]);
  const [globalGarageId, setGlobalGarageId] = useState(localStorage.getItem('globalGarageId') || '');

  useEffect(() => {
    fetchNotifications();
    fetchGarages();
    const interval = setInterval(fetchNotifications, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const fetchGarages = async () => {
    try {
      const res = await axios.get('/garages');
      if (res.data.success) {
        setGarages(res.data.data);
        if (!localStorage.getItem('globalGarageId') && res.data.data.length > 0) {
          handleGarageChange(res.data.data[0]._id);
        }
      }
    } catch (err) {
      console.error('Error fetching garages:', err);
    }
  };

  const handleGarageChange = (id) => {
    setGlobalGarageId(id);
    localStorage.setItem('globalGarageId', id);
    window.dispatchEvent(new Event('globalGarageChanged'));
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const markAsRead = async (id) => {
    try {
      const res = await axios.put(`/notifications/${id}/read`);
      if (res.data.success) {
        setNotifications(prev => 
          prev.map(n => n._id === id ? { ...n, isRead: true } : n)
        );
      }
    } catch (err) {
      console.error('Error reading notification:', err);
    }
  };

  const deleteNotification = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await axios.delete(`/notifications/${id}`);
      if (res.data.success) {
        setNotifications(prev => prev.filter(n => n._id !== id));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const menuItems = [
    { name: 'Dashboard', path: '/user/dashboard', icon: LayoutDashboard },
    { name: 'Services', path: '/user/services', icon: Wrench },
    { name: 'Shop Parts', path: '/user/shop', icon: ShoppingBag },
    { name: 'History', path: '/user/history', icon: History },
    { name: 'Partner', path: '/user/partner', icon: Building2 },
    { name: 'About Us', path: '/about', icon: Info },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] flex flex-col font-sans">
      {/* Sticky Premium Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm transition-all duration-300">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <div className="flex items-center gap-3">
              <Link to="/user/dashboard" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-[#111827] flex items-center justify-center transform group-hover:scale-105 transition-all duration-300 shadow-md">
                  <Wrench className="w-5 h-5 text-white group-hover:text-[#FF3B30] transition-colors" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="font-black text-xl tracking-tighter text-[#111827] uppercase">SMART<span className="text-[#FF3B30]">GARAGE</span></h1>
                  <p className="text-[9px] text-gray-500 font-bold tracking-[0.2em] uppercase mt-0.5">Automotive Intelligence</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-1 items-center bg-gray-50/50 p-1 rounded-full border border-gray-100">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path || (item.path !== '/user/dashboard' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider relative transition-all duration-300 flex items-center gap-2 ${
                      isActive 
                        ? 'text-white bg-[#111827] shadow-md' 
                        : 'text-gray-500 hover:text-[#111827] hover:bg-white'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${isActive ? 'text-[#FF3B30]' : 'text-gray-400'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Utilities */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#111827] hover:border-gray-300 transition-all duration-300 shadow-sm"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-[#FF3B30] border-2 border-white"></span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <span className="font-black text-xs uppercase tracking-widest text-[#111827]">Alerts ({unreadCount})</span>
                        <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-[#111827] transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center">
                            <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">All caught up</p>
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div 
                              key={n._id} 
                              onClick={() => markAsRead(n._id)}
                              className={`p-4 border-b border-gray-50 flex gap-3 cursor-pointer transition-colors ${!n.isRead ? 'bg-[#FF3B30]/5' : 'hover:bg-gray-50'}`}
                            >
                              <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${!n.isRead ? 'bg-[#FF3B30]' : 'bg-gray-300'}`}></div>
                              <div className="flex-1">
                                <h4 className="text-sm font-bold text-[#111827]">{n.title}</h4>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{n.message}</p>
                                <span className="text-[10px] font-bold text-gray-400 mt-2 block tracking-wider uppercase">{new Date(n.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Menu */}
              <div className="relative">
                <button 
                  onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-sm"
                >
                  <div className="w-7 h-7 rounded-full bg-[#111827] flex items-center justify-center overflow-hidden">
                    {user?.profileImage ? (
                      <img src={`http://localhost:5001${user.profileImage}`} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-xs font-bold text-[#111827] hidden sm:block tracking-wide">{user?.name?.split(' ')[0] || 'Profile'}</span>
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-2xl z-50 p-2"
                    >
                      <div className="px-4 py-3 border-b border-gray-100 mb-2">
                        <p className="text-sm font-black text-[#111827] truncate">{user?.name || 'Customer'}</p>
                        <p className="text-[10px] font-bold text-gray-500 truncate mt-0.5 tracking-wider uppercase">{user?.email}</p>
                      </div>
                      <button 
                        onClick={() => { navigate('/user/profile'); setShowProfileMenu(false); }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-[#111827] transition-all"
                      >
                        <User className="w-4 h-4 text-gray-400" />
                        My Profile
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-xs font-bold text-[#FF3B30] hover:bg-[#FF3B30]/10 transition-all mt-1"
                      >
                        <LogOut className="w-4 h-4 text-[#FF3B30]" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#111827] shadow-sm"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl overflow-hidden"
            >
              <div className="px-4 py-4 space-y-2">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path || (item.path !== '/user/dashboard' && location.pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all duration-300 ${
                        isActive 
                          ? 'bg-[#111827] text-white' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-[#FF3B30]' : 'text-gray-400'}`} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {children}
      </main>

      {/* Premium Footer */}
      <footer className="border-t border-gray-200 bg-white py-10 mt-auto">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 opacity-50">
            <Wrench className="w-4 h-4 text-[#111827]" />
            <span className="text-xs font-black tracking-widest uppercase text-[#111827]">SMART<span className="text-[#FF3B30]">GARAGE</span></span>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center md:text-right">
            © {new Date().getFullYear()} Smart Garage Technology Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;
