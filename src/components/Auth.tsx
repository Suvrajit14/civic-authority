import React, { useState } from 'react';
import { loginUser, registerUser } from '../services/api';
import { Shield, Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight, CheckCircle2, MapPin, Bell, BarChart3, ArrowLeft, KeyRound, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import { API_BASE } from '../services/apiBase';

type Mode = 'login' | 'register' | 'forgot' | 'reset';

const features = [
  { icon: MapPin,    title: 'Report Issues',   desc: 'Pin civic problems on the map instantly', color: '#00FF88' },
  { icon: Shield,    title: 'AI Verification', desc: 'Every report verified by Gemini AI',       color: '#00D4FF' },
  { icon: Bell,      title: 'Live Updates',    desc: 'Real-time status notifications',            color: '#BF5FFF' },
  { icon: BarChart3, title: 'Analytics',       desc: 'Track resolution trends & insights',       color: '#FFB800' },
];

export default function Auth() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'register') {
        if (!name.trim()) { toast.error('Please enter your name.'); setLoading(false); return; }
        const res = await registerUser({ name, email, password });
        if (res.msg === 'User registered' || res.user) {
          toast.success('Account created! Please log in.');
          setMode('login'); setLoading(false); return;
        }
        toast.error(res.msg || 'Registration failed.');
      } else if (mode === 'login') {
        const res = await loginUser({ email, password });
        if (res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          window.location.reload();
        } else {
          toast.error(res.msg || 'Login failed.');
        }
      } else if (mode === 'forgot') {
        const res = await fetch(`${API_BASE}/auth/forgot-password`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (data.resetToken) {
          toast.success(`Reset code: ${data.resetToken} — save it!`, { duration: 30000 });
          setMode('reset');
        } else { toast.error(data.msg || 'Email not found.'); }
      } else if (mode === 'reset') {
        const res = await fetch(`${API_BASE}/auth/reset-password`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, resetToken, newPassword })
        });
        const data = await res.json();
        if (data.msg === 'Password reset successfully') {
          toast.success('Password reset! Please log in.');
          setMode('login');
        } else { toast.error(data.msg || 'Reset failed.'); }
      }
    } catch { toast.error('Network error. Is the backend running?'); }
    finally { setLoading(false); }
  };

  const inputClass = "w-full rounded-xl py-3.5 pl-11 pr-4 text-sm font-medium transition-all outline-none input-dark";

  return (
    <div className="min-h-screen flex" style={{ background: '#0A0A0F' }}>
      <Toaster position="top-right" richColors />

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'linear-gradient(135deg, #0A0A0F 0%, #0D0D1A 100%)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>

        {/* Animated blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-[120px] pointer-events-none" style={{ background: 'rgba(0,255,136,0.08)' }} />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none" style={{ background: 'rgba(191,95,255,0.08)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[80px] pointer-events-none" style={{ background: 'rgba(0,212,255,0.05)' }} />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #00FF88, #00D4FF)', boxShadow: '0 0 30px rgba(0,255,136,0.4)' }}>
              <Shield className="w-6 h-6 text-black" />
            </div>
            <div>
              <span className="text-white font-display font-bold text-xl">Civic Pillar</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#00FF88' }} />
                <span className="text-[10px] font-medium" style={{ color: 'rgba(0,255,136,0.6)' }}>LIVE SYSTEM</span>
              </div>
            </div>
          </div>

          <h1 className="text-5xl font-display font-black text-white leading-tight mb-5">
            Empowering<br />
            <span className="text-gradient">Citizens</span><br />
            Together
          </h1>
          <p className="text-lg font-medium leading-relaxed max-w-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Report, track and resolve civic issues in your community with AI-powered verification.
          </p>
        </div>

        {/* Feature cards */}
        <div className="relative z-10 grid grid-cols-2 gap-3">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
              className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: `${f.color}15` }}>
                <f.icon className="w-4 h-4" style={{ color: f.color }} />
              </div>
              <p className="text-white text-sm font-bold mb-0.5">{f.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="relative z-10 flex items-center gap-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {[['10K+', 'Issues Resolved', '#00FF88'], ['98%', 'AI Accuracy', '#00D4FF'], ['24/7', 'Monitoring', '#BF5FFF']].map(([val, label, color]) => (
            <div key={label}>
              <p className="font-display font-black text-xl" style={{ color }}>{val}</p>
              <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6" style={{ background: '#0D0D1A' }}>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #00FF88, #00D4FF)', boxShadow: '0 0 20px rgba(0,255,136,0.3)' }}>
              <Shield className="w-5 h-5 text-black" />
            </div>
            <span className="font-display font-bold text-xl text-white">Civic Pillar</span>
          </div>

          <AnimatePresence mode="wait">
            {/* LOGIN / REGISTER */}
            {(mode === 'login' || mode === 'register') && (
              <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="mb-6">
                  <h2 className="text-3xl font-display font-black text-white mb-1">
                    {mode === 'login' ? 'Welcome back' : 'Create account'}
                  </h2>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {mode === 'login' ? 'Sign in to your account' : 'Join thousands of active citizens'}
                  </p>
                </div>

                {/* Toggle */}
                <div className="flex p-1 rounded-xl mb-6" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  {['login', 'register'].map(tab => (
                    <button key={tab} onClick={() => setMode(tab as Mode)}
                      className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 capitalize"
                      style={mode === tab
                        ? { background: 'linear-gradient(135deg, #00FF88, #00D4FF)', color: '#0A0A0F' }
                        : { color: 'rgba(255,255,255,0.4)' }}>
                      {tab === 'login' ? 'Login' : 'Register'}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <AnimatePresence>
                    {mode === 'register' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
                          <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className={inputClass} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
                    <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required className={inputClass} />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
                    <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className={`${inputClass} pr-12`} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color: 'rgba(255,255,255,0.3)' }}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {mode === 'login' && (
                    <div className="flex justify-end">
                      <button type="button" onClick={() => setMode('forgot')}
                        className="text-xs font-semibold transition-colors" style={{ color: '#00FF88' }}>
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <button type="submit" disabled={loading}
                    className="btn-neon w-full py-3.5 rounded-xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                      <>{mode === 'register' ? 'Create Account' : 'Sign In'}<ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </form>

                <p className="text-center text-sm mt-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                  <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                    className="font-bold transition-colors" style={{ color: '#00FF88' }}>
                    {mode === 'login' ? 'Sign up' : 'Sign in'}
                  </button>
                </p>

                <div className="flex items-center justify-center gap-4 mt-6 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  {['AI Verified', 'Secure', 'Free'].map(badge => (
                    <div key={badge} className="flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#00FF88' }} />
                      <span className="text-xs font-medium">{badge}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* FORGOT PASSWORD */}
            {mode === 'forgot' && (
              <motion.div key="forgot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <button onClick={() => setMode('login')} className="flex items-center gap-2 text-sm font-medium mb-6 transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  <ArrowLeft className="w-4 h-4" /> Back to login
                </button>
                <div className="mb-6">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.2)' }}>
                    <KeyRound className="w-6 h-6" style={{ color: '#00FF88' }} />
                  </div>
                  <h2 className="text-2xl font-display font-black text-white mb-1">Forgot Password?</h2>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Enter your email to get a reset code.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
                    <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required className={inputClass} />
                  </div>
                  <button type="submit" disabled={loading} className="btn-neon w-full py-3.5 rounded-xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Send Reset Code <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>
                <p className="text-center mt-4">
                  <button onClick={() => setMode('reset')} className="text-xs font-semibold" style={{ color: '#00D4FF' }}>Already have a reset code?</button>
                </p>
              </motion.div>
            )}

            {/* RESET PASSWORD */}
            {mode === 'reset' && (
              <motion.div key="reset" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <button onClick={() => setMode('forgot')} className="flex items-center gap-2 text-sm font-medium mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <div className="mb-6">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
                    <KeyRound className="w-6 h-6" style={{ color: '#00D4FF' }} />
                  </div>
                  <h2 className="text-2xl font-display font-black text-white mb-1">Reset Password</h2>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Enter your reset code and new password.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
                    <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required className={inputClass} />
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
                    <input type="text" placeholder="Reset Code" value={resetToken} onChange={e => setResetToken(e.target.value.toUpperCase())} required className={`${inputClass} tracking-widest`} />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
                    <input type={showPassword ? 'text' : 'password'} placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className={`${inputClass} pr-12`} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 rounded-xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #00D4FF, #BF5FFF)', color: 'white', boxShadow: '0 0 20px rgba(0,212,255,0.3)' }}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Reset Password <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
