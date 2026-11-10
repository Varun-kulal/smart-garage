import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Plus, Edit2, Trash2, CalendarDays, X, Check, AlertTriangle, Disc } from 'lucide-react';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [licensePlate, setLicensePlate] = useState('');
  const [vin, setVin] = useState('');
  const [mileage, setMileage] = useState(0);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/vehicles/my');
      if (res.data.success) {
        setVehicles(res.data.data);
      }
    } catch (err) {
      setError('Could not retrieve vehicles.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setMake('');
    setModel('');
    setYear(new Date().getFullYear());
    setLicensePlate('');
    setVin('');
    setMileage(0);
    setShowForm(true);
  };

  const handleOpenEdit = (v) => {
    setEditingId(v._id);
    setMake(v.make);
    setModel(v.model);
    setYear(v.year);
    setLicensePlate(v.licensePlate);
    setVin(v.vin || '');
    setMileage(v.mileage);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this vehicle? This will delete all associated bookings.')) {
      return;
    }

    try {
      const res = await axios.delete(`/vehicles/${id}`);
      if (res.data.success) {
        setSuccess('Vehicle removed successfully.');
        setVehicles(prev => prev.filter(v => v._id !== id));
        setTimeout(() => setSuccess(''), 3500);
      }
    } catch (err) {
      setError('Failed to delete vehicle.');
      setTimeout(() => setError(''), 3500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const payload = { make, model, year, licensePlate, vin, mileage };

    try {
      if (editingId) {
        const res = await axios.put(`/vehicles/${editingId}`, payload);
        if (res.data.success) {
          setSuccess('Vehicle updated successfully!');
          setVehicles(prev => prev.map(v => v._id === editingId ? res.data.data : v));
        }
      } else {
        const res = await axios.post('/vehicles', payload);
        if (res.data.success) {
          setSuccess('Vehicle registered successfully!');
          setVehicles(prev => [res.data.data, ...prev]);
        }
      }
      setShowForm(false);
      setTimeout(() => setSuccess(''), 3500);
    } catch (err) {
      setError(err.response?.data?.message || 'Transaction failed.');
    }
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-[#111827] tracking-tight flex items-center gap-3">
            <Car className="w-8 h-8 text-[#FF3B30]" />
            Registered Garage
          </h2>
          <p className="text-gray-500 font-medium mt-2">Manage your vehicle fleet to schedule bookings and track service history.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#111827] text-white flex items-center gap-2 text-xs font-black uppercase tracking-widest py-3 px-6 rounded-xl hover:bg-[#FF3B30] transition-all duration-300 shadow-lg shadow-gray-200"
        >
          <Plus className="w-4 h-4" />
          <span>Register Vehicle</span>
        </button>
      </div>

      {/* Messages */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-50 border-l-4 border-[#FF3B30] text-red-700 text-sm font-bold flex items-center gap-3 rounded-r-xl"
          >
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-[#FF3B30]" />
            <span>{error}</span>
          </motion.div>
        )}
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm font-bold flex items-center gap-3 rounded-r-xl"
          >
            <Check className="w-5 h-5 text-green-500" />
            <span>{success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid list */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF3B30]"></div>
        </div>
      ) : vehicles.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm"
        >
          <div className="w-20 h-20 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <Car className="w-10 h-10 text-gray-300" />
          </div>
          <h4 className="text-xl font-black text-[#111827] tracking-tight">No Vehicles Registered</h4>
          <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto font-medium leading-relaxed">
            You must register a vehicle first before scheduling booking slots at the service station.
          </p>
          <button onClick={handleOpenAdd} className="mt-8 text-xs font-black uppercase tracking-widest px-8 py-3 bg-white text-[#111827] border-2 border-[#111827] rounded-xl hover:bg-[#111827] hover:text-white transition-all duration-300">
            Add Your First Vehicle
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <motion.div 
              key={v._id} 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl hover:border-[#FF3B30]/30 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black bg-gray-100 text-[#111827] px-3 py-1.5 rounded-lg border border-gray-200 tracking-widest uppercase">
                      {v.licensePlate}
                    </span>
                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                      v.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                      v.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-orange-50 text-orange-700 border-orange-200'
                    }`}>
                      {v.status || 'Pending'}
                    </span>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEdit(v)}
                      className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-[#111827] hover:bg-gray-100 transition-colors border border-gray-200"
                      title="Edit vehicle info"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(v._id)}
                      className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-[#FF3B30] hover:bg-red-50 transition-colors border border-gray-200"
                      title="Remove vehicle"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#111827] flex items-center justify-center">
                    <Car className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-[#111827] tracking-tight">{v.make} {v.model}</h4>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Year {v.year}</p>
                  </div>
                </div>

                {v.vin && (
                  <div className="mt-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">VIN Number</p>
                    <p className="text-xs text-[#111827] font-mono font-bold tracking-widest">{v.vin}</p>
                  </div>
                )}

                {/* Verification Status Stepper Tracker */}
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <div className="flex justify-between items-center text-[10px] text-gray-400 font-black uppercase tracking-widest mb-4">
                    <span>Approval Status</span>
                  </div>
                  <div className="relative pb-2">
                    <div className="absolute top-2 left-0 right-0 h-1 bg-gray-100 z-0 rounded-full"></div>
                    <div 
                      className={`absolute top-2 left-0 h-1 z-0 rounded-full transition-all duration-500 ${
                        v.status === 'Approved' ? 'bg-[#FF3B30] w-full' : v.status === 'Rejected' ? 'bg-red-500 w-1/2' : 'bg-[#111827] w-1/2'
                      }`}
                    ></div>

                    <div className="flex justify-between relative z-10">
                      <div className="flex flex-col items-center">
                        <div className="w-5 h-5 rounded-full bg-[#111827] flex items-center justify-center text-white">
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#111827] mt-2">Added</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${
                          v.status === 'Approved' 
                            ? 'bg-[#FF3B30]' 
                            : v.status === 'Rejected' 
                            ? 'bg-red-500' 
                            : 'bg-[#111827] animate-pulse'
                        }`}>
                          {v.status === 'Approved' ? <Check className="w-3 h-3" /> : v.status === 'Rejected' ? <X className="w-3 h-3" /> : <Disc className="w-3 h-3 animate-spin" />}
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest mt-2 ${v.status === 'Rejected' ? 'text-red-500' : 'text-[#111827]'}`}>
                          {v.status === 'Rejected' ? 'Rejected' : 'Reviewing'}
                        </span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${
                          v.status === 'Approved' 
                            ? 'bg-[#FF3B30]' 
                            : 'bg-gray-200'
                        }`}>
                          {v.status === 'Approved' ? <Check className="w-3 h-3" /> : <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest mt-2 ${v.status === 'Approved' ? 'text-[#FF3B30]' : 'text-gray-400'}`}>Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mt-6 flex justify-between items-center">
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Mileage</p>
                  <p className="text-[#111827] font-black text-sm mt-0.5">{v.mileage.toLocaleString()} mi</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Last Service</p>
                  <p className="text-[#111827] font-bold text-sm mt-0.5 flex items-center gap-1.5 justify-end">
                    <CalendarDays className="w-4 h-4 text-[#FF3B30]" />
                    {v.lastServiceDate ? new Date(v.lastServiceDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Form Dialog Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-[#111827]/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-gray-200 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-200">
                    <Car className="w-5 h-5 text-[#FF3B30]" />
                  </div>
                  <h3 className="font-black text-xl text-[#111827] tracking-tight">{editingId ? 'Update Vehicle' : 'Register Vehicle'}</h3>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-[#111827] p-2 rounded-xl bg-white hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                      Make / Brand
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Toyota"
                      value={make}
                      onChange={(e) => setMake(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:bg-white focus:border-[#FF3B30] focus:ring-4 focus:ring-[#FF3B30]/10 outline-none transition-all font-bold text-[#111827] placeholder-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                      Model Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Camry"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:bg-white focus:border-[#FF3B30] focus:ring-4 focus:ring-[#FF3B30]/10 outline-none transition-all font-bold text-[#111827] placeholder-gray-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                      Manufacture Year
                    </label>
                    <input
                      type="number"
                      required
                      value={year}
                      onChange={(e) => setYear(parseInt(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:bg-white focus:border-[#FF3B30] focus:ring-4 focus:ring-[#FF3B30]/10 outline-none transition-all font-bold text-[#111827]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                      License Plate
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="CAR-AI-01"
                      value={licensePlate}
                      onChange={(e) => setLicensePlate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:bg-white focus:border-[#FF3B30] focus:ring-4 focus:ring-[#FF3B30]/10 outline-none transition-all font-bold text-[#111827] placeholder-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                    VIN (Vehicle Identification Number)
                  </label>
                  <input
                    type="text"
                    placeholder="17-Digit Alpha-numeric serial"
                    value={vin}
                    onChange={(e) => setVin(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:bg-white focus:border-[#FF3B30] focus:ring-4 focus:ring-[#FF3B30]/10 outline-none transition-all font-mono font-bold uppercase text-[#111827] placeholder-gray-300 tracking-widest"
                    maxLength={17}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                    Current Mileage (Miles)
                  </label>
                  <input
                    type="number"
                    required
                    value={mileage}
                    onChange={(e) => setMileage(parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:bg-white focus:border-[#FF3B30] focus:ring-4 focus:ring-[#FF3B30]/10 outline-none transition-all font-bold text-[#111827]"
                    min={0}
                  />
                </div>

                <div className="flex gap-4 justify-end pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs text-[#111827] bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs text-white bg-[#111827] hover:bg-[#FF3B30] transition-colors shadow-lg"
                  >
                    {editingId ? 'Save Changes' : 'Confirm Vehicle'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VehicleList;
