import { useTranslation } from "react-i18next";
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Clock, Phone, Building2, Search, UploadCloud, Map, AlertCircle, RefreshCw } from 'lucide-react';
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

const CACHE_KEY = 'cached_offices';
const LOCATION_CACHE_KEY = 'cached_location';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

const fetchWithTimeout = async (url, options, timeout = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

const SkeletonCard = () => (
  <div className="glass-card p-6 flex flex-col h-full animate-pulse border border-slate-100">
    <div className="flex justify-between items-start mb-4 mt-2">
      <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
      <div className="h-6 w-16 bg-slate-200 rounded-lg"></div>
    </div>
    <div className="h-6 w-3/4 bg-slate-200 rounded mb-4 mt-2"></div>
    <div className="space-y-3 mb-6 flex-1 pl-7">
      <div className="h-4 w-full bg-slate-200 rounded"></div>
      <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
      <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
    </div>
    <div className="flex flex-col gap-3 mt-auto">
      <div className="flex gap-3">
        <div className="flex-1 h-10 bg-slate-200 rounded-xl"></div>
        <div className="flex-1 h-10 bg-slate-200 rounded-xl"></div>
      </div>
      <div className="w-full h-10 bg-slate-200 rounded-xl"></div>
    </div>
  </div>
);

const NearbyOffices = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('pending'); // pending, granted, denied
  const [offices, setOffices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationName, setLocationName] = useState('Using Live Location');
  const [locationNameLoading, setLocationNameLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let initialLocation = null;
    const cachedLoc = localStorage.getItem(LOCATION_CACHE_KEY);
    if (cachedLoc) {
      try {
        const parsed = JSON.parse(cachedLoc);
        if (parsed.lat && parsed.lng) {
          initialLocation = parsed;
          setUserLocation(parsed);
          setLocationStatus('granted');
        }
      } catch (e) {}
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(loc);
          setLocationStatus('granted');
          localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(loc));
        },
        (err) => {
          console.error("Location error:", err);
          if (!initialLocation) {
            setUserLocation({ lat: 28.6139, lng: 77.2090 });
            setLocationStatus('denied');
          }
        },
        { timeout: 10000 }
      );
    } else {
      if (!initialLocation) {
        setUserLocation({ lat: 28.6139, lng: 77.2090 });
        setLocationStatus('denied');
      }
    }
  }, []);

  useEffect(() => {
    const loadPlaces = async () => {
      if (!userLocation) return;
      
      const cache = localStorage.getItem(CACHE_KEY);
      let validCache = null;
      let staleCache = null;

      if (cache) {
        try {
          const parsed = JSON.parse(cache);
          if (parsed.offices && parsed.offices.length > 0) {
            staleCache = parsed.offices;
            // Valid if within CACHE_DURATION and location hasn't drifted more than e.g. a tiny fraction (or exact match)
            if (Date.now() - parsed.timestamp < CACHE_DURATION && 
                Math.abs(parsed.lat - userLocation.lat) < 0.001 && 
                Math.abs(parsed.lng - userLocation.lng) < 0.001) {
              validCache = parsed.offices;
            }
          }
        } catch (e) {}
      }

      if (validCache) {
        setOffices(validCache);
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      const fetchWithRetry = async (retries = 1) => {
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
          
          const res = await fetchWithTimeout('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: "data=" + encodeURIComponent(query)
          }, 10000);

          if (!res.ok) throw new Error('Network response was not ok');
          return await res.json();
        } catch (error) {
          if (retries > 0) {
            console.warn("Fetch failed, retrying in 2 seconds...", error);
            await new Promise(r => setTimeout(r, 2000));
            return fetchWithRetry(retries - 1);
          }
          throw error;
        }
      };

      try {
        const data = await fetchWithRetry(1);
        
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
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          timestamp: Date.now(),
          lat: userLocation.lat,
          lng: userLocation.lng,
          offices: uniqueOffices
        }));
      } catch (err) {
        console.error("Error fetching places:", err);
        if (staleCache) {
          setOffices(staleCache);
        } else {
          setError(t("NearbyOffices.unable_to_load_nearby", "Unable to load nearby places. Please try again later."));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadPlaces();
  }, [userLocation]);

  useEffect(() => {
    if (!userLocation || locationStatus !== 'granted') return;
    
    const fetchLocationName = async () => {
      const cacheKey = 'cached_location_name';
      const CACHE_TIME = 30 * 60 * 1000; // 30 minutes
      const cache = localStorage.getItem(cacheKey);
      
      if (cache) {
        try {
          const parsed = JSON.parse(cache);
          if (
            Date.now() - parsed.timestamp < CACHE_TIME &&
            Math.abs(parsed.lat - userLocation.lat) < 0.001 &&
            Math.abs(parsed.lng - userLocation.lng) < 0.001
          ) {
            setLocationName(parsed.name);
            setLocationNameLoading(false);
            return;
          }
        } catch (e) {}
      }

      try {
        const res = await fetchWithTimeout(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLocation.lat}&lon=${userLocation.lng}`, {
          headers: { 'User-Agent': 'SmartBharatApp/1.0' }
        }, 8000);
        
        if (!res.ok) throw new Error('Geocoding failed');
        const data = await res.json();
        
        const address = data.address;
        const getReadableLocation = (addr) => {
          if (!addr) return null;
          const poi = addr.university || addr.college || addr.amenity || addr.hospital || addr.mall || addr.commercial || addr.building || addr.landmark;
          const area = addr.neighbourhood || addr.suburb || addr.residential;
          const city = addr.city || addr.town || addr.village || addr.locality || addr.county;
          
          if (poi && city) return `${poi}, ${city}`;
          if (poi) return poi;
          if (area && city) return `${area}, ${city}`;
          if (area) return area;
          if (city) return city;
          return null;
        };
        
        const readable = getReadableLocation(address);
        if (readable) {
          setLocationName(readable);
          localStorage.setItem(cacheKey, JSON.stringify({
            name: readable,
            lat: userLocation.lat,
            lng: userLocation.lng,
            timestamp: Date.now()
          }));
        } else {
          setLocationName('Using Live Location');
        }
      } catch (err) {
        console.error('Reverse geocoding error:', err);
        setLocationName('Using Live Location');
      } finally {
        setLocationNameLoading(false);
      }
    };

    fetchLocationName();
  }, [userLocation, locationStatus]);

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
            📍 <motion.span key={locationName} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              {locationNameLoading ? 'Using Live Location' : locationName}
            </motion.span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill().map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <div className="text-center py-12 px-4 glass-card border-red-200 max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">{error}</h3>
          <button onClick={() => window.location.reload()} className="mt-4 inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2.5 rounded-xl font-semibold transition-colors">
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
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