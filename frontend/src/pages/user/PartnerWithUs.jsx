import React, { useState } from 'react';
import axios from 'axios';
import { Building2, Mail, Phone, MapPin, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';

const PartnerWithUs = () => {
  const [formData, setFormData] = useState({
    ownerName: '',
    garageName: '',
    email: '',
    phone: '',
    location: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // The endpoint is public for submitting partner requests
      const res = await axios.post('/partners', formData);
      if (res.data.success) {
        setSuccess(true);
        setFormData({
          ownerName: '', garageName: '', email: '', phone: '', location: '', message: ''
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center animate-fade-in">
        <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100 max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-black text-[#111827] mb-4">Request Received!</h2>
          <p className="text-gray-600 font-medium mb-8">
            Thank you for your interest in partnering with Smart Garage. Our team will review your application and get in touch with you shortly.
          </p>
          <button 
            onClick={() => setSuccess(false)}
            className="btn-primary"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 animate-fade-in">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-[#111827] mb-4 tracking-tight">Partner With Smart Garage</h1>
        <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">
          Join our network of premium automotive service centers. Grow your business, reach more customers, and digitize your operations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left Side: Info */}
        <div className="space-y-8">
          <div className="bg-[#111827] text-white rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF3B30] rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
            <h3 className="text-2xl font-black mb-6 relative z-10">Why Join Us?</h3>
            <ul className="space-y-6 relative z-10">
              <li className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6 text-[#FF3B30]" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">More Customers</h4>
                  <p className="text-gray-400 text-sm font-medium">Get discovered by thousands of car owners looking for reliable services in your district.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-6 h-6 text-[#FF3B30]" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Digital Operations</h4>
                  <p className="text-gray-400 text-sm font-medium">Receive service bookings directly through our platform, completely digitized.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-black text-[#111827] mb-6">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600 font-medium">
                <Mail className="w-5 h-5 text-[#FF3B30]" />
                smartgarage@gmail.com
              </div>
              <div className="flex items-center gap-3 text-gray-600 font-medium">
                <Phone className="w-5 h-5 text-[#FF3B30]" />
                +91 8000907904
              </div>
              <div className="flex items-center gap-3 text-gray-600 font-medium">
                <MapPin className="w-5 h-5 text-[#FF3B30]" />
                Smart Garage HQ, Mangalore, Karnataka
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-2xl font-black text-[#111827] mb-6">Partnership Application</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-[#FF3B30] text-red-700 text-sm font-bold flex items-center gap-2 rounded-xl">
              <ShieldAlert className="w-5 h-5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Owner's Name</label>
                <input
                  type="text"
                  name="ownerName"
                  required
                  value={formData.ownerName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF3B30] focus:ring-4 focus:ring-[#FF3B30]/10 outline-none text-sm font-bold transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Garage/Business Name</label>
                <input
                  type="text"
                  name="garageName"
                  required
                  value={formData.garageName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF3B30] focus:ring-4 focus:ring-[#FF3B30]/10 outline-none text-sm font-bold transition-all"
                  placeholder="Super Auto Care"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF3B30] focus:ring-4 focus:ring-[#FF3B30]/10 outline-none text-sm font-bold transition-all"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF3B30] focus:ring-4 focus:ring-[#FF3B30]/10 outline-none text-sm font-bold transition-all"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Garage Location / District</label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF3B30] focus:ring-4 focus:ring-[#FF3B30]/10 outline-none text-sm font-bold transition-all"
                placeholder="123 Main St, Indiranagar, Bengaluru"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Additional Information (Optional)</label>
              <textarea
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF3B30] focus:ring-4 focus:ring-[#FF3B30]/10 outline-none text-sm font-medium transition-all resize-none"
                placeholder="Tell us about the services you offer..."
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-[#FF3B30] text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Submit Application'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PartnerWithUs;
