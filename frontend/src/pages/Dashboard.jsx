import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Landmark, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Activity
} from 'lucide-react';
import api from '../api/axios';

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  
  // DigiVault Stats
  const [vaultDocs, setVaultDocs] = useState([]);
  const [storageUsage, setStorageUsage] = useState(0);
  const [expiringDocs, setExpiringDocs] = useState(0);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [complaintRes, vaultRes] = await Promise.all([
          api.get('/complaints'),
          fetch('/api/documents', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json())
        ]);
        
        const complaints = complaintRes.data.data;
        
        setStats({
          total: complaints.length,
          pending: complaints.filter(c => c.status === 'Pending').length,
          resolved: complaints.filter(c => c.status === 'Resolved').length,
        });
        
        setRecentComplaints(complaints.slice(0, 3));

        if (vaultRes.success) {
          const docs = vaultRes.data;
          setVaultDocs(docs.slice(0, 3)); // Recent 3
          
          let size = 0;
          let expiring = 0;
          docs.forEach(d => {
            size += parseFloat(d.size.split(' ')[0] || 0);
            if (d.aiSummary?.expiryDate) {
              const diffDays = Math.ceil((new Date(d.aiSummary.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
              if (diffDays >= 0 && diffDays <= 30) expiring++;
            }
          });
          setStorageUsage(size.toFixed(1));
          setExpiringDocs(expiring);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 animate-pulse">{t('dashboard.loading')}</p>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gov-900 rounded-3xl overflow-hidden shadow-2xl p-8 sm:p-10"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {t('dashboard.welcomeBack')}, {user?.name ? user.name.split(' ')[0] : t('dashboard.citizen')}
            </h1>
            <p className="text-slate-300 text-lg max-w-xl">
              {t('dashboard.dashboardUpdated')} <span className="text-brand-400 font-semibold">{stats.pending} {t('dashboard.pending')}</span> {t('dashboard.pendingRequests')}
            </p>
          </div>
          <div className="flex gap-4">
            <Link to="/submit" className="bg-brand-500 hover:bg-brand-400 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-brand-500/30 flex items-center gap-2">
              <FileText className="w-5 h-5" /> {t('dashboard.reportIssue')}
            </Link>
          </div>
        </div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Stats Widgets */}
        <motion.div variants={itemVariants} className="glass-card p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">{t('dashboard.totalReports')}</p>
            <h3 className="text-3xl font-bold text-slate-900">{stats.total}</h3>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">{t('dashboard.pendingAction')}</p>
            <h3 className="text-3xl font-bold text-slate-900">{stats.pending}</h3>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">{t('dashboard.resolved')}</p>
            <h3 className="text-3xl font-bold text-slate-900">{stats.resolved}</h3>
          </div>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Timeline */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass-card p-6 sm:p-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">{t('dashboard.recentComplaints')}</h2>
            <Link to="/history" className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
              {t('dashboard.viewAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recentComplaints.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
              <FileText className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-2 text-sm font-semibold text-slate-900">{t('dashboard.noComplaints')}</h3>
              <p className="mt-1 text-sm text-slate-500">{t('dashboard.noComplaintsDesc')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentComplaints.map((complaint) => (
                <Link key={complaint._id} to={`/complaints/${complaint._id}`} className="block group">
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-12 rounded-full ${complaint.status === 'Resolved' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                      <div>
                        <h4 className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">{complaint.title}</h4>
                        <p className="text-sm text-slate-500">{new Date(complaint.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        complaint.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {complaint.status}
                      </span>
                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-brand-500 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Smart Recommendations */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 sm:p-8 bg-gradient-to-b from-white to-brand-50 border-brand-100"
        >
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-brand-500" />
            <h2 className="text-xl font-bold text-slate-900">{t('dashboard.smartInsights')}</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover-lift">
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Landmark className="w-5 h-5" />
                </div>
                {expiringDocs > 0 && (
                  <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs font-bold animate-pulse">{expiringDocs} {t('dashboard.expiringSoon')}</span>
                )}
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{t('dashboard.digiVaultStatus')}</h3>
              <p className="text-sm text-slate-600 mb-3">{t('dashboard.storageUsage', { usage: storageUsage })}</p>
              
              <div className="space-y-2 mb-4">
                {vaultDocs.map((doc, idx) => (
                   <div key={idx} className="text-xs flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-100">
                     <FileText className="w-3 h-3 text-slate-400" />
                     <span className="truncate flex-1 font-medium text-slate-700">{doc.originalName}</span>
                     <span className="text-slate-400">{new Date(doc.uploadDate).toLocaleDateString()}</span>
                   </div>
                ))}
              </div>

              <Link to="/vault" className="text-sm font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1">
                {t('dashboard.openDigiVault')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover-lift">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{t('dashboard.discoverGovtSchemes')}</h3>
              <p className="text-sm text-slate-600 mb-4">{t('dashboard.aiSchemesDesc')}</p>
              <Link to="/schemes" className="text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1">
                {t('dashboard.checkEligibility')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
