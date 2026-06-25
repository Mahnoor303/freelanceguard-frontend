import { useEffect, useState } from 'react';
import {
  Save, Plus, Trash2, Upload, ShieldCheck, Bell, Globe,
  AlertTriangle, Key, Database, UserCircle, Settings2
} from 'lucide-react';
import { adminApi } from '../../adminApi';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  // ---------- Profile ----------
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [newPassword, setNewPassword] = useState('');

  // ---------- Admins ----------
  const [admins, setAdmins] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '', role: 'admin' });

  // ---------- System Settings ----------
  const [darkMode, setDarkMode] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [securityLogs, setSecurityLogs] = useState(true);

  // ---------- Website Settings (mock) ----------
  const [siteName, setSiteName] = useState('FreelanceGuard');
  const [siteDesc, setSiteDesc] = useState('AI-powered scam detection for freelancers.');
  const [logoPreview, setLogoPreview] = useState(null);

  // ---------- Security ----------
  const [twoFactor, setTwoFactor] = useState(false);

  // ---------- Notification Preferences ----------
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifInApp, setNotifInApp] = useState(true);

  // ---------- Danger Zone ----------
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch current admin profile & all admins on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const me = await adminApi('/me');
        setProfile({ name: me.name, email: me.email });
        const allAdmins = await adminApi('/admins');
        setAdmins(allAdmins);
      } catch (err) {
        console.error('Failed to load admin data', err);
      }
    };
    fetchData();
  }, []);

  // Update own profile
  const handleProfileUpdate = async () => {
    try {
      await adminApi('/profile', {
        method: 'PUT',
        body: JSON.stringify({ name: profile.name, email: profile.email, password: newPassword || undefined }),
      });
      toast.success('Profile updated');
      setNewPassword('');
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Add new admin
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      const created = await adminApi('/register', {
        method: 'POST',
        body: JSON.stringify(newAdmin),
      });
      setAdmins(prev => [...prev, created]);
      setShowAddForm(false);
      setNewAdmin({ name: '', email: '', password: '', role: 'admin' });
      toast.success('Admin added');
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Delete admin
  const handleDeleteAdmin = async (id) => {
    if (!confirm('Delete this admin?')) return;
    try {
      await adminApi(`/admins/${id}`, { method: 'DELETE' });
      setAdmins(prev => prev.filter(a => a._id !== id));
      toast.success('Admin deleted');
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Website settings save (mock)
  const handleWebsiteSave = () => {
    toast.success('Website settings saved (demo)');
  };

  // Logo upload mock
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
      toast.success('Logo uploaded (demo)');
    }
  };

  // Danger actions (mock)
  const handleResetData = () => {
    toast.error('All data reset (demo only)');
    setShowResetConfirm(false);
  };
  const handleDeleteAccount = () => {
    toast.error('Account deleted (demo only)');
    setShowDeleteConfirm(false);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-heading font-bold text-text-primary flex items-center gap-2">
        <Settings2 size={32} className="text-primary" /> Admin Settings
      </h1>

      {/* ========== My Profile ========== */}
      <div className="bg-card-bg border border-border rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-text-primary flex items-center gap-2">
          <UserCircle size={20} /> My Profile
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            className="w-full p-3 bg-bg-secondary border border-border rounded-xl text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder="Full Name"
          />
          <input
            className="w-full p-3 bg-bg-secondary border border-border rounded-xl text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            placeholder="Email"
          />
        </div>
        <input
          type="password"
          placeholder="New password (leave blank to keep current)"
          className="w-full p-3 bg-bg-secondary border border-border rounded-xl text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          onClick={handleProfileUpdate}
          className="bg-primary text-black px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary-dark transition"
        >
          <Save size={18} /> Save Profile
        </button>
      </div>

      {/* ========== Website Settings ========== */}
      <div className="bg-card-bg border border-border rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-text-primary flex items-center gap-2">
          <Globe size={20} /> Website Settings
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            className="w-full p-3 bg-bg-secondary border border-border rounded-xl text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            placeholder="Site Name"
          />
          <input
            className="w-full p-3 bg-bg-secondary border border-border rounded-xl text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary"
            value={siteDesc}
            onChange={(e) => setSiteDesc(e.target.value)}
            placeholder="Site Description"
          />
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => document.getElementById('logoInput').click()}
            className="bg-bg-secondary border border-border rounded-xl px-4 py-2 text-text-secondary hover:text-text-primary flex items-center gap-2 transition"
          >
            <Upload size={16} /> Upload Logo
          </button>
          <input id="logoInput" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
          {logoPreview && (
            <img src={logoPreview} alt="logo" className="h-10 w-10 object-contain rounded-lg border border-border" />
          )}
        </div>
        <button
          onClick={handleWebsiteSave}
          className="bg-primary text-black px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary-dark transition"
        >
          <Save size={18} /> Save Website Settings
        </button>
      </div>

      {/* ========== Manage Admins ========== */}
      <div className="bg-card-bg border border-border rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-text-primary flex items-center gap-2">
            <ShieldCheck size={20} /> Manage Admins
          </h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-primary text-black px-3 py-1 rounded-lg text-sm flex items-center gap-1 hover:bg-primary-dark transition"
          >
            <Plus size={16} /> Add Admin
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddAdmin} className="space-y-3 border-t border-border pt-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input required placeholder="Name" className="w-full p-2 bg-bg-secondary border border-border rounded-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary" value={newAdmin.name} onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })} />
              <input required type="email" placeholder="Email" className="w-full p-2 bg-bg-secondary border border-border rounded-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary" value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} />
              <input required type="password" placeholder="Password" className="w-full p-2 bg-bg-secondary border border-border rounded-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary" value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} />
            </div>
            <select
              className="w-full p-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
              value={newAdmin.role}
              onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
              <option value="moderator">Moderator</option>
            </select>
            <button type="submit" className="bg-primary text-black px-4 py-2 rounded-lg text-sm w-full hover:bg-primary-dark transition">
              Create Admin
            </button>
          </form>
        )}

        <div className="space-y-2">
          {admins.map((admin) => (
            <div key={admin._id} className="flex items-center justify-between bg-bg-secondary p-3 rounded-lg">
              <div>
                <p className="font-medium text-text-primary">{admin.name}</p>
                <p className="text-xs text-text-secondary">{admin.email} – {admin.role}</p>
              </div>
              <button onClick={() => handleDeleteAdmin(admin._id)} className="text-text-secondary hover:text-danger transition">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ========== Security Settings ========== */}
      <div className="bg-card-bg border border-border rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-text-primary flex items-center gap-2">
          <Key size={20} /> Security
        </h2>
        <div className="flex items-center justify-between">
          <span className="text-text-primary">Two-Factor Authentication</span>
          <button
            onClick={() => setTwoFactor(!twoFactor)}
            className={`w-12 h-6 rounded-full transition ${twoFactor ? 'bg-primary' : 'bg-bg-secondary'}`}
          >
            <span className={`block w-5 h-5 bg-white rounded-full transform transition ${twoFactor ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
        <p className="text-xs text-text-secondary">
          {twoFactor ? 'Enabled' : 'Disabled'} (demo feature)
        </p>
      </div>

      {/* ========== Notification Preferences ========== */}
      <div className="bg-card-bg border border-border rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-text-primary flex items-center gap-2">
          <Bell size={20} /> Notification Preferences
        </h2>
        <div className="flex items-center justify-between">
          <span className="text-text-primary">Email Notifications</span>
          <button
            onClick={() => setNotifEmail(!notifEmail)}
            className={`w-12 h-6 rounded-full transition ${notifEmail ? 'bg-primary' : 'bg-bg-secondary'}`}
          >
            <span className={`block w-5 h-5 bg-white rounded-full transform transition ${notifEmail ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-text-primary">Push Notifications</span>
          <button
            onClick={() => setNotifPush(!notifPush)}
            className={`w-12 h-6 rounded-full transition ${notifPush ? 'bg-primary' : 'bg-bg-secondary'}`}
          >
            <span className={`block w-5 h-5 bg-white rounded-full transform transition ${notifPush ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-text-primary">In-App Notifications</span>
          <button
            onClick={() => setNotifInApp(!notifInApp)}
            className={`w-12 h-6 rounded-full transition ${notifInApp ? 'bg-primary' : 'bg-bg-secondary'}`}
          >
            <span className={`block w-5 h-5 bg-white rounded-full transform transition ${notifInApp ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>

      {/* ========== System Settings ========== */}
      <div className="bg-card-bg border border-border rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-text-primary flex items-center gap-2">
          <Database size={20} /> System Settings
        </h2>
        <div className="flex items-center justify-between">
          <span className="text-text-primary">Dark Mode</span>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-12 h-6 rounded-full transition ${darkMode ? 'bg-primary' : 'bg-bg-secondary'}`}
          >
            <span className={`block w-5 h-5 bg-white rounded-full transform transition ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-text-primary">Email Alerts</span>
          <button
            onClick={() => setEmailAlerts(!emailAlerts)}
            className={`w-12 h-6 rounded-full transition ${emailAlerts ? 'bg-primary' : 'bg-bg-secondary'}`}
          >
            <span className={`block w-5 h-5 bg-white rounded-full transform transition ${emailAlerts ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-text-primary">Security Logs</span>
          <button
            onClick={() => setSecurityLogs(!securityLogs)}
            className={`w-12 h-6 rounded-full transition ${securityLogs ? 'bg-primary' : 'bg-bg-secondary'}`}
          >
            <span className={`block w-5 h-5 bg-white rounded-full transform transition ${securityLogs ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>

      {/* ========== Danger Zone ========== */}
      <div className="bg-card-bg border border-danger/30 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-danger flex items-center gap-2">
          <AlertTriangle size={20} /> Danger Zone
        </h2>
        <p className="text-sm text-text-secondary">
          These actions are irreversible. Please proceed with caution.
        </p>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="border border-danger text-danger px-4 py-2 rounded-lg text-sm hover:bg-danger/10 transition"
          >
            Reset All Data
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-danger text-white px-4 py-2 rounded-lg text-sm hover:bg-danger/80 transition"
          >
            Delete My Account
          </button>
        </div>

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-card-bg border border-border rounded-2xl p-6 w-full max-w-sm">
              <h3 className="text-xl font-bold text-text-primary mb-2">Reset All Data?</h3>
              <p className="text-text-secondary text-sm mb-4">This will permanently delete all users, scans, and reports. This action cannot be undone.</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowResetConfirm(false)} className="border border-border text-text-primary px-4 py-2 rounded-lg text-sm">Cancel</button>
                <button onClick={handleResetData} className="bg-danger text-white px-4 py-2 rounded-lg text-sm">Yes, Reset</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Account Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-card-bg border border-border rounded-2xl p-6 w-full max-w-sm">
              <h3 className="text-xl font-bold text-text-primary mb-2">Delete Account?</h3>
              <p className="text-text-secondary text-sm mb-4">You will lose access to the admin panel immediately.</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowDeleteConfirm(false)} className="border border-border text-text-primary px-4 py-2 rounded-lg text-sm">Cancel</button>
                <button onClick={handleDeleteAccount} className="bg-danger text-white px-4 py-2 rounded-lg text-sm">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}