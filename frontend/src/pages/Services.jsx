import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Shield, CreditCard, Zap, Home, Droplets, Car, 
  HeartPulse, Scale, Search, Filter, Bookmark, ExternalLink
} from 'lucide-react';

const Services = () => {
  const services = [
    { id: 1, title: 'Passport Application', category: 'Identity', icon: Shield, time: '15-30 Days', dept: 'Ministry of External Affairs', color: 'bg-blue-100 text-blue-600' },
    { id: 2, title: 'Driving License', category: 'Transport', icon: Car, time: '7-14 Days', dept: 'RTO / Ministry of Road Transport', color: 'bg-emerald-100 text-emerald-600' },
    { id: 3, title: 'Aadhaar Update', category: 'Identity', icon: Shield, time: '3-5 Days', dept: 'UIDAI', color: 'bg-amber-100 text-amber-600' },
    { id: 4, title: 'PAN Card', category: 'Finance', icon: CreditCard, time: '10-15 Days', dept: 'Income Tax Department', color: 'bg-indigo-100 text-indigo-600' },
    { id: 5, title: 'Electricity Bill', category: 'Utility', icon: Zap, time: 'Instant', dept: 'State Electricity Board', color: 'bg-yellow-100 text-yellow-600' },
    { id: 6, title: 'Water Connection', category: 'Utility', icon: Droplets, time: '10-20 Days', dept: 'Municipal Corporation', color: 'bg-cyan-100 text-cyan-600' },
    { id: 7, title: 'Income Certificate', category: 'Revenue', icon: FileText, time: '7-10 Days', dept: 'Revenue Department', color: 'bg-purple-100 text-purple-600' },
    { id: 8, title: 'Property Tax', category: 'Revenue', icon: Home, time: 'Instant', dept: 'Municipal Corporation', color: 'bg-rose-100 text-rose-600' },
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Citizen Service Hub</h1>
          <p className="text-slate-500 mt-1">Apply for certificates, pay bills, and manage civic documents.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search services..." className="pl-10 pr-4 py-2 w-full rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none" />
          </div>
          <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, idx) => (
          <motion.div 
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass-card p-6 flex flex-col h-full hover-lift group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${service.color}`}>
                <service.icon className="w-6 h-6" />
              </div>
              <button className="text-slate-400 hover:text-brand-500 transition-colors">
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-brand-600 transition-colors">{service.title}</h3>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 block">{service.category}</span>
            
            <div className="space-y-3 mb-6 flex-1">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Processing Time</span>
                <span className="font-medium text-slate-900">{service.time}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Department</span>
                <span className="font-medium text-slate-900 text-right max-w-[60%]">{service.dept}</span>
              </div>
            </div>
            
            <button className="w-full py-2.5 rounded-xl border border-brand-200 text-brand-600 font-medium hover:bg-brand-50 transition-colors flex items-center justify-center gap-2">
              Apply Now <ExternalLink className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Services;
