import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, Clock, MapPin, Phone, User, CheckCircle2, Truck } from 'lucide-react';
import { io } from 'socket.io-client';

const SOSManagementPanel = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();

    const socket = io('http://localhost:5001');
    
    // Listen for new alerts to append
    socket.on('new_sos_alert', (newAlert) => {
      setAlerts(prev => [newAlert, ...prev]);
    });

    // Listen for status changes to update or remove
    socket.on('sos_status_changed', (updatedAlert) => {
      setAlerts(prev => {
        if (updatedAlert.status === 'Resolved') {
          return prev.filter(a => a._id !== updatedAlert._id);
        }
        const exists = prev.find(a => a._id === updatedAlert._id);
        if (exists) {
          return prev.map(a => a._id === updatedAlert._id ? updatedAlert : a);
        }
        return [updatedAlert, ...prev];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/sos');
      if (res.data.success) {
        setAlerts(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch SOS alerts', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await axios.put(`/sos/${id}/status`, { status: newStatus });
      if (res.data.success) {
        if (newStatus === 'Resolved') {
          setAlerts(prev => prev.filter(a => a._id !== id));
        } else {
          setAlerts(prev => prev.map(a => a._id === id ? res.data.data : a));
        }
      }
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Error updating status');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex justify-center items-center h-32 mb-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-xl font-black text-slate-800 mb-2">No Active Emergencies</h3>
        <p className="text-sm text-slate-500 font-medium max-w-md">
          All SOS requests have been resolved or dispatched. New alerts will automatically appear here in real-time.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6 bg-red-50 rounded-2xl shadow-sm border border-red-200 overflow-hidden">
      <div className="bg-red-600 px-6 py-4 flex items-center gap-3">
        <AlertTriangle className="w-6 h-6 text-white animate-pulse" />
        <h2 className="text-lg font-black text-white uppercase tracking-widest">Active Emergencies ({alerts.length})</h2>
      </div>
      
      <div className="p-4 space-y-4">
        {alerts.map(alert => (
          <div key={alert._id} className="bg-white rounded-xl shadow-sm border border-red-100 p-5 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            
            {/* Details */}
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-[10px] font-black tracking-widest uppercase rounded bg-red-100 text-red-700`}>
                  {alert.status}
                </span>
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(alert.createdAt).toLocaleString()}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Exact Location / Landmark</p>
                    <p className="text-sm font-bold text-slate-800">
                      {alert.location?.exactLocation || alert.location?.address}
                    </p>
                    {(alert.location?.lat && alert.location?.lng) ? (
                      <p className="text-[11px] font-mono font-medium text-slate-500 mt-0.5">
                        GPS: {alert.location.lat.toFixed(6)}, {alert.location.lng.toFixed(6)}
                      </p>
                    ) : null}
                    <a 
                      href={
                        (alert.location?.lat && alert.location?.lng) 
                          ? `https://www.google.com/maps?q=${alert.location.lat},${alert.location.lng}`
                          : `https://www.google.com/maps?q=${encodeURIComponent(alert.location?.exactLocation || alert.location?.address || '')}`
                      }
                      target="_blank" 
                      rel="noreferrer"
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 mt-1"
                    >
                      View Exact Map Location
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Customer</p>
                    <p className="text-sm font-bold text-slate-800">{alert.user?.name}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3" /> {alert.user?.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Truck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Assigned Garage</p>
                    <p className="text-sm font-bold text-slate-800">{alert.garage ? alert.garage.name : 'Pending Assignment'}</p>
                    {alert.garage && alert.garage.location && (
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {alert.garage.location.split(',').pop().trim()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {alert.notes && (
                <div className="mt-3 p-3 bg-slate-50 rounded-lg text-sm text-slate-600 italic border border-slate-100">
                  "{alert.notes}"
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex md:flex-col gap-3 w-full md:w-auto shrink-0">
              {alert.status === 'Pending' && (
                <button 
                  onClick={() => updateStatus(alert._id, 'Dispatched')}
                  className="flex-1 md:flex-none px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Truck className="w-4 h-4" /> Dispatch Tow
                </button>
              )}
              
              <button 
                onClick={() => updateStatus(alert._id, 'Resolved')}
                className="flex-1 md:flex-none px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Resolve
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default SOSManagementPanel;
