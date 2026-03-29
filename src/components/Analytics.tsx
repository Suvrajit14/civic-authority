import React, { useState, useEffect } from 'react';
import { IssueReport } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, CheckCircle2, AlertTriangle, ShieldCheck, Activity, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useI18n } from '../i18n';

const COLORS = ['#00FF88', '#00D4FF', '#BF5FFF', '#FF3CAC', '#FFB800', '#FF6B00', '#00FF88', '#00D4FF', '#BF5FFF', '#FF3CAC'];

export default function Analytics() {
  const { t } = useI18n();
  const [issues, setIssues] = useState<IssueReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [daysRange, setDaysRange] = useState(30);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/issues');
        if (res.ok) {
          const data: IssueReport[] = await res.json();
          const rangeDate = new Date(Date.now() - daysRange * 86400000);
          setIssues(data.filter(i => new Date(i.createdAt) >= rangeDate));
        }
      } catch { /* silent */ } finally { setLoading(false); }
    };
    fetchAnalytics();
  }, [daysRange]);

  const stats = {
    total: issues.length,
    verified: issues.filter(i => ['Verified','In Progress','Resolved'].includes(i.status)).length,
    resolved: issues.filter(i => i.status === 'Resolved').length,
    fake: issues.filter(i => i.isFake).length,
  };

  const categoryData = Array.from(new Set(issues.map(i => i.category))).map((cat, idx) => ({
    name: cat, value: issues.filter(i => i.category === cat).length, color: COLORS[idx % COLORS.length]
  }));

  const statusData = [
    { name: 'Pending',     value: issues.filter(i => i.status === 'Pending').length,     color: '#FFB800' },
    { name: 'Verified',    value: issues.filter(i => i.status === 'Verified').length,    color: '#00FF88' },
    { name: 'In Progress', value: issues.filter(i => i.status === 'In Progress').length, color: '#00D4FF' },
    { name: 'Resolved',    value: issues.filter(i => i.status === 'Resolved').length,    color: '#BF5FFF' },
    { name: 'Rejected',    value: issues.filter(i => i.status === 'Rejected').length,    color: '#FF3CAC' },
  ];

  const statCards = [
    { label: 'Total Reports', value: stats.total,    icon: TrendingUp,   color: '#00FF88', bg: 'rgba(0,255,136,0.1)',   glow: 'rgba(0,255,136,0.25)' },
    { label: 'Verified',      value: stats.verified, icon: ShieldCheck,  color: '#00D4FF', bg: 'rgba(0,212,255,0.1)',   glow: 'rgba(0,212,255,0.25)' },
    { label: 'Resolved',      value: stats.resolved, icon: CheckCircle2, color: '#BF5FFF', bg: 'rgba(191,95,255,0.1)',  glow: 'rgba(191,95,255,0.25)' },
    { label: 'Flagged Fake',  value: stats.fake,     icon: AlertTriangle,color: '#FF3CAC', bg: 'rgba(255,60,172,0.1)',  glow: 'rgba(255,60,172,0.25)' },
  ];

  const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' };
  const tooltipStyle = { borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', padding: '12px', fontSize: 12, background: '#1a1a2e', color: 'white' };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(0,255,136,0.2)', borderTopColor: '#00FF88' }} />
    </div>
  );

  return (
    <div className="space-y-5 pb-10">
      {/* Header */}
      <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(0,255,136,0.08) 0%, rgba(0,212,255,0.05) 100%)', border: '1px solid rgba(0,255,136,0.15)' }}>
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(0,255,136,0.06)' }} />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,255,136,0.15)', boxShadow: '0 0 20px rgba(0,255,136,0.2)' }}>
              <Activity className="w-5 h-5" style={{ color: '#00FF88' }} />
            </div>
            <div>
              <h1 className="text-xl font-display font-black text-white">Analytics</h1>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>System intelligence overview</p>
            </div>
          </div>
          <div className="flex p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
            {[30, 90, 365].map(range => (
              <button key={range} onClick={() => setDaysRange(range)}
                className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={daysRange === range
                  ? { background: 'rgba(0,255,136,0.15)', color: '#00FF88' }
                  : { color: 'rgba(255,255,255,0.4)' }}>
                {range}D
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="rounded-2xl p-4 transition-all hover:-translate-y-0.5 cursor-default" style={cardStyle}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: stat.bg, boxShadow: `0 0 15px ${stat.glow}` }}>
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: stat.bg, color: stat.color }}>{daysRange}d</span>
            </div>
            <p className="text-2xl font-display font-black text-white tracking-tight">{stat.value}</p>
            <p className="text-[10px] uppercase tracking-wider font-semibold mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar chart */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-2xl p-5" style={cardStyle}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,255,136,0.1)' }}>
              <BarChart3 className="w-4 h-4" style={{ color: '#00FF88' }} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>By Category</p>
              <p className="text-sm font-bold text-white">Distribution</p>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)', fontWeight: 700 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontWeight: 700 }} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 8 }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={28}>
                  {categoryData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pie chart */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="rounded-2xl p-5" style={cardStyle}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,212,255,0.1)' }}>
              <PieChartIcon className="w-4 h-4" style={{ color: '#00D4FF' }} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>By Status</p>
              <p className="text-sm font-bold text-white">Breakdown</p>
            </div>
          </div>
          <div className="h-40 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value" stroke="none">
                  {statusData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-display font-black text-white">{stats.total}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>Total</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {statusData.map((entry, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color, boxShadow: `0 0 6px ${entry.color}` }} />
                <div>
                  <p className="text-[9px] font-bold truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{entry.name}</p>
                  <p className="text-sm font-black text-white">{entry.value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
