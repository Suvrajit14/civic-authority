import React, { useState } from 'react';
import { loginUser, registerUser } from '../services/api';
import { Shield, Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight, CheckCircle2, MapPin, Bell, BarChart3, ArrowLeft, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import { API_BASE } from '../services/apiBase';

const features = [
  { icon: MapPin,    title: 'Report Issues',   desc: 'Pin civic problems on the map instantly' },
  { icon: Shield,    title: 'AI Verification', desc: 'Every report verified by Gemini AI' },
  { icon: Bell,      title: 'Live Updates',    desc: 'Real-time status notifications' },
  { icon: BarChart3, title: 'Analytics',       desc: 'Track resolution trends & insights' },
];

type Mode = 'login' | 'register' | 'forgot' | 'reset';

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
          setMode('login');
          setLoading(false);
          return;
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
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (data.resetToken) {
          toast.success(`Your reset code is: ${data.resetToken} — save it!`, { duration: 30000 });
          setMode('reset');
        } else {
          toast.error(data.msg || 'Email not found.');
        }
      } else if (mode === 'reset') {
        const res = await fetch(`${API_BASE}/auth/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, resetToken, newPassword })
        });
        const data = await res.json();
        if (data.msg === 'Password reset successfully') {
          toast.success('Password reset! Please log in.');
          setMode('login');
        } else {
          toast.error(data.msg || 'Reset failed.');
        }
      }
    } catch {
      toast.error('Network error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <Toaster position="top-right" richColors />

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0D0D0D] relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600/15 rounded-full blur-[80px] translate-x-1/3 translate-y-1/3" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/40">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-display font-bold text-xl">Civic Pillar</span>
          </div>
          <h1 className="text-5xl font-display font-black text-white leading-tight mb-4">
            Empowering<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400">Citizens</span><br />
            Together
          </h1>
          <p className="text-white/40 text-lg font-medium leading-relaxed max-w-sm">
            Report, track and resolve civic issues in your community with AI-powered verification.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-3">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-white/5 border border-white/8 rounded-2xl p-4 backdrop-blur-sm">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-lg flex items-center justify-center mb-3">
                <f.icon className="w-4 h-4 text-purple-300" />
              </div>
              <p className="text-white text-sm font-bold mb-0.5">{f.title}</p>
              <p className="text-white/35 text-xs leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 flex items-center gap-8 pt-6 border-t border-white/5">
          {[['10K+', 'Issues Resolved'], ['98%', 'AI Accuracy'], ['24/7', 'Monitoring']].map(([val, label]) => (
            <div key={label}>
              <p className="text-white font-display font-black text-xl">{val}</p>
              <p className="text-white/30 text-xs font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-[#F8F7FF]">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-neutral-900">Civic Pillar</span>
          </div>

          <AnimatePresence mode="wait">
            {/* LOGIN / REGISTER */}
            {(mode === 'login' || mode === 'register') && (
              <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="mb-6">
                  <h2 className="text-3xl font-display font-black text-neutral-900 mb-1">
                    {mode === 'login' ? 'Welcome back' : 'Create account'}
                  </h2>
                  <p className="text-neutral-500 text-sm">
                    {mode === 'login' ? 'Sign in to your account' : 'Join thousands of active citizens'}
                  </p>
                </div>

                <div className="flex bg-neutral-100 p-1 rounded-xl mb-6">
                  {['login', 'register'].map(tab => (
                    <button key={tab} onClick={() => setMode(tab as Mode)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 capitalize ${mode === tab ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}>
                      {tab === 'login' ? 'Login' : 'Register'}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <AnimatePresence>
                    {mode === 'register' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                          <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)}
                            className="w-full bg-white border border-neutral-200 rounded-xl py-3.5 pl-11 pr-4 text-neutral-900 placeholder:text-neutral-400 text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-3 focus:ring-purple-500/10 transition-all shadow-sm" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required
                      className="w-full bg-white border border-neutral-200 rounded-xl py-3.5 pl-11 pr-4 text-neutral-900 placeholder:text-neutral-400 text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-3 focus:ring-purple-500/10 transition-all shadow-sm" />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
                      className="w-full bg-white border border-neutral-200 rounded-xl py-3.5 pl-11 pr-12 text-neutral-900 placeholder:text-neutral-400 text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-3 focus:ring-purple-500/10 transition-all shadow-sm" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {mode === 'login' && (
                    <div className="flex justify-end">
                      <button type="button" onClick={() => setMode('forgot')} className="text-xs text-purple-600 hover:text-purple-700 font-semibold transition-colors">
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{mode === 'register' ? 'Create Account' : 'Sign In'}<ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>

                <p className="text-center text-neutral-500 text-sm mt-6">
                  {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                  <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-purple-600 hover:text-purple-700 font-bold transition-colors">
                    {mode === 'login' ? 'Sign up' : 'Sign in'}
                  </button>
                </p>

                <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-neutral-200">
                  {['AI Verified', 'Secure', 'Free'].map(badge => (
                    <div key={badge} className="flex items-center gap-1.5 text-neutral-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-xs font-medium">{badge}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* FORGOT PASSWORD */}
            {mode === 'forgot' && (
              <motion.div key="forgot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <button onClick={() => setMode('login')} className="flex items-center gap-2 text-neutral-400 hover:text-neutral-600 text-sm font-medium mb-6 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to login
                </button>
                <div className="mb-6">
                  <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-4">
                    <KeyRound className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-display font-black text-neutral-900 mb-1">Forgot Password?</h2>
                  <p className="text-neutral-500 text-sm">Enter your email and we'll send you a reset code.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required
                      className="w-full bg-white border border-neutral-200 rounded-xl py-3.5 pl-11 pr-4 text-neutral-900 placeholder:text-neutral-400 text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-3 focus:ring-purple-500/10 transition-all shadow-sm" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Send Reset Code <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>
                <p className="text-center mt-4">
                  <button onClick={() => setMode('reset')} className="text-xs text-purple-600 hover:text-purple-700 font-semibold">Already have a reset code?</button>
                </p>
              </motion.div>
            )}

            {/* RESET PASSWORD */}
            {mode === 'reset' && (
              <motion.div key="reset" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <button onClick={() => setMode('forgot')} className="flex items-center gap-2 text-neutral-400 hover:text-neutral-600 text-sm font-medium mb-6 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <div className="mb-6">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                    <KeyRound className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-display font-black text-neutral-900 mb-1">Reset Password</h2>
                  <p className="text-neutral-500 text-sm">Enter the reset code you received and your new password.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required
                      className="w-full bg-white border border-neutral-200 rounded-xl py-3.5 pl-11 pr-4 text-neutral-900 placeholder:text-neutral-400 text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-3 focus:ring-purple-500/10 transition-all shadow-sm" />
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input type="text" placeholder="Reset Code" value={resetToken} onChange={e => setResetToken(e.target.value.toUpperCase())} required
                      className="w-full bg-white border border-neutral-200 rounded-xl py-3.5 pl-11 pr-4 text-neutral-900 placeholder:text-neutral-400 text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-3 focus:ring-purple-500/10 transition-all shadow-sm tracking-widest" />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input type={showPassword ? 'text' : 'password'} placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required
                      className="w-full bg-white border border-neutral-200 rounded-xl py-3.5 pl-11 pr-12 text-neutral-900 placeholder:text-neutral-400 text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-3 focus:ring-purple-500/10 transition-all shadow-sm" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50 flex items-center justify-center gap-2">
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
