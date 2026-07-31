import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Clock, AlertTriangle, Building2, FileText, CheckCircle2, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
const ComplaintDetails = () => {
  const {
    t
  } = useTranslation();
  const {
    id
  } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const {
          data
        } = await api.get(`/complaints/${id}`);
        setComplaint(data.data);
      } catch (error) {
        console.error('Failed to fetch complaint details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id]);
  const downloadPDF = () => {
    const input = document.getElementById('report-content');
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = canvas.height * pdfWidth / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Report_${id}.pdf`);
    });
  };
  if (loading) {
    return <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>;
  }
  if (!complaint) {
    return <div className="text-center py-20 text-slate-500">{t("ComplaintDetails.complaint_not_found")}</div>;
  }
  return <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link to="/history" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />{t("ComplaintDetails.back_to_history")}</Link>
        <button onClick={downloadPDF} className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
          <Download className="w-4 h-4" />{t("ComplaintDetails.download_pdf_report")}</button>
      </div>

      <div id="report-content" className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Header Section */}
        <div className="relative p-8 sm:p-10 border-b border-slate-100 bg-slate-50">
          <div className="flex flex-col md:flex-row gap-8 justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-100 text-brand-700 border border-brand-200">
                  {complaint.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${complaint.priority === 'Critical' ? 'bg-red-100 text-red-700 border-red-200' : complaint.priority === 'High' ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-blue-100 text-blue-700 border-blue-200'}`}>
                  {complaint.priority}{t("ComplaintDetails.priority")}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">{complaint.title}</h1>
              
              <div className="flex flex-wrap gap-6 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400" />{t("ComplaintDetails.id")}{complaint._id.substring(0, 8).toUpperCase()}
                </div>
              </div>
            </div>
            
            <div className="md:w-64 flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
               <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">{t("ComplaintDetails.current_status")}</h3>
               <div className={`flex items-center justify-center gap-2 text-xl font-bold ${complaint.status === 'Resolved' ? 'text-emerald-600' : complaint.status === 'In Progress' ? 'text-blue-600' : 'text-amber-600'}`}>
                 {complaint.status === 'Resolved' && <CheckCircle2 className="w-6 h-6" />}
                 {complaint.status === 'In Progress' && <Clock className="w-6 h-6" />}
                 {complaint.status === 'Pending' && <Clock className="w-6 h-6" />}
                 {complaint.status}
               </div>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-3">{t("ComplaintDetails.description")}</h3>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{complaint.description}</p>
              </div>
            </section>

            {/* Evidence Image */}
            {complaint.imageUrl && <section>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{t("ComplaintDetails.evidence_photo")}</h3>
                <div className="rounded-2xl overflow-hidden border border-slate-200">
                  <img src={`http://localhost:5000${complaint.imageUrl}`} alt={t("ComplaintDetails.evidence")} className="w-full h-auto object-cover max-h-96" />
                </div>
              </section>}

            {/* Timeline */}
            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-6">{t("ComplaintDetails.resolution_timeline")}</h3>
              <div className="relative border-l-2 border-slate-200 ml-3 space-y-8">
                {complaint.timeline.map((event, index) => <div key={index} className="relative pl-8">
                    <div className={`absolute -left-3 top-1 w-6 h-6 rounded-full border-4 border-white ${index === complaint.timeline.length - 1 ? 'bg-brand-500' : 'bg-slate-300'}`}></div>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-slate-900">{event.status}</span>
                        <span className="text-xs text-slate-500">{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-slate-600">{event.description}</p>
                    </div>
                  </div>)}
              </div>
            </section>
          </div>

          {/* AI Insights Sidebar */}
          <div className="space-y-6">
             <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-indigo-900">{t("ComplaintDetails.ai_assessment")}</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white/60 p-3 rounded-xl border border-white">
                    <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-1">{t("ComplaintDetails.assigned_department")}</p>
                    <p className="text-sm font-bold text-slate-900">{complaint.category === 'Infrastructure' ? 'PWD / Municipal Corp' : 'Water & Sanitation Dept'}</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded-xl border border-white">
                    <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-1">{t("ComplaintDetails.estimated_resolution")}</p>
                    <p className="text-sm font-bold text-slate-900">{t("ComplaintDetails.48_72_hours")}</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded-xl border border-white">
                    <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-1">{t("ComplaintDetails.risk_level")}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-2 flex-1 bg-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full ${complaint.priority === 'Critical' ? 'bg-red-500 w-full' : complaint.priority === 'High' ? 'bg-orange-500 w-3/4' : 'bg-blue-500 w-1/2'}`}></div>
                      </div>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>;
};
export default ComplaintDetails;