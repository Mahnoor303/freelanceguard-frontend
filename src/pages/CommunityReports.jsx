import { useEffect, useState, useCallback } from 'react';
import { api } from '../api';
import {
  Search, ThumbsUp, Plus, X, Trash2, Shield, User, ExternalLink, Calendar, Flag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function CommunityReports() {
  const auth = useAuth();
  const user = auth?.user;

  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [form, setForm] = useState({
    type: 'scam',
    platform: '',
    company: '',
    jobLink: '',
    reason: '',
    evidence: '',
  });
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

  const handleUpvote = async (id, e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to upvote');
      return;
    }
    try {
      const updated = await api(`/community/upvote/${id}`, { method: 'PATCH' });
      setReports((prev) => prev.map((r) => (r._id === id ? updated : r)));
      toast.success('Upvoted!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Delete this report?')) return;
    try {
      await api(`/community/${id}`, { method: 'DELETE' });
      setReports((prev) => prev.filter((r) => r._id !== id));
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

    if (!form.platform.trim()) {
      toast.error('Platform is required');
      return;
    }
    if (!form.reason.trim()) {
      toast.error('Reason / Description is required');
      return;
    }

    try {
      await api('/community', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      toast.success('Report submitted!');
      setShowForm(false);
      setForm({
        type: 'scam',
        platform: '',
        company: '',
        jobLink: '',
        reason: '',
        evidence: '',
      });
      fetchReports();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filtered = reports.filter(
    (r) =>
      r.platform.toLowerCase().includes(search.toLowerCase()) ||
      r.company.toLowerCase().includes(search.toLowerCase()) ||
      r.reason.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="text-center py-20 text-text-secondary">Loading community reports...</div>;
  if (error) return <div className="text-center py-20 text-danger">Error: {error}</div>;

  return (
    <div className="space-y-6">
      {/* Header with Search + Submit Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-heading font-bold text-text-primary">Community Reports</h1>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 text-text-secondary" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-10 pr-4 py-2.5 rounded-xl bg-card-bg border border-border text-text-primary w-full placeholder:text-text-secondary focus:outline-none focus:border-primary"
            />
          </div>
          {user && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary text-black px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-primary-dark transition shrink-0"
            >
              <Plus size={18} /> Submit Report
            </button>
          )}
        </div>
      </div>

      {/* Reports Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-card-bg border border-border rounded-xl">
          <p className="text-text-secondary text-lg">No reports found.</p>
          {user ? (
            <p className="text-sm text-text-secondary mt-2">Be the first to submit a report!</p>
          ) : (
            <p className="text-sm text-text-secondary mt-2">Please login to submit a report.</p>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map((report) => (
            <div
              key={report._id}
              onClick={() => setSelectedReport(report)}
              className="group relative bg-card-bg/80 backdrop-blur-sm border border-border rounded-2xl p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_25px_rgba(97,255,139,0.1)] hover:-translate-y-1 cursor-pointer"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="relative z-10 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {report.type === 'scam' ? (
                        <Shield className="text-danger" size={20} />
                      ) : (
                        <Flag className="text-success" size={20} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary">{report.company || 'Unknown Company'}</h3>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {report.platform}
                      </span>
                    </div>
                  </div>
                  {(user?._id === report.userId?._id || user?.role === 'admin') && (
                    <button
                      onClick={(e) => handleDelete(report._id, e)}
                      className="text-text-secondary hover:text-danger transition p-1 rounded-lg hover:bg-bg-secondary"
                      title="Delete report"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                  {report.jobLink && (
                    <div className="flex items-center gap-1 text-text-secondary">
                      <ExternalLink size={14} />
                      <span className="text-primary truncate">{report.jobLink}</span>
                    </div>
                  )}
                  <p className="text-text-secondary leading-relaxed">{report.reason}</p>
                  {report.evidence && (
                    <div className="text-xs text-text-secondary">
                      <span className="font-medium">Evidence:</span>{' '}
                      <span className="text-primary">Available</span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <User size={14} />
                    <span>{report.userId?.name || 'Anonymous'}</span>
                    <span className="mx-1">•</span>
                    <Calendar size={14} />
                    <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        report.type === 'scam' ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'
                      }`}
                    >
                      {report.type === 'scam' ? 'Scam' : 'Legit'}
                    </span>
                    <button
                      onClick={(e) => handleUpvote(report._id, e)}
                      className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full transition-all ${
                        report.upvotedBy?.includes(user?._id)
                          ? 'bg-primary/20 text-primary shadow-sm'
                          : 'text-text-secondary hover:text-primary hover:bg-primary/10'
                      }`}
                    >
                      <ThumbsUp size={16} />
                      <span>{report.upvotes || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div
            className="bg-card-bg border border-border rounded-2xl p-6 w-full max-w-lg relative max-h-[90vh] hide-scrollbar"
            style={{ overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-text-secondary hover:text-white transition"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-heading font-bold text-text-primary mb-4">Submit Report</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type */}
              <div>
                <label className="text-sm text-text-secondary mb-1 block">Report Type</label>
                <select
                  className="w-full p-3 rounded-xl bg-bg-secondary border border-border text-text-primary focus:outline-none focus:border-primary"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="scam">Scam / Fraud</option>
                  <option value="legit">Legit Job / Client</option>
                </select>
              </div>

              {/* Platform (required) */}
              <div>
                <label className="text-sm text-text-secondary mb-1 block">Platform *</label>
                <select
                  required
                  className="w-full p-3 rounded-xl bg-bg-secondary border border-border text-text-primary focus:outline-none focus:border-primary"
                  value={form.platform}
                  onChange={(e) => setForm({ ...form, platform: e.target.value })}
                >
                  <option value="">Select Platform</option>
                  <option>Upwork</option>
                  <option>Fiverr</option>
                  <option>Freelancer</option>
                  <option>LinkedIn</option>
                  <option>PeoplePerHour</option>
                  <option>Guru</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Company */}
              <div>
                <label className="text-sm text-text-secondary mb-1 block">Company / Client Name</label>
                <input
                  placeholder="e.g., ABC Software House"
                  className="w-full p-3 rounded-xl bg-bg-secondary border border-border text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
              </div>

              {/* Job Link */}
              <div>
                <label className="text-sm text-text-secondary mb-1 block">Job / Profile Link</label>
                <input
                  type="url"
                  placeholder="https://..."
                  className="w-full p-3 rounded-xl bg-bg-secondary border border-border text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary"
                  value={form.jobLink}
                  onChange={(e) => setForm({ ...form, jobLink: e.target.value })}
                />
              </div>

              {/* Reason (required) */}
              <div>
                <label className="text-sm text-text-secondary mb-1 block">Reason / Description *</label>
                <textarea
                  required
                  placeholder="Describe what happened..."
                  rows={3}
                  className="w-full p-3 rounded-xl bg-bg-secondary border border-border text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary resize-none"
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                />
              </div>

              {/* Evidence URL */}
              <div>
                <label className="text-sm text-text-secondary mb-1 block">Evidence (Screenshot URL)</label>
                <input
                  type="url"
                  placeholder="https://imgur.com/..."
                  className="w-full p-3 rounded-xl bg-bg-secondary border border-border text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary"
                  value={form.evidence}
                  onChange={(e) => setForm({ ...form, evidence: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-black py-3 rounded-xl font-semibold hover:bg-primary-dark transition"
              >
                Submit Report
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div
            className="bg-card-bg border border-border rounded-2xl p-6 w-full max-w-lg relative max-h-[90vh] hide-scrollbar"
            style={{ overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 text-text-secondary hover:text-white transition"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-heading font-bold text-text-primary mb-4">Report Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Type:</span>
                <span className={`font-medium ${selectedReport.type === 'scam' ? 'text-danger' : 'text-success'}`}>
                  {selectedReport.type === 'scam' ? 'Scam' : 'Legit'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Platform:</span>
                <span className="text-text-primary">{selectedReport.platform}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Company:</span>
                <span className="text-text-primary">{selectedReport.company || 'N/A'}</span>
              </div>
              {selectedReport.jobLink && (
                <div>
                  <span className="text-text-secondary">Job Link:</span>
                  <a href={selectedReport.jobLink} target="_blank" className="text-primary block break-all hover:underline mt-1">
                    {selectedReport.jobLink}
                  </a>
                </div>
              )}
              <div>
                <span className="text-text-secondary">Reason:</span>
                <p className="text-text-primary mt-1">{selectedReport.reason}</p>
              </div>
              {selectedReport.evidence && (
                <div>
                  <span className="text-text-secondary">Evidence:</span>
                  <a href={selectedReport.evidence} target="_blank" className="text-primary block mt-1 break-all hover:underline">
                    View Screenshot
                  </a>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-text-secondary">Reported by:</span>
                <span className="text-text-primary">{selectedReport.userId?.name || 'Anonymous'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Date:</span>
                <span className="text-text-primary">{new Date(selectedReport.createdAt).toLocaleString()}</span>
              </div>
            </div>
            {selectedReport.jobLink && (
              <a
                href={selectedReport.jobLink}
                target="_blank"
                className="mt-4 inline-block bg-primary text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition"
              >
                Go to Job Post ↗
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}