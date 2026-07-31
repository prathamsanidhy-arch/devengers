import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { servicesData } from '../data/servicesData';
import { ArrowLeft, ExternalLink, Bookmark, Shield, CreditCard, Zap, Home, Droplets, Car, HeartPulse, Scale, FileText, CheckCircle, MapPin, Clock, FileBadge, Scroll, AlertCircle, Bot } from 'lucide-react';
const iconMap = {
  Shield,
  CreditCard,
  Zap,
  Home,
  Droplets,
  Car,
  HeartPulse,
  Scale,
  FileText,
  FileBadge,
  Scroll
};
const ServiceDetails = () => {
  const {
    t
  } = useTranslation();
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const service = servicesData.find(s => s.id === id);
  const [bookmarked, setBookmarked] = useState(false);
  const [checklist, setChecklist] = useState({});
  const [aiGuidance, setAiGuidance] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [vaultDocs, setVaultDocs] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/documents', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(res => res.json()).then(data => {
        if (data.success) setVaultDocs(data.data);
      }).catch(console.error);
    }
    if (service) {
      // Load bookmarks
      const savedBookmarks = JSON.parse(localStorage.getItem('smartbharat_bookmarks') || '[]');
      setBookmarked(savedBookmarks.includes(service.id));

      // Load checklist progress
      const savedProgress = JSON.parse(localStorage.getItem(`smartbharat_checklist_${service.id}`) || '{}');
      if (Object.keys(savedProgress).length === 0) {
        const initial = {};
        service.documents.forEach(doc => {
          initial[doc.id] = false;
        });
        setChecklist(initial);
      } else {
        setChecklist(savedProgress);
      }

      // Save to recently viewed
      const viewed = JSON.parse(localStorage.getItem('smartbharat_recently_viewed') || '[]');
      const newViewed = [service.id, ...viewed.filter(vid => vid !== service.id)].slice(0, 5);
      localStorage.setItem('smartbharat_recently_viewed', JSON.stringify(newViewed));
    }
  }, [service]);
  if (!service) {
    return <div className="py-8 px-4 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">{t("ServiceDetails.service_not_found")}</h2>
        <button onClick={() => navigate('/services')} className="btn-primary">{t("ServiceDetails.back_to_services")}</button>
      </div>;
  }
  const Icon = iconMap[service.iconName] || FileText;
  const toggleBookmark = () => {
    const savedBookmarks = JSON.parse(localStorage.getItem('smartbharat_bookmarks') || '[]');
    let newBookmarks;
    if (bookmarked) {
      newBookmarks = savedBookmarks.filter(sid => sid !== service.id);
    } else {
      newBookmarks = [...savedBookmarks, service.id];
    }
    localStorage.setItem('smartbharat_bookmarks', JSON.stringify(newBookmarks));
    setBookmarked(!bookmarked);
  };
  const toggleChecklist = docId => {
    const newChecklist = {
      ...checklist,
      [docId]: !checklist[docId]
    };
    setChecklist(newChecklist);
    localStorage.setItem(`smartbharat_checklist_${service.id}`, JSON.stringify(newChecklist));
  };
  const calculateProgress = () => {
    if (!service.documents.length) return 100;
    const completed = Object.values(checklist).filter(Boolean).length;
    return Math.round(completed / service.documents.length * 100);
  };
  const progress = calculateProgress();
  const fetchAiGuidance = async () => {
    setAiLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/ai/service-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          serviceName: service.title
        })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAiGuidance(data.data);
          setAiLoading(false);
          return;
        }
      }
    } catch (err) {
      console.error('AI Error:', err);
    }

    // Fallback template-based guidance
    setTimeout(() => {
      setAiGuidance({
        explanation: `${service.title} is a key service provided by the ${service.dept}.`,
        eligibility: service.eligibility,
        tips: ['Always use a secure internet connection.', 'Double check your entries.'],
        mistakes: [service.commonMistakes],
        advice: 'Keep your documents scanned and ready before applying.'
      });
      setAiLoading(false);
    }, 1000);
  };
  return <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <button onClick={() => navigate('/services')} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors font-medium">
          <ArrowLeft className="w-5 h-5 mr-2" />{t("ServiceDetails.back_to_services")}</button>
        <div className="flex gap-3">
          <button onClick={toggleBookmark} className={`flex items-center px-4 py-2 rounded-xl border transition-colors ${bookmarked ? 'bg-brand-50 border-brand-200 text-brand-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            <Bookmark className={`w-4 h-4 mr-2 ${bookmarked ? 'fill-current' : ''}`} />
            {bookmarked ? 'Saved' : 'Save for later'}
          </button>
        </div>
      </div>

      <div className="glass-card p-6 md:p-8 relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 rounded-full ${service.color.split(' ')[0]}`}></div>
        
        <div className="flex flex-col md:flex-row gap-6 relative z-10">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 ${service.color}`}>
            <Icon className="w-10 h-10" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{t(`servicesData.${service.id}.category`, { defaultValue: service.category })}</span>
              <span className="text-sm font-medium text-slate-500">{t(`servicesData.${service.id}.dept`, { defaultValue: service.dept })}</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">{t(`servicesData.${service.id}.title`, { defaultValue: service.title })}</h1>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">{t(`servicesData.${service.id}.description`, { defaultValue: service.description })}</p>
            
            <div className="flex flex-wrap gap-4">
              <div className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl flex items-center gap-3">
                <Clock className="w-5 h-5 text-brand-500" />
                <div>
                  <div className="text-xs text-slate-500 font-medium">{t("ServiceDetails.processing_time")}</div>
                  <div className="text-sm font-bold text-slate-900">{service.time}</div>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-emerald-500" />
                <div>
                  <div className="text-xs text-slate-500 font-medium">{t("ServiceDetails.approximate_fees")}</div>
                  <div className="text-sm font-bold text-slate-900">{t(`servicesData.${service.id}.approxFees`, { defaultValue: service.approxFees })}</div>
                </div>
              </div>
              <button onClick={() => navigate('/offices')} className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl flex items-center gap-3 hover:bg-slate-100 transition-colors cursor-pointer text-left">
                <MapPin className="w-5 h-5 text-rose-500" />
                <div>
                  <div className="text-xs text-slate-500 font-medium">{t("ServiceDetails.nearest_office")}</div>
                  <div className="text-sm font-bold text-slate-900">{t("ServiceDetails.locate_on_map")}</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 md:p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-brand-500" />{t("ServiceDetails.service_details")}</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">{t("ServiceDetails.purpose")}</h4>
                <p className="text-slate-600">{t(`servicesData.${service.id}.purpose`, { defaultValue: service.purpose })}</p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">{t("ServiceDetails.eligibility")}</h4>
                <p className="text-slate-600">{t(`servicesData.${service.id}.eligibility`, { defaultValue: service.eligibility })}</p>
              </div>
              
              <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-amber-900 mb-1">{t("ServiceDetails.important_note")}</h4>
                  <p className="text-amber-800 text-sm">{t(`servicesData.${service.id}.importantNotes`, { defaultValue: service.importantNotes })}</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Assistant Section */}
          <div className="glass-card p-6 md:p-8 border-t-4 border-t-purple-500">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Bot className="w-6 h-6 text-purple-500" />{t("ServiceDetails.ai_assistant")}</h3>
              {!aiGuidance && !aiLoading && <button onClick={fetchAiGuidance} className="text-sm bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-medium hover:bg-purple-200 transition-colors">{t("ServiceDetails.ask_gemini")}</button>}
            </div>

            {aiLoading && <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
              </div>}

            {aiGuidance && <motion.div initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-xl text-purple-900 text-sm leading-relaxed">
                  <p className="font-medium mb-2">{aiGuidance.explanation}</p>
                  <p className="italic text-purple-700">{aiGuidance.advice}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-slate-100 rounded-xl p-4">
                    <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />{t("ServiceDetails.helpful_tips")}</h4>
                    <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4">
                      {aiGuidance.tips.map((tip, idx) => <li key={idx}>{tip}</li>)}
                    </ul>
                  </div>
                  <div className="border border-slate-100 rounded-xl p-4">
                    <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-500" />{t("ServiceDetails.common_mistakes")}</h4>
                    <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4">
                      {aiGuidance.mistakes.map((mistake, idx) => <li key={idx}>{mistake}</li>)}
                    </ul>
                  </div>
                </div>
              </motion.div>}
            
            {!aiGuidance && !aiLoading && <p className="text-slate-500 text-sm">{t("ServiceDetails.need_help_preparing_ask")}</p>}
          </div>

          <div className="glass-card p-6 md:p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">{t("ServiceDetails.frequently_asked_questions")}</h3>
            <div className="space-y-4">
              {service.faqs.map((faq, idx) => <div key={idx} className="border border-slate-100 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 mb-2">{faq.q}</h4>
                  <p className="text-slate-600 text-sm">{faq.a}</p>
                </div>)}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">{t("ServiceDetails.required_documents")}</h3>
              <span className="text-sm font-bold text-brand-600">{progress}%</span>
            </div>
            
            <div className="w-full bg-slate-100 rounded-full h-2 mb-6 overflow-hidden">
              <div className="bg-brand-500 h-2 rounded-full transition-all duration-500" style={{
              width: `${progress}%`
            }}></div>
            </div>

            <div className="space-y-3">
              {service.documents.map(doc => {
              const isFoundInVault = vaultDocs.some(vd => vd.aiSummary?.documentType?.toLowerCase().includes(doc.name.toLowerCase()) || vd.originalName.toLowerCase().includes(doc.name.toLowerCase()) || doc.name.toLowerCase().includes(vd.aiSummary?.documentType?.toLowerCase() || ''));
              return <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-100 bg-white">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500" checked={isFoundInVault || !!checklist[doc.id]} onChange={() => !isFoundInVault && toggleChecklist(doc.id)} disabled={isFoundInVault} />
                      <span className={`text-sm ${isFoundInVault || checklist[doc.id] ? 'text-slate-400 line-through' : 'text-slate-700 font-bold'}`}>
                        {doc.name}
                      </span>
                    </label>
                    {isFoundInVault ? <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                        <CheckCircle className="w-3.5 h-3.5" />{t("ServiceDetails.available_in_digivault")}</span> : <button onClick={() => navigate('/vault')} className="flex items-center gap-1 text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg border border-brand-100 transition-colors">{t("ServiceDetails.upload_to_vault")}<ArrowLeft className="w-3.5 h-3.5 rotate-135 transform scale-x-[-1]" />
                      </button>}
                  </div>;
            })}
            </div>
          </div>

          <div className="glass-card p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
            <h3 className="text-lg font-bold mb-2">{t("ServiceDetails.ready_to_apply")}</h3>
            <p className="text-slate-300 text-sm mb-6">{t("ServiceDetails.make_sure_you_have")}</p>
            
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-1">
                <CheckCircle className="w-4 h-4" />{t("ServiceDetails.verified_government_portal")}</div>
              <div className="text-slate-400 text-xs truncate">{service.officialWebsite}</div>
            </div>
            
            <a href={service.officialWebsite} target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">{t("ServiceDetails.apply_on_official_website")}<ExternalLink className="w-4 h-4" />
            </a>
            <p className="text-center text-xs text-slate-400 mt-4">{t("ServiceDetails.opens_in_a_new")}</p>
          </div>
        </div>
      </div>
    </div>;
};
export default ServiceDetails;