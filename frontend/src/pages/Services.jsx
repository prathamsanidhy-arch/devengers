import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { servicesData } from '../data/servicesData';
import { 
  FileText, Shield, CreditCard, Zap, Home, Droplets, Car, 
  HeartPulse, Scale, Search, Filter, Bookmark, ExternalLink,
  History, Sparkles, FileBadge, Scroll, ArrowRight,
  Landmark, HeartHandshake, Users
} from 'lucide-react';

const iconMap = {
  Shield, CreditCard, Zap, Home, Droplets, Car, HeartPulse, Scale, FileText, FileBadge, Scroll, Landmark, HeartHandshake, Users
};

const officialLogos = {
  'pan-card': '/logos/pan.svg',
  'aadhaar-card': '/logos/aadhaar.svg',
  'passport': '/logos/passport.svg',
  'driving-license': '/logos/driving-license.svg',
  'voter-id': '/logos/voter-id.svg',
  'health-card': '/logos/health-card.png',
};

const ServiceLogo = ({ serviceId, title, size = 'md' }) => {
  const [error, setError] = useState(false);
  const logoUrl = officialLogos[serviceId];
  const containerClasses = size === 'sm' ? 'w-10 h-10 p-1' : 'w-12 h-12 p-1.5';
  const iconSize = size === 'sm' ? 20 : 24;

  if (logoUrl && !error) {
    return (
      <div className={`${containerClasses} rounded-xl flex items-center justify-center bg-white shadow-sm border border-slate-100 shrink-0`}>
        <img 
          src={logoUrl} 
          alt={`${title} Logo`}
          onError={() => setError(true)}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>
    );
  }

  // Fallback to Lucide monochrome icon for Category 2 services
  const service = servicesData.find(s => s.id === serviceId);
  const IconComponent = service && iconMap[service.iconName] ? iconMap[service.iconName] : FileText;

  return (
    <div className={`${containerClasses} rounded-xl flex items-center justify-center bg-slate-50 text-slate-600 shadow-sm border border-slate-200 shrink-0`}>
      <IconComponent size={iconSize} strokeWidth={1.75} />
    </div>
  );
};

const Services = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [bookmarked, setBookmarked] = useState([]);

  const categories = ['All', 'Identity', 'Finance', 'Transport', 'Utilities', 'Revenue', 'Certificates', 'Taxation', 'Healthcare'];

  useEffect(() => {
    // Load recently viewed and bookmarks from localStorage
    const savedBookmarks = JSON.parse(localStorage.getItem('smartbharat_bookmarks') || '[]');
    setBookmarked(savedBookmarks);

    const viewed = JSON.parse(localStorage.getItem('smartbharat_recently_viewed') || '[]');
    setRecentlyViewed(viewed);
  }, []);

  const toggleBookmark = (e, id) => {
    e.stopPropagation();
    let newBookmarks;
    if (bookmarked.includes(id)) {
      newBookmarks = bookmarked.filter(bid => bid !== id);
    } else {
      newBookmarks = [...bookmarked, id];
    }
    setBookmarked(newBookmarks);
    localStorage.setItem('smartbharat_bookmarks', JSON.stringify(newBookmarks));
  };

  const filteredServices = servicesData.filter(service => {
    const title = t(`servicesData.${service.id}.title`, { defaultValue: service.title });
    const dept = t(`servicesData.${service.id}.dept`, { defaultValue: service.dept });
    const category = t(`servicesData.${service.id}.category`, { defaultValue: service.category });
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All' || service.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getRecommendedServices = () => {
    // Simple logic for demonstration based on the prompt's request
    // E.g., Student -> Scholarship, Income Certificate, Aadhaar. 
    // Here we just pick a few top general ones.
    return servicesData.filter(s => ['income-certificate', 'aadhaar-card', 'voter-id'].includes(s.id));
  };

  const recommendedServices = getRecommendedServices();
  const recentServices = servicesData.filter(s => recentlyViewed.includes(s.id)).sort((a,b) => recentlyViewed.indexOf(a.id) - recentlyViewed.indexOf(b.id));

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t('services.title')}</h1>
          <p className="text-slate-500 mt-1">{t('services.subtitle')}</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={t('services.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none" 
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex overflow-x-auto pb-4 mb-6 gap-2 hide-scrollbar">
        {categories.map(category => (
          <button 
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === category 
                ? 'bg-brand-500 text-white shadow-md' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t(`services.${category.toLowerCase()}`)}
          </button>
        ))}
        {bookmarked.length > 0 && (
          <button 
            onClick={() => setActiveFilter('Saved')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
              activeFilter === 'Saved' 
                ? 'bg-amber-500 text-white shadow-md' 
                : 'bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100'
            }`}
          >
            <Bookmark className="w-4 h-4" /> {t('services.savedServices')}
          </button>
        )}
      </div>

      {activeFilter === 'All' && searchTerm === '' && (
        <>
          {recentServices.length > 0 && (
            <div className="mb-10">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <History className="w-5 h-5 text-slate-400" /> {t('services.recentlyViewed')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {recentServices.slice(0, 4).map((service) => {
                  return (
                    <div 
                      key={service.id} 
                      onClick={() => navigate(`/services/${service.id}`)}
                      className="glass-card p-4 flex items-center gap-4 cursor-pointer hover:border-brand-300 transition-colors"
                    >
                      <ServiceLogo serviceId={service.id} title={t(`servicesData.${service.id}.title`, { defaultValue: service.title })} size="sm" />
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{t(`servicesData.${service.id}.title`, { defaultValue: service.title })}</h3>
                        <p className="text-xs text-slate-500 truncate">{t(`servicesData.${service.id}.dept`, { defaultValue: service.dept })}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="mb-10">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> {t('services.recommendedForYou')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedServices.map((service, idx) => {
                return (
                  <motion.div 
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => navigate(`/services/${service.id}`)}
                    className="glass-card p-5 border border-amber-100 bg-gradient-to-br from-white to-amber-50/30 cursor-pointer hover:shadow-lg transition-all group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <ServiceLogo serviceId={service.id} title={t(`servicesData.${service.id}.title`, { defaultValue: service.title })} size="sm" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-100 px-2 py-1 rounded-full">{t('services.recommended')}</span>
                    </div>
                    <h3 className="text-md font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{t(`servicesData.${service.id}.title`, { defaultValue: service.title })}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{t(`servicesData.${service.id}.description`, { defaultValue: service.description })}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </>
      )}

      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-4">
          {activeFilter === 'Saved' ? t('services.yourSavedServices') : activeFilter === 'All' ? t('services.allServices') : t('services.categoryServices', { category: t(`services.${activeFilter.toLowerCase()}`) })}
        </h2>
        
        {filteredServices.length === 0 && activeFilter !== 'Saved' && (
          <div className="text-center py-12 text-slate-500">
            {t('services.noServicesFound')}
          </div>
        )}
        
        {activeFilter === 'Saved' && bookmarked.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            {t('services.noSavedServices')}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {(activeFilter === 'Saved' ? servicesData.filter(s => bookmarked.includes(s.id)) : filteredServices).map((service, idx) => {
              const isBookmarked = bookmarked.includes(service.id);
              
              return (
                <motion.div 
                  key={service.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="glass-card p-6 flex flex-col h-full hover-lift group cursor-pointer bg-white"
                  onClick={() => navigate(`/services/${service.id}`)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <ServiceLogo serviceId={service.id} title={t(`servicesData.${service.id}.title`, { defaultValue: service.title })} size="md" />
                    <button 
                      onClick={(e) => toggleBookmark(e, service.id)}
                      className={`transition-colors ${isBookmarked ? 'text-brand-500' : 'text-slate-300 hover:text-brand-400'}`}
                    >
                      <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-brand-600 transition-colors">{t(`servicesData.${service.id}.title`, { defaultValue: service.title })}</h3>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 block">{t(`servicesData.${service.id}.category`, { defaultValue: service.category })}</span>
                  
                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">{t('services.processingTime')}</span>
                      <span className="font-medium text-slate-900">{t(`servicesData.${service.id}.time`, { defaultValue: service.time })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">{t('services.department')}</span>
                      <span className="font-medium text-slate-900 text-right max-w-[60%] truncate">{t(`servicesData.${service.id}.dept`, { defaultValue: service.dept })}</span>
                    </div>
                  </div>
                  
                  <button className="w-full py-2.5 rounded-xl border border-brand-200 text-brand-600 font-medium group-hover:bg-brand-50 transition-colors flex items-center justify-center gap-2">
                    {t('services.applyNow')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Services;
