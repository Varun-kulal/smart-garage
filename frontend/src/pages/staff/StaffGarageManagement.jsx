import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Building2, Search, Plus, MapPin, Phone, Trash2, ShieldAlert, Check } from 'lucide-react';

const StaffGarageManagement = () => {
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [newGarage, setNewGarage] = useState({ name: '', location: '' });

  useEffect(() => {
    fetchGarages();
  }, []);

  const fetchGarages = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/garages');
      if (res.data.success) {
        setGarages(res.data.data);
      }
    } catch (err) {
      setError('Failed to fetch garages.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGarage = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await axios.post('/garages', newGarage);
      if (res.data.success) {
        setSuccess('Garage location added successfully!');
        setGarages([...garages, res.data.data]);
        setShowAddModal(false);
        setNewGarage({ name: '', location: '' });
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add garage.');
      setTimeout(() => setError(''), 4000);
    }
  };

  const handleDeleteGarage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this garage location?')) return;

    try {
      const res = await axios.delete(`/garages/${id}`);
      if (res.data.success) {
        setSuccess('Garage deleted successfully.');
        setGarages(garages.filter(g => g._id !== id));
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete garage.');
      setTimeout(() => setError(''), 4000);
    }
  };

  const filteredGarages = garages.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    g.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-3xl space-y-6">
      <div className="flex items-center justify-between pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-[#111827]">Garage Management</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Manage partner garage locations across districts.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#111827] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#FF3B30] transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add Garage
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-[#FF3B30] text-red-700 text-sm font-bold flex items-center gap-2 rounded-xl">
          <ShieldAlert className="w-5 h-5" />
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm font-bold flex items-center gap-2 rounded-xl">
          <Check className="w-5 h-5" />
          {success}
        </div>
      )}

      <div className="relative w-full max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search garages by name or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF3B30] focus:ring-4 focus:ring-[#FF3B30]/10 outline-none text-sm font-bold transition-all"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#111827]"></div>
          </div>
        ) : filteredGarages.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-bold">No garages found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-500 border-b border-gray-100 bg-gray-50">Garage Name</th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-500 border-b border-gray-100 bg-gray-50">Location / District</th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-500 border-b border-gray-100 bg-gray-50">Contact Info</th>
                  <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-widest text-gray-500 border-b border-gray-100 bg-gray-50">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredGarages.map((garage) => (
                  <tr key={garage._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#111827]/5 rounded-lg">
                          <Building2 className="w-5 h-5 text-[#111827]" />
                        </div>
                        <span className="font-bold text-[#111827]">{garage.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">{garage.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {garage.technicianName || garage.technicianPhone ? (
                        <div className="flex flex-col gap-1">
                          {garage.technicianName && <span className="text-sm font-bold text-[#111827]">{garage.technicianName}</span>}
                          {garage.technicianPhone && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                              <Phone className="w-3 h-3" />
                              {garage.technicianPhone}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDeleteGarage(garage._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Garage"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-[#111827]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-black text-[#111827]">Add New Garage</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-[#111827]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddGarage} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Garage Name</label>
                <input
                  type="text"
                  required
                  value={newGarage.name}
                  onChange={(e) => setNewGarage({ ...newGarage, name: e.target.value })}
                  placeholder="Express Tech Garage"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF3B30] focus:ring-4 focus:ring-[#FF3B30]/10 outline-none text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Location / District</label>
                <input
                  type="text"
                  required
                  value={newGarage.location}
                  onChange={(e) => setNewGarage({ ...newGarage, location: e.target.value })}
                  placeholder="Indiranagar, Bengaluru"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF3B30] focus:ring-4 focus:ring-[#FF3B30]/10 outline-none text-sm font-bold"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-3 bg-[#FF3B30] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-700 shadow-md">
                  Save Garage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffGarageManagement;
