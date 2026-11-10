import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileCheck, Search, Sliders, X, Check, CheckCircle2, Ban, Trash2, ChevronDown } from 'lucide-react';

const ExpandableNote = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  const isLong = text.length > 60;
  const displayText = isExpanded ? text : (isLong ? text.slice(0, 60) + '...' : text);

  return (
    <div
      className={`mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100 max-w-xs transition-all ${isLong ? 'cursor-pointer hover:bg-slate-100' : ''}`}
      onClick={() => isLong && setIsExpanded(!isExpanded)}
    >
      <span className="text-xs text-slate-600 font-medium italic whitespace-normal break-words leading-relaxed block">
        "{displayText}"
        {isLong && (
          <span className="text-blue-500 text-[10px] ml-2 font-bold cursor-pointer inline-block">
            {isExpanded ? 'Show Less' : 'Read More'}
          </span>
        )}
      </span>
    </div>
  );
};

const ExpandableText = ({ text, prefix, prefixColor = "text-slate-500" }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  const isLong = text.length > 40;
  const displayText = isExpanded ? text : (isLong ? text.slice(0, 40) + '...' : text);

  return (
    <div className="whitespace-normal leading-tight">
      {prefix && <span className={`${prefixColor} font-semibold mr-1`}>{prefix}</span>}
      <span
        className={isLong ? 'cursor-pointer' : ''}
        onClick={() => isLong && setIsExpanded(!isExpanded)}
      >
        {displayText}
        {isLong && (
          <span className="text-blue-500 text-[10px] ml-1 font-bold">
            {isExpanded ? 'Less' : 'More'}
          </span>
        )}
      </span>
    </div>
  );
};

const ServiceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedGarage, setSelectedGarage] = useState({ id: 'All', name: 'All Garages' });
  const [isGarageDropdownOpen, setIsGarageDropdownOpen] = useState(false);
  const [garageSearchText, setGarageSearchText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Editing state
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [status, setStatus] = useState('Pending');
  const [notes, setNotes] = useState('');
  const [totalCost, setTotalCost] = useState(0);
  const [assignedStaff, setAssignedStaff] = useState('');
  const [pickupAndDrop, setPickupAndDrop] = useState(false);
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropAddress, setDropAddress] = useState('');
  const [staffMembers, setStaffMembers] = useState([]);

  // Garage state
  const [activeAdminTab, setActiveAdminTab] = useState('bookings');
  const [garages, setGarages] = useState([]);
  const [garageLoading, setGarageLoading] = useState(false);
  const [newGarageName, setNewGarageName] = useState('');
  const [newGarageLocation, setNewGarageLocation] = useState('');
  const [garageError, setGarageError] = useState('');
  const [garageSuccess, setGarageSuccess] = useState('');

  useEffect(() => {
    fetchRequests();
    fetchGarages();
    fetchStaffMembers();
  }, []);

  const fetchStaffMembers = async () => {
    try {
      const res = await axios.get('/users/staff');
      if (res.data.success) {
        setStaffMembers(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch staff members');
    }
  };

  const fetchGarages = async () => {
    try {
      setGarageLoading(true);
      const res = await axios.get('/garages');
      if (res.data.success) {
        setGarages(res.data.data);
      }
    } catch (err) {
      setGarageError('Could not retrieve garages.');
    } finally {
      setGarageLoading(false);
    }
  };

  const handleAddGarage = async (e) => {
    e.preventDefault();
    setGarageError('');
    setGarageSuccess('');

    if (!newGarageName || newGarageName.trim().length < 3) {
      setGarageError('Garage name must be at least 3 characters.');
      return;
    }
    if (!newGarageLocation || newGarageLocation.trim().length < 5) {
      setGarageError('Garage location must be at least 5 characters.');
      return;
    }

    try {
      const res = await axios.post('/garages', { name: newGarageName, location: newGarageLocation });
      if (res.data.success) {
        setGarageSuccess('Garage location registered successfully!');
        setNewGarageName('');
        setNewGarageLocation('');
        fetchGarages();
        setTimeout(() => setGarageSuccess(''), 3500);
      }
    } catch (err) {
      setGarageError(err.response?.data?.message || 'Failed to add garage.');
    }
  };

  const handleDeleteGarage = async (id) => {
    if (!window.confirm('Are you sure you want to remove this garage? This will fail if there are active bookings assigned to it.')) {
      return;
    }
    setGarageError('');
    setGarageSuccess('');
    try {
      const res = await axios.delete(`/garages/${id}`);
      if (res.data.success) {
        setGarageSuccess('Garage location removed.');
        setGarages(prev => prev.filter(g => g._id !== id));
        setTimeout(() => setGarageSuccess(''), 3500);
      }
    } catch (err) {
      setGarageError(err.response?.data?.message || 'Failed to delete garage.');
    }
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/services/bookings');
      if (res.data.success) {
        setRequests(res.data.data);
      }
    } catch (err) {
      setError('Could not retrieve service requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickApprove = async (id) => {
    try {
      const res = await axios.put(`/services/bookings/${id}`, { status: 'Accepted' });
      if (res.data.success) {
        setSuccess('Booking approved.');
        setRequests(prev => prev.map(r => r._id === id ? { ...r, status: 'Accepted' } : r));
        setTimeout(() => setSuccess(''), 3500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Approving failed.');
    }
  };

  const handleQuickReject = async (id) => {
    try {
      const res = await axios.put(`/services/bookings/${id}`, { status: 'Cancelled' });
      if (res.data.success) {
        setSuccess('Booking rejected.');
        setRequests(prev => prev.map(r => r._id === id ? { ...r, status: 'Cancelled' } : r));
        setTimeout(() => setSuccess(''), 3500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Rejecting failed.');
    }
  };

  const handleDeleteRequest = async (id) => {
    if (!window.confirm('Are you sure you want to completely delete this service booking? This cannot be undone.')) {
      return;
    }
    setError('');
    setSuccess('');
    try {
      const res = await axios.delete(`/services/bookings/${id}`);
      if (res.data.success) {
        setSuccess('Booking deleted successfully.');
        setRequests(prev => prev.filter(r => r._id !== id));
        setTimeout(() => setSuccess(''), 3500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete booking.');
    }
  };

  const handleOpenStatusAdjust = (reqRecord) => {
    setSelectedRequest(reqRecord);
    setStatus(reqRecord.status);
    setNotes(reqRecord.notes || '');
    setTotalCost(reqRecord.totalCost || 0);
    setAssignedStaff(reqRecord.assignedStaff?._id || '');
    setPickupAndDrop(reqRecord.pickupAndDrop || false);
    setPickupAddress(reqRecord.pickupAddress || '');
    setDropAddress(reqRecord.dropAddress || '');
    setShowStatusModal(true);
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const payload = {
        status, notes, totalCost, assignedStaff: assignedStaff || null,
        pickupAndDrop
      };

      if (pickupAndDrop) {
        payload.pickupAddress = pickupAddress;
        payload.dropAddress = dropAddress;
      } else {
        payload.pickupAddress = '';
        payload.dropAddress = '';
      }

      const res = await axios.put(`/services/bookings/${selectedRequest._id}`, payload);

      if (res.data.success) {
        setSuccess('Appointment status saved.');
        fetchRequests(); // Refresh populated listing
        setShowStatusModal(false);
        setTimeout(() => setSuccess(''), 3500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update request.');
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Accepted': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'In Progress': return 'bg-neon-purple/10 text-[#111827] border-neon-purple/20';
      case 'Completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Cancelled': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.vehicle?.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.vehicle?.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.service?.name.toLowerCase().includes(searchQuery.toLowerCase());
      
    let reqStatus = r.status;
    if (reqStatus === 'Approved') reqStatus = 'Accepted';
    if (reqStatus === 'Rejected') reqStatus = 'Cancelled';

    const matchesStatus = statusFilter === 'All' || reqStatus === statusFilter;

    const reqGarageId = r.garage?._id || r.garage || 'unassigned';
    const matchesGarage = selectedGarage.id === 'All' || 
                          (selectedGarage.id === 'unassigned' && reqGarageId === 'unassigned') || 
                          reqGarageId === selectedGarage.id;

    return matchesSearch && matchesStatus && matchesGarage;
  });

  return (
    <div className="space-y-6">
      {/* Admin Tab Switcher */}


      {activeAdminTab === 'bookings' && (
        <div className="space-y-6">
          {/* Messages */}
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

          {/* Controls */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by customer, vehicle, or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#111827] focus:ring-1 focus:ring-[#111827] outline-none transition-all text-sm font-medium"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:border-[#111827] outline-none text-sm font-bold bg-gray-50 min-w-[150px]"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="In Progress">In Progress</option>
              <option value="Waiting for Parts">Waiting for Parts</option>
              <option value="Completed">Completed</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <div className="relative z-40 min-w-[150px]">
              <div className="px-4 py-3 text-sm font-bold bg-gray-50 border border-gray-200 focus-within:border-[#111827] rounded-xl flex items-center justify-between cursor-pointer">
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
                  className="w-full bg-transparent outline-none truncate text-[#111827] cursor-pointer"
                />
                <ChevronDown 
                  className="w-4 h-4 text-slate-500 cursor-pointer flex-shrink-0 ml-2" 
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
                    {garages.filter(g => g.name.toLowerCase().includes(garageSearchText.toLowerCase())).map(g => (
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

          {/* Main Table */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#111827]"></div>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-black text-[#111827] mb-2">No Tasks Found</h3>
                <p className="text-gray-500 font-medium max-w-md mx-auto">You have no assigned services matching your current filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="table-th">Customer</th>
                      <th className="table-th">Vehicle</th>
                      <th className="table-th">Service / Issue Description</th>
                      <th className="table-th">Pickup / Drop Address</th>
                      <th className="table-th">Garage Location</th>
                      <th className="table-th">Appt Date</th>
                      <th className="table-th">Billing Cost</th>
                      <th className="table-th">Status</th>
                      <th className="table-th text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredRequests.map((r) => {
                      const pickupMatch = r.notes?.match(/\[Pick Up Location:\s*(.*?)\]/i);
                      const parsedPickup = pickupMatch ? pickupMatch[1].trim() : r.pickupAddress;

                      const dropMatch = r.notes?.match(/\[Drop Location:\s*(.*?)\]/i);
                      const parsedDrop = dropMatch ? dropMatch[1].trim() : r.dropAddress;

                      const hasPickupOrDrop = parsedPickup || parsedDrop || r.pickupAndDrop;
                      const displayNotes = r.notes ? r.notes.replace(/\[Pick Up Location:.*?\]/gi, '').replace(/\[Drop Location:.*?\]/gi, '').trim() : '';

                      return (
                        <tr key={r._id} className="hover:bg-slate-50/10 transition-colors group">
                          <td className="table-td">
                            {r.user ? (
                              <div>
                                <h4 className="font-bold text-[#111827]">{r.user.name}</h4>
                                <span className="text-[10px] text-slate-500 block mt-0.5">{r.user.phone}</span>
                              </div>
                            ) : (
                              <span className="text-rose-400 italic">User Removed</span>
                            )}
                          </td>
                          <td className="table-td font-semibold text-[#111827]">
                            {r.vehicle ? `${r.vehicle.make} ${r.vehicle.model}` : 'N/A'}
                          </td>
                          <td className="table-td">
                            <div>
                              <h4 className="font-bold text-slate-600">{r.service?.name}</h4>
                              {displayNotes && <ExpandableNote text={displayNotes} />}
                            </div>
                          </td>
                          <td className="table-td">
                            {hasPickupOrDrop ? (
                              <div className="text-sm text-[#111827] font-bold space-y-2 min-w-[200px] max-w-xs">
                                {parsedPickup && <ExpandableText text={parsedPickup} prefix="P:" />}
                                {parsedDrop && <ExpandableText text={parsedDrop} prefix="D:" />}
                              </div>
                            ) : (
                              <span className="text-slate-400 font-medium">-</span>
                            )}
                          </td>
                          <td className="table-td">
                            {r.garage ? (
                              <div>
                                <span className="font-bold text-[#111827] block text-xs">{r.garage.name}</span>
                                <span className="text-[9px] text-slate-500 block mt-0.5 leading-snug">{r.garage.location}</span>
                              </div>
                            ) : (
                              <span className="text-slate-500 italic text-xs">Unassigned</span>
                            )}
                            {r.assignedStaff && (
                              <div className="mt-2 text-xs text-indigo-600 font-semibold bg-indigo-50 border border-indigo-100 rounded px-2 py-0.5 inline-block">
                                Staff: {r.assignedStaff.name}
                              </div>
                            )}
                          </td>
                          <td className="table-td text-xs text-slate-600">
                            {new Date(r.bookingDate).toLocaleDateString()} at {r.preferredTime}
                          </td>
                          <td className="table-td font-extrabold text-[#111827]">₹{r.totalCost}</td>
                          <td className="table-td">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadgeColor(r.status)}`}>
                              {r.status}
                            </span>
                          </td>
                          <td className="table-td text-right">
                            <div className="flex justify-end items-center gap-2">
                              {r.status === 'Pending' && (
                                <>
                                  <button
                                    onClick={() => handleQuickApprove(r._id)}
                                    className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                                    title="Approve Booking"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleQuickReject(r._id)}
                                    className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors"
                                    title="Reject Booking"
                                  >
                                    <Ban className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => handleOpenStatusAdjust(r)}
                                className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-[#111827] border border-slate-300 transition-all font-bold text-xs flex items-center gap-1"
                              >
                                <Sliders className="w-3.5 h-3.5" />
                                <span>Manage</span>
                              </button>
                              <button
                                onClick={() => handleDeleteRequest(r._id)}
                                className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors"
                                title="Delete Booking"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeAdminTab === 'garages' && (
        <div className="space-y-6">
          {garageError && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
              {garageError}
            </div>
          )}
          {garageSuccess && (
            <div className="p-4 bg-green-50 border border-green-200 text-green-600 text-sm rounded-xl flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span>{garageSuccess}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Add Garage Form */}
            <div className="glass-panel p-6 rounded-xl space-y-4 h-fit">
              <h3 className="font-bold text-[#111827] text-base">Add New Garage Location</h3>
              <form onSubmit={handleAddGarage} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Garage Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Smart Garage Downtown"
                    value={newGarageName}
                    onChange={(e) => setNewGarageName(e.target.value)}
                    className="input-field text-xs py-2.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Location Address
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="E.g. 101 Metro Ave, Suite A, Bengaluru"
                    value={newGarageLocation}
                    onChange={(e) => setNewGarageLocation(e.target.value)}
                    className="input-field text-xs resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary w-full py-2.5 text-xs font-bold"
                >
                  Register Garage Location
                </button>
              </form>
            </div>

            {/* Right: Garages List */}
            <div className="lg:col-span-2 glass-panel rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h3 className="font-bold text-[#111827] text-sm">Active Garage Network</h3>
              </div>
              {garageLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#111827]"></div>
                </div>
              ) : garages.length === 0 ? (
                <div className="text-center py-16">
                  <Ban className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-500 font-bold">No Garages Found</p>
                  <p className="text-xs text-slate-500 mt-1">Add garage locations on the left panel to populate.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="table-th">Garage Name</th>
                        <th className="table-th">Address / Location</th>
                        <th className="table-th text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {garages.map((g) => (
                        <tr key={g._id} className="hover:bg-slate-50/10">
                          <td className="table-td font-bold text-[#111827]">{g.name}</td>
                          <td className="table-td text-slate-600">{g.location}</td>
                          <td className="table-td text-right">
                            <button
                              onClick={() => handleDeleteGarage(g._id)}
                              className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors"
                              title="Delete Garage"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Manage Status Modal */}
      {showStatusModal && selectedRequest && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-bold text-[#111827]">Manage Service Appointment</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Booking Code: {selectedRequest._id.toUpperCase().slice(-8)}</p>
              </div>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-slate-500 hover:text-[#111827] p-1 rounded-lg bg-slate-100/50 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStatusSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                  Live Status Tracker
                </label>

                <div className="flex flex-wrap gap-2">
                  {['Pending', 'Accepted', 'In Progress', 'Waiting for Parts', 'Completed', 'Delivered'].map((step) => {
                    const isActive = status === step;
                    return (
                      <button
                        key={step}
                        type="button"
                        onClick={() => setStatus(step)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${isActive
                          ? 'bg-[#111827] text-white border-[#111827]'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-[#111827]'
                          }`}
                      >
                        {step}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setStatus('Cancelled')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${status === 'Cancelled'
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                      }`}
                  >
                    Cancelled
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Invoice Amount (₹)
                </label>
                <input
                  type="number"
                  required
                  value={totalCost}
                  onChange={(e) => setTotalCost(parseFloat(e.target.value))}
                  className="input-field font-mono text-lg font-bold"
                  min={0}
                />
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-5 rounded-2xl border border-slate-200/60 shadow-inner">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-widest mb-3">
                  <Sliders className="w-4 h-4 text-brand-red" />
                  Technician / Status Notes
                </label>
                <div className="relative">
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-white/80 backdrop-blur-sm border-2 border-slate-200 focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-400 transition-all duration-300 resize-none font-medium shadow-sm"
                    placeholder="Insert remarks visible to the customer on their printed invoice..."
                  />
                  <div className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-inset ring-black/5"></div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="btn-secondary py-2 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2 text-xs font-bold"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceRequests;
