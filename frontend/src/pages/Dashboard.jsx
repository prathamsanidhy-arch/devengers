import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await api.get('/complaints');
        const complaints = data.data;
        
        setStats({
          total: complaints.length,
          pending: complaints.filter(c => c.status === 'Pending').length,
          resolved: complaints.filter(c => c.status === 'Resolved').length,
        });
        
        setRecentComplaints(complaints.slice(0, 3));
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
        <p className="mt-4 text-slate-500 animate-pulse">Loading your dashboard...</p>
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
              Welcome back, {user?.name ? user.name.split(' ')[0] : 'Citizen'}
            </h1>
            <p className="text-slate-300 text-lg max-w-xl">
              Your civic dashboard is updated. You have <span className="text-brand-400 font-semibold">{stats.pending} pending</span> requests requiring attention.
            </p>
          </div>
          <div className="flex gap-4">
            <Link to="/submit" className="bg-brand-500 hover:bg-brand-400 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-brand-500/30 flex items-center gap-2">
              <FileText className="w-5 h-5" /> Report Issue
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
            <p className="text-sm font-medium text-slate-500">Total Reports</p>
            <h3 className="text-3xl font-bold text-slate-900">{stats.total}</h3>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pending Action</p>
            <h3 className="text-3xl font-bold text-slate-900">{stats.pending}</h3>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Resolved</p>
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
            <h2 className="text-xl font-bold text-slate-900">Recent Complaints</h2>
            <Link to="/history" className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recentComplaints.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
              <FileText className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-2 text-sm font-semibold text-slate-900">No complaints</h3>
              <p className="mt-1 text-sm text-slate-500">You haven't reported any issues yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentComplaints.map((complaint) => (
                <Link key={complaint._id} to={`/complaints/${complaint._id}`} className="block group">
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
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
            <h2 className="text-xl font-bold text-slate-900">Smart Insights</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover-lift">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
                <Landmark className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Discover Govt Schemes</h3>
              <p className="text-sm text-slate-600 mb-4">Our AI has identified 5 new welfare schemes you might be eligible for.</p>
              <Link to="/schemes" className="text-sm font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1">
                Check Eligibility <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover-lift">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Community Trends</h3>
              <p className="text-sm text-slate-600">Water & Sanitation issues are currently trending in your locality.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
