import { useEffect, useState, useRef } from 'react';
import { User, Mail, Briefcase, Camera, Save, X, ShieldCheck, Zap, BarChart3, FileText, Search } from 'lucide-react';
import { api } from '../api';
import toast from 'react-hot-toast';

// Use the same base URL as api.js (avoid hardcoded localhost)
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', freelanceNiche: '' });
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api('/auth/me');
        setProfile(data);
        setForm({ name: data.name, freelanceNiche: data.freelanceNiche || '' });
        if (data.avatar) {
          // Build full URL from backend
          setPreviewUrl(`${API_BASE}${data.avatar}`);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Save profile changes (name, niche, avatar)
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('freelanceNiche', form.freelanceNiche);
      if (selectedFile) formData.append('avatar', selectedFile);

      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/auth/profile`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData, // No Content-Type for FormData
      });

      if (!res.ok) throw new Error('Update failed');

      const updatedUser = await res.json();
      setProfile(updatedUser);
      setEditing(false);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="text-center py-20 text-text-secondary">Loading profile...</div>;
  if (error) return <div className="text-center py-20 text-danger">{error}</div>;

  // Plan details
  const plan = profile?.plan || 'free';
  const isPro = plan === 'pro' || plan === 'elite';
  const usageStats = [
    { label: 'Job Scans', value: profile?.totalJobScans || 0, icon: FileText },
    { label: 'Message Scans', value: profile?.totalMessageScans || 0, icon: FileText },
    { label: 'Contract Scans', value: profile?.totalContractScans || 0, icon: FileText },
    { label: 'Client Checks', value: profile?.totalClientChecks || 0, icon: Search },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-heading font-bold text-text-primary">Profile</h1>

      {/* ========== Personal Info + Avatar ========== */}
      <div className="bg-card-bg border border-border rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden cursor-pointer border-2 border-primary/20 hover:border-primary transition"
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={40} />
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-primary text-black p-1.5 rounded-full shadow-lg hover:bg-primary-dark transition"
            >
              <Camera size={16} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Name & Email */}
          <div className="flex-1 space-y-2">
            {editing ? (
              <input
                className="text-2xl font-heading font-bold bg-transparent border-b border-border focus:outline-none text-text-primary w-full sm:w-auto"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            ) : (
              <h2 className="text-2xl font-heading font-bold text-text-primary">{profile.name}</h2>
            )}
            <div className="flex items-center gap-2 text-text-secondary">
              <Mail size={18} />
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <Briefcase size={18} className="text-primary" />
              {editing ? (
                <input
                  className="bg-transparent border-b border-border focus:outline-none text-text-primary flex-1"
                  value={form.freelanceNiche}
                  onChange={(e) => setForm({ ...form, freelanceNiche: e.target.value })}
                  placeholder="e.g. Web Developer"
                />
              ) : (
                <span>{profile.freelanceNiche || 'Not set'}</span>
              )}
            </div>
            {editing ? (
              <div className="flex gap-2 mt-2">
                <button onClick={handleSave} className="bg-primary text-black px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
                  <Save size={16} /> Save Changes
                </button>
                <button onClick={() => setEditing(false)} className="border border-border text-text-primary px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
                  <X size={16} /> Cancel
                </button>
              </div>
            ) : (
              <button onClick={() => setEditing(true)} className="bg-primary text-black px-4 py-2 rounded-lg text-sm mt-2">
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========== Current Plan ========== */}
      <div className="bg-card-bg border border-border rounded-2xl p-6">
        <h2 className="font-heading font-semibold text-lg text-text-primary mb-4 flex items-center gap-2">
          <ShieldCheck className="text-primary" size={20} /> Your Plan
        </h2>
        {isPro ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-primary font-bold text-xl capitalize">{plan} Shield</p>
              {profile.subscriptionExpiry && (
                <p className="text-text-secondary text-sm mt-1">
                  Expires {new Date(profile.subscriptionExpiry).toLocaleDateString()}
                </p>
              )}
            </div>
            <span className="bg-success/10 text-success px-3 py-1 rounded-full text-sm font-medium">Active</span>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-primary font-bold text-xl">Free Shield</p>
              <p className="text-text-secondary text-sm mt-1">Upgrade to unlock all features</p>
            </div>
            <button
              onClick={() => navigate('/payment')} // optional: navigate to payment
              className="bg-primary text-black px-4 py-2 rounded-lg text-sm font-semibold"
            >
              Upgrade
            </button>
          </div>
        )}
      </div>

      {/* ========== Usage Stats ========== */}
      <div className="bg-card-bg border border-border rounded-2xl p-6">
        <h2 className="font-heading font-semibold text-lg text-text-primary mb-4 flex items-center gap-2">
          <BarChart3 className="text-primary" size={20} /> Usage Stats
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {usageStats.map((stat) => (
            <div key={stat.label} className="bg-bg-secondary rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-text-secondary text-xs">{stat.label}</p>
                <p className="text-text-primary font-bold text-lg">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}