import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Newspaper, Share2, Bookmark, ExternalLink } from 'lucide-react';

const NewsCenter = () => {
  const news = [
    { id: 1, type: 'Alert', title: 'Heavy Rainfall Warning for Coastal Regions', date: '2 hours ago', source: 'IMD', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    { id: 2, title: 'New Digital Subsidy Scheme Announced for Farmers', date: '5 hours ago', source: 'Ministry of Agriculture', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    { id: 3, title: 'Smart City Infrastructure Upgrade Initiated in Metro Cities', date: '1 day ago', source: 'Ministry of Urban Affairs', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    { id: 4, title: 'Tax Filing Deadline Extended by 15 Days', date: '2 days ago', source: 'Income Tax Dept', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-12 h-12 bg-gradient-brand rounded-2xl flex items-center justify-center text-white shadow-lg">
          <Newspaper className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">GovNews Feed</h1>
          <p className="text-slate-500">Official updates, alerts, and announcements.</p>
        </div>
      </div>

      <div className="space-y-6">
        {news.map((item, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
            key={item.id} className="glass-card p-6 flex flex-col sm:flex-row gap-6 hover-lift"
          >
            {/* Image Placeholder */}
            <div className={`w-full sm:w-48 h-48 sm:h-auto rounded-xl flex-shrink-0 flex flex-col items-center justify-center border ${item.bg} ${item.border} ${item.text}`}>
               <Bell className="w-8 h-8 mb-2" />
               <span className="font-bold tracking-widest uppercase text-xs opacity-70">Official News</span>
            </div>
            
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <span>{item.source}</span> • <span>{item.date}</span>
                  {item.type === 'Alert' && <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-[10px] animate-pulse">CRITICAL ALERT</span>}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3 leading-tight hover:text-brand-600 transition-colors cursor-pointer">{item.title}</h2>
                <p className="text-slate-600 line-clamp-2">Detailed information regarding the official announcement. The government has released this bulletin to inform citizens of recent changes and updates to policy procedures which will affect daily operations and civic duties.</p>
              </div>
              
              <div className="mt-6 flex items-center gap-3">
                <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors">
                  Read Full <ExternalLink className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
                  <Bookmark className="w-5 h-5" />
                </button>
                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NewsCenter;
