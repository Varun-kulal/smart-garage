import React, { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';

const SOSAlertBanner = () => {
  const [alerts, setAlerts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'staff' && user.role !== 'mechanic')) return;

    // Connect to WebSocket using the backend URL (assuming it's on localhost:5001)
    const socket = io('http://localhost:5001');

    socket.on('new_sos_alert', (newAlert) => {
      // Filter if staff is assigned to a specific garage
      if (user.role !== 'admin' && user.assignedGarage && newAlert.garage && newAlert.garage._id !== user.assignedGarage) {
        return;
      }
      setAlerts(prev => [...prev, newAlert]);
      
      // Play a sound to alert staff
      try {
        const audio = new Audio('/alarm.mp3'); // Assuming an alarm.mp3 exists in public folder
        audio.play().catch(e => console.log('Audio autoplay blocked'));
      } catch(e) {}
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const dismissAlert = (id) => {
    setAlerts(prev => prev.filter(a => a._id !== id));
  };

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pt-4 space-y-2 pointer-events-none">
      {alerts.map(alert => (
        <div key={alert._id} className="pointer-events-auto w-full max-w-4xl bg-red-600 text-white rounded-lg shadow-2xl flex items-center justify-between p-4 animate-bounce">
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-full p-2">
              <AlertTriangle className="w-6 h-6 text-red-600 animate-pulse" />
            </div>
            <div>
              <h3 className="font-black text-lg uppercase tracking-wider">Emergency Breakdown SOS!</h3>
              <p className="text-sm font-medium">
                {alert.user?.name} ({alert.user?.phone}) needs immediate assistance at <strong>{alert.location?.address}</strong>
              </p>
            </div>
          </div>
          <button 
            onClick={() => dismissAlert(alert._id)}
            className="p-2 hover:bg-red-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default SOSAlertBanner;
