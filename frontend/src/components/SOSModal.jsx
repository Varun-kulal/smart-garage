import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, MapPin, Search, AlertTriangle, Building2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SOSModal = ({ isOpen, onClose, defaultVehicleId }) => {
  const [locationText, setLocationText] = useState('');
  const [locatingTarget, setLocatingTarget] = useState(null);
  const [garages, setGarages] = useState([]);
  const [filteredGarages, setFilteredGarages] = useState([]);
  const [selectedGarage, setSelectedGarage] = useState(null);
  const [exactLocation, setExactLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

  useEffect(() => {
    if (isOpen) {
      fetchGarages();
      // Reset state on open
      setLocationText('');
      setSelectedGarage(null);
      setNotes('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!locationText.trim()) {
      setFilteredGarages(garages);
      return;
    }
    const term = locationText.toLowerCase();
    const filtered = garages.filter(g => 
      g.name.toLowerCase().includes(term) || 
      g.location.toLowerCase().includes(term)
    );
    setFilteredGarages(filtered);
  }, [locationText, garages]);

  const fetchGarages = async () => {
    try {
      const res = await axios.get('/garages');
      if (res.data.success) {
        setGarages(res.data.data);
        setFilteredGarages(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch garages', error);
    }
  };

  const handleUseGPS = (target) => {
    if (navigator.geolocation) {
      setLocatingTarget(target);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            setCoordinates({ lat: latitude, lng: longitude });
            
            // Fetch real address using OpenStreetMap's Nominatim API
            let addressString = `GPS Location Captured (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
            try {
              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
              const data = await res.json();
              if (data && data.display_name) {
                // Prepend or append the exact coordinates so that even if the text address is off, the exact point is sent
                addressString = `${data.display_name} (Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)})`;
              }
            } catch (err) {
              console.error("Geocoding failed:", err);
            }

            if (target === 'exact') {
              setExactLocation(addressString);
            } else {
              setLocationText(addressString);
            }
          } finally {
            setLocatingTarget(null);
          }
        },
        (error) => {
          console.error("GPS Error:", error);
          alert('Location access denied or unavailable. Please type your location manually.');
          setLocatingTarget(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedGarage) {
      alert('Please select a garage from the list below.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await axios.post('/sos', {
        vehicleId: defaultVehicleId,
        garageId: selectedGarage._id,
        location: { 
          lat: coordinates.lat !== null ? coordinates.lat : 0, 
          lng: coordinates.lng !== null ? coordinates.lng : 0, 
          address: locationText || 'Unknown Location',
          exactLocation: exactLocation || ''
        },
        notes: notes || 'Emergency breakdown reported'
      });

      if (res.data.success) {
        alert('SOS Alert Sent successfully! The selected garage has been notified.');
        onClose();
      }
    } catch (error) {
      console.error(error);
      alert('Failed to send SOS alert. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-red-600 px-6 py-4 flex items-center justify-between text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-wider uppercase">Emergency SOS</h2>
                <p className="text-red-100 text-xs font-medium">Request immediate roadside assistance</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1">
            <form id="sos-form" onSubmit={handleSubmit} className="space-y-6">
              
              {/* Location Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Where are you located?</label>
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={locationText}
                    onChange={(e) => setLocationText(e.target.value)}
                    placeholder="e.g., Whitefield, Main Road..."
                    className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
                    required
                  />
                  {locationText && (
                    <button
                      type="button"
                      onClick={() => {
                        setLocationText('');
                        setSelectedGarage(null);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              

              {/* Garage Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Select Nearest Garage</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {filteredGarages.map(garage => (
                    <div 
                      key={garage._id}
                      onClick={() => {
                        setSelectedGarage(garage);
                        setLocationText(garage.location);
                      }}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${selectedGarage?._id === garage._id ? 'border-red-500 bg-red-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                    >
                      <div className={`p-2 rounded-lg ${selectedGarage?._id === garage._id ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-sm font-bold ${selectedGarage?._id === garage._id ? 'text-red-900' : 'text-gray-900'}`}>{garage.name}</h4>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{garage.location}</p>
                      </div>
                      {selectedGarage?._id === garage._id && (
                        <CheckCircle2 className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  ))}
                  {filteredGarages.length === 0 && (
                    <div className="col-span-full py-8 text-center text-sm text-gray-500 font-medium bg-gray-50 rounded-xl">
                      No garages found matching "{locationText}"
                    </div>
                  )}
                </div>
              </div>
              {/* Exact Location Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Exact Location / Landmark</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={exactLocation}
                      onChange={(e) => setExactLocation(e.target.value)}
                      placeholder="e.g., Near Forum Mall, Opposite Metro Station..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUseGPS('exact')}
                    disabled={locatingTarget !== null}
                    className="px-4 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    {locatingTarget === 'exact' ? 'Locating...' : 'Use GPS'}
                  </button>
                </div>
              </div>
              {/* Notes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Describe the issue (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="E.g., Flat tire, dead battery, engine smoke..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none resize-none h-20"
                ></textarea>
              </div>

            </form>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="sos-form"
              disabled={isSubmitting || !selectedGarage}
              className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-red-600/20"
            >
              {isSubmitting ? 'Sending Alert...' : 'Dispatch SOS to this Garage'}
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SOSModal;
