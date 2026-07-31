import { useTranslation } from "react-i18next";
import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { LayoutDashboard, Users, FileText, CheckCircle2, AlertTriangle, TrendingUp, Download } from 'lucide-react';
const AdminPanel = () => {
  const {
    t
  } = useTranslation();
  // Mock Data for Admin Dashboard Demo
  const stats = [{
    title: 'Total Users',
    value: '45,231',
    icon: Users,
    color: 'text-blue-500',
    bg: 'bg-blue-100'
  }, {
    title: 'Active Complaints',
    value: '1,204',
    icon: AlertTriangle,
    color: 'text-amber-500',
    bg: 'bg-amber-100'
  }, {
    title: 'Resolved (Monthly)',
    value: '8,430',
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bg: 'bg-emerald-100'
  }, {
    title: 'Avg. Resolution Time',
    value: '48 Hrs',
    icon: TrendingUp,
    color: 'text-purple-500',
    bg: 'bg-purple-100'
  }];
  const pieData = [{
    name: 'Infrastructure',
    value: 400
  }, {
    name: 'Water & Sanitation',
    value: 300
  }, {
    name: 'Electricity',
    value: 300
  }, {
    name: 'Waste Mgmt',
    value: 200
  }];
  const COLORS = ['#0ea5e9', '#14b8a6', '#f59e0b', '#8b5cf6'];
  const barData = [{
    name: 'Mon',
    complaints: 120
  }, {
    name: 'Tue',
    complaints: 150
  }, {
    name: 'Wed',
    complaints: 180
  }, {
    name: 'Thu',
    complaints: 140
  }, {
    name: 'Fri',
    complaints: 200
  }, {
    name: 'Sat',
    complaints: 90
  }, {
    name: 'Sun',
    complaints: 60
  }];
  return <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-gov-900" />{t("AdminPanel.admin_command_center")}</h1>
          <p className="text-slate-500 mt-1">{t("AdminPanel.platform_analytics_demo")}</p>
        </div>
        <button className="bg-gov-900 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-gov-800 transition-colors shadow-lg">
          <Download className="w-4 h-4" />{t("AdminPanel.export_master_csv")}</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: i * 0.1
      }} key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-4">
               <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                 <stat.icon className="w-6 h-6" />
               </div>
            </div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{stat.title}</h3>
            <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </motion.div>)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <h3 className="text-lg font-bold text-slate-900 mb-6">{t("AdminPanel.complaints_volume_this_week")}</h3>
           <div className="h-72">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={barData}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{
                fill: '#64748b'
              }} />
                 <YAxis axisLine={false} tickLine={false} tick={{
                fill: '#64748b'
              }} />
                 <Tooltip cursor={{
                fill: '#f1f5f9'
              }} contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }} />
                 <Bar dataKey="complaints" fill="#0d9488" radius={[6, 6, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <h3 className="text-lg font-bold text-slate-900 mb-6">{t("AdminPanel.complaints_by_department")}</h3>
           <div className="h-72 flex items-center">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={pieData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value">
                   {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                 </Pie>
                 <Tooltip contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }} />
               </PieChart>
             </ResponsiveContainer>
             <div className="flex flex-col gap-4 pr-4">
                {pieData.map((entry, index) => <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{
                backgroundColor: COLORS[index % COLORS.length]
              }}></div>
                    <span className="text-sm font-medium text-slate-600">{entry.name}</span>
                  </div>)}
             </div>
           </div>
        </div>
      </div>

      {/* Mock Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900">{t("AdminPanel.recent_escalations")}</h3>
          <button className="text-brand-600 text-sm font-semibold hover:underline">{t("AdminPanel.view_all_records")}</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">{t("AdminPanel.id")}</th>
                <th className="p-4 font-semibold">{t("AdminPanel.citizen")}</th>
                <th className="p-4 font-semibold">{t("AdminPanel.issue_category")}</th>
                <th className="p-4 font-semibold">{t("AdminPanel.ai_priority")}</th>
                <th className="p-4 font-semibold">{t("AdminPanel.action")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[1, 2, 3, 4].map(num => <tr key={num} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm font-mono text-slate-500">{t("AdminPanel.cmp")}{1000 + num}</td>
                  <td className="p-4 text-sm font-medium text-slate-900">{t("AdminPanel.ravi_kumar")}</td>
                  <td className="p-4 text-sm text-slate-600">{t("AdminPanel.road_infrastructure")}</td>
                  <td className="p-4"><span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-bold">{t("AdminPanel.critical")}</span></td>
                  <td className="p-4"><button className="text-brand-600 text-sm font-semibold hover:text-brand-800">{t("AdminPanel.review")}</button></td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
};
export default AdminPanel;