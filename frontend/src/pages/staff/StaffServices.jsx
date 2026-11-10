import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import {
  FileCheck2,
  Search,
  MapPin,
  Car,
  Calendar,
  Clock,
  User,
  Wrench,
  CheckCircle2,
  XCircle,
  Pencil,
  AlertCircle,
  Sliders,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ExpandableNote = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  const isLong = text.length > 60;
  const displayText = isExpanded ? text : (isLong ? text.slice(0, 60) + '...' : text);

  return (
    <div
      className={`mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100 transition-all ${isLong ? 'cursor-pointer hover:bg-gray-100' : ''}`}
      onClick={() => isLong && setIsExpanded(!isExpanded)}
    >
      <p className="text-xs text-gray-600 font-medium italic whitespace-normal break-words leading-relaxed">
        "{displayText}"
        {isLong && (
          <span className="text-blue-500 text-[10px] ml-2 font-bold cursor-pointer">
            {isExpanded ? 'Show Less' : 'Read More'}
          </span>
        )}
      </p>
    </div>
  );
};

const ExpandableText = ({ text, prefix, prefixColor = "text-gray-500" }) => {
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

const StaffServices = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [garageFilter, setGarageFilter] = useState('All');
  const [isGarageDropdownOpen, setIsGarageDropdownOpen] = useState(false);
  const [garageSearchText, setGarageSearchText] = useState('');
  const [garageName, setGarageName] = useState('');
  const [allGarages, setAllGarages] = useState([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('');
  const [updateNotes, setUpdateNotes] = useState('');
  const [updateTotalCost, setUpdateTotalCost] = useState('');
  const [updateEstimatedCompletionTime, setUpdateEstimatedCompletionTime] = useState('');
  const [updateServiceImages, setUpdateServiceImages] = useState(''); // Comma separated
  const [updateMechanic, setUpdateMechanic] = useState('');
  const [updatePickupAndDrop, setUpdatePickupAndDrop] = useState(false);
  const [updatePickupAddress, setUpdatePickupAddress] = useState('');
  const [updateDropAddress, setUpdateDropAddress] = useState('');
  const [mechanics, setMechanics] = useState([]);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
    fetchTeam();
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

  async function fetchTeam() {
    try {
      const res = await axios.get('/staff/team');
      if (res.data.success) {
        setMechanics(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchRequests() {
    try {
      setLoading(true);
      const res = await axios.get('/staff/services');
      if (res.data.success) {
        setRequests(res.data.data);
        setGarageName(res.data.garageName || '');
      } else {
        setError('Failed to fetch assigned services');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading services');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (request) => {
    setSelectedRequest(request);

    // Map legacy statuses if any
    let s = request.status;
    if (s === 'Approved') s = 'Accepted';
    if (s === 'Rejected') s = 'Cancelled';
    setUpdateStatus(s);

    setUpdateNotes(request.notes || '');
    setUpdateTotalCost(request.totalCost || '');
    setUpdateEstimatedCompletionTime(request.estimatedCompletionTime ? new Date(request.estimatedCompletionTime).toISOString().slice(0, 16) : '');
    setUpdateServiceImages(request.serviceImages ? request.serviceImages.join(', ') : '');
    setUpdateMechanic(request.assignedStaff?._id || request.assignedStaff || '');
    setUpdatePickupAndDrop(request.pickupAndDrop || false);
    setUpdatePickupAddress(request.pickupAddress || '');
    setUpdateDropAddress(request.dropAddress || '');
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const payload = {
        status: updateStatus,
        notes: updateNotes,
      };

      if (updateTotalCost !== '') payload.totalCost = Number(updateTotalCost);
      if (updateEstimatedCompletionTime) payload.estimatedCompletionTime = updateEstimatedCompletionTime;
      if (updateServiceImages) {
        payload.serviceImages = updateServiceImages.split(',').map(s => s.trim()).filter(s => s);
      }

      payload.pickupAndDrop = updatePickupAndDrop;
      if (updatePickupAndDrop) {
        payload.pickupAddress = updatePickupAddress;
        payload.dropAddress = updateDropAddress;
      } else {
        payload.pickupAddress = '';
        payload.dropAddress = '';
      }

      await axios.put(`/staff/services/${selectedRequest._id}/status`, payload);

      const currentAssigned = selectedRequest.assignedStaff?._id || selectedRequest.assignedStaff || '';
      if (updateMechanic !== currentAssigned) {
        await axios.put(`/staff/services/${selectedRequest._id}/assign`, { mechanicId: updateMechanic || null });
      }

      await fetchRequests();
      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleQuickApprove = async (id) => {
    try {
      const res = await axios.put(`/staff/services/${id}/status`, { status: 'Accepted' });
      if (res.data.success) {
        setRequests(prev => prev.map(r => r._id === id ? { ...r, status: 'Accepted' } : r));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Approving failed.');
    }
  };

  const handleQuickReject = async (id) => {
    try {
      const res = await axios.put(`/staff/services/${id}/status`, { status: 'Cancelled' });
      if (res.data.success) {
        setRequests(prev => prev.map(r => r._id === id ? { ...r, status: 'Cancelled' } : r));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Rejecting failed.');
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = (req.service?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.vehicle?.licensePlate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()));

    let reqStatus = req.status;
    if (reqStatus === 'Approved') reqStatus = 'Accepted';
    if (reqStatus === 'Rejected') reqStatus = 'Cancelled';

    const matchesStatus = statusFilter === 'All' || reqStatus === statusFilter;

    const reqGarageId = req.garage?._id || 'unassigned';
    const matchesGarage = garageFilter === 'All' || reqGarageId === garageFilter;

    return matchesSearch && matchesStatus && matchesGarage;
  });

  const getStatusColor = (status) => {
    let s = status;
    if (s === 'Approved') s = 'Accepted';
    if (s === 'Rejected') s = 'Cancelled';

    switch (s) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Accepted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Waiting for Parts': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Delivered': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const statusSteps = ['Pending', 'Accepted', 'In Progress', 'Waiting for Parts', 'Completed', 'Delivered'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#111827] flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-[#FF3B30]" />
            {garageName ? `${garageName.toUpperCase()} SERVICES` : 'SERVICE REQUESTS'}
          </h1>
          <p className="text-gray-500 font-medium text-sm mt-1">Manage and update tasks in real-time</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-[#FF3B30] text-red-700 text-sm font-bold flex items-center gap-3 rounded-r-xl">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer, vehicle, or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
              placeholder={garageFilter === 'All' ? 'All Garages' : garageFilter === 'unassigned' ? 'Unassigned' : allGarages.find(g => g._id === garageFilter)?.name || 'All Garages'}
              value={isGarageDropdownOpen ? garageSearchText : (garageFilter === 'All' ? 'All Garages' : garageFilter === 'unassigned' ? 'Unassigned' : allGarages.find(g => g._id === garageFilter)?.name || 'All Garages')}
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
                  onMouseDown={(e) => { e.preventDefault(); setGarageFilter('All'); setIsGarageDropdownOpen(false); setGarageSearchText(''); }}
                  className="px-3 py-2 text-xs font-bold text-[#111827] hover:bg-slate-50 rounded-lg cursor-pointer"
                >
                  All Garages
                </div>
                <div 
                  onMouseDown={(e) => { e.preventDefault(); setGarageFilter('unassigned'); setIsGarageDropdownOpen(false); setGarageSearchText(''); }}
                  className="px-3 py-2 text-xs font-bold text-[#111827] hover:bg-slate-50 rounded-lg cursor-pointer"
                >
                  Unassigned
                </div>
                {allGarages.filter(g => g.name.toLowerCase().includes(garageSearchText.toLowerCase())).map(g => (
                  <div 
                    key={g._id}
                    onMouseDown={(e) => { e.preventDefault(); setGarageFilter(g._id); setIsGarageDropdownOpen(false); setGarageSearchText(''); }}
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

      {/* Requests List */}
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
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
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
                {filteredRequests.map((req) => {
                  let displayStatus = req.status;
                  if (displayStatus === 'Approved') displayStatus = 'Accepted';
                  if (displayStatus === 'Rejected') displayStatus = 'Cancelled';

                  const pickupMatch = req.notes?.match(/\[Pick Up Location:\s*(.*?)\]/i);
                  const parsedPickup = pickupMatch ? pickupMatch[1].trim() : req.pickupAddress;

                  const dropMatch = req.notes?.match(/\[Drop Location:\s*(.*?)\]/i);
                  const parsedDrop = dropMatch ? dropMatch[1].trim() : req.dropAddress;

                  const hasPickupOrDrop = parsedPickup || parsedDrop || req.pickupAndDrop;
                  const displayNotes = req.notes ? req.notes.replace(/\[Pick Up Location:.*?\]/gi, '').replace(/\[Drop Location:.*?\]/gi, '').trim() : '';

                  return (
                    <tr key={req._id} className="hover:bg-slate-50/10 transition-colors group">
                      <td className="table-td">
                        {req.user ? (
                          <div>
                            <h4 className="font-bold text-[#111827]">{req.user.name}</h4>
                            <span className="text-[10px] text-slate-500 block mt-0.5">{req.user.phone}</span>
                          </div>
                        ) : (
                          <span className="text-rose-400 italic">User Removed</span>
                        )}
                      </td>

                      <td className="table-td font-semibold text-[#111827]">
                        {req.vehicle ? `${req.vehicle.make} ${req.vehicle.model}` : 'N/A'}
                      </td>

                      <td className="table-td">
                        <div>
                          <h4 className="font-bold text-slate-600">{req.service?.name || <span className="italic">Custom Request</span>}</h4>
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
                        {req.garage ? (
                          <div>
                            <span className="font-bold text-[#111827] block text-xs">{req.garage.name}</span>
                            <span className="text-[9px] text-slate-500 block mt-0.5 leading-snug">{req.garage.location}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic text-xs">Unassigned</span>
                        )}
                        {req.assignedStaff && (
                          <div className="mt-2 text-xs text-indigo-600 font-semibold bg-indigo-50 border border-indigo-100 rounded px-2 py-0.5 inline-block">
                            Staff: {req.assignedStaff.name}
                          </div>
                        )}
                      </td>

                      <td className="table-td text-xs text-slate-600">
                        {new Date(req.bookingDate).toLocaleDateString()} at {req.preferredTime}
                      </td>

                      <td className="table-td font-extrabold text-[#111827]">₹{req.totalCost}</td>

                      <td className="table-td">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(displayStatus)}`}>
                          {displayStatus}
                        </span>
                      </td>

                      <td className="table-td text-right">
                        <div className="flex justify-end items-center gap-2">
                          {displayStatus === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleQuickApprove(req._id)}
                                className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                                title="Approve Booking"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleQuickReject(req._id)}
                                className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors"
                                title="Reject Booking"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleOpenModal(req)}
                            className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-[#111827] border border-slate-300 transition-all font-bold text-xs flex items-center gap-1"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            <span>Manage</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Update Modal */}
      <AnimatePresence>
        {isModalOpen && selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#111827]/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0">
                <h3 className="font-black text-lg text-[#111827]">Update Service Request</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-[#FF3B30] transition-colors">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="overflow-y-auto p-6 flex-1">
                <form id="updateForm" onSubmit={handleUpdateStatus} className="space-y-6">

                  {/* Status Tracker */}
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Live Status Tracker</label>
                    <div className="flex flex-wrap gap-2">
                      {statusSteps.map((step) => {
                        const isActive = updateStatus === step;
                        return (
                          <button
                            key={step}
                            type="button"
                            onClick={() => setUpdateStatus(step)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${isActive
                                ? 'bg-[#111827] text-white border-[#111827]'
                                : 'bg-white text-gray-500 border-gray-200 hover:border-[#111827]'
                              }`}
                          >
                            {step}
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => setUpdateStatus('Cancelled')}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${updateStatus === 'Cancelled'
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                          }`}
                      >
                        Cancelled
                      </button>
                    </div>
                  </div>

                  {/* Assignments & Logistics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Billing Cost (₹)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={updateTotalCost}
                        onChange={(e) => setUpdateTotalCost(e.target.value)}
                        placeholder="0.00"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#111827] outline-none text-sm font-medium"
                      />
                    </div>
                  </div>



                  {/* Notes & Images */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-5 rounded-2xl border border-slate-200/60 shadow-inner">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-widest mb-3">
                      <Pencil className="w-4 h-4 text-[#FF3B30]" />
                      Mechanic Notes / Repair Details
                    </label>
                    <div className="relative">
                      <textarea
                        value={updateNotes}
                        onChange={(e) => setUpdateNotes(e.target.value)}
                        placeholder="Add notes about the service, parts used, etc."
                        rows="4"
                        className="w-full bg-white/80 backdrop-blur-sm border-2 border-slate-200 focus:border-[#FF3B30] focus:ring-4 focus:ring-[#FF3B30]/10 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-400 transition-all duration-300 resize-none font-medium shadow-sm"
                      ></textarea>
                      <div className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-inset ring-black/5"></div>
                    </div>
                  </div>



                </form>
              </div>

              <div className="p-6 border-t border-gray-100 flex-shrink-0 bg-gray-50">
                <button
                  type="submit"
                  form="updateForm"
                  disabled={updateLoading}
                  className="w-full py-3 bg-[#111827] hover:bg-[#FF3B30] text-white rounded-xl font-black uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2 shadow-xl shadow-gray-200"
                >
                  {updateLoading ? 'Saving...' : 'Save Updates'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StaffServices;
