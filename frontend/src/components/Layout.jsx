import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  LayoutDashboard, 
  FileText, 
  History, 
  Landmark, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Briefcase,
  FolderLock,
  Siren,
  BookOpen,
  MapPin,
  Newspaper,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Chatbot from './Chatbot';

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Desktop top nav
  const topNav = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Services', href: '/services', icon: Briefcase },
    { name: 'Schemes', href: '/schemes', icon: Landmark },
    { name: 'Documents', href: '/documents', icon: FolderLock },
  ];

  // Mobile nav (all links)
  const allNav = [
    ...topNav,
    { name: 'Submit Complaint', href: '/submit', icon: FileText },
    { name: 'History', href: '/history', icon: History },
    { name: 'Emergency', href: '/emergency', icon: Siren },
    { name: 'News', href: '/news', icon: Newspaper },
    { name: 'Offices', href: '/offices', icon: MapPin },
    { name: 'Knowledge', href: '/knowledge', icon: BookOpen },
    { name: 'Admin', href: '/admin', icon: ShieldCheck },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="light" />
      <Chatbot />
      
      {/* Navbar */}
      <nav className="glass sticky top-0 z-50 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="flex justify-between h-16 max-w-7xl mx-auto">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
                <Landmark className="text-white w-5 h-5" />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight text-gov-900">
                Smart<span className="text-brand-600">Bharat</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            <div className="flex space-x-1">
              {topNav.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href || (location.pathname === '/' && item.href === '/dashboard');
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'text-brand-700 bg-brand-50' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
            
            <div className="flex items-center space-x-4 border-l border-slate-200 pl-4">
              <Link to="/emergency" className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Emergency SOS">
                <Siren className="w-5 h-5" />
              </Link>
              <Link to="/news" className="text-slate-400 hover:text-brand-600 hover:bg-brand-50 p-2 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </Link>
              
              <div className="relative group">
                <button className="flex items-center gap-2 focus:outline-none">
                  <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold border border-brand-200 hover:ring-2 hover:ring-brand-500 transition-all">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </button>
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                  <div className="p-2 space-y-1">
                    <div className="px-4 py-2 border-b border-slate-100 mb-1">
                      <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                    {allNav.slice(4).map(item => (
                       <Link key={item.name} to={item.href} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">
                         <item.icon className="w-4 h-4 text-slate-400" /> {item.name}
                       </Link>
                    ))}
                    <div className="h-px bg-slate-100 my-1"></div>
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">
                      <User className="w-4 h-4 text-slate-400" /> Profile Settings
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                      <LogOut className="w-4 h-4 text-red-500" /> Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-500 hover:text-slate-600 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden glass absolute top-16 inset-x-0 z-40 border-b border-slate-200 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {allNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium ${
                    isActive ? 'text-brand-700 bg-brand-50' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              );
            })}
            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900">
               <User className="w-5 h-5 text-slate-400" /> Profile
            </Link>
            <button
              onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
              className="flex w-full items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full mx-auto">
        {children}
      </main>
      
      <footer className="mt-auto py-6 border-t border-slate-200 text-center bg-white">
        <p className="text-sm text-slate-500">© 2026 Smart Bharat Digital Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
