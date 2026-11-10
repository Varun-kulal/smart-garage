import React from 'react';
import SOSManagementPanel from '../../components/SOSManagementPanel';
import { ShieldAlert } from 'lucide-react';

const StaffEmergencies = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-[#111827] flex items-center gap-2">
            <ShieldAlert className="w-8 h-8 text-red-600" />
            Emergency SOS Requests
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage and dispatch tow trucks for emergencies in your garage.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl space-y-6">
        <SOSManagementPanel />
      </div>
    </div>
  );
};

export default StaffEmergencies;
