import { useTranslation } from "react-i18next";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, Shield, ChevronRight, Scale, GraduationCap, Laptop, Landmark } from 'lucide-react';
const KnowledgeCenter = () => {
  const {
    t
  } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = [{
    name: 'All',
    icon: BookOpen
  }, {
    name: 'Citizen Rights',
    icon: Scale
  }, {
    name: 'Digital Safety',
    icon: Laptop
  }, {
    name: 'Women Safety',
    icon: Shield
  }, {
    name: 'Student Guides',
    icon: GraduationCap
  }];
  const articles = [{
    title: 'Understanding Your Right to Information (RTI)',
    category: 'Citizen Rights',
    readTime: '5 min read',
    desc: 'A complete guide on how to file an RTI application online to seek information from any public authority.'
  }, {
    title: 'How to Protect Yourself from Cyber Frauds',
    category: 'Digital Safety',
    readTime: '8 min read',
    desc: 'Learn to identify phishing links, OTP scams, and secure your digital banking profiles against modern threats.'
  }, {
    title: 'Legal Rights Every Woman Should Know',
    category: 'Women Safety',
    readTime: '10 min read',
    desc: 'Comprehensive overview of maternity benefits, zero FIR, and workplace harassment laws in India.'
  }, {
    title: 'Step-by-Step Voter Registration Process',
    category: 'Citizen Rights',
    readTime: '4 min read',
    desc: 'Are you turning 18? Here is how you can apply for your Voter ID card online via the NVSP portal.'
  }, {
    title: 'Tax Basics for New Earners',
    category: 'All',
    readTime: '7 min read',
    desc: 'An introductory guide to Income Tax slabs, deductions under 80C, and filing your first ITR.'
  }, {
    title: 'Applying for Education Loans Subsidies',
    category: 'Student Guides',
    readTime: '6 min read',
    desc: 'A student guide to the Central Sector Interest Subsidy Scheme (CSIS) for education loans.'
  }];
  const filtered = activeCategory === 'All' ? articles : articles.filter(a => a.category === activeCategory);
  return <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-12 bg-gov-900 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gov-900 via-gov-900/80 to-transparent"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <BookOpen className="w-12 h-12 text-brand-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">{t("KnowledgeCenter.knowledge_center")}</h1>
          <p className="text-slate-300 text-lg mb-8">{t("KnowledgeCenter.empower_yourself_with_official")}</p>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder={t("KnowledgeCenter.search_guides_tutorials_or")} className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-400 focus:bg-white/20 outline-none transition-all" />
          </div>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-3 mb-10 pb-4 no-scrollbar">
        {categories.map((cat, idx) => <button key={idx} onClick={() => setActiveCategory(cat.name)} className={`whitespace-nowrap px-6 py-3 rounded-full font-medium flex items-center gap-2 transition-all ${activeCategory === cat.name ? 'bg-brand-600 text-white shadow-md shadow-brand-500/30' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            <cat.icon className="w-4 h-4" /> {cat.name}
          </button>)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((article, idx) => <motion.div initial={{
        opacity: 0,
        scale: 0.95
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        delay: idx * 0.1
      }} key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col">
            <div className="h-2 bg-gradient-brand w-full"></div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-1 rounded-md">{article.category}</span>
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors">{article.title}</h3>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed flex-1">{article.desc}</p>
              
              <button className="flex items-center text-sm font-bold text-brand-600 mt-auto group-hover:gap-2 transition-all">{t("KnowledgeCenter.read_full_guide")}<ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </motion.div>)}
      </div>
    </div>;
};
import { Clock } from 'lucide-react';
export default KnowledgeCenter;