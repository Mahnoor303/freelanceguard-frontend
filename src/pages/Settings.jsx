import { useState } from 'react';
import { Bell, Moon, Globe, Lock, ShieldCheck, Trash2, User, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import toast from 'react-hot-toast';
import i18n from '../i18n';
import { useNavigate } from 'react-router-dom';

export default function Settings({ dark, setDark }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ---------- Notification Prefs ----------
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifInApp, setNotifInApp] = useState(true);

  // ---------- Password Change ----------
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // ---------- Danger Zone ----------
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ---------- Language ----------
  const [language, setLanguage] = useState(i18n.language);

  const handlePasswordChange = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await api('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    toast.success(`Language changed to ${lang === 'en' ? 'English' : lang === 'ur' ? 'Urdu' : lang === 'it' ? 'Italiano' : lang === 'tr' ? 'Türkçe' : lang === 'ar' ? 'العربية' : 'Русский'}`);
  };

  const handleDeleteAccount = async () => {
    try {
      await api('/auth/me', { method: 'DELETE' });
      toast.success('Account deleted successfully');
      logout();
      localStorage.clear();
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-heading font-bold text-text-primary">Settings</h1>

      {/* ========== Notification Preferences ========== */}
      <div className="bg-card-bg border border-border rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-text-primary flex items-center gap-2">
          <Bell size={20} className="text-primary" /> Notification Preferences
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

      {/* ========== Appearance ========== */}
      <div className="bg-card-bg border border-border rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-text-primary flex items-center gap-2">
          <Moon size={20} className="text-primary" /> Appearance
        </h2>
        <div className="flex items-center justify-between">
          <span className="text-text-primary">Dark Mode</span>
          <button
            onClick={() => setDark(!dark)}
            className={`w-12 h-6 rounded-full transition ${dark ? 'bg-primary' : 'bg-bg-secondary'}`}
          >
            <span className={`block w-5 h-5 bg-white rounded-full transform transition ${dark ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-text-primary">Language</span>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-bg-secondary border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary"
          >
            <option value="en">English</option>
            <option value="ur">Urdu</option>
            <option value="it">Italiano</option>
            <option value="tr">Türkçe</option>
            <option value="ar">العربية</option>
            <option value="ru">Русский</option>
          </select>
        </div>
      </div>

      {/* ========== Security ========== */}
      <div className="bg-card-bg border border-border rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-text-primary flex items-center gap-2">
          <Lock size={20} className="text-primary" /> Change Password
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-3 bg-bg-secondary border border-border rounded-xl text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary"
          />
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 bg-bg-secondary border border-border rounded-xl text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 bg-bg-secondary border border-border rounded-xl text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary"
          />
        </div>
        <button
          onClick={handlePasswordChange}
          className="bg-primary text-black px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary-dark transition"
        >
          <ShieldCheck size={18} /> Update Password
        </button>
      </div>

      {/* ========== Danger Zone ========== */}
      <div className="bg-card-bg border border-danger/30 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-danger flex items-center gap-2">
          <AlertTriangle size={20} /> Danger Zone
        </h2>
        <p className="text-sm text-text-secondary">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="border border-danger text-danger px-4 py-2 rounded-lg text-sm hover:bg-danger/10 transition"
        >
          Delete My Account
        </button>

        {/* Confirm Delete Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-card-bg border border-border rounded-2xl p-6 w-full max-w-sm">
              <h3 className="text-xl font-bold text-text-primary mb-2">Delete Account?</h3>
              <p className="text-text-secondary text-sm mb-4">This action cannot be undone. All your data will be permanently removed.</p>
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