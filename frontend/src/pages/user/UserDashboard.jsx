import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SOSModal from '../../components/SOSModal';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Car, 
  CalendarDays, 
  ScanQrCode, 
  ShoppingBag,
  ArrowRight,
  CheckCircle,
  Wrench,
  Zap,
  Shield,
  Clock,
  AlertTriangle,
  IndianRupee
} from 'lucide-react';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [vehRes, bookRes] = await Promise.all([
        axios.get('/vehicles/my'),
        axios.get('/services/bookings/my')
      ]);
      if (vehRes.data.success) setVehicles(vehRes.data.data);
      if (bookRes.data.success) setBookings(bookRes.data.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSOSClick = () => {
    setIsSOSModalOpen(true);
  };

  const activeBookings = bookings.filter(b => ['Pending', 'Approved', 'In Progress'].includes(b.status));

  const getReminders = () => {
    const reminders = [];
    if (vehicles.length === 0) {
      return [{ title: 'Register Your Vehicle', message: 'Add your vehicle to enable automated maintenance reminders.', type: 'Warning', action: 'Add Vehicle', link: '/user/services' }];
    }
    vehicles.forEach(vehicle => {
      if (vehicle.mileage > 10000 || !vehicle.lastServiceDate) {
        reminders.push({ title: `Oil Change Needed — ${vehicle.make} ${vehicle.model}`, message: `Mileage at ${vehicle.mileage.toLocaleString('en-IN')} km. Oil change is recommended.`, type: 'Warning', action: 'Book Now', link: '/user/services' });
      }
      if (vehicle.lastServiceDate) {
        const days = Math.floor((Date.now() - new Date(vehicle.lastServiceDate)) / 86400000);
        if (days > 90) reminders.push({ title: `Brake Inspection Due — ${vehicle.make} ${vehicle.model}`, message: `Last service was ${days} days ago. Ensure pads and rotors are in check.`, type: 'Reminder', action: 'Book Service', link: '/user/services' });
      }
    });
    if (reminders.length === 0) reminders.push({ title: 'All Systems Good!', message: 'Your registered vehicles are in healthy condition.', type: 'Safe' });
    return reminders;
  };

  const reminders = getReminders();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-10 pb-12 relative overflow-hidden"
    >
      {/* 1. TOP DASHBOARD INTRO HERO SECTION */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-2.5">
          <span className="inline-flex items-center gap-2 text-[10px] font-black text-white tracking-widest uppercase bg-brand-dark px-3 py-1.5 rounded shadow-sm">
            <Car className="w-3.5 h-3.5 text-brand-red" />
            Smart Garage Hub
          </span>
          
          <p className="text-slate-500 font-medium text-xs md:text-sm max-w-xl">
            Monitor vehicle health and schedule professional maintenance seamlessly.
          </p>
        </div>
        <div className="flex flex-wrap gap-3.5 w-full lg:w-auto">
          <button 
            onClick={handleSOSClick}
            className="flex-1 lg:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-[#FF3B30] border-2 border-[#FF3B30] text-white hover:bg-red-700 hover:border-red-700 transition-all duration-300 shadow-sm animate-pulse"
          >
            <AlertTriangle className="w-4 h-4" />
            Emergency SOS
          </button>
          <button 
            onClick={() => navigate('/user/shop')} 
            className="flex-1 lg:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-white border-2 border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white transition-all duration-300 shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            Shop Parts
          </button>
        </div>
      </motion.div>

      {/* 2. PREMIUM ANALYTICS OVERVIEW CARDS */}
      <motion.div variants={containerVariants} className="grid grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          { label: 'Registered Vehicles', value: vehicles.length, icon: Car, link: '/user/services', sub: 'Garage Fleet' },
          { label: 'Active Bookings', value: activeBookings.length, icon: CalendarDays, link: '/user/history', sub: 'In Progress' },
          { label: 'Total Services', value: bookings.length, icon: Wrench, link: '/user/history', sub: 'Job Cards' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.button 
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              key={i} 
              onClick={() => navigate(s.link)} 
              className="p-6 rounded-2xl bg-white border border-slate-200 text-left transition-all duration-300 hover:border-brand-red hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-brand-red/5 to-transparent rounded-bl-full -z-10 transition-transform group-hover:scale-150 duration-500"></div>
              <div className="flex justify-between items-start z-10 relative">
                <div>
                  <p className="text-4xl font-black text-brand-dark tracking-tighter">{s.value}</p>
                  <p className="text-[11px] text-slate-500 font-bold tracking-wider uppercase mt-2">{s.label}</p>
                </div>
                <div className="p-3 rounded-xl bg-brand-gray text-brand-dark transition-all duration-300 group-hover:bg-brand-red group-hover:text-white group-hover:-rotate-12">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-[10px] text-brand-red font-bold uppercase tracking-widest mt-5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <span>{s.sub}</span>
                <ArrowRight className="w-3 h-3" />
              </p>
            </motion.button>
          );
        })}
      </motion.div>

      {/* 3. QUICK ACTION & CORE MODULES */}
      <motion.div variants={itemVariants} className="space-y-5">
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Wrench className="w-4 h-4 text-brand-dark" />
          Core Platform Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: Car, title: 'Manage Vehicles', desc: 'Register your cars, check validation status, and update vehicle log details.', link: '/user/services' },
            { icon: CalendarDays, title: 'Book Garage Service', desc: 'Schedule appointment slots, choose mechanics, and monitor live tracking stages.', link: '/user/services' },
            { icon: ShoppingBag, title: 'Shop Genuine Parts', desc: 'Acquire original manufacturer components compatible with your registered fleet.', link: '/user/shop' },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.button 
                whileHover={{ y: -5 }}
                key={i} 
                onClick={() => navigate(f.link)} 
                className="p-6 rounded-2xl bg-brand-dark border-2 border-brand-dark text-left flex flex-col justify-between min-h-[180px] transition-all duration-300 group cursor-pointer hover:border-brand-red hover:shadow-[0_10px_40px_rgba(255,59,48,0.15)] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-brand-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="space-y-4 w-full relative z-10">
                  <div className="flex justify-between items-center">
                    <div className="p-3 rounded-xl bg-white/10 text-white group-hover:bg-brand-red group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-wide uppercase">{f.title}</h3>
                    <p className="text-[11px] text-slate-400 mt-2 leading-relaxed font-medium group-hover:text-slate-300 transition-colors">{f.desc}</p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* 4. ACTIVITY & LIVE STATUS PANEL */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 gap-6">
        
        {/* Maintenance Reminders & My Vehicles */}
        <div className="space-y-6">
          
          {/* Alerts */}
          <motion.div variants={itemVariants} className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-red" />
              Active System Warnings & Alerts
            </h2>
            <div className="space-y-3">
              {reminders.map((r, i) => (
                <div 
                  key={i} 
                  className={`p-4 rounded-xl border-l-4 flex items-center justify-between gap-4 transition-all shadow-sm bg-white ${
                    r.type === 'Warning' 
                      ? 'border-l-brand-red border-y-slate-100 border-r-slate-100 hover:bg-slate-50' 
                      : r.type === 'Safe' 
                      ? 'border-l-brand-dark border-y-slate-100 border-r-slate-100 hover:bg-slate-50' 
                      : 'border-l-brand-dark border-y-slate-100 border-r-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-lg ${
                      r.type === 'Warning' 
                        ? 'bg-red-50 text-brand-red' 
                        : 'bg-slate-100 text-brand-dark'
                    }`}>
                      {r.type === 'Safe' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-brand-dark tracking-wide">{r.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 font-medium">{r.message}</p>
                    </div>
                  </div>
                  {r.link && (
                    <button 
                      onClick={() => navigate(r.link)} 
                      className="text-[10px] font-black uppercase tracking-wider text-brand-red bg-white border border-slate-200 px-4 py-2.5 rounded-lg hover:text-white hover:bg-brand-red hover:border-brand-red transition-all cursor-pointer shadow-sm"
                    >
                      {r.action}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Registered Garage Preview */}
          <motion.div variants={itemVariants} className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Car className="w-4 h-4 text-brand-dark" />
                Active Garage Inventory
              </h2>
              <button 
                onClick={() => navigate('/user/services')} 
                className="text-[10px] font-black uppercase tracking-wider text-brand-red hover:text-red-700 transition-colors cursor-pointer"
              >
                + Register Vehicle
              </button>
            </div>

            {vehicles.length === 0 ? (
              <div className="text-center py-10 bg-brand-gray rounded-xl border border-slate-200 border-dashed p-6">
                <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-bold text-brand-dark">No vehicles cataloged yet.</p>
                <p className="text-[11px] text-slate-500 mt-1 mb-5 font-medium">Add your personal or fleet vehicles to enable automation logs.</p>
                <button 
                  onClick={() => navigate('/user/services')} 
                  className="btn-primary text-[10px] font-black uppercase tracking-wider py-2.5 px-6 rounded-lg"
                >
                  Register First Vehicle
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vehicles.slice(0, 4).map((v) => (
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    key={v._id} 
                    className="p-5 rounded-xl bg-white border border-slate-200 flex justify-between items-center hover:border-brand-dark hover:shadow-md transition-all group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-brand-dark tracking-wide">{v.make} {v.model}</h4>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${
                          v.status === 'Approved' ? 'bg-slate-100 text-brand-dark border-slate-200' :
                          v.status === 'Rejected' ? 'bg-red-50 text-brand-red border-red-200' :
                          'bg-amber-50 text-amber-600 border-amber-200'
                        }`}>
                          {v.status || 'Pending'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono mt-1 font-semibold">{v.year} · {v.licensePlate}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-[10px] font-bold text-brand-dark bg-slate-100 px-2.5 py-1 rounded-md">
                          {v.mileage.toLocaleString('en-IN')} km
                        </span>
                        {v.lastServiceDate && (
                          <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-brand-red" />
                            {new Date(v.lastServiceDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate('/user/services')} 
                      className="p-3 rounded-xl bg-brand-gray border border-slate-200 text-brand-dark hover:text-white hover:bg-brand-red hover:border-brand-red transition-all cursor-pointer shadow-sm group-hover:scale-110"
                      title="Schedule Service"
                    >
                      <CalendarDays className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      <SOSModal 
        isOpen={isSOSModalOpen} 
        onClose={() => setIsSOSModalOpen(false)} 
        defaultVehicleId={vehicles.length > 0 ? vehicles[0]._id : null}
      />
    </motion.div>
  );
};

export default UserDashboard;
