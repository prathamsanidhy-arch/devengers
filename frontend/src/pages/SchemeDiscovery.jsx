import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Landmark, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Sparkles,
  FolderSearch,
  Search
} from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import SchemeCard from '../components/SchemeCard';

const SchemeDiscovery = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [schemes, setSchemes] = useState([]);
  const [savedSchemes, setSavedSchemes] = useState([]);
  
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('userProfile');
    if (saved) return JSON.parse(saved);
    return {
      age: '',
      gender: 'Male',
      state: '',
      employmentStatus: 'Employed',
      annualIncome: '',
      occupation: '',
      maritalStatus: 'Single',
      familyMembers: '',
      areaType: 'Urban',
      socialCategory: 'General',
      documents: {
        aadhaar: false,
        pan: false,
        bankLinked: false,
        rationCard: false,
        incomeCertificate: false,
        casteCertificate: false,
        disabilityCertificate: false
      },
      personalStatus: {
        student: false,
        farmer: false,
        businessOwner: false,
        seniorCitizen: false,
        personWithDisability: false,
        womanEntrepreneur: false,
        pregnantWoman: false
      },
      housingStatus: 'Own House',
      utilities: {
        electricity: false,
        lpg: false,
        internet: false
      }
    };
  });

  const [vaultDocs, setVaultDocs] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('savedSchemes');
    if (saved) {
      setSavedSchemes(JSON.parse(saved));
    }

    // Fetch DigiVault documents
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/documents', { headers: { 'Authorization': `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setVaultDocs(data.data);
            
            // Auto-check profile documents based on Vault
            setProfile(prev => {
              const newDocs = { ...prev.documents };
              let updated = false;
              
              Object.keys(newDocs).forEach(docKey => {
                const isFound = data.data.some(vd => 
                  vd.aiSummary?.documentType?.toLowerCase().includes(docKey.toLowerCase()) || 
                  vd.originalName.toLowerCase().includes(docKey.toLowerCase())
                );
                if (isFound && !newDocs[docKey]) {
                  newDocs[docKey] = true;
                  updated = true;
                }
              });
              
              if (updated) {
                const newProfile = { ...prev, documents: newDocs };
                localStorage.setItem('userProfile', JSON.stringify(newProfile));
                return newProfile;
              }
              return prev;
            });
          }
        })
        .catch(console.error);
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

  const handleChange = (e) => {
    const newProfile = { ...profile, [e.target.name]: e.target.value };
    setProfile(newProfile);
    localStorage.setItem('userProfile', JSON.stringify(newProfile));
  };

  const handleDocumentToggle = (doc) => {
    const newProfile = { ...profile, documents: { ...profile.documents, [doc]: !profile.documents[doc] } };
    setProfile(newProfile);
    localStorage.setItem('userProfile', JSON.stringify(newProfile));
  };

  const handleStatusToggle = (status) => {
    const newProfile = { ...profile, personalStatus: { ...profile.personalStatus, [status]: !profile.personalStatus[status] } };
    setProfile(newProfile);
    localStorage.setItem('userProfile', JSON.stringify(newProfile));
  };

  const handleUtilityToggle = (util) => {
    const newProfile = { ...profile, utilities: { ...profile.utilities, [util]: !profile.utilities[util] } };
    setProfile(newProfile);
    localStorage.setItem('userProfile', JSON.stringify(newProfile));
  };

  const validateStep = () => {
    if (step === 1) {
      if (!profile.age || !profile.state) {
        toast.error('Please fill out all required fields');
        return false;
      }
    }
    if (step === 2) {
      if (!profile.annualIncome) {
        toast.error('Please provide your annual income');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => Math.min(prev + 1, 4));
    }
  };
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    if (!validateStep()) return;
    
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setLoading(true);
    setStep(4);
    
    try {
      const response = await api.post('/schemes/discover', profile);
      setSchemes(response.data.data);
      toast.success('Schemes discovered successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to analyze profile.');
      setStep(3);
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">Age <span className="text-red-500">*</span></label>
                  <input type="number" name="age" value={profile.age} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none" placeholder="e.g., 35" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Gender <span className="text-red-500">*</span></label>
                  <select name="gender" value={profile.gender} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none bg-white">
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">State of Residence <span className="text-red-500">*</span></label>
                  <input type="text" name="state" value={profile.state} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none" placeholder="e.g., Maharashtra" required />
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">Annual Income (₹) <span className="text-red-500">*</span></label>
                  <input type="number" name="annualIncome" value={profile.annualIncome} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none" placeholder="e.g., 250000" required />
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
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Additional Status</h2>
              
              <div className="space-y-8">
                {/* Family Information */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Family Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Marital Status</label>
                      <select name="maritalStatus" value={profile.maritalStatus} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none bg-white">
                        <option>Single</option><option>Married</option><option>Widowed</option><option>Divorced</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Number of Family Members</label>
                      <input type="number" name="familyMembers" value={profile.familyMembers} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none" placeholder="e.g. 4" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Area Type</label>
                      <select name="areaType" value={profile.areaType} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none bg-white">
                        <option>Urban</option><option>Rural</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Social Category</label>
                      <select name="socialCategory" value={profile.socialCategory} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none bg-white">
                        <option>General</option><option>OBC</option><option>SC</option><option>ST</option><option>EWS</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Document Checkboxes */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Government Documents</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.keys(profile.documents).map((doc) => {
                      const isFoundInVault = vaultDocs.some(vd => 
                        vd.aiSummary?.documentType?.toLowerCase().includes(doc.toLowerCase()) || 
                        vd.originalName.toLowerCase().includes(doc.toLowerCase())
                      );
                      
                      return (
                        <div key={doc} className={`flex flex-col gap-2 p-3 rounded-xl border ${isFoundInVault ? 'border-brand-200 bg-brand-50/30' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                          <label className={`flex items-center gap-3 cursor-pointer ${isFoundInVault ? 'opacity-80' : ''}`}>
                            <input type="checkbox" checked={profile.documents[doc]} onChange={() => !isFoundInVault && handleDocumentToggle(doc)} disabled={isFoundInVault} className="w-5 h-5 text-brand-600 rounded border-slate-300 focus:ring-brand-500 disabled:bg-brand-200" />
                            <span className="text-sm font-medium text-slate-700 capitalize">{doc.replace(/([A-Z])/g, ' $1')}</span>
                          </label>
                          {isFoundInVault && (
                            <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider flex items-center gap-1 mt-1">
                              <CheckCircle2 className="w-3 h-3" /> Vault Verified
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Personal Status */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Personal Status</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.keys(profile.personalStatus).map((status) => (
                      <label key={status} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                        <input type="checkbox" checked={profile.personalStatus[status]} onChange={() => handleStatusToggle(status)} className="w-5 h-5 text-brand-600 rounded border-slate-300 focus:ring-brand-500" />
                        <span className="text-sm font-medium text-slate-700 capitalize">{status.replace(/([A-Z])/g, ' $1')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Housing & Utilities */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Housing</h3>
                    <div className="space-y-3">
                      {['Own House', 'Rental', 'Homeless'].map((type) => (
                        <label key={type} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                          <input type="radio" name="housingStatus" value={type} checked={profile.housingStatus === type} onChange={handleChange} className="w-5 h-5 text-brand-600 border-slate-300 focus:ring-brand-500" />
                          <span className="text-sm font-medium text-slate-700">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Utility Access</h3>
                    <div className="space-y-3">
                      {Object.keys(profile.utilities).map((util) => (
                        <label key={util} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                          <input type="checkbox" checked={profile.utilities[util]} onChange={() => handleUtilityToggle(util)} className="w-5 h-5 text-brand-600 rounded border-slate-300 focus:ring-brand-500" />
                          <span className="text-sm font-medium text-slate-700 capitalize">{util}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Results */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 bg-slate-50">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">Recommended Schemes</h2>
                  <p className="text-sm text-slate-500 mt-1">Based on your profile, we've found these tailored opportunities.</p>
                </div>
                <button onClick={() => setStep(1)} className="text-brand-600 font-medium hover:text-brand-700 text-sm bg-brand-50 px-5 py-2.5 rounded-xl transition-colors border border-brand-100 flex items-center gap-2">
                  <Search className="w-4 h-4" /> Edit Profile
                </button>
              </div>

              {loading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-pulse">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                        <div className="flex-1 space-y-3">
                          <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                        </div>
                      </div>
                      <div className="mt-6 space-y-3">
                        <div className="h-4 bg-slate-200 rounded w-full"></div>
                        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  ))}
                  <div className="text-center mt-6">
                    <p className="text-brand-600 font-medium animate-pulse flex items-center justify-center gap-2">
                      <Sparkles className="w-5 h-5" /> Analyzing massive government databases with AI...
                    </p>
                  </div>
                </div>
              ) : schemes.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
                  <FolderSearch className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-700">No matching schemes found</h3>
                  <p className="text-slate-500 mt-2">Try adjusting your profile to see more results.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {schemes.map((scheme, idx) => (
                    <SchemeCard 
                      key={idx} 
                      scheme={scheme} 
                      isSaved={savedSchemes.some(s => s.schemeName === scheme.schemeName)} 
                      toggleSave={toggleSaveScheme} 
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>

        {/* Footer Navigation */}
        {step < 4 && (
          <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
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
                className="bg-brand-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm hover:bg-brand-500 flex items-center gap-2 transition-colors"
              >
                Continue <ChevronRight className="w-4 h-4" />
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
