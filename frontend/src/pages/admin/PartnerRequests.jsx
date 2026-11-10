import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Building2, User, Search, CheckCircle2, XCircle, Clock, Trash2, Check, X, ShieldAlert } from 'lucide-react';

const PartnerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/partners');
      if (res.data.success) {
        setRequests(res.data.data);
      }
    } catch (err) {
      setError('Failed to fetch partner requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await axios.put(`/partners/${id}/status`, { status });
      if (res.data.success) {
        setSuccess(`Request ${status.toLowerCase()} successfully!`);
        setRequests(requests.map(r => r._id === id ? { ...r, status } : r));
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update request.');
      setTimeout(() => setError(''), 4000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this request permanently?')) return;
    try {
      const res = await axios.delete(`/partners/${id}`);
      if (res.data.success) {
        setSuccess('Request deleted successfully.');
        setRequests(requests.filter(r => r._id !== id));
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete request.');
      setTimeout(() => setError(''), 4000);
    }
  };

  const filteredRequests = requests.filter(r => 
    r.garageName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Approved':
        return <span className="px-3 py-1 rounded bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-max"><CheckCircle2 className="w-3 h-3" /> Approved</span>;
      case 'Rejected':
        return <span className="px-3 py-1 rounded bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-max"><XCircle className="w-3 h-3" /> Rejected</span>;
      default:
        return <span className="px-3 py-1 rounded bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-max"><Clock className="w-3 h-3" /> Pending</span>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl space-y-6">
      <div className="flex items-center justify-between pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-[#111827]">Partner Requests</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Review contact submissions from garage businesses.</p>
        </div>
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
          placeholder="Search by owner or garage name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF3B30] focus:ring-4 focus:ring-[#FF3B30]/10 outline-none text-sm font-bold transition-all"
        />
      </div>

      {loading ? (
        <div className="p-12 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#111827]"></div>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center">
          <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-bold">No partner requests found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRequests.map((req) => (
            <div key={req._id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-black text-xl text-[#111827] flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    {req.garageName}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mt-1">
                    <User className="w-4 h-4" /> {req.ownerName}
                  </div>
                </div>
                {getStatusBadge(req.status)}
              </div>

              <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold text-gray-700">{req.location}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold text-gray-700">{req.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold text-gray-700">{req.email}</span>
                </div>
              </div>

              {req.message && (
                <div className="mb-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Message</span>
                  <p className="text-sm text-gray-600 bg-white border border-gray-200 p-3 rounded-lg">{req.message}</p>
                </div>
              )}

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                {req.status === 'Pending' && (
                  <>
                    <button 
                      onClick={() => handleUpdateStatus(req._id, 'Approved')}
                      className="flex-1 py-2 bg-[#111827] text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-green-600 transition-colors shadow-md flex justify-center items-center gap-2"
                    >
                      <Check className="w-4 h-4" /> Approve
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(req._id, 'Rejected')}
                      className="flex-1 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex justify-center items-center gap-2"
                    >
                      <X className="w-4 h-4" /> Reject
                    </button>
                  </>
                )}
                <button 
                  onClick={() => handleDelete(req._id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
                  title="Delete Request"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PartnerRequests;
