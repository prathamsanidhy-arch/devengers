import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, UploadCloud, Folder, Search, MoreVertical, 
  Download, Trash2, Eye, ShieldCheck, File
} from 'lucide-react';
import { toast } from 'react-toastify';

const DocumentVault = () => {
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Aadhaar_Card.pdf', category: 'Identity', date: '2026-05-12', size: '2.4 MB', type: 'pdf' },
    { id: 2, name: 'Driving_License.jpg', category: 'Transport', date: '2026-06-01', size: '1.1 MB', type: 'image' },
    { id: 3, name: 'Income_Certificate_2025.pdf', category: 'Revenue', date: '2026-06-15', size: '3.5 MB', type: 'pdf' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newDoc = {
        id: Date.now(),
        name: file.name,
        category: 'Uncategorized',
        date: new Date().toISOString().split('T')[0],
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        type: file.type.includes('image') ? 'image' : 'pdf'
      };
      setDocuments([newDoc, ...documents]);
      toast.success('Document encrypted and stored securely!');
    }
  };

  const deleteDoc = (id) => {
    setDocuments(documents.filter(d => d.id !== id));
    toast.info('Document deleted permanently');
  };

  const filteredDocs = documents.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-500" /> DigiVault
          </h1>
          <p className="text-slate-500 mt-1">Government-grade encrypted document storage.</p>
        </div>
        
        <label className="bg-brand-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-brand-500/30 hover:bg-brand-500 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-2">
          <UploadCloud className="w-5 h-5" /> Upload Document
          <input type="file" className="hidden" onChange={handleUpload} />
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search files..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none"
            />
          </div>
          
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-2">Folders</h3>
          {['All Documents', 'Identity', 'Transport', 'Revenue', 'Education'].map((cat, i) => (
            <button key={i} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${i === 0 ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Folder className={`w-5 h-5 ${i === 0 ? 'text-brand-500' : 'text-slate-400'}`} /> {cat}
            </button>
          ))}
        </div>

        {/* Files Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredDocs.map((doc, i) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                key={doc.id} className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-lg transition-shadow group relative"
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button className="p-1.5 bg-slate-100 hover:bg-blue-100 text-blue-600 rounded-lg"><Eye className="w-4 h-4" /></button>
                  <button className="p-1.5 bg-slate-100 hover:bg-emerald-100 text-emerald-600 rounded-lg"><Download className="w-4 h-4" /></button>
                  <button onClick={() => deleteDoc(doc.id)} className="p-1.5 bg-slate-100 hover:bg-red-100 text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
                
                <div className={`w-14 h-14 rounded-2xl mb-4 flex items-center justify-center ${doc.type === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                  {doc.type === 'pdf' ? <FileText className="w-7 h-7" /> : <File className="w-7 h-7" />}
                </div>
                
                <h4 className="font-bold text-slate-900 truncate mb-1" title={doc.name}>{doc.name}</h4>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>{doc.date}</span>
                  <span>{doc.size}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">{doc.category}</span>
                </div>
              </motion.div>
            ))}
          </div>
          
          {filteredDocs.length === 0 && (
             <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl">
               <UploadCloud className="w-12 h-12 text-slate-300 mx-auto mb-3" />
               <h3 className="text-lg font-bold text-slate-900">No documents found</h3>
               <p className="text-slate-500">Upload your first secure document</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentVault;
