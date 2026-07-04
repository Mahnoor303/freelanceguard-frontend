import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Shield, MessageSquare, FileText, Search,
  History, Users, Settings, Bookmark, Flag, Home, ShieldCheck,
  BookOpen,  Video, ScrollText, Map, Calculator, FolderKanban // 👈 add this
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Static links – NO Contract Checker, Client Lookup, or Subscription here
const links = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/job-analyzer', icon: Shield, label: 'Job Analyzer' },
  { to: '/message-scanner', icon: MessageSquare, label: 'Message Scanner' },
  { to: '/history', icon: History, label: 'History' },
  { to: '/portfolio-builder', icon: FolderKanban, label: 'Portfolio' },
  { to: '/saved-reports', icon: Bookmark, label: 'Saved Reports' },
  { to: '/video-tutorials', icon: Video, label: 'Tutorials' },
  { to: '/contract-templates', icon: ScrollText, label: 'Templates' },
  { to: '/workspace', icon: BookOpen, label: 'Workspace' },
  { to: '/roadmap', icon: Map, label: 'Roadmap' },
  { to: '/demo-scans', icon: BookOpen, label: 'Demo Scans' },
  { to: '/reports', icon: Flag, label: 'Community' },
  { to: '/rate-calculator', icon: Calculator, label: 'Rate Calc' },
  { to: '/profile', icon: Users, label: 'Profile' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-black/40 backdrop-blur-md border-r border-white/5 h-screen sticky top-0 z-30 sidebar">
      {/* User name / brand */}
      <div className="p-6 font-heading font-bold text-2xl text-primary">
        {user?.name || 'FreelanceGuard'}
      </div>

      {/* Back to Site */}
      <NavLink
        to="/"
        className="flex items-center gap-3 px-3 py-2 mx-3 rounded-lg text-sm text-gray-400 hover:bg-white/5 hover:text-white transition mb-2"
      >
        <Home size={18} />
        Back to Site
      </NavLink>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-primary/10 text-primary shadow-[0_0_12px_rgba(97,255,139,0.15)] border border-primary/20'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
              }`
            }
          >
            <link.icon size={20} />
            {link.label}
          </NavLink>
        ))}

        {/* Premium links – only for pro/elite users */}
        {(user?.plan === 'pro' || user?.plan === 'elite') && (
          <>
            <NavLink
              to="/contract-checker"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-primary/10 text-primary shadow-[0_0_12px_rgba(97,255,139,0.15)] border border-primary/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`
              }
            >
              <FileText size={20} />
              Contract Checker
            </NavLink>

            <NavLink
              to="/client-lookup"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-primary/10 text-primary shadow-[0_0_12px_rgba(97,255,139,0.15)] border border-primary/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`
              }
            >
              <Search size={20} />
              Client Lookup
            </NavLink>

            <NavLink
              to="/subscription"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-primary/10 text-primary shadow-[0_0_12px_rgba(97,255,139,0.15)] border border-primary/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`
              }
            >
              <ShieldCheck size={20} />
              Subscription
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}