import { useTranslation } from "react-i18next";
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Clock, Phone, Building2, Search, UploadCloud, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; 
  return d;
}

function checkIsOpen(timeStr) {
  if (!timeStr || timeStr === 'N/A') return null;
  if (timeStr.toLowerCase().includes('24/7')) return true;
  try {
    const [start, end] = timeStr.split(' - ');
    if (!start || !end) return null;
    const parseTime = (t) => {
      const parts = t.trim().split(' ');
      let [hours, minutes] = parts[0].split(':');
      if (!minutes) minutes = '00';
      if (hours === '12') hours = '00';
      if (parts[1] && parts[1].toUpperCase() === 'PM') hours = parseInt(hours, 10) + 12;
      return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
    };
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();
    const startMins = parseTime(start);
    const endMins = parseTime(end);
    return currentMins >= startMins && currentMins <= endMins;
  } catch (e) {
    return null; 
  }
}

const CATEGORIES = ['All', 'Identity', 'Transport', 'Healthcare', 'Police', 'Municipal', 'Revenue', 'Utilities', 'Emergency'];

const mapOSMToCategory = (tags) => {
  const name = (tags.name || tags['name:en'] || '').toLowerCase();
  
  if (tags.amenity === 'police' || name.includes('police')) {
    return { category: 'Police', type: 'Law Enforcement', department: 'Home Affairs', color: 'bg-blue-100 text-blue-600 border-blue-200' };
  }
  if (tags.amenity === 'hospital' || name.includes('hospital')) {
    return { category: 'Healthcare', type: 'Healthcare', department: 'Health Department', color: 'bg-red-100 text-red-600 border-red-200' };
  }
  if (name.includes('rto') || name.includes('transport')) {
    return { category: 'Transport', type: 'Transport', department: 'Transport Department', color: 'bg-orange-100 text-orange-600 border-orange-200' };
  }
  if (name.includes('passport') || name.includes('aadhaar') || name.includes('uidai')) {
    return { category: 'Identity', type: 'Identity', department: 'Identity & Docs', color: 'bg-purple-100 text-purple-600 border-purple-200' };
  }
  if (tags.amenity === 'townhall' || name.includes('municipal') || name.includes('nagar nigam')) {
    return { category: 'Municipal', type: 'Civic Administration', department: 'Civic Administration', color: 'bg-emerald-100 text-emerald-600 border-emerald-200' };
  }
  if (tags.office === 'utility' || tags.office === 'energy' || name.includes('water') || name.includes('electricity') || name.includes('power')) {
    return { category: 'Utilities', type: 'Utilities', department: 'Public Utilities', color: 'bg-cyan-100 text-cyan-600 border-cyan-200' };
  }
  if (tags.amenity === 'courthouse' || name.includes('revenue') || name.includes('tehsil') || name.includes('collector')) {
    return { category: 'Revenue', type: 'Administration', department: 'Revenue Department', color: 'bg-indigo-100 text-indigo-600 border-indigo-200' };
  }
  
  return { category: 'Revenue', type: 'Administration', department: 'Government', color: 'bg-slate-100 text-slate-600 border-slate-200' };
};

const NearbyOffices = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('pending'); // pending, granted, denied
  const [offices, setOffices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationStatus('granted');
        },
        (error) => {
          console.error("Location error:", error);
          setUserLocation({ lat: 28.6139, lng: 77.2090 });
          setLocationStatus('denied');
        }
      );
    } else {
      setUserLocation({ lat: 28.6139, lng: 77.2090 });
      setLocationStatus('denied');
    }
  }, []);

  useEffect(() => {
    const fetchPlaces = async () => {
      if (!userLocation) return;
      setIsLoading(true);
      try {
        const query = `
          [out:json][timeout:25];
          (
            node["amenity"~"police|hospital|townhall|courthouse"](around:15000,${userLocation.lat},${userLocation.lng});
            node["office"~"government|administrative|utility|energy"](around:15000,${userLocation.lat},${userLocation.lng});
            way["amenity"~"police|hospital|townhall|courthouse"](around:15000,${userLocation.lat},${userLocation.lng});
            way["office"~"government|administrative|utility|energy"](around:15000,${userLocation.lat},${userLocation.lng});
          );
          out center;
        `;
        const res = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: "data=" + encodeURIComponent(query)
        });
        const data = await res.json();
        
        let fetchedOffices = [];
        if (data && data.elements) {
          data.elements.forEach(el => {
            const tags = el.tags || {};
            const name = tags.name || tags['name:en'];
            if (!name) return;

            const placeLat = el.lat || (el.center && el.center.lat);
            const placeLon = el.lon || (el.center && el.center.lon);
            if (!placeLat || !placeLon) return;

            const { category, type, department, color } = mapOSMToCategory(tags);
            
            let addressParts = [];
            if (tags['addr:street']) addressParts.push(tags['addr:street']);
            if (tags['addr:city']) addressParts.push(tags['addr:city']);
            const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : (tags['addr:full'] || 'Address unavailable');
            
            fetchedOffices.push({
              id: el.id,
              name,
              address: fullAddress,
              lat: placeLat,
              lng: placeLon,
              category,
              type,
              department,
              phone: tags.phone || tags['contact:phone'] || 'N/A',
              time: tags.opening_hours || 'N/A',
              color,
              city: tags['addr:city'] || '',
              rating: tags.rating || null
            });
          });
        }
        
        // Remove duplicates by name
        const uniqueOffices = [];
        const seenNames = new Set();
        fetchedOffices.forEach(o => {
          if (!seenNames.has(o.name)) {
            seenNames.add(o.name);
            uniqueOffices.push(o);
          }
        });
        
        setOffices(uniqueOffices);
      } catch (err) {
        console.error("Error fetching places:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaces();
  }, [userLocation]);

  const processedOffices = useMemo(() => {
    let list = offices.map(o => {
      const dist = userLocation ? getDistance(userLocation.lat, userLocation.lng, o.lat, o.lng) : null;
      return { ...o, calculatedDistance: dist };
    });

    list.sort((a, b) => (a.calculatedDistance || 0) - (b.calculatedDistance || 0));

    list = list.filter(o => {
      if (activeCategory !== 'All' && o.category !== activeCategory) return false;
      if (searchTerm) {
        const s = searchTerm.toLowerCase();
        return (
          o.name.toLowerCase().includes(s) ||
          o.department.toLowerCase().includes(s) ||
          o.category.toLowerCase().includes(s) ||
          o.city.toLowerCase().includes(s)
        );
      }
      return true;
    });

    return list;
  }, [searchTerm, activeCategory, userLocation, offices]);

  const openMap = (lat, lng) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
  };

  const openDirections = (destLat, destLng) => {
    if (userLocation) {
      window.open(`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${destLat},${destLng}&travelmode=driving`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&travelmode=driving`, '_blank');
    }
  };

  return <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="w-16 h-16 bg-gradient-brand rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg shadow-brand-500/30 text-white">
          <MapPin className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">{t("NearbyOffices.nearby_government_offices")}</h1>
        <p className="text-slate-500 mb-4">{t("NearbyOffices.find_official_centers_get")}</p>
        
        {locationStatus === 'granted' && (
          <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold mb-6">
            📍 Using Live Location
          </div>
        )}
        {locationStatus === 'denied' && (
          <div className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold mb-6">
            Location permission denied. Showing default (New Delhi).
          </div>
        )}

        <div className="relative mt-2 max-w-md mx-auto mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input type="text" placeholder={t("NearbyOffices.search_by_name_or")} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none shadow-sm" />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                activeCategory === category
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedOffices.map((office, idx) => {
            const isOpen = checkIsOpen(office.time);
            const isNearest = idx === 0 && searchTerm === '' && activeCategory === 'All' && locationStatus === 'granted';
            
            return (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} key={office.id} className="glass-card p-6 flex flex-col h-full group hover:shadow-xl hover:border-brand-300 transition-all relative">
                
                {isNearest && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-md whitespace-nowrap z-10">
                    ⭐ Nearest Office
                  </div>
                )}

                <div className="flex justify-between items-start mb-4 mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${office.color}`}>
                    {office.category}
                  </span>
                  <div className="flex items-center gap-1 text-sm font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-lg">
                    <Navigation className="w-4 h-4 text-brand-600" /> {office.calculatedDistance !== null ? `${office.calculatedDistance.toFixed(1)} km` : '-'}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors flex items-start gap-2">
                  <Building2 className="w-5 h-5 mt-1 flex-shrink-0" /> {office.name}
                </h3>
                
                {office.rating && (
                  <div className="flex items-center gap-1 text-sm font-bold text-yellow-600 mb-2 pl-7">
                    ⭐ {office.rating} Rating
                  </div>
                )}
                
                <div className="space-y-3 mb-6 flex-1 pl-7">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Map className="w-4 h-4 text-slate-400 shrink-0" /> 
                    <span className="flex-1 line-clamp-2">{office.address}</span>
                  </div>
                  {office.time !== 'N/A' && (
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" /> 
                      <span className="flex-1">{office.time}</span>
                      {isOpen !== null && (
                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold shrink-0 ${isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {isOpen ? '🟢 Open' : '🔴 Closed'}
                        </span>
                      )}
                    </div>
                  )}
                  {office.phone !== 'N/A' && (
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" /> {office.phone}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-3 mt-auto">
                   <div className="flex gap-3">
                     <button onClick={() => openMap(office.lat, office.lng)} className="flex-1 bg-brand-50 hover:bg-brand-100 text-brand-700 py-2.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                       <MapPin className="w-4 h-4" />{t("NearbyOffices.view_map")}</button>
                     <button onClick={() => openDirections(office.lat, office.lng)} className="flex-1 bg-brand-600 hover:bg-brand-500 text-white py-2.5 rounded-xl font-semibold shadow-md transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
                       <Navigation className="w-4 h-4" />{t("NearbyOffices.directions")}</button>
                   </div>
                   <button onClick={() => navigate('/vault')} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-sm border border-slate-200">
                     <UploadCloud className="w-4 h-4" />{t("NearbyOffices.upload_docs_for_visit")}</button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>;
};
export default NearbyOffices;