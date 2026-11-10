import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import SOSManagementPanel from '../../components/SOSManagementPanel';
import { 
  FileCheck2, 
  Clock, 
  Wrench, 
  CheckCircle2, 
  AlertCircle,
  Banknote,
  Users,
  XCircle,
  Car,
  CalendarDays
} from 'lucide-react';
import { motion } from 'framer-motion';

const StaffDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const res = await axios.get('/staff/dashboard');
      if (res.data.success) {
        setStats(res.data.data);
      } else {
        setError('Failed to fetch dashboard stats');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#111827]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl space-y-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between pb-6 border-b border-gray-100">
          <h1 className="text-3xl font-black text-[#111827]">{stats?.garageName ? `${stats.garageName} Management` : `Welcome, ${user?.name || 'Mechanic'}`}</h1>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-[#FF3B30] text-red-700 text-sm font-bold rounded-xl shadow-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Revenue */}
          <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl flex flex-col justify-between h-[130px] shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start text-emerald-600">
              <span className="text-[10px] font-black uppercase tracking-widest">Revenue</span>
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Banknote className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-black text-emerald-600">₹{stats?.totalRevenue?.toFixed(2) || '0.00'}</h3>
              <p className="text-[10px] text-emerald-500 font-bold mt-1 uppercase tracking-widest">Garage Earnings</p>
            </div>
          </div>

          {/* Customers */}
          <div className="bg-purple-50 border border-purple-200 p-5 rounded-2xl flex flex-col justify-between h-[130px] shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start text-purple-600">
              <span className="text-[10px] font-black uppercase tracking-widest">Customers</span>
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Users className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-black text-purple-600">{stats?.totalCustomers || 0}</h3>
              <p className="text-[10px] text-purple-500 font-bold mt-1 uppercase tracking-widest">Total Clients</p>
            </div>
          </div>

          {/* Today's Appointments */}
          <div className="bg-indigo-50 border border-indigo-200 p-5 rounded-2xl flex flex-col justify-between h-[130px] shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start text-indigo-600">
              <span className="text-[10px] font-black uppercase tracking-widest">Appointments</span>
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <CalendarDays className="w-4 h-4 text-indigo-600" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-black text-indigo-600">{stats?.todaysAppointments || 0}</h3>
              <p className="text-[10px] text-indigo-500 font-bold mt-1 uppercase tracking-widest">Today</p>
            </div>
          </div>

          {/* Total Bookings */}
          <div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl flex flex-col justify-between h-[130px] shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start text-gray-500">
              <span className="text-[10px] font-black uppercase tracking-widest">Total Bookings</span>
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <FileCheck2 className="w-4 h-4 text-[#111827]" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-black text-[#111827]">{stats?.totalAssigned || 0}</h3>
              <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">All Time</p>
            </div>
          </div>
          
          {/* Vehicles in Service */}
          <div className="bg-sky-50 border border-sky-200 p-5 rounded-2xl flex flex-col justify-between h-[130px] shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start text-sky-600">
              <span className="text-[10px] font-black uppercase tracking-widest">In Garage</span>
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Car className="w-4 h-4 text-sky-600" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-black text-sky-600">{stats?.vehiclesInService || 0}</h3>
              <p className="text-[10px] text-sky-500 font-bold mt-1 uppercase tracking-widest">Vehicles in Service</p>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex flex-col justify-between h-[130px] shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start text-amber-600">
              <span className="text-[10px] font-black uppercase tracking-widest">Pending</span>
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-black text-amber-600">{stats?.pending || 0}</h3>
              <p className="text-[10px] text-amber-500 font-bold mt-1 uppercase tracking-widest">Awaiting Action</p>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-green-50 border border-green-200 p-5 rounded-2xl flex flex-col justify-between h-[130px] shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start text-green-600">
              <span className="text-[10px] font-black uppercase tracking-widest">Completed</span>
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-black text-green-600">{stats?.completed || 0}</h3>
              <p className="text-[10px] text-green-500 font-bold mt-1 uppercase tracking-widest">Finished Jobs</p>
            </div>
          </div>

          {/* Cancelled */}
          <div className="bg-red-50 border border-red-200 p-5 rounded-2xl flex flex-col justify-between h-[130px] shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start text-red-600">
              <span className="text-[10px] font-black uppercase tracking-widest">Cancelled</span>
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <XCircle className="w-4 h-4 text-red-600" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-black text-red-600">{stats?.cancelled || 0}</h3>
              <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-widest">Failed Bookings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Section */}
      <div className="bg-white p-6 rounded-3xl space-y-6 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-black text-[#111827]">Recent Customer Bookings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] uppercase tracking-widest font-black text-gray-400">
                <th className="pb-4">Customer</th>
                <th className="pb-4">Vehicle</th>
                <th className="pb-4">Booking Date</th>
                <th className="pb-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentBookings && stats.recentBookings.length > 0 ? (
                stats.recentBookings.map(booking => (
                  <tr key={booking._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="py-4">
                      <div className="font-bold text-sm text-[#111827]">{booking.user?.name}</div>
                      <div className="text-xs text-gray-500 font-medium">{booking.user?.phone}</div>
                    </td>
                    <td className="py-4">
                      <div className="font-bold text-sm text-[#111827]">{booking.vehicle?.make} {booking.vehicle?.model}</div>
                      <div className="text-xs text-gray-500 font-medium">{booking.vehicle?.licensePlate}</div>
                    </td>
                    <td className="py-4 font-medium text-sm text-gray-600">
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <span className="text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest border border-gray-200 text-gray-600">
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500 text-sm font-medium">No recent bookings.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
