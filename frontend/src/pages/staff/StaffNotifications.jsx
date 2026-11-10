import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BellRing, Send, User, Check, X, ShieldAlert } from 'lucide-react';

const StaffNotifications = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [targetType, setTargetType] = useState('broadcast'); // 'broadcast' or 'targeted'
  const [selectedUser, setSelectedUser] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('Info'); // 'Info', 'Warning', 'Reminder', 'Alert'
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/users');
      if (res.data.success) {
        setUsers(res.data.data);
        if (res.data.data.length > 0) {
          setSelectedUser(res.data.data[0]._id);
        }
      }
    } catch (err) {
      setError('Could not retrieve user log to select targets.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSending(true);

    const payload = {
      title,
      message,
      type,
      userId: targetType === 'targeted' ? selectedUser : null // null = broadcast
    };

    try {
      const res = await axios.post('/notifications', payload);
      if (res.data.success) {
        setSuccess(`Notification sent successfully ${targetType === 'broadcast' ? 'to all users' : 'to targeted customer'}!`);
        setTitle('');
        setMessage('');
        setTimeout(() => setSuccess(''), 4000);
      }
    } catch (err) {
      setError('Failed to dispatch notification.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
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

      {/* Form Panel */}
      <div className="glass-panel rounded-xl p-8 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
          <div className="p-2.5 rounded-lg bg-neon-purple/15 text-[#111827] border border-neon-purple/20">
            <BellRing className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-[#111827] text-lg">Dispatch Center</h3>
            <p className="text-xs text-slate-500">Broadcast announcements or send targeted service reminders to customer accounts</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#111827]"></div>
          </div>
        ) : (
          <form onSubmit={handleSendNotification} className="space-y-5">
            {/* Target select */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Target Group
                </label>
                <div className="flex bg-white p-1 border border-slate-200 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setTargetType('broadcast')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded transition-all ${
                      targetType === 'broadcast' ? 'bg-slate-100 text-[#111827]' : 'text-slate-500 hover:text-slate-200'
                    }`}
                  >
                    Broadcast All
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetType('targeted')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded transition-all ${
                      targetType === 'targeted' ? 'bg-slate-100 text-[#111827]' : 'text-slate-500 hover:text-slate-200'
                    }`}
                  >
                    Targeted User
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Alert Severity / Category
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="input-field cursor-pointer bg-slate-50"
                >
                  <option value="Info">Information (Info)</option>
                  <option value="Warning">Warning Notice (Warning)</option>
                  <option value="Reminder">Maintenance Check (Reminder)</option>
                  <option value="Alert">Urgent Attention (Alert)</option>
                </select>
              </div>
            </div>

            {/* Targeted User select dropdown */}
            {targetType === 'targeted' && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Select Target Customer
                </label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="input-field cursor-pointer bg-slate-50"
                >
                  {users.map(u => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Notification Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Notification Headline
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Schedule Maintenance Check"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Notification Message */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Notification Message Details
              </label>
              <textarea
                rows={4}
                required
                placeholder="Write message details for the user's bell alerts center..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="input-field resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-xs font-bold mt-2"
            >
              <Send className="w-4 h-4" />
              <span>{sending ? 'Sending alert...' : 'Dispatch Notification'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default StaffNotifications;
