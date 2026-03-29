import React from 'react';
import { LogOut, Shield, LayoutDashboard, FilePlus, BarChart3, Menu, X, Bell, UserCircle, Trophy, Activity, BookOpen, Globe, ChevronRight, Zap } from 'lucide-react';
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
    { id: 'dashboard',     label: t('nav.dashboard'),                    icon: LayoutDashboard, path: '/' },
    ...(user?.role === 'admin' ? [{ id: 'admin', label: t('nav.admin'), icon: Shield, path: '/admin' }] : []),
    { id: 'report',        label: t('nav.report'),                       icon: FilePlus,        path: '/report' },
    { id: 'live',          label: t('nav.live'),                         icon: Activity,        path: '/live' },
    { id: 'analytics',     label: t('nav.analytics'),                    icon: BarChart3,       path: '/analytics' },
    { id: 'leaderboard',   label: t('nav.leaderboard'),                  icon: Trophy,          path: '/leaderboard' },
    { id: 'notifications', label: t('nav.notifications') || 'Alerts',   icon: Bell,            path: '/notifications', badge: unreadNotifications },
    { id: 'guide',         label: t('nav.guide') || 'Guide',             icon: BookOpen,        path: '/guide' },
    { id: 'profile',       label: t('nav.profile'),                      icon: UserCircle,      path: '/profile' },
  ];

  const activeTab = navItems.find(item =>
    item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)
  )?.id || 'dashboard';

  return (
    <div className="min-h-screen font-sans relative" style={{ background: '#0A0A0F' }}>
      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-64 w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: 'rgba(191,95,255,0.06)' }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[100px]" style={{ background: 'rgba(0,212,255,0.05)' }} />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full blur-[80px]" style={{ background: 'rgba(0,255,136,0.04)' }} />
      </div>

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="fixed left-0 top-0 h-full w-64 z-50 hidden lg:flex flex-col overflow-hidden"
        style={{ background: 'rgba(10,10,20,0.95)', borderRight: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}>

        {/* Sidebar glow */}
        <div className="absolute top-0 right-0 w-32 h-48 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(0,255,136,0.06)' }} />

        {/* Logo */}
        <div className="px-6 pt-7 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #00FF88, #00D4FF)', boxShadow: '0 0 20px rgba(0,255,136,0.3)' }}>
              <Shield className="w-5 h-5 text-black" />
            </div>
            <div>
              <p className="text-white font-display font-bold text-base tracking-tight leading-none">Civic Pillar</p>
              <p className="text-xs font-medium mt-0.5" style={{ color: 'rgba(0,255,136,0.6)' }}>Governance Platform</p>
            </div>
          </Link>
        </div>

        {/* Language */}
        <div className="px-4 pt-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Globe className="w-3.5 h-3.5" style={{ color: 'rgba(0,255,136,0.7)' }} />
            <select value={language} onChange={e => setLanguage(e.target.value as any)}
              className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer w-full appearance-none"
              style={{ color: 'rgba(255,255,255,0.6)' }}>
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="or">ଓଡ଼ିଆ</option>
            </select>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 pt-4 space-y-0.5 overflow-y-auto no-scrollbar">
          <p className="text-[9px] uppercase tracking-[0.3em] font-bold px-3 pb-2" style={{ color: 'rgba(255,255,255,0.2)' }}>Navigation</p>
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <Link key={item.id} to={item.path}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${isActive ? 'nav-active' : ''}`}
                style={!isActive ? { color: 'rgba(255,255,255,0.4)' } : { color: '#00FF88' }}>
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="text-sm font-semibold tracking-tight">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-auto text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full"
                    style={{ background: '#FF3CAC', color: 'white' }}>
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="ml-auto w-3 h-3" style={{ color: 'rgba(0,255,136,0.5)' }} />}
              </Link>
            );
          })}
        </nav>

        {/* User card */}
        <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {user && (
            <div className="flex items-center gap-3 p-3 rounded-xl mb-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
                className="w-8 h-8 rounded-lg object-cover" alt="Profile"
                style={{ border: '2px solid rgba(0,255,136,0.3)' }} />
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-bold truncate">{user.displayName}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="h-1 flex-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <div className="h-full rounded-full" style={{ width: `${Math.min(100, (user.trustScore / 1000) * 100)}%`, background: 'linear-gradient(90deg, #00FF88, #00D4FF)' }} />
                  </div>
                  <span className="text-[9px] font-bold" style={{ color: 'rgba(0,255,136,0.7)' }}>{user.trustScore}</span>
                </div>
              </div>
            </div>
          )}
          <button onClick={() => signOut(auth)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all"
            style={{ background: 'rgba(255,60,172,0.1)', color: '#FF3CAC', border: '1px solid rgba(255,60,172,0.2)' }}>
            <LogOut className="w-3.5 h-3.5" />
            {t('nav.logout')}
          </button>
        </div>
      </aside>

      {/* ── MOBILE HEADER ── */}
      <header className="lg:hidden fixed top-0 left-0 w-full px-4 py-3 flex items-center justify-between z-[60]"
        style={{ background: 'rgba(10,10,20,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}>
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #00FF88, #00D4FF)', boxShadow: '0 0 15px rgba(0,255,136,0.3)' }}>
            <Shield className="w-4 h-4 text-black" />
          </div>
          <span className="font-display font-bold text-base text-white">Civic Pillar</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg" style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.15)' }}>
            <Globe className="w-3 h-3" style={{ color: '#00FF88' }} />
            <select value={language} onChange={e => setLanguage(e.target.value as any)}
              className="bg-transparent text-[10px] font-bold focus:outline-none cursor-pointer appearance-none"
              style={{ color: '#00FF88' }}>
              <option value="en">EN</option>
              <option value="hi">HI</option>
              <option value="or">OR</option>
            </select>
          </div>
          {unreadNotifications > 0 && (
            <Link to="/notifications" className="relative p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <Bell className="w-4 h-4 text-white" />
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 text-[8px] font-black flex items-center justify-center rounded-full"
                style={{ background: '#FF3CAC', color: 'white' }}>{unreadNotifications}</span>
            </Link>
          )}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
            {isMobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>
      </header>

      {/* ── MOBILE MENU ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.22 }}
            className="lg:hidden fixed inset-0 z-[55] pt-16 flex flex-col"
            style={{ background: 'rgba(10,10,20,0.98)', backdropFilter: 'blur(20px)' }}>
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {navItems.map(item => {
                const isActive = activeTab === item.id;
                return (
                  <Link key={item.id} to={item.path} onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all"
                    style={isActive
                      ? { background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.25)', color: '#00FF88' }
                      : { color: 'rgba(255,255,255,0.5)', border: '1px solid transparent' }}>
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span className="font-semibold text-sm">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="ml-auto text-[9px] font-black px-1.5 py-0.5 rounded-full"
                        style={{ background: '#FF3CAC', color: 'white' }}>{item.badge}</span>
                    )}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              {user && (
                <div className="flex items-center gap-3 p-3 rounded-xl mb-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
                    className="w-10 h-10 rounded-xl object-cover" alt="Profile" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-bold truncate">{user.displayName}</p>
                    <p className="text-xs" style={{ color: 'rgba(0,255,136,0.6)' }}>Trust: {user.trustScore}</p>
                  </div>
                </div>
              )}
              <button onClick={() => signOut(auth)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm"
                style={{ background: 'rgba(255,60,172,0.1)', color: '#FF3CAC', border: '1px solid rgba(255,60,172,0.2)' }}>
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
