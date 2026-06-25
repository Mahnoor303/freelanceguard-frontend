import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, FileSearch, Flag, Database,
  FileText, Bell, Settings, LogOut, Home, Sun, Moon, MessageSquare
} from 'lucide-react';
import NotificationBell from '../ui/NotificationBell';
import { useAdminAuth } from '../../context/AdminAuthContext';

const links = [
  { to: '/admin', icon: LayoutDashboard, label: 'Overview', exact: true },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/scans', icon: FileSearch, label: 'Scans' },
  { to: '/admin/reports', icon: Flag, label: 'Reports' },
  { to: '/admin/scam-database', icon: Database, label: 'Scam Database' },
  { to: '/admin/content', icon: FileText, label: 'Content' },
  { to: '/admin/notifications', icon: Bell, label: 'Notifications' },
  { to: '/admin/testimonials', icon: MessageSquare, label: 'Testimonials' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout({ dark, setDark }) {
  const navigate = useNavigate();
  const { admin } = useAdminAuth();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-bg-primary text-text-primary">      {/* 👈 global bg & text */}
      {/* Sidebar */}
      <aside className="w-64 bg-card-bg border-r border-border p-4 flex flex-col">   {/* 👈 card-bg & border */}
        <h2 className="text-xl font-heading font-bold text-primary mb-8 px-2">
          {admin?.name || 'Admin Panel'}
        </h2>

        <NavLink to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-bg-secondary transition mb-4">
          <Home size={18} /> Back to Site
        </NavLink>

        <nav className="flex-1 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:bg-bg-secondary'
                }`
              }
            >
              <link.icon size={18} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 mt-4 text-sm text-text-secondary hover:text-primary transition">
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border flex items-center justify-end px-6 gap-4">   {/* 👈 border */}
          <NotificationBell isAdmin={true} />
          <button onClick={() => setDark(!dark)} className="p-2 rounded-full hover:bg-bg-secondary transition">
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}