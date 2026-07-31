import { useTranslation } from "react-i18next";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Sparkles, CheckCircle2, AlertCircle, ArrowRight, ShieldAlert, Building2, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { compressImage } from '../utils/imageUtils';
const SubmitComplaint = () => {
  const {
    t
  } = useTranslation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Infrastructure',
    priority: 'Medium'
  });
  const [aiData, setAiData] = useState({
    department: '',
    confidenceScore: null
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [vaultDocs, setVaultDocs] = useState([]);
  const [showVaultModal, setShowVaultModal] = useState(false);
  const [attachedVaultDoc, setAttachedVaultDoc] = useState(null);
  const navigate = useNavigate();
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/documents', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(res => res.json()).then(data => {
        if (data.success) setVaultDocs(data.data.filter(d => d.mimeType.startsWith('image/')));
      }).catch(console.error);
    }
  }, []);
  const handleInputChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleImageChange = async e => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        try {
          const compressed = await compressImage(file);
          setImage(compressed);
          setImagePreview(URL.createObjectURL(compressed));
        } catch (err) {
          setImage(file);
          setImagePreview(URL.createObjectURL(file));
        }
      } else {
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
      }
      setAttachedVaultDoc(null);
      setAiData({
        department: '',
        confidenceScore: null
      });
    }
  };
  const selectVaultDoc = async doc => {
    setAttachedVaultDoc(doc);
    setShowVaultModal(false);

    // We fetch the blob for preview and AI
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/documents/${doc._id}/view`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to load vault document');
      const blob = await response.blob();
      const file = new File([blob], doc.originalName, {
        type: doc.mimeType
      });
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setAiData({
        department: '',
        confidenceScore: null
      });
    } catch (err) {
      toast.error('Failed to attach document from vault');
    }
  };
  const fileToBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
    });
  };
  const handleAnalyzeAI = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    try {
      const base64Image = await fileToBase64(image);
      const mimeType = image.type;
      const response = await api.post('/ai/analyze', {
        imageBase64: base64Image,
        mimeType
      });
      const {
        title,
        description,
        category,
        priority,
        department,
        confidenceScore
      } = response.data.data;
      setFormData({
        title: title || formData.title,
        description: description || formData.description,
        category: category || formData.category,
        priority: priority || formData.priority
      });
      setAiData({
        department: department || '',
        confidenceScore: confidenceScore || 0
      });
      toast.success('AI Analysis Complete!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI Analysis failed. Please fill manually.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('priority', formData.priority);
    if (image) {
      data.append('image', image);
    }
    try {
      await api.post('/complaints', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Complaint submitted successfully!');
      navigate('/history');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };
  return <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{t("SubmitComplaint.report_an_issue")}</h1>
        <p className="text-slate-500 mt-2">Help us keep Smart Bharat clean and safe. Upload a photo and let our AI handle the rest.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Step 1: Upload */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="glass-card p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold">1</div>
            <h2 className="text-xl font-bold text-slate-900">{t("SubmitComplaint.photo_evidence")}</h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <label className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-slate-100 hover:border-brand-400 transition-all cursor-pointer overflow-hidden group">
                {imagePreview ? <>
                    <img src={imagePreview} alt={t("SubmitComplaint.preview")} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" />
                    <div className="relative z-10 flex flex-col items-center">
                      <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2" />
                      <span className="font-medium text-slate-900 bg-white/80 px-3 py-1 rounded-full backdrop-blur-sm">{t("SubmitComplaint.change_photo")}</span>
                    </div>
                  </> : <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-10 h-10 text-slate-400 mb-3 group-hover:text-brand-500 transition-colors" />
                    <p className="mb-2 text-sm text-slate-500"><span className="font-semibold text-brand-600">{t("SubmitComplaint.click_to_upload")}</span>{t("SubmitComplaint.or_drag_and_drop")}</p>
                    <p className="text-xs text-slate-400">{t("SubmitComplaint.png_jpg_jpeg_max")}</p>
                  </div>}
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-slate-500 mb-2">{t("SubmitComplaint.or")}</p>
                <button type="button" onClick={() => setShowVaultModal(true)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 rounded-xl transition-colors text-sm flex items-center gap-2 mx-auto">
                  <MapPin className="w-4 h-4" />{t("SubmitComplaint.attach_from_digivault")}</button>
              </div>
            </div>

            <div className="sm:w-64 flex flex-col justify-center">
              <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
                <Sparkles className="w-6 h-6 text-purple-500 mb-2" />
                <h3 className="font-semibold text-purple-900 mb-1">{t("SubmitComplaint.smart_analysis")}</h3>
                <p className="text-sm text-purple-700/80 mb-4">{t("SubmitComplaint.our_ai_will_automatically")}</p>
                <button type="button" disabled={!image || isAnalyzing} onClick={handleAnalyzeAI} className="w-full bg-purple-600 text-white py-2.5 px-4 rounded-xl font-medium shadow-md hover:bg-purple-700 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2">
                  {isAnalyzing ? <><div className="w-4 h-4 border-2 border-white border-t-white rounded-full animate-spin"></div>{t("SubmitComplaint.analyzing")}</> : <>{t("SubmitComplaint.analyze_image")}<ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Step 2: AI Results / Form */}
        <AnimatePresence>
          <motion.div initial={{
          opacity: 0,
          height: 0
        }} animate={{
          opacity: 1,
          height: 'auto'
        }} className="glass-card p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold">2</div>
                <h2 className="text-xl font-bold text-slate-900">{t("SubmitComplaint.issue_details")}</h2>
              </div>
              
              {aiData.confidenceScore && <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1.5 ${aiData.confidenceScore > 75 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {aiData.confidenceScore > 75 ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}{t("SubmitComplaint.ai_confidence")}{aiData.confidenceScore}%
                </div>}
            </div>

            {aiData.department && <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t("SubmitComplaint.routed_department")}</p>
                      <p className="text-sm font-medium text-slate-900">{aiData.department}</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t("SubmitComplaint.ai_severity")}</p>
                      <p className="text-sm font-medium text-slate-900">{formData.priority}</p>
                    </div>
                  </div>
               </div>}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t("SubmitComplaint.issue_title")}</label>
                <input type="text" name="title" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all bg-white/50 backdrop-blur-sm" placeholder={t("SubmitComplaint.eg_pothole_on_main")} value={formData.title} onChange={handleInputChange} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t("SubmitComplaint.detailed_description")}</label>
                <textarea name="description" rows={4} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all bg-white/50 backdrop-blur-sm" placeholder={t("SubmitComplaint.provide_any_additional_details")} value={formData.description} onChange={handleInputChange} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t("SubmitComplaint.category")}</label>
                  <select name="category" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all bg-white" value={formData.category} onChange={handleInputChange}>
                    <option>{t("SubmitComplaint.infrastructure")}</option>
                    <option>{t("SubmitComplaint.water_sanitation")}</option>
                    <option>{t("SubmitComplaint.electricity")}</option>
                    <option>{t("SubmitComplaint.waste_management")}</option>
                    <option>{t("SubmitComplaint.others")}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t("SubmitComplaint.priority")}</label>
                  <select name="priority" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all bg-white" value={formData.priority} onChange={handleInputChange}>
                    <option>{t("SubmitComplaint.low")}</option>
                    <option>{t("SubmitComplaint.medium")}</option>
                    <option>{t("SubmitComplaint.high")}</option>
                    <option>{t("SubmitComplaint.critical")}</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-4">
              <button type="button" onClick={() => navigate('/')} className="px-6 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors">{t("SubmitComplaint.cancel")}</button>
              <button type="submit" disabled={loading} className="bg-brand-600 text-white px-8 py-2.5 rounded-xl font-medium shadow-lg shadow-brand-500/30 hover:bg-brand-500 hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center gap-2">
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </form>

      {/* Vault Modal */}
      <AnimatePresence>
        {showVaultModal && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <motion.div initial={{
          opacity: 0,
          scale: 0.95
        }} animate={{
          opacity: 1,
          scale: 1
        }} className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-900">{t("SubmitComplaint.select_image_from_vault")}</h3>
                <button onClick={() => setShowVaultModal(false)} className="text-slate-400 hover:text-slate-600">×</button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {vaultDocs.length === 0 ? <p className="text-center text-slate-500 py-8">{t("SubmitComplaint.no_images_found_in")}</p> : vaultDocs.map(doc => <button key={doc._id} type="button" onClick={() => selectVaultDoc(doc)} className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-brand-300 hover:bg-brand-50 transition-colors text-left">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{doc.originalName}</span>
                        <span className="text-xs text-slate-500">{doc.aiSummary?.documentType || doc.category}</span>
                      </div>
                      <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">{new Date(doc.uploadDate).toLocaleDateString()}</span>
                    </button>)}
              </div>
            </motion.div>
          </div>}
      </AnimatePresence>
    </div>;
};
export default SubmitComplaint;