import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Plus, Edit2, Trash2, Search, X, Check, ShieldAlert } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Form Modals state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [garages, setGarages] = useState([]);
  const [assignedGarage, setAssignedGarage] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchGarages();
  }, []);

  const fetchGarages = async () => {
    try {
      const res = await axios.get('/garages');
      if (res.data.success) {
        setGarages(res.data.data);
      }
    } catch (err) {
      console.error('Could not fetch garages');
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      setError('Could not retrieve customer logs.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setRole('user');
    setAssignedGarage('');
    setShowModal(true);
  };

  const handleOpenEdit = (u) => {
    setEditingId(u._id);
    setName(u.name);
    setEmail(u.email);
    setPhone(u.phone || '');
    setPassword(''); // Leave blank if not updating password in this modal
    setRole(u.role || 'user');
    setAssignedGarage(u.assignedGarage?._id || u.assignedGarage || '');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('WARNING: Removing this user deletes all vehicles and booking history associated with them! Proceed?')) {
      return;
    }

    try {
      const res = await axios.delete(`/users/${id}`);
      if (res.data.success) {
        setSuccess('Customer account deleted.');
        setUsers(prev => prev.filter(u => u._id !== id));
        setTimeout(() => setSuccess(''), 3500);
      }
    } catch (err) {
      setError('Deletion aborted by server error.');
      setTimeout(() => setError(''), 3500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const payload = { name, email, phone };
    
    if (role === 'staff') {
      payload.assignedGarage = assignedGarage;
    } else {
      payload.assignedGarage = null;
    }

    if (!editingId) {
      payload.password = password; // Only required for new registrations
      payload.role = role;
    }

    try {
      if (editingId) {
        // Edit flow
        const res = await axios.put(`/users/${editingId}`, payload);
        if (res.data.success) {
          setSuccess('Customer record updated.');
          setUsers(prev => prev.map(u => u._id === editingId ? res.data.data : u));
        }
      } else {
        // Create flow
        const res = await axios.post('/users', payload);
        if (res.data.success) {
          setSuccess('Customer record registered successfully!');
          setUsers(prev => [res.data.data, ...prev]);
        }
      }
      setShowModal(false);
      setTimeout(() => setSuccess(''), 3500);
    } catch (err) {
      setError(err.response?.data?.message || 'Transaction aborted.');
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.phone?.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Alert panels */}
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

      {/* Control panel header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search users by name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10 py-2.5 text-xs"
          />
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-primary flex items-center gap-2 text-xs font-bold py-2.5 px-4 self-stretch sm:self-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>Register Customer</span>
        </button>
      </div>

      {/* Main Customers table log */}
      <div className="glass-panel rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#111827]"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 font-bold">No Customers Found</p>
            <p className="text-xs text-slate-500 mt-1">Try modifying your search queries.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-th">Customer Name</th>
                  <th className="table-th">Email Account</th>
                  <th className="table-th">Role</th>
                  <th className="table-th">Phone Number</th>
                  <th className="table-th">Registered Since</th>
                  <th className="table-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/10">
                    <td className="table-td font-bold text-[#111827]">{u.name}</td>
                    <td className="table-td">{u.email}</td>
                    <td className="table-td">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        u.role === 'staff' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {u.role || 'user'}
                      </span>
                    </td>
                    <td className="table-td font-mono">{u.phone || 'N/A'}</td>
                    <td className="table-td">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="table-td text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(u)}
                          className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-350 hover:text-[#111827] transition-colors"
                          title="Edit Customer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(u._id)}
                          className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-350 hover:text-red-600 transition-colors"
                          title="Delete Customer"
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

      {/* Form Modal dialog */}
      {showModal && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-[#111827]">{editingId ? 'Edit Customer Details' : 'Register Customer Account'}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-500 hover:text-[#111827] p-1 rounded-lg bg-slate-100/50 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field"
                />
              </div>

              {!editingId && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="input-field"
                    >
                      <option value="user">Customer (User)</option>
                      <option value="staff">Garage Staff (Mechanic)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Initial Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field"
                    />
                  </div>
                </>
              )}

              {role === 'staff' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Assigned Garage
                  </label>
                  <select
                    value={assignedGarage}
                    onChange={(e) => setAssignedGarage(e.target.value)}
                    required
                    className="input-field"
                  >
                    <option value="">-- Select Garage --</option>
                    {garages.map(g => (
                      <option key={g._id} value={g._id}>{g.name} - {g.location}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary py-2 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2 text-xs font-bold"
                >
                  {editingId ? 'Save Changes' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
