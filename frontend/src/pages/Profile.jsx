import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Bookmark, FileText, Bell, Settings as SettingsIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Profile = () => {
  const { user } = useAuth();
  const [savedSchemes, setSavedSchemes] = useState([]);
  const [complaintCount, setComplaintCount] = useState(0);

  useEffect(() => {
    // Load saved schemes
    const saved = localStorage.getItem('savedSchemes');
    if (saved) {
      setSavedSchemes(JSON.parse(saved));
    }

    // Load complaint count
    const fetchComplaints = async () => {
      try {
        const { data } = await api.get('/complaints');
        setComplaintCount(data.data.length);
      } catch (error) {
        console.error('Failed to fetch complaints');
      }
    };
    fetchComplaints();
  }, []);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Personal Info */}
        <div className="space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-brand mx-auto flex items-center justify-center text-4xl text-white font-bold mb-4 shadow-lg shadow-brand-500/40">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
            <p className="text-slate-500 flex items-center justify-center gap-1 mt-1">
              <Mail className="w-4 h-4" /> {user?.email}
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium border border-emerald-200">
              <Shield className="w-4 h-4" /> Verified Citizen
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
            <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Activity Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg"><FileText className="w-5 h-5" /></div>
                  <span className="font-medium text-slate-700">Total Reports</span>
                </div>
                <span className="text-xl font-bold text-slate-900">{complaintCount}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 text-purple-600 p-2 rounded-lg"><Bookmark className="w-5 h-5" /></div>
                  <span className="font-medium text-slate-700">Saved Schemes</span>
                </div>
                <span className="text-xl font-bold text-slate-900">{savedSchemes.length}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Saved Content */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 sm:p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-brand-500" /> Saved Schemes
            </h3>
            
            {savedSchemes.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">You haven't saved any schemes yet.</p>
                <Link to="/schemes" className="text-brand-600 font-medium hover:underline mt-2 inline-block">Discover Schemes</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {savedSchemes.map((scheme, i) => (
                  <div key={i} className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover-lift">
                    <div>
                      <h4 className="font-bold text-slate-900">{scheme.schemeName}</h4>
                      <p className="text-sm text-slate-500 line-clamp-1 mt-1">{scheme.whyEligible}</p>
                    </div>
                    <button onClick={() => {
                        const newSaved = savedSchemes.filter(s => s.schemeName !== scheme.schemeName);
                        setSavedSchemes(newSaved);
                        localStorage.setItem('savedSchemes', JSON.stringify(newSaved));
                      }} 
                      className="text-xs font-medium text-red-500 hover:text-red-600 bg-red-50 px-3 py-1.5 rounded-lg whitespace-nowrap"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 sm:p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-slate-500" /> Quick Settings
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer">
                <div>
                  <h4 className="font-medium text-slate-900">Email Notifications</h4>
                  <p className="text-xs text-slate-500">Get updates on complaints</p>
                </div>
                <div className="w-10 h-6 bg-brand-500 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer">
                <div>
                  <h4 className="font-medium text-slate-900">SMS Alerts</h4>
                  <p className="text-xs text-slate-500">Important Govt alerts</p>
                </div>
                <div className="w-10 h-6 bg-slate-200 rounded-full relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
