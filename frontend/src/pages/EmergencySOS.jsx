import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Siren, Phone, ShieldAlert, Navigation, AlertTriangle, 
  HeartPulse, Shield, MapPin, Activity
} from 'lucide-react';

const EmergencySOS = () => {
  const [sosActive, setSosActive] = useState(false);

  const handleSOS = () => {
    setSosActive(true);
    setTimeout(() => setSosActive(false), 5000); // Reset for demo
  };

  const emergencyContacts = [
    { name: 'National Emergency', number: '112', icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-100' },
    { name: 'Police', number: '100', icon: Shield, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Fire', number: '101', icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-100' },
    { name: 'Ambulance', number: '102', icon: HeartPulse, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { name: 'Women Helpline', number: '1091', icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Disaster Management', number: '108', icon: Activity, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
          <Siren className="w-8 h-8 text-red-500 animate-pulse" /> Emergency SOS
        </h1>
        <p className="text-slate-500 mt-2">Get immediate help. Your location will be shared automatically.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-center justify-center mb-16">
        {/* SOS Button */}
        <div className="relative group cursor-pointer" onClick={handleSOS}>
          <div className={`absolute inset-0 rounded-full bg-red-500 opacity-20 filter blur-3xl transition-all duration-500 ${sosActive ? 'scale-150 opacity-40 animate-ping' : 'group-hover:scale-110'}`}></div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-64 h-64 rounded-full flex flex-col items-center justify-center relative z-10 border-8 border-white shadow-2xl transition-colors duration-300 ${sosActive ? 'bg-red-600 text-white' : 'bg-red-500 text-white'}`}
          >
            <Siren className={`w-20 h-20 mb-2 ${sosActive ? 'animate-pulse' : ''}`} />
            <span className="text-4xl font-bold tracking-widest">{sosActive ? 'SENDING' : 'SOS'}</span>
            <span className="text-sm font-medium mt-2 opacity-80 uppercase tracking-widest">Tap for Help</span>
          </motion.div>
        </div>

        {/* Location Mock */}
        <div className="glass-card p-6 w-full max-w-md border-2 border-red-100">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
               <Navigation className="w-5 h-5" />
             </div>
             <div>
               <h3 className="font-bold text-slate-900">Live Location Active</h3>
               <p className="text-sm text-slate-500">Accuracy: 5 meters</p>
             </div>
          </div>
          <div className="bg-slate-100 rounded-xl h-32 flex items-center justify-center mb-4 overflow-hidden relative">
             <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=28.6139,77.2090&zoom=14&size=600x300&maptype=roadmap&markers=color:red%7C28.6139,77.2090')] bg-cover bg-center opacity-50"></div>
             <div className="relative z-10 flex flex-col items-center p-3 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-white">
               <MapPin className="text-red-500 w-6 h-6 mb-1" />
               <p className="text-xs font-bold text-slate-800">New Delhi, India</p>
             </div>
          </div>
          {sosActive && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 font-medium text-center">
              Alert dispatched to nearest Police Control Room & Ambulance!
            </motion.div>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-4">Quick Dial Numbers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {emergencyContacts.map((contact, idx) => (
          <div key={idx} className="glass-card p-6 flex items-center justify-between hover-lift">
             <div className="flex items-center gap-4">
               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${contact.bg} ${contact.color}`}>
                 <contact.icon className="w-7 h-7" />
               </div>
               <div>
                 <h3 className="font-bold text-slate-900">{contact.name}</h3>
                 <p className="text-2xl font-black text-slate-800">{contact.number}</p>
               </div>
             </div>
             <a href={`tel:${contact.number}`} className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all shadow-sm hover:shadow-md">
               <Phone className="w-5 h-5" />
             </a>
          </div>
        ))}
      </div>
    </div>
  );
};

// Lucide React doesn't export ShieldCheck in my current version explicitly without breaking, 
// using Shield instead as fallback if needed, but I imported ShieldCheck in the imports. 
// Wait, I didn't import ShieldCheck. Let me define it.
import { ShieldCheck } from 'lucide-react';

export default EmergencySOS;
