import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Landmark, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Info,
  BookmarkPlus,
  BookmarkCheck,
  ExternalLink,
  ShieldCheck,
  FileText
} from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-toastify';

const SchemeDiscovery = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [schemes, setSchemes] = useState([]);
  const [savedSchemes, setSavedSchemes] = useState([]);
  
  const [profile, setProfile] = useState({
    age: '',
    gender: 'Male',
    state: '',
    occupation: '',
    annualIncome: '',
    studentStatus: 'No',
    farmerStatus: 'No',
    disabilityStatus: 'No',
    casteCategory: 'General',
    employmentStatus: 'Employed',
  });

  useEffect(() => {
    const saved = localStorage.getItem('savedSchemes');
    if (saved) {
      setSavedSchemes(JSON.parse(saved));
    }
  }, []);

  const toggleSaveScheme = (scheme) => {
    let newSaved;
    const exists = savedSchemes.find(s => s.schemeName === scheme.schemeName);
    
    if (exists) {
      newSaved = savedSchemes.filter(s => s.schemeName !== scheme.schemeName);
      toast.info('Removed from saved schemes');
    } else {
      newSaved = [...savedSchemes, scheme];
      toast.success('Scheme saved successfully!');
    }
    
    setSavedSchemes(newSaved);
    localStorage.setItem('savedSchemes', JSON.stringify(newSaved));
  };

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });
  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await api.post('/schemes/discover', profile);
      setSchemes(response.data.data);
      setStep(4);
      toast.success('Schemes discovered successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to analyze profile.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, title: 'Basic Details' },
    { id: 2, title: 'Professional Info' },
    { id: 3, title: 'Additional Status' },
    { id: 4, title: 'Results' }
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header & Progress */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-brand rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Scheme Discovery</h1>
            <p className="text-slate-500">Find government welfare programs you qualify for.</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 rounded-full"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-brand-500 -translate-y-1/2 rounded-full transition-all duration-500"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          ></div>
          <div className="relative flex justify-between">
            {steps.map((s) => (
              <div key={s.id} className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  step >= s.id 
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/40' 
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${step >= s.id ? 'text-slate-900' : 'text-slate-400'}`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <AnimatePresence mode="wait">
          
          {/* Step 1 */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Age</label>
                  <input type="number" name="age" value={profile.age} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none" placeholder="e.g., 35" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                  <select name="gender" value={profile.gender} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none bg-white">
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">State of Residence</label>
                  <input type="text" name="state" value={profile.state} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none" placeholder="e.g., Maharashtra" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Professional & Financial Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Employment Status</label>
                  <select name="employmentStatus" value={profile.employmentStatus} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none bg-white">
                    <option>Employed</option><option>Self-Employed</option><option>Unemployed</option><option>Homemaker</option><option>Retired</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Annual Income (₹)</label>
                  <input type="number" name="annualIncome" value={profile.annualIncome} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none" placeholder="e.g., 250000" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Occupation (Optional)</label>
                  <input type="text" name="occupation" value={profile.occupation} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none" placeholder="e.g., Farmer, Weaver, Teacher" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Special Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Are you a Student?</label>
                  <select name="studentStatus" value={profile.studentStatus} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none bg-white">
                    <option>No</option><option>Yes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Are you a Farmer?</label>
                  <select name="farmerStatus" value={profile.farmerStatus} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none bg-white">
                    <option>No</option><option>Yes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Caste Category</label>
                  <select name="casteCategory" value={profile.casteCategory} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none bg-white">
                    <option>General</option><option>OBC</option><option>SC</option><option>ST</option><option>Minority</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Person with Disability</label>
                  <select name="disabilityStatus" value={profile.disabilityStatus} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none bg-white">
                    <option>No</option><option>Yes</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Results */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 bg-slate-50">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Your AI Matches</h2>
                  <p className="text-sm text-slate-500">Based on your profile, you are eligible for these schemes.</p>
                </div>
                <button onClick={() => setStep(1)} className="text-brand-600 font-medium hover:text-brand-700 text-sm">
                  Edit Profile
                </button>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
                  <p className="mt-4 text-brand-600 font-medium animate-pulse">Analyzing massive government databases...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {schemes.map((scheme, idx) => {
                    const isSaved = savedSchemes.some(s => s.schemeName === scheme.schemeName);
                    return (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                      key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="text-xl font-bold text-slate-900">{scheme.schemeName}</h3>
                          <button 
                            onClick={() => toggleSaveScheme(scheme)}
                            className={`p-2 rounded-lg transition-colors ${isSaved ? 'bg-brand-50 text-brand-600' : 'text-slate-400 hover:bg-slate-50'}`}
                          >
                            {isSaved ? <BookmarkCheck className="w-6 h-6" /> : <BookmarkPlus className="w-6 h-6" />}
                          </button>
                        </div>

                        <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex gap-3">
                          <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                          <div>
                            <h4 className="text-sm font-bold text-emerald-900 uppercase tracking-wider mb-1">Why you qualify</h4>
                            <p className="text-sm text-emerald-800">{scheme.whyEligible}</p>
                          </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-brand-500" /> Key Benefits
                            </h4>
                            <ul className="space-y-2">
                              {scheme.benefits.map((b, i) => (
                                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 flex-shrink-0"></div>
                                  {b}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                              <FileText className="w-4 h-4 text-brand-500" /> Required Documents
                            </h4>
                            <ul className="space-y-2">
                              {scheme.requiredDocuments.map((d, i) => (
                                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 flex-shrink-0"></div>
                                  {d}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-100">
                          <h4 className="text-sm font-bold text-slate-900 mb-2">How to Apply</h4>
                          <p className="text-sm text-slate-600">{scheme.howToApply}</p>
                        </div>

                        {scheme.importantNotes && (
                          <div className="mt-4 bg-amber-50 rounded-lg p-3 text-sm text-amber-800 flex items-start gap-2">
                            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            {scheme.importantNotes}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )})}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>

        {/* Footer Navigation */}
        {step < 4 && (
          <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
            <button 
              onClick={prevStep}
              disabled={step === 1}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-0 flex items-center gap-1 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            
            {step < 3 ? (
              <button 
                onClick={nextStep}
                disabled={!profile.age || !profile.state}
                className="bg-brand-600 text-white px-6 py-2 rounded-xl font-medium shadow-sm hover:bg-brand-500 disabled:opacity-50 flex items-center gap-1 transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="bg-gradient-brand text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 flex items-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
              >
                Find Schemes <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemeDiscovery;
