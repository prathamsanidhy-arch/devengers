import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Info,
  BookmarkPlus,
  BookmarkCheck,
  ShieldCheck,
  FileText,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Award
} from 'lucide-react';

const SchemeCard = ({ scheme, isSaved, toggleSave }) => {
  const [expanded, setExpanded] = useState(false);

  const getBadgeColors = (badge) => {
    switch (badge) {
      case 'Eligible': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Partially Eligible': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Not Eligible': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
    >
      <div className="p-6 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0 text-brand-600">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{scheme.schemeName}</h3>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getBadgeColors(scheme.eligibilityBadge)}`}>
                  {scheme.eligibilityBadge || 'Eligible'}
                </span>
                <span className="text-sm font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span className="text-brand-600">{scheme.eligibilityPercentage}%</span> Match
                </span>
                <span className="text-sm font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {scheme.estimatedProcessingTime || '15-30 Days'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); toggleSave(scheme); }}
              className={`p-2 rounded-lg transition-colors ${isSaved ? 'bg-brand-50 text-brand-600' : 'text-slate-400 hover:bg-slate-100'}`}
            >
              {isSaved ? <BookmarkCheck className="w-6 h-6" /> : <BookmarkPlus className="w-6 h-6" />}
            </button>
            <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
              {expanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-slate-600 text-sm line-clamp-2">{scheme.benefitSummary}</p>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-100"
          >
            <div className="p-6 bg-slate-50">
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex gap-3 mb-6">
                <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-900 uppercase tracking-wider mb-1">Eligibility Reasoning</h4>
                  <p className="text-sm text-emerald-800">{scheme.whyEligible}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-500" /> Application Tips
                  </h4>
                  <ul className="space-y-2">
                    {scheme.applicationTips?.map((b, i) => (
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
                    {scheme.requiredDocuments?.map((d, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 flex-shrink-0"></div>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {scheme.importantNotes && (
                <div className="bg-amber-50 rounded-lg p-4 text-sm text-amber-800 flex items-start gap-3 mb-6">
                  <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Important Notes</h4>
                    <p>{scheme.importantNotes}</p>
                  </div>
                </div>
              )}
              
              {scheme.suggestedNextSteps && (
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-slate-900 mb-2">Suggested Next Steps</h4>
                  <p className="text-sm text-slate-600">{scheme.suggestedNextSteps}</p>
                </div>
              )}

              <div className="flex gap-4">
                <button className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl font-medium shadow-sm flex justify-center items-center gap-2 transition-colors">
                  Apply Now <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SchemeCard;
