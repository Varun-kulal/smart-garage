import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Plus, Trash2, ShieldAlert, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StaffTeam = () => {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/staff/team');
      if (res.data.success) {
        setMechanics(res.data.data);
      }
    } catch (err) {
      setError('Could not fetch garage team.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm('Are you sure you want to remove this mechanic from your garage?')) return;
    try {
      const res = await axios.delete(`/staff/team/${id}`);
      if (res.data.success) {
        setMechanics(mechanics.filter(m => m._id !== id));
        setSuccess('Mechanic removed successfully.');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error removing mechanic.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');
    
    try {
      const res = await axios.post('/staff/team', { name, email, phone, password });
      if (res.data.success) {
        setMechanics([...mechanics, res.data.data]);
        setSuccess('Mechanic added successfully.');
        setIsModalOpen(false);
        setName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding mechanic.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#111827] flex items-center gap-2">
            <Users className="w-6 h-6 text-[#FF3B30]" />
            GARAGE TEAM
          </h1>
          <p className="text-gray-500 font-medium text-sm mt-1">Manage your mechanics and staff assignments</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 py-2.5 px-5 bg-[#111827] hover:bg-[#FF3B30] text-white rounded-xl font-bold transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Mechanic
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-[#FF3B30] text-red-700 text-sm font-bold flex items-center gap-3 rounded-r-xl">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm font-bold flex items-center gap-3 rounded-r-xl">
          <Check className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#111827]"></div>
        </div>
      ) : mechanics.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-black text-[#111827] mb-2">No Mechanics Found</h3>
          <p className="text-gray-500 font-medium max-w-md mx-auto">You have not added any mechanics to your garage team yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-black text-gray-500 uppercase tracking-widest">
                  <th className="px-6 py-4">Mechanic Name</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mechanics.map((mechanic) => (
                  <tr key={mechanic._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#111827]">{mechanic.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">Role: {mechanic.role.toUpperCase()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-700">{mechanic.email}</div>
                      <div className="text-xs text-gray-500 font-mono mt-0.5">{mechanic.phone || 'No phone'}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleRemove(mechanic._id)}
                        className="p-2 rounded-xl text-gray-400 hover:text-[#FF3B30] hover:bg-red-50 transition-colors"
                        title="Remove Mechanic"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Mechanic Modal */}
      <AnimatePresence>
        {isModalOpen && (
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
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-black text-lg text-[#111827]">Register New Mechanic</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-[#FF3B30] transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleAdd} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#111827] outline-none text-sm"
                    placeholder="John Mechanic"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#111827] outline-none text-sm"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#111827] outline-none text-sm"
                    placeholder="1234567890"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Initial Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#111827] outline-none text-sm"
                    placeholder="••••••••"
                  />
                </div>

                <div className="pt-4 mt-6 border-t border-gray-100 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-bold transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="flex-1 py-3 bg-[#111827] hover:bg-[#FF3B30] text-white rounded-xl font-black uppercase tracking-widest text-xs transition-colors flex items-center justify-center"
                  >
                    {submitLoading ? 'Registering...' : 'Register Mechanic'}
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

export default StaffTeam;
