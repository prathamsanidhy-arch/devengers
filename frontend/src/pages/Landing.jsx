import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Landmark, ShieldCheck, Zap, Activity, Users, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Navbar */}
      <nav className="glass sticky top-0 z-50 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex justify-between h-20 items-center">
          <div className="flex items-center">
            <img src="/logos/jansetu-icon.png" alt="JanSetu" className="h-10 w-auto md:hidden" />
            <img src="/logos/jansetu-logo.png" alt="JanSetu" className="h-10 w-auto hidden md:block" />
          </div>
          <div className="hidden md:flex space-x-8 font-medium text-slate-600">
            <a href="#features" className="hover:text-brand-600 transition-colors">Features</a>
            <a href="#impact" className="hover:text-brand-600 transition-colors">Impact</a>
            <a href="#faq" className="hover:text-brand-600 transition-colors">FAQ</a>
          </div>
          <div className="flex space-x-4">
            <Link to="/login" className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors">Sign In</Link>
            <Link to="/register" className="px-5 py-2.5 rounded-xl font-medium bg-brand-600 text-white shadow-lg shadow-brand-500/30 hover:bg-brand-500 transition-colors">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-400 to-blue-500 blur-[100px] rounded-full mix-blend-multiply"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-100 text-brand-700 font-medium text-sm mb-8">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500"></span>
              </span>
              Official Government Digital Platform
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold font-heading text-gov-900 tracking-tight leading-tight mb-6">
              The Future of <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-blue-600">
                Digital Governance
              </span>
            </h1>
            
            <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              Empowering 1.4 billion citizens with AI-driven civic services, instant grievance redressal, and seamless scheme discovery.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold bg-gradient-brand text-white shadow-xl shadow-brand-500/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-lg">
                Access Portal <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gov-900 mb-4">Everything you need in one place</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">JanSetu eliminates bureaucracy through AI automation and unified digital interfaces.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "AI Complaint Resolution", desc: "Our Gemini AI automatically analyzes your issue photos and routes them to the exact department in seconds." },
              { icon: FileText, title: "Scheme Discovery", desc: "Never miss a welfare scheme. Our AI matches your profile against thousands of government programs." },
              { icon: ShieldCheck, title: "Document Vault", desc: "Securely store your Aadhaar, PAN, and certificates with government-grade encryption." },
              { icon: Activity, title: "Emergency SOS", desc: "One-tap access to police, ambulance, and disaster management with live location sharing." },
              { icon: Users, title: "Civic Community", desc: "Engage with nearby citizens, track local issues, and earn verified citizen badges." },
              { icon: Landmark, title: "Service Hub", desc: "Apply for passports, licenses, and certificates directly through our unified portal." }
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-6 group-hover:bg-brand-50 group-hover:border-brand-200 transition-colors">
                  <f.icon className="w-7 h-7 text-brand-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section id="impact" className="py-24 bg-gov-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596422846543-75c6fc197f0a?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: "2M+", label: "Active Citizens" },
              { num: "95%", label: "Resolution Rate" },
              { num: "10k+", label: "Schemes Mapped" },
              { num: "24/7", label: "AI Assistance" }
            ].map((stat, i) => (
              <div key={i}>
                <h4 className="text-4xl md:text-5xl font-bold text-brand-400 mb-2">{stat.num}</h4>
                <p className="text-slate-300 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <img src="/logos/jansetu-icon.png" alt="JanSetu" className="h-6 w-auto" />
          <span className="font-bold text-xl text-gov-900">JanSetu</span>
        </div>
        <p className="text-slate-500 text-sm">© 2026 Government of India Digital Initiative. Built with Google Gemini.</p>
      </footer>
    </div>
  );
};

export default Landing;
