import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Car, Edit2, Trash2, CalendarDays, X, Check, ChevronDown } from 'lucide-react';

const StaffVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [garageSearchText, setGarageSearchText] = useState('');
  const [selectedGarage, setSelectedGarage] = useState({ id: 'All', name: 'All Garages' });
  const [isGarageDropdownOpen, setIsGarageDropdownOpen] = useState(false);
  const [allGarages, setAllGarages] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Editing state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [licensePlate, setLicensePlate] = useState('');
  const [vin, setVin] = useState('');

  useEffect(() => {
    fetchVehicles();
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

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/staff/vehicles');
      if (res.data.success) {
        setVehicles(res.data.data);
      }
    } catch (err) {
      setError('Could not retrieve database vehicles.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (v) => {
    setEditingId(v._id);
    setMake(v.make);
    setModel(v.model);
    setYear(v.year);
    setLicensePlate(v.licensePlate);
    setVin(v.vin || '');
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this vehicle? This will delete all associated service bookings.')) {
      return;
    }

    try {
      const res = await axios.delete(`/vehicles/${id}`);
      if (res.data.success) {
        setSuccess('Vehicle record removed.');
        setVehicles(prev => prev.filter(v => v._id !== id));
        setTimeout(() => setSuccess(''), 3500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete vehicle record.');
      setTimeout(() => setError(''), 3500);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await axios.put(`/vehicles/${editingId}`, {
        make, model, year, licensePlate, vin
      });

      if (res.data.success) {
        setSuccess('Vehicle details modified successfully.');
        // Refresh vehicle list to fetch owner populate details
        fetchVehicles();
        setShowEditModal(false);
        setTimeout(() => setSuccess(''), 3500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Transaction aborted.');
    }
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchesGarage = selectedGarage.id === 'All' ||
      (v.garage?._id || v.garage) === selectedGarage.id ||
      v.serviceHistory?.some(s => (s.garage?._id || s.garage || 'unassigned') === selectedGarage.id);

    return matchesGarage;
  });

  return (
    <div className="space-y-6">
      {/* Alert notices */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-600 text-sm rounded-xl flex items-center gap-2">
          <Check className="w-5 h-5" />
          <span>{success}</span>
        </div>
      )}

      {/* Title & Filter */}
      <div className="flex justify-start items-center gap-4 flex-wrap">
        <div className="relative">
          <div className="input-field py-2 px-3 text-xs font-bold bg-white border border-slate-200 focus-within:border-[#111827] rounded-xl flex items-center justify-between min-w-[200px]">
            <input 
              type="text"
              placeholder={selectedGarage.name}
              value={isGarageDropdownOpen ? garageSearchText : selectedGarage.name}
              onFocus={() => {
                setIsGarageDropdownOpen(true);
                setGarageSearchText('');
              }}
              onBlur={() => setTimeout(() => setIsGarageDropdownOpen(false), 200)}
              onChange={(e) => {
                setGarageSearchText(e.target.value);
                setIsGarageDropdownOpen(true);
              }}
              className="w-full bg-transparent outline-none truncate text-[#111827]"
            />
            <ChevronDown 
              className="w-4 h-4 text-slate-500 cursor-pointer flex-shrink-0" 
              onClick={() => setIsGarageDropdownOpen(!isGarageDropdownOpen)}
            />
          </div>
          
          {isGarageDropdownOpen && (
            <div className="absolute top-full mt-2 w-full min-w-[200px] bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="max-h-60 overflow-y-auto p-1">
                <div 
                  onMouseDown={(e) => { e.preventDefault(); setSelectedGarage({ id: 'All', name: 'All Garages' }); setIsGarageDropdownOpen(false); setGarageSearchText(''); }}
                  className="px-3 py-2 text-xs font-bold text-[#111827] hover:bg-slate-50 rounded-lg cursor-pointer"
                >
                  All Garages
                </div>
                <div 
                  onMouseDown={(e) => { e.preventDefault(); setSelectedGarage({ id: 'unassigned', name: 'Unassigned' }); setIsGarageDropdownOpen(false); setGarageSearchText(''); }}
                  className="px-3 py-2 text-xs font-bold text-[#111827] hover:bg-slate-50 rounded-lg cursor-pointer"
                >
                  Unassigned
                </div>
                {allGarages.filter(g => g.name.toLowerCase().includes(garageSearchText.toLowerCase())).map(g => (
                  <div 
                    key={g._id}
                    onMouseDown={(e) => { e.preventDefault(); setSelectedGarage({ id: g._id, name: g.name }); setIsGarageDropdownOpen(false); setGarageSearchText(''); }}
                    className="px-3 py-2 text-xs font-bold text-[#111827] hover:bg-slate-50 rounded-lg cursor-pointer truncate"
                  >
                    {g.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main vehicles registry list */}
      <div className="glass-panel rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#111827]"></div>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="text-center py-16">
            <Car className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 font-bold">No Vehicles Found</p>
            <p className="text-xs text-slate-500 mt-1">Try modifying your search queries.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-th">Vehicle</th>
                  <th className="table-th">License Plate</th>
                  <th className="table-th">Owner (Customer)</th>
                  <th className="table-th">Last Service</th>
                  <th className="table-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredVehicles.map((v) => (
                  <tr key={v._id} className="hover:bg-slate-50/10">
                    <td className="table-td">
                      <div>
                        <h4 className="font-bold text-[#111827]">{v.make} {v.model}</h4>
                        <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{v.vin || 'NO VIN PROVIDED'}</span>
                      </div>
                    </td>
                    <td className="table-td font-semibold text-slate-600 font-mono uppercase">{v.licensePlate}</td>
                    <td className="table-td">
                      {v.owner ? (
                        <div>
                          <h4 className="font-bold text-[#111827]">{v.owner.name}</h4>
                          <span className="text-[10px] text-slate-500 block mt-0.5">{v.owner.email}</span>
                        </div>
                      ) : (
                        <span className="text-rose-400 italic">Unknown Owner</span>
                      )}
                    </td>
                    <td className="table-td font-medium text-[#111827]">
                      {v.lastServiceDate ? new Date(v.lastServiceDate).toLocaleDateString() : 'N/A'}
                    </td>

                    <td className="table-td text-right">
                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() => handleOpenEdit(v)}
                          className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-350 hover:text-[#111827] transition-colors"
                          title="Edit vehicle info"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(v._id)}
                          className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-350 hover:text-red-600 transition-colors"
                          title="Remove vehicle record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-[#111827]">Edit Fleet Vehicle</h3>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="text-slate-500 hover:text-[#111827] p-1 rounded-lg bg-slate-100/50 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Make
                  </label>
                  <input
                    type="text"
                    required
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Model
                  </label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Year Model
                  </label>
                  <input
                    type="number"
                    required
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    License Plate
                  </label>
                  <input
                    type="text"
                    required
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  VIN Code
                </label>
                <input
                  type="text"
                  value={vin}
                  onChange={(e) => setVin(e.target.value)}
                  className="input-field uppercase font-mono"
                  maxLength={17}
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn-secondary py-2 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2 text-xs font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffVehicles;
