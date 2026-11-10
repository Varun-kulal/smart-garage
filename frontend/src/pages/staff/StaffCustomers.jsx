import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Search, Mail, Phone, Car, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StaffCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [garageFilter, setGarageFilter] = useState('All');
  const [allGarages, setAllGarages] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchCustomers();
    fetchAllGarages();
  }, []);

  async function fetchAllGarages() {
    try {
      const res = await axios.get('/garages');
      if (res.data.success) {
        setAllGarages(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch garages', err);
    }
  }

  async function fetchCustomers() {
    try {
      setLoading(true);
      const res = await axios.get('/staff/customers');
      if (res.data.success) {
        setCustomers(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading customers');
    } finally {
      setLoading(false);
    }
  }

  const filteredCustomers = customers.filter(c => {
    const term = searchTerm.toLowerCase();
    const nameMatch = c.name?.toLowerCase().includes(term);
    const phoneMatch = c.phone?.toLowerCase().includes(term);
    const emailMatch = c.email?.toLowerCase().includes(term);
    const vehicleMatch = c.vehicles?.some(v => v.licensePlate?.toLowerCase().includes(term) || v.model?.toLowerCase().includes(term));
    const bookingMatch = c.serviceHistory?.some(s => s._id?.toLowerCase().includes(term));
    const matchesSearch = nameMatch || phoneMatch || emailMatch || vehicleMatch || bookingMatch;
    
    const matchesGarage = garageFilter === 'All' || c.serviceHistory?.some(s => {
      const gId = s.garage?._id || s.garage || 'unassigned';
      return gId === garageFilter;
    });
    
    return matchesSearch && matchesGarage;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#111827] flex items-center gap-2">
            <Users className="w-6 h-6 text-[#FF3B30]" />
            CUSTOMER MANAGEMENT
          </h1>
          <p className="text-gray-500 font-medium text-sm mt-1">View clients, vehicles, and service history</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, phone, vehicle plate, or booking ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#111827] focus:ring-1 focus:ring-[#111827] outline-none transition-all text-sm font-medium"
          />
        </div>
        <select
          value={garageFilter}
          onChange={(e) => setGarageFilter(e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-200 focus:border-[#111827] outline-none text-sm font-bold bg-gray-50 min-w-[150px]"
        >
          <option value="All">All Garages</option>
          <option value="unassigned">Unassigned</option>
          {allGarages.map((g) => (
            <option key={g._id} value={g._id}>{g.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#111827]"></div>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-black text-[#111827] mb-2">No Customers Found</h3>
          <p className="text-gray-500 font-medium max-w-md mx-auto">No matching clients found for your garage.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCustomers.map(customer => (
            <div key={customer._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                onClick={() => setExpandedId(expandedId === customer._id ? null : customer._id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-lg border border-blue-100">
                    {customer.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#111827]">{customer.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500 font-medium mt-1">
                      <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {customer.phone}</span>
                      <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {customer.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Vehicles</p>
                    <p className="font-bold text-[#111827]">{customer.vehicles?.length || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Bookings</p>
                    <p className="font-bold text-[#111827]">{customer.serviceHistory?.length || 0}</p>
                  </div>
                  <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-[#111827] hover:text-white transition-colors">
                    {expandedId === customer._id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {expandedId === customer._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-100 bg-gray-50/50 p-6"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Vehicles List */}
                      <div>
                        <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Car className="w-4 h-4 text-[#FF3B30]" /> Registered Vehicles
                        </h4>
                        <div className="space-y-3">
                          {customer.vehicles?.length > 0 ? customer.vehicles.map(vehicle => (
                            <div key={vehicle._id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
                              <div>
                                <p className="font-bold text-[#111827]">{vehicle.make} {vehicle.model}</p>
                                <p className="text-xs text-gray-500 font-medium">Plate: {vehicle.licensePlate} • {vehicle.year}</p>
                              </div>
                              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase tracking-widest">
                                {vehicle.fuelType || 'Unknown'}
                              </span>
                            </div>
                          )) : <p className="text-sm text-gray-500 italic">No vehicles found.</p>}
                        </div>
                      </div>

                      {/* Service History */}
                      <div>
                        <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#FF3B30]" /> Service History
                        </h4>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                          {customer.serviceHistory?.length > 0 ? customer.serviceHistory.map(service => (
                            <div key={service._id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                              <div className="flex justify-between items-start mb-2">
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${
                                  service.status === 'Completed' || service.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                                  service.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {service.status}
                                </span>
                                <span className="text-xs font-bold text-gray-400">
                                  {new Date(service.bookingDate).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 font-medium font-mono mb-1">ID: {service._id}</p>
                              <p className="text-sm font-bold text-[#111827]">Cost: ${service.totalCost || service.estimatedCost || '0.00'}</p>
                            </div>
                          )) : <p className="text-sm text-gray-500 italic">No history found.</p>}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffCustomers;
