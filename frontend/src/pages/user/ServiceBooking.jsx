import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays,
  Car,
  Wrench,
  Clock,
  FileText,
  HelpCircle,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  ClipboardList
} from 'lucide-react';

const ServiceBooking = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Form State
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('09:00 AM');
  const [notes, setNotes] = useState('');
  
  const [pickupAndDrop, setPickupAndDrop] = useState(false);
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropAddress, setDropAddress] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  useEffect(() => {
    fetchFormDetails();
  }, []);

  const fetchFormDetails = async () => {
    try {
      setLoading(true);
      const [vehRes, servRes, bookRes] = await Promise.all([
        axios.get('/vehicles/my'),
        axios.get('/services'),
        axios.get('/services/bookings/my')
      ]);

      if (vehRes.data.success) {
        setVehicles(vehRes.data.data);
        if (vehRes.data.data.length > 0) {
          setSelectedVehicle(vehRes.data.data[0]._id);
        }
      }

      if (servRes.data.success) {
        setServices(servRes.data.data);
        if (servRes.data.data.length > 0) {
          setSelectedService(servRes.data.data[0]._id);
        }
      }

      if (bookRes.data.success) {
        // filter active ones
        setActiveBookings(
          bookRes.data.data.filter(b => ['Pending', 'Approved', 'In Progress'].includes(b.status))
        );
      }
    } catch (err) {
      setError('Could not load appointment setup data.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVehicle) {
      setError('You must register and select a vehicle first.');
      return;
    }
    if (!selectedService) {
      setError('Please select a service type.');
      return;
    }

    setBookingLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await axios.post('/services/bookings', {
        vehicleId: selectedVehicle,
        serviceId: selectedService,
        bookingDate,
        preferredTime,
        notes,
        pickupAndDrop,
        pickupAddress: pickupAndDrop ? pickupAddress : '',
        dropAddress: pickupAndDrop ? dropAddress : ''
      });

      if (res.data.success) {
        setSuccess('Appointment request submitted successfully!');
        setNotes('');
        fetchFormDetails(); // refresh active list
        setTimeout(() => setSuccess(''), 3500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit booking.');
    } finally {
      setBookingLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Approved': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'In Progress': return 'bg-[#111827] text-white border-[#111827]';
      case 'Completed': return 'bg-green-50 text-green-700 border-green-200';
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStepIndex = (status) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Approved': return 1;
      case 'In Progress': return 2;
      case 'Completed': return 3;
      default: return 0;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF3B30]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-[#111827] tracking-tight flex items-center gap-3">
            <CalendarDays className="w-8 h-8 text-[#FF3B30]" />
            Schedule Service
          </h2>
          <p className="text-gray-500 font-medium mt-2">Book an appointment for your vehicle and track service progress in real-time.</p>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-50 border-l-4 border-[#FF3B30] text-red-700 text-sm font-bold flex items-center gap-3 rounded-r-xl"
          >
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-[#FF3B30]" />
            <span>{error}</span>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm font-bold flex items-center gap-3 rounded-r-xl"
          >
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>{success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">

        {/* Booking Form Card */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm relative overflow-hidden">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -mr-16 -mt-16 z-0"></div>

            <div className="flex items-center gap-3 mb-8 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#111827]" />
              </div>
              <h3 className="font-black text-xl text-[#111827] tracking-tight">Booking Form</h3>
            </div>

            {vehicles.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 relative z-10">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-200">
                  <Car className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-black text-[#111827]">No vehicles registered</h4>
                <p className="text-sm text-gray-500 mt-2 mb-6 max-w-[200px] mx-auto font-medium">You need to register a vehicle before scheduling repair jobs.</p>
                <Link to="/user/vehicles" className="inline-block px-6 py-3 bg-[#111827] text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-[#FF3B30] transition-colors shadow-lg shadow-gray-200">
                  Add Vehicle
                </Link>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-6 relative z-10">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                    Select Vehicle
                  </label>
                  <select
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:bg-white focus:border-[#FF3B30] focus:ring-4 focus:ring-[#FF3B30]/10 outline-none transition-all font-bold text-[#111827] cursor-pointer appearance-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                  >
                    {vehicles.map(v => (
                      <option key={v._id} value={v._id}>
                        {v.make} {v.model} ({v.licensePlate})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                    Select Service Category
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:bg-white focus:border-[#FF3B30] focus:ring-4 focus:ring-[#FF3B30]/10 outline-none transition-all font-bold text-[#111827] cursor-pointer appearance-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                  >
                    {services.map(s => (
                      <option key={s._id} value={s._id}>
                        {s.name} - ₹{Math.round(s.basePrice).toLocaleString('en-IN')}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                      Target Date
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:bg-white focus:border-[#FF3B30] focus:ring-4 focus:ring-[#FF3B30]/10 outline-none transition-all font-bold text-[#111827]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                      Time Slot
                    </label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:bg-white focus:border-[#FF3B30] focus:ring-4 focus:ring-[#FF3B30]/10 outline-none transition-all font-bold text-[#111827] cursor-pointer appearance-none"
                      style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                    >
                      {timeSlots.map(ts => (
                        <option key={ts} value={ts}>{ts}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                    Symptoms / Diagnostic Notes
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe any squeaks, warning lights, or custom instructions..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:bg-white focus:border-[#FF3B30] focus:ring-4 focus:ring-[#FF3B30]/10 outline-none transition-all font-medium text-[#111827] resize-none placeholder-gray-300"
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <label className="flex items-center gap-3 cursor-pointer mb-4">
                    <input
                      type="checkbox"
                      checked={pickupAndDrop}
                      onChange={(e) => setPickupAndDrop(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-[#FF3B30] focus:ring-[#FF3B30]"
                    />
                    <span className="font-bold text-[#111827] text-sm">Opt for Pickup & Drop (Additional Charges may apply)</span>
                  </label>
                  
                  {pickupAndDrop && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                          Pickup Address
                        </label>
                        <textarea
                          rows={2}
                          required={pickupAndDrop}
                          placeholder="Full address for vehicle pickup..."
                          value={pickupAddress}
                          onChange={(e) => setPickupAddress(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:bg-white focus:border-[#FF3B30] focus:ring-4 focus:ring-[#FF3B30]/10 outline-none transition-all font-medium text-[#111827] resize-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                          Drop Address
                        </label>
                        <textarea
                          rows={2}
                          required={pickupAndDrop}
                          placeholder="Full address for vehicle drop-off..."
                          value={dropAddress}
                          onChange={(e) => setDropAddress(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:bg-white focus:border-[#FF3B30] focus:ring-4 focus:ring-[#FF3B30]/10 outline-none transition-all font-medium text-[#111827] resize-none text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full py-4 bg-[#111827] hover:bg-[#FF3B30] text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all duration-300 shadow-xl shadow-gray-200 mt-4"
                >
                  {bookingLoading ? 'Requesting booking slot...' : 'Submit Appointment'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Tracking Outlet Column */}
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm h-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[#111827] flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-black text-xl text-[#111827] tracking-tight">Active Trackers</h3>
            </div>

            {activeBookings.length === 0 ? (
              <div className="text-center py-24 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                  <Wrench className="w-10 h-10 text-gray-300" />
                </div>
                <h4 className="text-lg font-black text-[#111827]">No Active Service Trackers</h4>
                <p className="text-sm text-gray-500 mt-2 max-w-[250px] mx-auto font-medium">
                  When you submit service bookings, they will appear here with active stages.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {activeBookings.map((b) => {
                  const currentStep = getStepIndex(b.status);
                  const steps = ['Pending', 'Scheduled', 'In Progress', 'Completed'];

                  return (
                    <motion.div
                      key={b._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div>
                          <span className="text-[10px] text-[#FF3B30] uppercase font-black tracking-widest bg-red-50 px-2 py-1 rounded">Scheduled Service</span>
                          <h4 className="text-xl font-black text-[#111827] mt-2 tracking-tight">{b.service?.name}</h4>
                          <p className="text-sm text-gray-500 mt-1 font-medium flex items-center gap-2">
                            <Car className="w-4 h-4" />
                            <strong className="text-[#111827]">{b.vehicle?.make} {b.vehicle?.model}</strong>
                          </p>
                          <p className="text-xs text-gray-500 mt-1 font-bold uppercase tracking-widest flex items-center gap-2">
                            <CalendarDays className="w-3.5 h-3.5" />
                            {new Date(b.bookingDate).toLocaleDateString()} at {b.preferredTime}
                          </p>
                        </div>
                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusColor(b.status)}`}>
                          {b.status}
                        </span>
                      </div>

                      {/* Tracker Visual */}
                      <div className="relative pt-10 pb-4 mt-6 border-t border-gray-100">
                        {/* Progress Line background */}
                        <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gray-100 -translate-y-1/2 z-0 rounded-full mt-3"></div>

                        {/* Progress Line active */}
                        <div
                          className="absolute top-1/2 left-0 h-1.5 bg-[#FF3B30] -translate-y-1/2 z-0 rounded-full transition-all duration-700 ease-out mt-3"
                          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                        ></div>

                        {/* Step circles */}
                        <div className="flex justify-between relative z-10">
                          {steps.map((step, idx) => {
                            const isDone = idx <= currentStep;
                            const isCurrent = idx === currentStep;
                            return (
                              <div key={step} className="flex flex-col items-center">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${isDone
                                    ? 'bg-white border-[#FF3B30] shadow-[0_0_10px_rgba(255,59,48,0.3)]'
                                    : 'bg-white border-gray-200'
                                  }`}>
                                  {isDone && <div className="w-2.5 h-2.5 rounded-full bg-[#FF3B30]"></div>}
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest mt-3 text-center max-w-[80px] ${isCurrent ? 'text-[#111827]' : isDone ? 'text-gray-500' : 'text-gray-300'
                                  }`}>
                                  {step}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {b.notes && (
                        <div className="mt-6 bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-600 font-medium">
                          <span className="font-black text-[#111827] text-xs uppercase tracking-widest block mb-1">Notes</span>
                          {b.notes}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceBooking;
