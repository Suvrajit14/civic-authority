import React from 'react';
import { LogOut, Shield, LayoutDashboard, FilePlus, BarChart3, Menu, X, Bell, UserCircle, Trophy, Activity, BookOpen, Globe, Sparkles } from 'lucide-react';
import { auth, signOut } from '../currentUser';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../i18n';

interface LayoutProps {
  children: React.ReactNode;
  user: UserProfile | null;
}

export default function Layout({ children, user }: LayoutProps) {
  const { t, language, setLanguage } = useI18n();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [unreadNotifications, setUnreadNotifications] = React.useState(0);
  const location = useLocation();

  React.useEffect(() => {
    if (!user) return;
    const fetchUnreadCount = async () => {
      if (!user?.uid) return;
      try {
        const res = await fetch(`/api/notifications/${encodeURIComponent(user.uid)}`);
        if (res.ok) {
          const notifications = await res.json();
          setUnreadNotifications(notifications.filter((n: any) => !n.read).length);
        }
      } catch { /* silent */ }
    };
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const navItems = [
    { id: 'dashboard',     label: t('nav.dashboard'),                  icon: LayoutDashboard, path: '/',              color: '#6366F1' },
    ...(user?.role === 'admin' ? [{ id: 'admin', label: t('nav.admin'), icon: Shield, path: '/admin', color: '#F43F5E' }] : []),
    { id: 'report',        label: t('nav.report'),                     icon: FilePlus,        path: '/report',        color: '#10B981' },
    { id: 'live',          label: t('nav.live'),                       icon: Activity,        path: '/live',          color: '#F43F5E' },
    { id: 'analytics',     label: t('nav.analytics'),                  icon: BarChart3,       path: '/analytics',    color: '#3B82F6' },
    { id: 'leaderboard',   label: t('nav.leaderboard'),                icon: Trophy,          path: '/leaderboard',  color: '#F59E0B' },
    { id: 'notifications', label: t('nav.notifications') || 'Alerts', icon: Bell,            path: '/notifications', color: '#8B5CF6', badge: unreadNotifications },
    { id: 'guide',         label: t('nav.guide') || 'Guide',           icon: BookOpen,        path: '/guide',        color: '#06B6D4' },
    { id: 'profile',       label: t('nav.profile'),                    icon: UserCircle,      path: '/profile',      color: '#14B8A6' },
  ];

  const activeTab = navItems.find(item =>
    item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)
  )?.id || 'dashboard';

  const activeItem = navItems.find(i => i.id === activeTab);

  return (
    <div className="min-h-screen font-sans relative" style={{ background: 'linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 50%, #faf5ff 100%)' }}>

      {/* Aurora background blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', animation: 'aurora-shift 12s ease-in-out infinite' }} />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', animation: 'aurora-shift 15s ease-in-out infinite reverse' }} />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)', animation: 'aurora-shift 18s ease-in-out infinite 3s' }} />
      </div>

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="fixed left-0 top-0 h-full w-64 z-50 hidden lg:flex flex-col"
        style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderRight: '1px solid rgba(99,102,241,0.1)', boxShadow: '4px 0 24px rgba(99,102,241,0.06)' }}>

        {/* Logo */}
        <div className="px-6 pt-6 pb-5" style={{ borderBottom: '1px solid rgba(99,102,241,0.08)' }}>
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div whileHover={{ rotate: 10, scale: 1.05 }} transition={{ type: 'spring', stiffness: 400 }}
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1, #3B82F6)', boxShadow: '0 4px 15px rgba(99,102,241,0.35)' }}>
              <Shield className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <p className="font-display font-black text-base tracking-tight" style={{ color: '#1a1a2e' }}>Civic Pillar</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#10B981' }} />
                <p className="text-[10px] font-semibold" style={{ color: 'rgba(26,26,46,0.4)' }}>Live Platform</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Language */}
        <div className="px-4 pt-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.1)' }}>
            <Globe className="w-3.5 h-3.5" style={{ color: '#6366F1' }} />
            <select value={language} onChange={e => setLanguage(e.target.value as any)}
              className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer w-full appearance-none"
              style={{ color: '#6366F1' }}>
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="or">ଓଡ଼ିଆ</option>
            </select>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 pt-4 space-y-0.5 overflow-y-auto no-scrollbar">
          <p className="text-[9px] uppercase tracking-[0.3em] font-bold px-3 pb-2" style={{ color: 'rgba(26,26,46,0.3)' }}>Menu</p>
          {navItems.map((item, i) => {
            const isActive = activeTab === item.id;
            return (
              <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                <Link to={item.path}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${isActive ? 'nav-active' : ''}`}
                  style={!isActive ? { color: 'rgba(26,26,46,0.5)' } : { color: item.color }}>
                  {isActive && (
                    <motion.div layoutId="activeNav" className="absolute inset-0 rounded-xl"
                      style={{ background: `linear-gradient(135deg, ${item.color}15, ${item.color}08)`, border: `1px solid ${item.color}25` }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }} />
                  )}
                  <div className="relative z-10 w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                    style={isActive ? { background: `${item.color}15` } : {}}>
                    <item.icon className="w-4 h-4" style={isActive ? { color: item.color } : {}} />
                  </div>
                  <span className="text-sm font-semibold relative z-10">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="ml-auto text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full relative z-10"
                      style={{ background: '#F43F5E', color: 'white' }}>
                      {item.badge > 9 ? '9+' : item.badge}
                    </motion.span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* User card */}
        <div className="p-3" style={{ borderTop: '1px solid rgba(99,102,241,0.08)' }}>
          {user && (
            <motion.div whileHover={{ scale: 1.01 }}
              className="flex items-center gap-3 p-3 rounded-xl mb-2 cursor-default"
              style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.04))', border: '1px solid rgba(99,102,241,0.1)' }}>
              <div className="relative">
                <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
                  className="w-9 h-9 rounded-xl object-cover" alt="Profile"
                  style={{ border: '2px solid rgba(99,102,241,0.2)' }} />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white" style={{ background: '#10B981' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: '#1a1a2e' }}>{user.displayName}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="h-1 flex-1 rounded-full overflow-hidden" style={{ background: 'rgba(99,102,241,0.1)' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (user.trustScore / 1000) * 100)}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #8B5CF6, #6366F1, #3B82F6)' }} />
                  </div>
                  <span className="text-[9px] font-bold" style={{ color: '#6366F1' }}>{user.trustScore}</span>
                </div>
              </div>
            </motion.div>
          )}
          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            onClick={() => signOut(auth)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all"
            style={{ background: 'rgba(244,63,94,0.06)', color: '#F43F5E', border: '1px solid rgba(244,63,94,0.15)' }}>
            <LogOut className="w-3.5 h-3.5" />
            {t('nav.logout')}
          </motion.button>
        </div>
      </aside>

      {/* ── MOBILE HEADER ── */}
      <header className="lg:hidden fixed top-0 left-0 w-full px-4 py-3 flex items-center justify-between z-[60]"
        style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(99,102,241,0.1)', boxShadow: '0 2px 16px rgba(99,102,241,0.06)' }}>
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)', boxShadow: '0 3px 10px rgba(99,102,241,0.3)' }}>
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-black text-base" style={{ color: '#1a1a2e' }}>Civic Pillar</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.12)' }}>
            <Globe className="w-3 h-3" style={{ color: '#6366F1' }} />
            <select value={language} onChange={e => setLanguage(e.target.value as any)}
              className="bg-transparent text-[10px] font-bold focus:outline-none cursor-pointer appearance-none"
              style={{ color: '#6366F1' }}>
              <option value="en">EN</option>
              <option value="hi">HI</option>
              <option value="or">OR</option>
            </select>
          </div>
          {unreadNotifications > 0 && (
            <Link to="/notifications" className="relative p-2 rounded-xl" style={{ background: 'rgba(99,102,241,0.06)' }}>
              <Bell className="w-4 h-4" style={{ color: '#6366F1' }} />
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 text-[8px] font-black flex items-center justify-center rounded-full"
                style={{ background: '#F43F5E', color: 'white' }}>{unreadNotifications}</span>
            </Link>
          )}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl" style={{ background: 'rgba(99,102,241,0.06)' }}>
            {isMobileMenuOpen ? <X className="w-5 h-5" style={{ color: '#6366F1' }} /> : <Menu className="w-5 h-5" style={{ color: '#6366F1' }} />}
          </button>
        </div>
      </header>

      {/* ── MOBILE MENU ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.22 }}
            className="lg:hidden fixed inset-0 z-[55] pt-16 flex flex-col"
            style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(24px)' }}>
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {navItems.map((item, i) => {
                const isActive = activeTab === item.id;
                return (
                  <motion.div key={item.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                    <Link to={item.path} onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all"
                      style={isActive
                        ? { background: `linear-gradient(135deg, ${item.color}12, ${item.color}06)`, border: `1px solid ${item.color}20`, color: item.color }
                        : { color: 'rgba(26,26,46,0.5)', border: '1px solid transparent' }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: isActive ? `${item.color}15` : 'rgba(26,26,46,0.04)' }}>
                        <item.icon className="w-4 h-4" style={isActive ? { color: item.color } : {}} />
                      </div>
                      <span className="font-semibold text-sm">{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="ml-auto text-[9px] font-black px-1.5 py-0.5 rounded-full"
                          style={{ background: '#F43F5E', color: 'white' }}>{item.badge}</span>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
            <div className="p-4" style={{ borderTop: '1px solid rgba(99,102,241,0.08)' }}>
              {user && (
                <div className="flex items-center gap-3 p-3 rounded-xl mb-3"
                  style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.1)' }}>
                  <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
                    className="w-10 h-10 rounded-xl object-cover" alt="Profile" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: '#1a1a2e' }}>{user.displayName}</p>
                    <p className="text-xs font-medium" style={{ color: '#6366F1' }}>Trust: {user.trustScore}</p>
                  </div>
                </div>
              )}
              <button onClick={() => signOut(auth)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm"
                style={{ background: 'rgba(244,63,94,0.06)', color: '#F43F5E', border: '1px solid rgba(244,63,94,0.15)' }}>
                <LogOut className="w-4 h-4" />
                {t('nav.logout')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ── */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-5 lg:px-8 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
