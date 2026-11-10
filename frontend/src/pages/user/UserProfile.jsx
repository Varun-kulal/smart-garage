import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Lock, Save, Camera, ShieldCheck, AlertTriangle } from 'lucide-react';

const UserProfile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  
  // Profile Info Form State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  
  // Password Reset Form State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Notification states
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPwd, setLoadingPwd] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setLoadingProfile(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    if (profileImageFile) {
      formData.append('profileImage', profileImageFile);
    }

    try {
      const res = await updateProfile(formData);
      if (res.success) {
        setProfileSuccess('Profile details saved successfully!');
        setProfileImageFile(null); // Clear active file state
        setTimeout(() => setProfileSuccess(''), 3500);
      } else {
        setProfileError(res.message);
      }
    } catch (err) {
      setProfileError('Failed to save profile changes.');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');

    if (newPassword !== confirmPassword) {
      setPwdError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setPwdError('Password must be at least 6 characters.');
      return;
    }

    setLoadingPwd(true);

    try {
      const res = await changePassword(oldPassword, newPassword);
      if (res.success) {
        setPwdSuccess('Password changed successfully!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPwdSuccess(''), 3500);
      } else {
        setPwdError(res.message);
      }
    } catch (err) {
      setPwdError('Change password request failed.');
    } finally {
      setLoadingPwd(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-[#111827] tracking-tight flex items-center gap-3">
            <User className="w-8 h-8 text-[#FF3B30]" />
            Account Settings
          </h2>
          <p className="text-gray-500 font-medium mt-2">Manage your personal profile, credentials, and notification preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        
        {/* Profile Details Edit Card */}
        <div className="xl:col-span-3">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -mr-16 -mt-16 z-0"></div>
            
            <div className="flex items-center gap-3 mb-8 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <User className="w-5 h-5 text-[#111827]" />
              </div>
              <h3 className="font-black text-xl text-[#111827] tracking-tight">Profile Details</h3>
            </div>

            <AnimatePresence>
              {profileError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 bg-red-50 border-l-4 border-[#FF3B30] text-red-700 text-sm font-bold flex items-center gap-3 rounded-r-xl"
                >
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 text-[#FF3B30]" />
                  <span>{profileError}</span>
                </motion.div>
              )}

              {profileSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm font-bold flex items-center gap-3 rounded-r-xl"
                >
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  <span>{profileSuccess}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleProfileSubmit} className="space-y-6 relative z-10">
              {/* Profile Avatar upload widget */}
              <div className="flex flex-col sm:flex-row items-center gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
                    {profileImagePreview ? (
                      <img src={profileImagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : user?.profileImage ? (
                      <img src={`http://localhost:5001${user.profileImage}`} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 text-gray-300" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 p-2.5 bg-[#111827] hover:bg-[#FF3B30] text-white rounded-full cursor-pointer transition-colors shadow-lg border-2 border-white">
                    <Camera className="w-4 h-4" />
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <h4 className="text-base font-black text-[#111827]">Upload New Avatar</h4>
                  <p className="text-xs text-gray-500 font-medium">Supports PNG, JPG, or WEBP. Square dimension recommended.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:bg-white focus:border-[#FF3B30] focus:ring-4 focus:ring-[#FF3B30]/10 outline-none transition-all font-bold text-[#111827]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                    Email Address <span className="text-gray-300">(Read-only)</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed font-medium"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:bg-white focus:border-[#FF3B30] focus:ring-4 focus:ring-[#FF3B30]/10 outline-none transition-all font-bold text-[#111827]"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loadingProfile}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#111827] hover:bg-[#FF3B30] text-white font-black uppercase tracking-widest px-8 py-4 rounded-xl text-xs transition-all duration-300 shadow-xl shadow-gray-200"
                >
                  <Save className="w-4 h-4" />
                  <span>{loadingProfile ? 'Saving Details...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Password Rotations Form Card */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm h-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <Lock className="w-5 h-5 text-[#FF3B30]" />
              </div>
              <h3 className="font-black text-xl text-[#111827] tracking-tight">Security</h3>
            </div>

            <AnimatePresence>
              {pwdError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 bg-red-50 border-l-4 border-[#FF3B30] text-red-700 text-sm font-bold flex items-center gap-3 rounded-r-xl"
                >
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 text-[#FF3B30]" />
                  <span>{pwdError}</span>
                </motion.div>
              )}

              {pwdSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm font-bold flex items-center gap-3 rounded-r-xl"
                >
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  <span>{pwdSuccess}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:bg-white focus:border-[#FF3B30] focus:ring-4 focus:ring-[#FF3B30]/10 outline-none transition-all font-bold text-[#111827] placeholder-gray-300"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:bg-white focus:border-[#FF3B30] focus:ring-4 focus:ring-[#FF3B30]/10 outline-none transition-all font-bold text-[#111827] placeholder-gray-300"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:bg-white focus:border-[#FF3B30] focus:ring-4 focus:ring-[#FF3B30]/10 outline-none transition-all font-bold text-[#111827] placeholder-gray-300"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loadingPwd}
                  className="w-full py-4 bg-white border-2 border-[#111827] hover:bg-[#111827] hover:text-white text-[#111827] font-black uppercase tracking-widest text-xs rounded-xl transition-all duration-300 shadow-sm"
                >
                  {loadingPwd ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
