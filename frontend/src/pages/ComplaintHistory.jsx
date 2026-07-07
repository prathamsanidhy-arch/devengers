import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const ComplaintHistory = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data } = await api.get('/complaints');
        setComplaints(data.data);
        setFilteredComplaints(data.data);
      } catch (error) {
        console.error('Failed to fetch complaints', error);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  useEffect(() => {
    let result = complaints;
    if (filterStatus !== 'All') {
      result = result.filter(c => c.status === filterStatus);
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(lower) || 
        c.category.toLowerCase().includes(lower)
      );
    }
    setFilteredComplaints(result);
  }, [searchTerm, filterStatus, complaints]);

  const StatusBadge = ({ status }) => {
    const styles = {
      'Pending': 'bg-amber-100 text-amber-700 border-amber-200',
      'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
      'Resolved': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    };
    const icons = {
      'Pending': <Clock className="w-3.5 h-3.5 mr-1" />,
      'In Progress': <AlertCircle className="w-3.5 h-3.5 mr-1" />,
      'Resolved': <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles['Pending']}`}>
        {icons[status] || icons['Pending']}
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Reports</h1>
          <p className="text-slate-500 mt-1">Track and manage your civic issues</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search reports..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 w-full sm:w-auto appearance-none rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {filteredComplaints.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No reports found</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-6">
            {searchTerm || filterStatus !== 'All' 
              ? "We couldn't find any complaints matching your filters." 
              : "You haven't reported any issues yet. Help us improve the city!"}
          </p>
          <Link to="/submit" className="bg-brand-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-md hover:bg-brand-500 transition-colors">
            Report an Issue
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComplaints.map((complaint, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={complaint._id} 
            >
              <Link to={`/complaints/${complaint._id}`} className="block h-full group">
                <div className="glass-card h-full overflow-hidden hover-lift flex flex-col">
                  {complaint.imageUrl ? (
                    <div className="h-48 w-full overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10"></div>
                      <img 
                        src={`http://localhost:5000${complaint.imageUrl}`} 
                        alt="Issue" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <div className="absolute bottom-3 left-4 z-20">
                        <StatusBadge status={complaint.status} />
                      </div>
                    </div>
                  ) : (
                    <div className="h-4 bg-gradient-brand w-full"></div>
                  )}
                  
                  <div className="p-5 flex-1 flex flex-col">
                    {!complaint.imageUrl && (
                      <div className="mb-3"><StatusBadge status={complaint.status} /></div>
                    )}
                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-brand-600 transition-colors">
                      {complaint.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-1">
                      {complaint.description}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                      <div className="flex items-center text-xs text-slate-500 gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-xs font-semibold text-brand-600 gap-1">
                        View Details <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComplaintHistory;
