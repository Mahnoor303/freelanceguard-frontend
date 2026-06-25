import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, Shield, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../ui/NotificationBell';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export default function Navbar({ dark, setDark }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Detect scroll for background change
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const closeMobile = () => setMobileOpen(false);

  // Common active class for desktop links
  const activeClass = "text-primary relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/95 shadow-[0_4px_20px_rgba(97,255,139,0.1)] backdrop-blur-md'
          : 'bg-black/80 backdrop-blur-lg'
      } border-b border-gray-800`}
    >
      <div className="flex items-center justify-between px-6 h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-heading font-bold text-primary hover:drop-shadow-[0_0_8px_rgba(97,255,139,0.5)] transition">
          <Shield size={28} />
          FreelanceGuard
        </Link>

        {/* Desktop navigation – hidden on mobile */}
        <div className="hidden lg:flex items-center gap-8 text-sm">
          <NavLink to="/dashboard" end className={({ isActive }) => isActive ? activeClass : 'text-gray-300 hover:text-primary transition'}>
            {t('dashboard')}
          </NavLink>
          <NavLink to="/job-analyzer" className={({ isActive }) => isActive ? activeClass : 'text-gray-300 hover:text-primary transition'}>
            {t('jobAnalyzer')}
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => isActive ? activeClass : 'text-gray-300 hover:text-primary transition'}>
            {t('history')}
          </NavLink>
          <NavLink to="/reports" className={({ isActive }) => isActive ? activeClass : 'text-gray-300 hover:text-primary transition'}>
            {t('reports')}
          </NavLink>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          {user && <NotificationBell />}
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-full hover:bg-gray-800 hover:shadow-[0_0_10px_rgba(97,255,139,0.3)] transition"
          >
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Desktop user links */}
          <div className="hidden lg:flex items-center gap-4">
            {user && (
              <>
                <Link to="/profile" className="text-sm text-gray-300 hover:text-primary transition">{t('profile')}</Link>
                <Link to="/settings" className="text-sm text-gray-300 hover:text-primary transition">{t('settings')}</Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-400 transition"
                >
                  <LogOut size={16} /> {t('logout')}
                </button>
              </>
            )}
            {!user && (
              <Link to="/?login=true" className="text-sm text-gray-300 hover:text-primary transition">{t('login')}</Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 text-gray-400 hover:text-primary"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile full‑screen overlay */}
      <div
        className={`fixed inset-0 bg-black/95 z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-500 ease-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          className="absolute top-6 right-6 text-gray-400 hover:text-primary"
          onClick={closeMobile}
        >
          <X size={28} />
        </button>
        <NavLink to="/dashboard" end onClick={closeMobile} className="text-2xl text-gray-300 hover:text-primary transition">Dashboard</NavLink>
        <NavLink to="/job-analyzer" onClick={closeMobile} className="text-2xl text-gray-300 hover:text-primary transition">Job Analyzer</NavLink>
        <NavLink to="/history" onClick={closeMobile} className="text-2xl text-gray-300 hover:text-primary transition">History</NavLink>
        <NavLink to="/reports" onClick={closeMobile} className="text-2xl text-gray-300 hover:text-primary transition">Community</NavLink>
        {user && (
          <>
            <NavLink to="/profile" onClick={closeMobile} className="text-2xl text-gray-300 hover:text-primary transition">Profile</NavLink>
            <NavLink to="/settings" onClick={closeMobile} className="text-2xl text-gray-300 hover:text-primary transition">Settings</NavLink>
            <button
              onClick={handleLogout}
              className="text-2xl text-red-400 hover:text-red-300 transition flex items-center gap-2"
            >
              <LogOut size={20} /> Logout
            </button>
          </>
        )}
        {!user && (
          <Link to="/?login=true" onClick={closeMobile} className="text-2xl text-gray-300 hover:text-primary transition">Login</Link>
        )}
      </div>
    </header>
  );
}