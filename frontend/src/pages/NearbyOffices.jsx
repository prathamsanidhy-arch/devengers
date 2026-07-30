import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Clock, Phone, Building2, Search, UploadCloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NearbyOffices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const offices = [
    { id: 1, name: 'Central Police Station', type: 'Law Enforcement', distance: '1.2 km', time: 'Open 24/7', phone: '100', color: 'bg-blue-100 text-blue-600 border-blue-200' },
    { id: 2, name: 'Municipal Corporation Head Office', type: 'Civic Administration', distance: '3.4 km', time: '09:00 AM - 05:00 PM', phone: '1800-11-2233', color: 'bg-emerald-100 text-emerald-600 border-emerald-200' },
    { id: 3, name: 'Regional Transport Office (RTO)', type: 'Transport', distance: '5.1 km', time: '10:00 AM - 04:00 PM', phone: '011-2334455', color: 'bg-orange-100 text-orange-600 border-orange-200' },
    { id: 4, name: 'Passport Seva Kendra', type: 'Identity', distance: '6.8 km', time: '09:30 AM - 04:30 PM', phone: '1800-258-1800', color: 'bg-purple-100 text-purple-600 border-purple-200' },
    { id: 5, name: 'Aadhaar Enrollment Center', type: 'Identity', distance: '0.8 km', time: '10:00 AM - 06:00 PM', phone: '1947', color: 'bg-amber-100 text-amber-600 border-amber-200' },
    { id: 6, name: 'District Hospital', type: 'Healthcare', distance: '2.5 km', time: 'Open 24/7', phone: '108', color: 'bg-red-100 text-red-600 border-red-200' },
  ];

  const filteredOffices = offices.filter(o => o.name.toLowerCase().includes(searchTerm.toLowerCase()) || o.type.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="w-16 h-16 bg-gradient-brand rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg shadow-brand-500/30 text-white">
          <MapPin className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Nearby Government Offices</h1>
        <p className="text-slate-500">Find official centers, get directions, and check operating hours in your locality.</p>
        
        <div className="relative mt-8 max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or category..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOffices.map((office, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
            key={office.id} className="glass-card p-6 flex flex-col h-full group hover:shadow-xl hover:border-brand-300 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${office.color}`}>
                {office.type}
              </span>
              <div className="flex items-center gap-1 text-sm font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-lg">
                <Navigation className="w-4 h-4 text-brand-600" /> {office.distance}
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-brand-600 transition-colors flex items-start gap-2">
              <Building2 className="w-5 h-5 mt-1 flex-shrink-0" /> {office.name}
            </h3>
            
            <div className="space-y-3 mb-6 flex-1">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Clock className="w-4 h-4 text-slate-400" /> {office.time}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" /> {office.phone}
              </div>
            </div>
            
            <div className="flex flex-col gap-3 mt-auto">
               <div className="flex gap-3">
                 <button className="flex-1 bg-brand-50 hover:bg-brand-100 text-brand-700 py-2.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                   <MapPin className="w-4 h-4" /> View Map
                 </button>
                 <button className="flex-1 bg-brand-600 hover:bg-brand-500 text-white py-2.5 rounded-xl font-semibold shadow-md transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
                   <Navigation className="w-4 h-4" /> Directions
                 </button>
               </div>
               <button onClick={() => navigate('/vault')} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-sm border border-slate-200">
                 <UploadCloud className="w-4 h-4" /> Upload Docs for Visit
               </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NearbyOffices;
