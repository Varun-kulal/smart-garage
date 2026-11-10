import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Download, Printer, Eye, X, Calendar, Wrench, ShieldCheck, IndianRupee, AlertTriangle, FileText } from 'lucide-react';

const ServiceHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Selected Invoice Modal State
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/services/bookings/my');
      if (res.data.success) {
        const completedOnly = res.data.data.filter(b => b.status === 'Completed' || b.status === 'Delivered');
        setHistory(completedOnly);
      }
    } catch (err) {
      setError('Could not retrieve service history.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Delivered':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Pending':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 font-sans">
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
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-[#111827] tracking-tight flex items-center gap-3">
            <History className="w-8 h-8 text-[#FF3B30]" />
            Service Records
          </h2>
          <p className="text-gray-500 font-medium mt-2">View past appointments, repair logs, and access digital invoices.</p>
        </div>
      </div>

      {/* History panel */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF3B30]"></div>
          </div>
        ) : history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-gray-50/50"
          >
            <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
              <Wrench className="w-10 h-10 text-gray-300" />
            </div>
            <h4 className="text-xl font-black text-[#111827] tracking-tight">No Services Logged</h4>
            <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto font-medium leading-relaxed">
              Your appointment history will be listed here once services are booked and completed.
            </p>
          </motion.div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Service Rendered</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Vehicle</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Appointment Date</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Invoice Cost</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.map((h) => (
                  <tr key={h._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div>
                        <h4 className="font-bold text-[#111827] text-sm group-hover:text-[#FF3B30] transition-colors">{h.service?.name || 'General Maintenance'}</h4>
                        <p className="text-[11px] text-gray-500 truncate max-w-[200px] mt-0.5">{h.service?.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#111827] text-sm">{h.vehicle?.make} {h.vehicle?.model}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(h.bookingDate).toLocaleDateString()} at {h.preferredTime}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1 font-black text-[#111827]">
                        <IndianRupee className="w-4 h-4" />
                        {Math.round(h.totalCost).toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border inline-block ${getStatusBadge(h.status)}`}>
                        {h.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      {h.status === 'Completed' || h.status === 'Delivered' ? (
                        <button
                          onClick={() => setSelectedInvoice(h)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#111827] hover:bg-[#111827] hover:text-white text-[#111827] font-black uppercase tracking-widest rounded-xl text-[10px] transition-all duration-300 shadow-sm"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedInvoice(h)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 hover:border-gray-300 text-[#111827] font-black uppercase tracking-widest rounded-xl text-[10px] transition-all duration-300"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Report Print Modal */}
      <AnimatePresence>
        {selectedInvoice && (
          <div className="fixed inset-0 bg-[#111827]/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto print:bg-white print:p-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden print:w-full print:shadow-none print:border-none print:rounded-none my-8 print:my-0"
            >

              {/* Modal Header controls (hidden on print) */}
              <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 print:hidden">
                <h3 className="font-black text-[#111827] text-lg flex items-center gap-3 tracking-tight">
                  <FileText className="w-5 h-5 text-[#FF3B30]" />
                  <span>Work Report & Receipt</span>
                </h3>
                <div className="flex gap-3">
                  <button
                    onClick={handlePrint}
                    className="bg-[#111827] hover:bg-[#FF3B30] text-white font-black uppercase tracking-widest px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all duration-300 shadow-md"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print</span>
                  </button>
                  <button
                    onClick={() => setSelectedInvoice(null)}
                    className="text-gray-400 hover:text-[#111827] p-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Print Area Content */}
              <div className="p-10 space-y-8 print:p-8" id="print-area">

                {/* Header Invoice Meta */}
                <div className="flex justify-between items-start border-b-2 border-gray-100 pb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#FF3B30] rounded-2xl flex items-center justify-center transform -rotate-6">
                      <Wrench className="w-8 h-8 text-white transform rotate-6" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-black tracking-tighter text-[#111827] uppercase">SMART GARAGE</h1>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Autonomous Diagnostics & Repairs</p>
                      <p className="text-xs text-gray-400 mt-1">128 Tech Park Road, Sector V</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-gray-100 text-[#111827] px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest mb-4">
                      {selectedInvoice.status}
                    </span>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Invoice Code</p>
                    <p className="text-sm font-mono font-bold text-[#111827] mb-2">{selectedInvoice._id.toUpperCase().slice(-8)}</p>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Issue Date</p>
                    <p className="text-xs font-bold text-[#111827]">{new Date(selectedInvoice.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Customer and Vehicle information */}
                <div className="grid grid-cols-2 gap-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <div>
                    <h4 className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2">Billing Customer</h4>
                    <p className="font-black text-lg text-[#111827]">Alex Mercer</p>
                    <p className="text-xs text-gray-500 font-medium">Registered Hub User</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2">Vehicle Details</h4>
                    <p className="font-black text-lg text-[#111827]">
                      {selectedInvoice.vehicle?.make} {selectedInvoice.vehicle?.model} <span className="text-gray-400 font-medium text-sm">({selectedInvoice.vehicle?.year})</span>
                    </p>
                    <p className="text-xs text-[#111827] font-mono font-bold mt-1 bg-white inline-block px-2 py-1 rounded border border-gray-200 uppercase tracking-widest">Plate: {selectedInvoice.vehicle?.licensePlate}</p>
                  </div>
                </div>

                {/* Itemized Table */}
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Services Rendered</h4>
                  <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-500">
                          <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Description</th>
                          <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest">Duration</th>
                          <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest">Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-[#111827]">
                        <tr>
                          <td className="px-6 py-6 text-left">
                            <p className="font-black text-base text-[#111827]">{selectedInvoice.service?.name || 'General Repair'}</p>
                            <p className="text-xs text-gray-500 mt-1 font-medium">{selectedInvoice.service?.description}</p>
                          </td>
                          <td className="px-6 py-6 text-center text-sm font-bold text-gray-500">
                            {selectedInvoice.service?.estimatedDuration || '1 hour'}
                          </td>
                          <td className="px-6 py-6 text-right font-black text-lg text-[#111827]">
                            ₹{Math.round(selectedInvoice.service?.basePrice || selectedInvoice.totalCost).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Total Calculation */}
                <div className="flex justify-between items-center border-t-2 border-gray-100 pt-8 mt-8">
                  <div>
                    <p className="text-xs font-bold text-gray-500">Payments collected electronically.</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">Thank you for servicing with Smart Garage Hub!</p>
                  </div>
                  <div className="text-right bg-gray-50 py-4 px-8 rounded-2xl border border-gray-100">
                    <span className="text-[10px] uppercase font-black tracking-widest text-gray-500">Grand Total</span>
                    <h3 className="text-3xl font-black text-[#111827] mt-1 flex items-center justify-end gap-1">
                      <IndianRupee className="w-6 h-6 text-[#FF3B30]" />
                      <span>{Math.round(selectedInvoice.totalCost).toLocaleString('en-IN')}</span>
                    </h3>
                  </div>
                </div>

                {selectedInvoice.notes && (
                  <div className="border-t border-gray-100 pt-6 mt-6">
                    <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 block mb-2">Service Notes</span>
                    <p className="text-sm text-gray-600 font-medium bg-gray-50 p-4 rounded-xl border border-gray-100">{selectedInvoice.notes}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServiceHistory;
