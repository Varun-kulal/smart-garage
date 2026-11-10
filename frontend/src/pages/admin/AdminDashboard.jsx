import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Car,
  Wrench,
  ScanQrCode,
  IndianRupee,
  Package,
  TrendingUp,
  Activity,
  AlertCircle,
} from 'lucide-react';
import {
  Chart as ChartJS, Filler,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend, Filler
);

import { useAuth } from '../../context/AuthContext';
import SOSManagementPanel from '../../components/SOSManagementPanel';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Guard: ensure admin role
  if (!user || user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
        <h2 className="text-xl font-bold text-[#111827]">Access Denied</h2>
        <p className="text-sm text-slate-500 mt-2">You must be logged in as an administrator to view this page.</p>
      </div>
    );
  }

  // Greeting for admin
  const adminName = user?.name || 'Admin';

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/admin/dashboard');
      if (res.data.success) {
        setStats(res.data.data);
      } else {
        setError('Failed to load dashboard data: ' + res.data.message);
      }
    } catch (err) {
      console.error('Dashboard Stats Error:', err);
      setError(err.response?.data?.message || 'Could not retrieve administrative metrics.');
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

  // Fallback defaults if charts data is empty (although seeded)
  const cards = stats?.cards || {};
  const charts = stats?.charts || {};

  // 1. Line Chart Config: Revenue Trends
  const revenueChartData = {
    labels: charts.revenue?.map(r => r.month) || [],
    datasets: [
      {
        label: 'Monthly Revenue (₹)',
        data: charts.revenue?.map(r => r.revenue * 83) || [],
        borderColor: '#8b5cf6', // neon purple
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true,
        borderWidth: 3,
        pointBackgroundColor: '#06b6d4',
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#131826',
        titleColor: '#fff',
        bodyColor: '#cbd5e1',
        borderColor: '#232b42',
        borderWidth: 1,
      },
    },
    scales: {
      y: { grid: { color: 'rgba(35, 43, 66, 0.4)' }, ticks: { color: '#94a3b8' } },
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
    },
  };

  // 2. Doughnut Chart Config: Service Categories
  const serviceChartData = {
    labels: charts.serviceTrends?.map(s => s.category) || [],
    datasets: [
      {
        data: charts.serviceTrends?.map(s => s.count) || [],
        backgroundColor: [
          '#8b5cf6', // purple
          '#06b6d4', // cyan
          '#10b981', // emerald
          '#f59e0b', // amber
          '#f43f5e', // rose
          '#6366f1', // indigo
        ],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#cbd5e1', font: { size: 10 } },
      },
    },
    cutout: '65%',
  };



  return (
    <div className="bg-white p-6 rounded-3xl space-y-6">
      {/* Greeting Banner */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-100">
        <h1 className="text-3xl font-black text-[#111827]">Welcome, {adminName}</h1>
        <button onClick={() => navigate('/admin/inventory')} className="px-6 py-3 bg-[#111827] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#FF3B30] transition-colors shadow-md">
          Manage Inventory
        </button>
      </div>

      <div className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-[#FF3B30] text-red-700 text-sm font-bold rounded-xl shadow-sm">
            {error}
          </div>
        )}

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5">
          {/* Total Users */}
          <div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl flex flex-col justify-between h-[130px] shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start text-gray-500">
              <span className="text-[10px] font-black uppercase tracking-widest">Total Users</span>
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Users className="w-4 h-4 text-[#111827]" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-black text-[#111827]">{cards.totalUsers}</h3>
              <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">Active Accounts</p>
            </div>
          </div>

          {/* Total Vehicles */}
          <div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl flex flex-col justify-between h-[130px] shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start text-gray-500">
              <span className="text-[10px] font-black uppercase tracking-widest">Vehicles</span>
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Car className="w-4 h-4 text-[#111827]" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-black text-[#111827]">{cards.totalVehicles}</h3>
              <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">Monitored Fleet</p>
            </div>
          </div>

          {/* Total Service requests */}
          <div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl flex flex-col justify-between h-[130px] shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start text-gray-500">
              <span className="text-[10px] font-black uppercase tracking-widest">Booked Tasks</span>
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Wrench className="w-4 h-4 text-[#FF3B30]" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-black text-[#111827]">{cards.totalServiceRequests}</h3>
              <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">Active Bookings</p>
            </div>
          </div>


          {/* Revenue */}
          <div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl flex flex-col justify-between h-[130px] shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start text-gray-500">
              <span className="text-[10px] font-black uppercase tracking-widest">Revenue</span>
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <IndianRupee className="w-4 h-4 text-[#FF3B30]" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-[#111827]">₹{Math.round(cards.totalRevenue || 0).toLocaleString('en-IN')}</h3>
              <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">Completed Earnings</p>
            </div>
          </div>

          {/* Inventory count */}
          <div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl flex flex-col justify-between h-[130px] shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start text-gray-500">
              <span className="text-[10px] font-black uppercase tracking-widest">Parts Stock</span>
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Package className="w-4 h-4 text-[#111827]" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-black text-[#111827]">{cards.totalInventoryCount}</h3>
              <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">Warehouse Qty</p>
            </div>
          </div>
        </div>

        {/* Analytics Charts Grid */}
        

        {/* Second Row: Low Stock Warnings */}
        <div className="grid grid-cols-1 gap-6">

          {/* Low Stock Warning Panel */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100 text-[#FF3B30]">
                <div className="p-2 bg-[#FF3B30]/10 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-[#FF3B30]" />
                </div>
                <h3 className="font-black text-[#111827] text-lg">Warehouse Warnings</h3>
              </div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">Stock quantities below reorder levels</p>
              <div className="space-y-3.5">
                {stats?.inventory?.lowStockItems?.length > 0 ? (
                  stats.inventory.lowStockItems.map((item, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex justify-between items-center shadow-sm">
                      <div>
                        <h4 className="text-xs font-black text-[#111827]">{item.partName}</h4>
                        <p className="text-[10px] text-gray-400 font-mono font-bold mt-1">{item.partCode}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black text-red-700 bg-red-100 border border-red-200 px-2 py-1 rounded uppercase tracking-widest">{item.quantity} left</span>
                        <p className="text-[9px] text-gray-400 font-bold mt-1 uppercase tracking-widest">Reorder: {item.reorderLevel}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 font-bold">No low stock warnings.</p>
                )}
              </div>
            </div>
            <button onClick={() => navigate('/admin/inventory')} className="w-full mt-6 px-6 py-3.5 bg-[#111827] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#FF3B30] transition-colors shadow-md">
              Restock Inventory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
