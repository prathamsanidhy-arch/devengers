import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { compressImage } from '../utils/imageUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, UploadCloud, Folder, Search, Download, Trash2, 
  Eye, ShieldCheck, File, Loader, MoreVertical, Edit2, Move, 
  Plus, X, Maximize, ZoomIn, ZoomOut, RotateCw, Printer, AlertTriangle, 
  Sparkles, CheckCircle2, ChevronRight, Star, Clock, Info, ArrowRightLeft, Database, PieChart
} from 'lucide-react';
import { toast } from 'react-toastify';

const DocumentVault = () => {
  const [documents, setDocuments] = useState([]);
  const [defaultFolders, setDefaultFolders] = useState(['Identity', 'Transport', 'Revenue', 'Education', 'Healthcare', 'Finance', 'Property', 'Certificates', 'Other']);
  const [customFolders, setCustomFolders] = useState([]);
  const [activeFolder, setActiveFolder] = useState('All Documents');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Modals state
  const [previewDoc, setPreviewDoc] = useState(null);
  const [previewZoom, setPreviewZoom] = useState(1);
  const [previewRotate, setPreviewRotate] = useState(0);
  const [previewBlobUrl, setPreviewBlobUrl] = useState(null);

  const [renameDoc, setRenameDoc] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  const [moveDoc, setMoveDoc] = useState(null);
  const [confirmDeleteDoc, setConfirmDeleteDoc] = useState(null);

  const [folderModal, setFolderModal] = useState({ isOpen: false, type: 'create', folderId: null, value: '' });
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [folderDropdown, setFolderDropdown] = useState(null);
  
  // Duplicate Detection state
  const [duplicateFiles, setDuplicateFiles] = useState([]);
  const [currentDuplicateIndex, setCurrentDuplicateIndex] = useState(0);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const [docRes, folRes] = await Promise.all([
        fetch('/api/documents', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/folders', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      const docData = await docRes.json();
      const folData = await folRes.json();

      if (docData.success) setDocuments(docData.data);
      if (folData.success) {
        if (folData.data.defaultFolders) setDefaultFolders(folData.data.defaultFolders);
        if (folData.data.customFolders) setCustomFolders(folData.data.customFolders);
      }
    } catch (err) {
      toast.error("Failed to load vault data.");
    }
  };

  useEffect(() => {
    fetchData();
    const handleClickOutside = () => { setActiveDropdown(null); setFolderDropdown(null); };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const validateFiles = (files) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const validFiles = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!validTypes.includes(file.type)) {
        toast.error(`"${file.name}" is not supported. Only PDF, JPG, and PNG are allowed.`);
        continue;
      }
      if (file.size > 20 * 1024 * 1024) {
        toast.error(`"${file.name}" exceeds the 20MB limit.`);
        continue;
      }
      validFiles.push(file);
    }
    return validFiles;
  };


  const uploadFiles = async (filesToUpload) => {
    if (filesToUpload.length === 0) return;
    const token = localStorage.getItem('token');
    const formData = new FormData();
    filesToUpload.forEach(file => formData.append('documents', file));
    
    if (activeFolder && !['All Documents', 'Favorites', 'Recent Uploads', 'Recently Viewed', 'Recent Downloads'].includes(activeFolder)) {
      formData.append('folder', activeFolder);
    }

    setIsUploading(true);
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => prev >= 90 ? prev : prev + 10);
    }, 100);

    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      clearInterval(progressInterval);
      setUploadProgress(100);
      const data = await res.json();
      
      if (data.success) {
        toast.success(`${filesToUpload.length} document(s) uploaded securely!`);
        setDocuments(prev => [...data.data, ...prev]);
      } else {
        toast.error(data.message || "Upload failed.");
      }
    } catch (err) {
      clearInterval(progressInterval);
      toast.error("An error occurred during upload.");
    } finally {
      setTimeout(() => { setIsUploading(false); setUploadProgress(0); }, 500);
    }
  };

  const processFileSelection = async (filesList) => {
    let files = validateFiles(filesList);
    if (files.length === 0) return;

    // Compress images before processing
    files = await Promise.all(files.map(async (file) => {
      if (file.type.startsWith('image/')) {
        try {
          return await compressImage(file);
        } catch(err) {
          return file;
        }
      }
      return file;
    }));

    // Duplicate Check
    const duplicates = [];
    const newFiles = [];

    files.forEach(f => {
      const existing = documents.find(d => d.originalName === f.name);
      if (existing) {
        duplicates.push({ newFile: f, existingDoc: existing });
      } else {
        newFiles.push(f);
      }
    });

    if (duplicates.length > 0) {
      setDuplicateFiles(duplicates);
      setCurrentDuplicateIndex(0);
    } 
    if (newFiles.length > 0) {
      uploadFiles(newFiles);
    }
  };

  const handleDuplicateAction = async (action) => {
    const currentDup = duplicateFiles[currentDuplicateIndex];
    if (action === 'replace') {
      const token = localStorage.getItem('token');
      await fetch(`/api/documents/${currentDup.existingDoc.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }});
      setDocuments(prev => prev.filter(d => d.id !== currentDup.existingDoc.id));
      uploadFiles([currentDup.newFile]);
    } else if (action === 'keep') {
      // Just upload, backend handles UUIDs so it won't overwrite physically.
      uploadFiles([currentDup.newFile]);
    } // action === 'cancel' does nothing for this file

    if (currentDuplicateIndex + 1 < duplicateFiles.length) {
      setCurrentDuplicateIndex(prev => prev + 1);
    } else {
      setDuplicateFiles([]);
    }
  };

  const handleFileChange = (e) => {
    processFileSelection(e.target.files);
    e.target.value = null;
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length > 0) {
      processFileSelection(e.dataTransfer.files);
    }
  }, [documents, activeFolder]);

  // Actions
  const doRenameDoc = async (e) => {
    e.preventDefault();
    if (!renameValue.trim()) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/documents/${renameDoc.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: renameValue })
      });
      const data = await res.json();
      if (data.success) {
        setDocuments(documents.map(d => d.id === renameDoc.id ? { ...d, originalName: renameValue } : d));
        toast.success('Document renamed');
        setRenameDoc(null);
      } else toast.error(data.message);
    } catch (err) { toast.error('Error renaming'); }
  };

  const doMoveDoc = async (folderName) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/documents/${moveDoc.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ folder: folderName })
      });
      const data = await res.json();
      if (data.success) {
        setDocuments(documents.map(d => d.id === moveDoc.id ? { ...d, folder: folderName } : d));
        toast.success(`Moved to ${folderName}`);
        setMoveDoc(null);
      } else toast.error(data.message);
    } catch (err) { toast.error('Error moving'); }
  };

  const doDeleteDoc = async () => {
    if (!confirmDeleteDoc) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/documents/${confirmDeleteDoc.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setDocuments(documents.filter(d => d.id !== confirmDeleteDoc.id));
        toast.info('Document deleted');
        setConfirmDeleteDoc(null);
      } else toast.error(data.message);
    } catch (err) { toast.error('Error deleting'); }
  };

  const toggleFavorite = async (docId, e) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/documents/${docId}/favorite`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setDocuments(documents.map(d => d.id === docId ? { ...d, isFavorite: data.data.isFavorite } : d));
      }
    } catch (err) { toast.error('Error updating favorite'); }
  };

  const downloadDoc = async (id, name, e) => {
    if(e) e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/documents/${id}/download`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setDocuments(documents.map(d => d.id === id ? { ...d, lastDownloaded: new Date().toISOString() } : d));
    } catch (err) { toast.error('Secure download failed'); }
  };

  const openPreview = async (doc) => {
    setPreviewDoc(doc); 
    setPreviewZoom(1); 
    setPreviewRotate(0);
    
    try {
      const token = localStorage.getItem('token');
      const detailsRes = await fetch(`/api/documents/${doc.id}/details`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (detailsRes.ok) {
        const detailsData = await detailsRes.json();
        if (detailsData.success) {
          setPreviewDoc(detailsData.data);
          setDocuments(documents.map(d => d.id === doc.id ? { ...d, lastViewed: new Date().toISOString() } : d));
        }
      }

      const blobRes = await fetch(`/api/documents/${doc.id}/view`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (blobRes.ok) {
        const blob = await blobRes.blob();
        setPreviewBlobUrl(window.URL.createObjectURL(blob));
      }
    } catch (err) { toast.error('Failed to load secure preview'); }
  };

  const closePreview = () => {
    setPreviewDoc(null);
    if (previewBlobUrl) {
      window.URL.revokeObjectURL(previewBlobUrl);
      setPreviewBlobUrl(null);
    }
  };

  const handleFolderSubmit = async (e) => {
    e.preventDefault();
    if (!folderModal.value.trim()) return;
    const token = localStorage.getItem('token');
    try {
      if (folderModal.type === 'create') {
        const res = await fetch('/api/folders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ name: folderModal.value })
        });
        const data = await res.json();
        if (data.success) {
          setCustomFolders([...customFolders, data.data]);
          toast.success('Folder created');
        } else toast.error(data.message);
      } else {
        const res = await fetch(`/api/folders/${folderModal.folderId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ name: folderModal.value })
        });
        const data = await res.json();
        if (data.success) {
          setCustomFolders(customFolders.map(f => f.id === folderModal.folderId ? { ...f, name: folderModal.value } : f));
          const oldName = customFolders.find(f => f.id === folderModal.folderId).name;
          setDocuments(documents.map(d => d.folder === oldName ? { ...d, folder: folderModal.value } : d));
          if (activeFolder === oldName) setActiveFolder(folderModal.value);
          toast.success('Folder renamed');
        } else toast.error(data.message);
      }
      setFolderModal({ isOpen: false, type: 'create', folderId: null, value: '' });
    } catch (err) { toast.error('Error saving folder'); }
  };

  const deleteFolder = async (folderId, folderName) => {
    if (!window.confirm(`Delete folder "${folderName}"? Documents inside will be moved to 'Other'.`)) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/folders/${folderId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setCustomFolders(customFolders.filter(f => f.id !== folderId));
        setDocuments(documents.map(d => d.folder === folderName ? { ...d, folder: 'Other' } : d));
        if (activeFolder === folderName) setActiveFolder('All Documents');
        toast.info('Folder deleted');
      } else toast.error(data.message);
    } catch (err) { toast.error('Error deleting folder'); }
  };

  // Expiry Logic
  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return null;
    const exp = new Date(expiryDate);
    const now = new Date();
    const diffTime = exp - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { label: 'Expired', color: 'bg-red-100 text-red-700 border-red-200' };
    if (diffDays <= 30) return { label: `Expires in ${diffDays} days`, color: 'bg-amber-100 text-amber-700 border-amber-200' };
    return { label: 'Valid', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
  };

  // Notifications for soon to expire
  useEffect(() => {
    if (documents.length > 0) {
      const expiringSoon = documents.filter(d => {
        if (!d.aiSummary?.expiryDate) return false;
        const diffDays = Math.ceil((new Date(d.aiSummary.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 30;
      });
      if (expiringSoon.length > 0 && !sessionStorage.getItem('expiryNotified')) {
        toast.warning(`You have ${expiringSoon.length} document(s) expiring within 30 days!`);
        sessionStorage.setItem('expiryNotified', 'true');
      }
    }
  }, [documents]);

  // Filtering
  const filteredDocs = documents.filter(d => {
    const matchesSearch = 
      d.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.category && d.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (d.folder && d.folder.toLowerCase().includes(searchTerm.toLowerCase()));

    let matchesFolder = false;
    if (activeFolder === 'All Documents') matchesFolder = true;
    else if (activeFolder === 'Favorites') matchesFolder = d.isFavorite;
    else if (activeFolder === 'Recent Uploads') {
      const days = (new Date() - new Date(d.uploadDate)) / (1000 * 60 * 60 * 24);
      matchesFolder = days <= 7; // Last 7 days
    }
    else if (activeFolder === 'Recently Viewed') matchesFolder = !!d.lastViewed;
    else if (activeFolder === 'Recent Downloads') matchesFolder = !!d.lastDownloaded;
    else matchesFolder = d.folder === activeFolder;

    return matchesSearch && matchesFolder;
  }).sort((a, b) => {
    if (activeFolder === 'Recently Viewed') return new Date(b.lastViewed || 0) - new Date(a.lastViewed || 0);
    if (activeFolder === 'Recent Downloads') return new Date(b.lastDownloaded || 0) - new Date(a.lastDownloaded || 0);
    return new Date(b.uploadDate) - new Date(a.uploadDate); // Default newest first
  });

  // Stats
  const totalSize = documents.reduce((acc, d) => acc + parseFloat(d.size.split(' ')[0] || 0), 0);
  const sizePercentage = Math.min((totalSize / 1024) * 100, 100); // Assume 1GB max
  const expiringCount = documents.filter(d => {
    if (!d.aiSummary?.expiryDate) return false;
    const diff = Math.ceil((new Date(d.aiSummary.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 30;
  }).length;
  const favoritesCount = documents.filter(d => d.isFavorite).length;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen flex flex-col relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-500" /> DigiVault
          </h1>
          <p className="text-slate-500 mt-1">Intelligent enterprise document storage.</p>
        </div>
        <label className="bg-brand-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-brand-500/30 hover:bg-brand-500 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-2">
          {isUploading ? <><Loader className="w-5 h-5 animate-spin" /> Uploading {uploadProgress}%</> : <><UploadCloud className="w-5 h-5" /> Upload Document</>}
          <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleFileChange} disabled={isUploading} />
        </label>
      </div>

      {/* Dashboard Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shrink-0"><Database className="w-6 h-6" /></div>
          <div className="flex-1">
            <p className="text-sm text-slate-500 font-medium">Storage Usage</p>
            <p className="text-xl font-bold text-slate-900">{totalSize.toFixed(1)} MB <span className="text-sm font-normal text-slate-400">/ 1 GB</span></p>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2"><div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${sizePercentage}%` }}></div></div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center shrink-0"><Clock className="w-6 h-6" /></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Expiring Soon</p>
            <p className="text-xl font-bold text-slate-900">{expiringCount} <span className="text-sm font-normal text-slate-400">documents</span></p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center shrink-0"><PieChart className="w-6 h-6" /></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Document Stats</p>
            <p className="text-sm font-bold text-slate-900">{documents.length} Total • {favoritesCount} Favorites</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search intelligent vault..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none" />
          </div>
          
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">Smart Folders</h3>
            {[
              { name: 'All Documents', icon: Folder, count: documents.length },
              { name: 'Favorites', icon: Star, count: favoritesCount },
              { name: 'Recent Uploads', icon: UploadCloud, count: documents.filter(d => (new Date() - new Date(d.uploadDate)) / 86400000 <= 7).length },
              { name: 'Recently Viewed', icon: Eye, count: documents.filter(d => !!d.lastViewed).length },
              { name: 'Recent Downloads', icon: Download, count: documents.filter(d => !!d.lastDownloaded).length }
            ].map((f, i) => (
              <button key={i} onClick={() => setActiveFolder(f.name)} className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeFolder === f.name ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                <div className="flex items-center gap-3"><f.icon className={`w-4 h-4 ${activeFolder === f.name ? 'text-brand-500' : 'text-slate-400'}`} /> {f.name}</div>
                <span className="text-xs opacity-50">{f.count}</span>
              </button>
            ))}
            
            <div className="pt-4 pb-2 flex items-center justify-between px-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Vault Folders</h3>
              <button onClick={() => setFolderModal({ isOpen: true, type: 'create', folderId: null, value: '' })} className="text-brand-500 hover:bg-brand-50 p-1 rounded" title="Create Folder"><Plus className="w-4 h-4" /></button>
            </div>
            
            <div className="max-h-[30vh] overflow-y-auto space-y-1 hide-scrollbar">
              {[...defaultFolders, ...customFolders.map(f => f.name)].map((cat, i) => {
                const count = documents.filter(d => d.folder === cat).length;
                const isCustom = customFolders.some(f => f.name === cat);
                const customFolderObj = isCustom ? customFolders.find(f => f.name === cat) : null;

                return (
                  <div key={i} className="relative group flex items-center">
                    <button onClick={() => setActiveFolder(cat)} className={`flex-1 flex items-center justify-between px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeFolder === cat ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                      <div className="flex items-center gap-3 truncate"><Folder className={`w-4 h-4 ${activeFolder === cat ? 'text-brand-500' : 'text-slate-400'}`} /> <span className="truncate">{cat}</span></div>
                      <span className="text-xs opacity-50 ml-2">{count}</span>
                    </button>
                    {isCustom && (
                      <div className="relative ml-1">
                        <button onClick={(e) => { e.stopPropagation(); setFolderDropdown(folderDropdown === cat ? null : cat); }} className={`p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 ${folderDropdown === cat ? 'bg-slate-100 text-slate-700' : 'opacity-0 group-hover:opacity-100'}`}><MoreVertical className="w-4 h-4" /></button>
                        {folderDropdown === cat && (
                          <div className="absolute right-0 mt-1 w-32 bg-white border border-slate-200 shadow-xl rounded-xl py-1 z-50">
                            <button onClick={(e) => { e.stopPropagation(); setFolderModal({ isOpen: true, type: 'rename', folderId: customFolderObj.id, value: cat }); setFolderDropdown(null); }} className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">Rename</button>
                            <button onClick={(e) => { e.stopPropagation(); deleteFolder(customFolderObj.id, cat); setFolderDropdown(null); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Delete</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Files Grid */}
        <div className={`lg:col-span-3 transition-colors rounded-3xl ${isDragging ? 'bg-brand-50 border-2 border-brand-500 border-dashed p-4' : ''}`} onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }} onDrop={onDrop}>
          {isDragging ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] pointer-events-none">
              <UploadCloud className="w-16 h-16 text-brand-500 mb-4 animate-bounce" />
              <h2 className="text-2xl font-bold text-brand-700">Drop files to upload</h2>
            </div>
          ) : (
            <>
              {isUploading && (
                <div className="mb-6 bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center shrink-0"><UploadCloud className="w-5 h-5 text-brand-600 animate-pulse" /></div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1"><span className="text-sm font-bold text-slate-700">Analyzing & Uploading securely...</span><span className="text-sm font-bold text-brand-600">{uploadProgress}%</span></div>
                    <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-brand-500 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div></div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 content-start">
                <AnimatePresence>
                  {filteredDocs.map((doc, i) => {
                    const expStatus = getExpiryStatus(doc.aiSummary?.expiryDate);
                    return (
                    <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }} key={doc.id} className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-lg hover:border-brand-300 transition-all group relative">
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10 bg-white/90 backdrop-blur rounded-lg shadow-sm border border-slate-100 p-1">
                        <button onClick={(e) => toggleFavorite(doc.id, e)} className={`p-1.5 rounded-lg transition-colors ${doc.isFavorite ? 'text-amber-500 bg-amber-50' : 'text-slate-400 hover:bg-amber-50 hover:text-amber-500'}`}><Star className="w-4 h-4" fill={doc.isFavorite ? "currentColor" : "none"} /></button>
                        <button onClick={() => openPreview(doc)} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
                        <button onClick={(e) => downloadDoc(doc.id, doc.originalName, e)} className="p-1.5 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors"><Download className="w-4 h-4" /></button>
                        <div className="relative">
                          <button onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === doc.id ? null : doc.id); }} className={`p-1.5 rounded-lg transition-colors ${activeDropdown === doc.id ? 'bg-slate-100 text-slate-700' : 'hover:bg-slate-50 text-slate-500'}`}><MoreVertical className="w-4 h-4" /></button>
                          {activeDropdown === doc.id && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 shadow-xl rounded-xl py-1 z-50">
                              <button onClick={(e) => { e.stopPropagation(); setRenameDoc(doc); setRenameValue(doc.originalName); setActiveDropdown(null); }} className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"><Edit2 className="w-4 h-4" /> Rename</button>
                              <button onClick={(e) => { e.stopPropagation(); setMoveDoc(doc); setActiveDropdown(null); }} className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"><Move className="w-4 h-4" /> Move to...</button>
                              <div className="h-px bg-slate-100 my-1"></div>
                              <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteDoc(doc); setActiveDropdown(null); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 className="w-4 h-4" /> Delete</button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center cursor-pointer ${doc.type === 'pdf' ? 'bg-red-50 text-red-500 group-hover:bg-red-100' : 'bg-blue-50 text-blue-500 group-hover:bg-blue-100'} transition-colors`} onClick={() => openPreview(doc)}>
                        {doc.type === 'pdf' ? <FileText className="w-6 h-6" /> : <File className="w-6 h-6" />}
                      </div>
                      
                      <h4 className="font-bold text-slate-900 truncate mb-1 cursor-pointer hover:text-brand-600 transition-colors" title={doc.originalName} onClick={() => openPreview(doc)}>{doc.originalName}</h4>
                      <div className="flex justify-between items-center text-[11px] text-slate-500 font-medium">
                        <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                        <span>{doc.size}</span>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-2 overflow-hidden">
                        <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase truncate max-w-full">{doc.folder || 'Other'}</span>
                        {expStatus && <span className={`inline-block px-2 py-1 border rounded-md text-[10px] font-bold uppercase truncate max-w-full ${expStatus.color}`}>{expStatus.label}</span>}
                      </div>
                    </motion.div>
                  )})}
                </AnimatePresence>
              </div>
              
              {filteredDocs.length === 0 && !isUploading && (
                <div className="text-center py-24 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 mt-4">
                  <UploadCloud className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-900">No documents found</h3>
                  <label className="bg-white border border-slate-200 text-slate-700 px-6 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition-colors cursor-pointer inline-flex items-center gap-2 shadow-sm mt-4">
                    Browse Files
                    <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Duplicate Modal */}
      <AnimatePresence>
        {duplicateFiles.length > 0 && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center shrink-0"><ArrowRightLeft className="w-6 h-6" /></div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Duplicate Detected</h3>
                  <p className="text-slate-500 text-sm mt-1">A file named <strong className="text-slate-800">{duplicateFiles[currentDuplicateIndex].newFile.name}</strong> already exists in your vault.</p>
                  <p className="text-xs text-slate-400 mt-2">File {currentDuplicateIndex + 1} of {duplicateFiles.length}</p>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Existing File</span>
                  <p className="text-sm font-medium text-slate-800">{duplicateFiles[currentDuplicateIndex].existingDoc.size}</p>
                  <p className="text-xs text-slate-500">{new Date(duplicateFiles[currentDuplicateIndex].existingDoc.uploadDate).toLocaleString()}</p>
                </div>
                <div className="w-px bg-slate-200 hidden md:block"></div>
                <div className="flex-1">
                  <span className="text-xs font-bold text-brand-500 uppercase tracking-wider block mb-1">New Upload</span>
                  <p className="text-sm font-medium text-slate-800">{(duplicateFiles[currentDuplicateIndex].newFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  <p className="text-xs text-slate-500">Just now</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => handleDuplicateAction('cancel')} className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 rounded-xl transition-colors">Skip</button>
                <button onClick={() => handleDuplicateAction('keep')} className="flex-1 py-3 bg-blue-50 text-blue-600 font-bold hover:bg-blue-100 rounded-xl transition-colors">Keep Both</button>
                <button onClick={() => handleDuplicateAction('replace')} className="flex-1 py-3 bg-brand-600 text-white font-bold hover:bg-brand-700 rounded-xl transition-colors shadow-lg">Replace</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewDoc && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex flex-col bg-slate-900/95 backdrop-blur-sm">
            <div className="h-16 border-b border-white flex items-center justify-between px-6 bg-slate-900">
              <div className="flex items-center gap-4 text-white">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${previewDoc.type === 'pdf' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  {previewDoc.type === 'pdf' ? <FileText className="w-5 h-5" /> : <File className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold truncate max-w-[200px] md:max-w-md">{previewDoc.originalName}</h3>
                  <p className="text-xs text-slate-400">{previewDoc.size} • {previewDoc.folder || 'Other'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setPreviewZoom(z => Math.max(0.5, z - 0.25))} className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Zoom Out"><ZoomOut className="w-5 h-5" /></button>
                <button onClick={() => setPreviewZoom(z => Math.min(3, z + 0.25))} className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Zoom In"><ZoomIn className="w-5 h-5" /></button>
                <button onClick={() => setPreviewRotate(r => r + 90)} className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Rotate"><RotateCw className="w-5 h-5" /></button>
                <div className="w-px h-6 bg-white/20 mx-2"></div>
                <button onClick={closePreview} className="p-2 text-slate-300 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors" title="Close"><X className="w-6 h-6" /></button>
              </div>
            </div>
            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 overflow-auto flex items-center justify-center p-8 bg-slate-900/50">
                {!previewBlobUrl ? (
                  <div className="text-white flex flex-col items-center"><Loader className="w-8 h-8 animate-spin mb-2" /> Loading securely...</div>
                ) : previewDoc.type === 'pdf' ? (
                  <div className="w-full h-full max-w-4xl bg-white rounded-xl overflow-hidden shadow-2xl ring-1 ring-white" style={{ transform: `scale(${previewZoom}) rotate(${previewRotate}deg)`, transition: 'transform 0.2s' }}>
                    <iframe src={`${previewBlobUrl}#toolbar=0`} className="w-full h-full border-0" title="PDF Preview"></iframe>
                  </div>
                ) : (
                  <img src={previewBlobUrl} alt={previewDoc.originalName} className="max-w-full max-h-full object-contain rounded-xl shadow-2xl ring-1 ring-white" style={{ transform: `scale(${previewZoom}) rotate(${previewRotate}deg)`, transition: 'transform 0.2s' }} />
                )}
              </div>
              <div className="w-full max-w-sm bg-white overflow-y-auto border-l border-slate-200 flex flex-col">
                <div className="p-6 bg-gradient-to-br from-brand-50 to-white border-b border-brand-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center"><Sparkles className="w-5 h-5" /></div>
                  <div><h2 className="text-lg font-bold text-slate-900">AI Analysis</h2><p className="text-xs text-brand-600 font-medium">Intelligent Vault</p></div>
                </div>
                {previewDoc.aiSummary ? (
                  <div className="p-6 space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Document Details</h4>
                      <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between items-start border-b border-slate-200 pb-2"><span className="text-sm text-slate-500">Type</span><span className="text-sm font-bold text-slate-900 text-right">{previewDoc.aiSummary.documentType}</span></div>
                        <div className="flex justify-between items-start border-b border-slate-200 pb-2"><span className="text-sm text-slate-500">Issued By</span><span className="text-sm font-bold text-slate-900 text-right">{previewDoc.aiSummary.issuedBy}</span></div>
                        {previewDoc.aiSummary.documentNumber && (
                          <div className="flex justify-between items-start border-b border-slate-200 pb-2 bg-brand-50/50 -mx-4 px-4 py-2">
                            <span className="text-sm text-slate-500 font-medium">ID Number</span><span className="text-sm font-mono font-bold text-brand-700 tracking-wider text-right">{previewDoc.aiSummary.documentNumber}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-start border-b border-slate-200 pb-2">
                          <span className="text-sm text-slate-500">Expiry</span>
                          <span className="text-sm font-bold text-slate-900 text-right">
                            {previewDoc.aiSummary.expiryDate ? new Date(previewDoc.aiSummary.expiryDate).toLocaleDateString() : previewDoc.aiSummary.validity}
                          </span>
                        </div>
                        <div className="flex justify-between items-start"><span className="text-sm text-slate-500">Purpose</span><span className="text-sm font-bold text-slate-900 text-right max-w-[150px]">{previewDoc.aiSummary.purpose}</span></div>
                      </div>
                    </div>
                    <div><h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Important Notes</h4><div className="bg-amber-50 text-amber-800 p-4 rounded-xl text-sm flex items-start gap-3"><AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" /><p>{previewDoc.aiSummary.importantNotes}</p></div></div>
                    {previewDoc.aiSummary.usefulServices?.length > 0 && (
                      <div><h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Useful Services</h4><div className="space-y-2">{previewDoc.aiSummary.usefulServices.map((service, idx) => <div key={idx} className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-xl"><ShieldCheck className="w-4 h-4 text-brand-500 shrink-0" /><span className="text-sm font-medium text-slate-700">{service}</span></div>)}</div></div>
                    )}
                    {previewDoc.aiSummary.usefulSchemes?.length > 0 && (
                      <div><h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Relevant Schemes</h4><div className="space-y-2">{previewDoc.aiSummary.usefulSchemes.map((scheme, idx) => <div key={idx} className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-xl"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /><span className="text-sm font-medium text-slate-700">{scheme}</span></div>)}</div></div>
                    )}
                  </div>
                ) : <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500"><Loader className="w-8 h-8 text-slate-300 animate-spin mb-4" /><p>AI Analysis is not available.</p></div>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rename, Move, Delete, Folder Modals */}
      <AnimatePresence>
        {renameDoc && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Rename Document</h3>
              <form onSubmit={doRenameDoc}>
                <input type="text" value={renameValue} onChange={(e) => setRenameValue(e.target.value)} autoFocus className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none mb-6" placeholder="Document Name" />
                <div className="flex gap-3">
                  <button type="button" onClick={() => setRenameDoc(null)} className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-brand-600 text-white font-bold hover:bg-brand-700 rounded-xl transition-colors shadow-lg">Save</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {moveDoc && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-900">Move Document</h3>
                <button onClick={() => setMoveDoc(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto space-y-1 mb-6 pr-2 custom-scrollbar">
                {['Other', ...defaultFolders, ...customFolders.map(f => f.name)].map((cat, i) => (
                  <button key={i} onClick={() => doMoveDoc(cat)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${moveDoc.folder === cat ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                    <Folder className={`w-5 h-5 ${moveDoc.folder === cat ? 'text-brand-500' : 'text-slate-400'}`} /> {cat} {moveDoc.folder === cat && <span className="ml-auto text-xs font-bold px-2 py-1 bg-brand-100 rounded-md">Current</span>}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {folderModal.isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">{folderModal.type === 'create' ? 'Create Folder' : 'Rename Folder'}</h3>
              <form onSubmit={handleFolderSubmit}>
                <input type="text" value={folderModal.value} onChange={(e) => setFolderModal({ ...folderModal, value: e.target.value })} autoFocus className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none mb-6" placeholder="Folder Name" />
                <div className="flex gap-3">
                  <button type="button" onClick={() => setFolderModal({ isOpen: false, type: 'create', folderId: null, value: '' })} className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-brand-600 text-white font-bold hover:bg-brand-700 rounded-xl transition-colors shadow-lg">{folderModal.type === 'create' ? 'Create' : 'Save'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDeleteDoc && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle className="w-8 h-8" /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Document?</h3>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setConfirmDeleteDoc(null)} className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl">Cancel</button>
                <button onClick={doDeleteDoc} className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentVault;
