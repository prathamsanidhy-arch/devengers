import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Landmark, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Panel: Hero/Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-gov-900 relative overflow-hidden flex-col justify-center p-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596422846543-75c6fc197f0a?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gov-900 via-gov-900/80 to-transparent"></div>
        
        <div className="relative z-10 max-w-xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="w-16 h-16 rounded-2xl bg-gradient-brand flex items-center justify-center mb-8 shadow-2xl shadow-brand-500/30">
              <Landmark className="text-white w-8 h-8" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              Empowering Citizens with <span className="text-brand-500">Smart AI</span>
            </h1>
            <p className="text-xl text-slate-300 mb-12 font-light">
              Experience the next generation of civic engagement. Report issues, discover schemes, and track progress—all powered by Google Gemini.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-slate-200">
                <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center backdrop-blur-md border border-slate-700">
                  <ShieldCheck className="w-6 h-6 text-brand-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white">Secure & Transparent</h3>
                  <p className="text-sm text-slate-400">Government-grade encryption for your data.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-200">
                <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center backdrop-blur-md border border-slate-700">
                  <Zap className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white">Instant AI Resolution</h3>
                  <p className="text-sm text-slate-400">Automated routing and issue categorization.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        {/* Background blobs for right panel */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10 glass-card p-8 sm:p-10"
        >
          <div className="text-center mb-10 lg:hidden">
             <div className="w-12 h-12 rounded-xl bg-gradient-brand flex items-center justify-center mx-auto mb-4">
              <Landmark className="text-white w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Smart Bharat</h2>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h2>
          <p className="text-slate-500 mb-8">Please enter your details to sign in.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all bg-white/50 backdrop-blur-sm"
                placeholder="citizen@india.gov.in"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <a href="#" className="text-sm font-medium text-brand-600 hover:text-brand-500">Forgot password?</a>
              </div>
              <input
                type="password"
                name="password"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all bg-white/50 backdrop-blur-sm"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-brand text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Sign in <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-500 hover:underline">
              Register here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
