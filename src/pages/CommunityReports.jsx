import { useEffect, useState } from 'react';
import { api } from '../api';
import { Search, ThumbsUp, Plus, X, Trash2, Shield, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function CommunityReports() {
  const auth = useAuth();
  const user = auth?.user;

  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ scammerName: '', platform: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    try {
      const data = await api('/community');
      setReports(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUpvote = async (id) => {
    if (!user) {
      toast.error('Please login to upvote');
      return;
    }
    try {
      const updated = await api(`/community/upvote/${id}`, { method: 'PATCH' });
      setReports(prev => prev.map(r => (r._id === id ? updated : r)));
      toast.success('Upvoted!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this report?')) return;
    try {
      await api(`/admin/reports/${id}`, { method: 'DELETE' });
      setReports(prev => prev.filter(r => r._id !== id));
      toast.success('Report deleted');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a report');
      return;
    }
    try {
      await api('/community', { method: 'POST', body: JSON.stringify(form) });
      toast.success('Report submitted!');
      setShowForm(false);
      setForm({ scammerName: '', platform: '', description: '' });
      fetchReports();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filtered = reports.filter(
    r =>
      r.scammerName.toLowerCase().includes(search.toLowerCase()) ||
      r.platform.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="text-center py-20 text-text-secondary">Loading community reports...</div>;
  if (error) return <div className="text-center py-20 text-danger">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-text-primary">Community Reports</h1>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 text-text-secondary" size={18} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search scammer..."
          className="pl-10 pr-4 py-2.5 rounded-xl bg-card-bg border border-border text-text-primary w-full placeholder:text-text-secondary focus:outline-none focus:border-primary"
        />
      </div>

      {/* Reports Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-card-bg border border-border rounded-xl">
          <p className="text-text-secondary text-lg">No scam reports found.</p>
          {user ? (
            <p className="text-sm text-text-secondary mt-2">Be the first to report a scam!</p>
          ) : (
            <p className="text-sm text-text-secondary mt-2">Please login to submit a report.</p>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map(report => (
            <div
              key={report._id}
              className="group relative bg-card-bg/80 backdrop-blur-sm border border-border rounded-2xl p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_25px_rgba(97,255,139,0.1)] hover:-translate-y-1"
            >
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="relative z-10 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="text-primary" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary">{report.scammerName}</h3>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {report.platform}
                      </span>
                    </div>
                  </div>
                  {user && (user._id === report.userId?._id || user.role === 'admin') && (
                    <button
                      onClick={() => handleDelete(report._id)}
                      className="text-text-secondary hover:text-danger transition p-1 rounded-lg hover:bg-bg-secondary"
                      title="Delete report"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-text-secondary leading-relaxed">
                  {report.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <User size={14} />
                    <span>{report.userId?.name || 'Anonymous'}</span>
                  </div>
                  <button
                    onClick={() => handleUpvote(report._id)}
                    className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full transition-all ${
                      report.upvotedBy?.includes(user?._id)
                        ? 'bg-primary/20 text-primary shadow-sm'
                        : 'text-text-secondary hover:text-primary hover:bg-primary/10'
                    }`}
                    title="Upvote"
                  >
                    <ThumbsUp size={16} />
                    <span>{report.upvotes || 0}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Add Button */}
      {user && (
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-8 right-8 bg-primary text-black w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition z-40 animate-bounce-slow"
        >
          <Plus size={28} />
        </button>
      )}

      {/* Submit Modal (unchanged) */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-card-bg border border-border rounded-2xl p-6 w-full max-w-md relative">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-text-secondary hover:text-white transition">
              <X size={20} />
            </button>
            <h2 className="text-xl font-heading font-bold text-text-primary mb-4">Report Scam</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required placeholder="Scammer Name" className="w-full p-3 rounded-xl bg-bg-secondary border border-border text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary" value={form.scammerName} onChange={e => setForm({ ...form, scammerName: e.target.value })} />
              <select required className="w-full p-3 rounded-xl bg-bg-secondary border border-border text-text-primary focus:outline-none focus:border-primary" value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}>
                <option value="">Platform</option>
                <option>Upwork</option>
                <option>Fiverr</option>
                <option>Freelancer</option>
              </select>
              <textarea required placeholder="Description" className="w-full p-3 rounded-xl bg-bg-secondary border border-border text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary h-24 resize-none" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <button type="submit" className="w-full bg-primary text-black py-3 rounded-xl font-semibold hover:bg-primary-dark transition">Submit Report</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}