import { useEffect, useState } from 'react';
import {
  CheckCircle, XCircle, Trash2, Flag, Search, Eye, Clock, ExternalLink
} from 'lucide-react';
import { adminApi } from '../../adminApi';
import StatCard from '../../components/ui/StatCard';

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewReport, setViewReport] = useState(null);

  useEffect(() => {
  const stored = JSON.parse(localStorage.getItem('adminReports') || '[]');
  setReports(stored);
}, []);
  const updateStatus = async (id, status) => {
    try {
      const endpoint = status === 'approved' ? `/reports/${id}/approve` : `/reports/${id}/reject`;
      const updated = await adminApi(endpoint, { method: 'PATCH' });
      setReports(prev => prev.map(r => r._id === id ? updated : r));
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteReport = async (id) => {
    if (!confirm('Delete this report?')) return;
    try {
      await adminApi(`/reports/${id}`, { method: 'DELETE' });
      setReports(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = reports.filter(r => {
    const searchText = (r.company || '') + (r.platform || '') + (r.reason || '');
    const matchSearch = searchText.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    pending: reports.filter(r => r.status === 'pending').length,
    approved: reports.filter(r => r.status === 'approved').length,
    rejected: reports.filter(r => r.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-text-primary">Community Reports</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Clock} value={stats.pending} label="Pending" color="warning" />
        <StatCard icon={CheckCircle} value={stats.approved} label="Approved" color="success" />
        <StatCard icon={XCircle} value={stats.rejected} label="Rejected" color="danger" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-text-secondary" size={18} />
          <input
            placeholder="Search company or platform..."
            className="pl-10 pr-4 py-2.5 rounded-xl bg-card-bg border border-border text-text-primary w-full focus:outline-none focus:border-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2.5 rounded-xl bg-card-bg border border-border text-text-primary"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((report) => (
          <div key={report._id} className="bg-card-bg border border-border rounded-xl p-5 space-y-3 hover:border-primary/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg text-text-primary">{report.company || 'Unknown Company'}</h3>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{report.platform}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                report.status === 'pending' ? 'bg-warning/10 text-warning' :
                report.status === 'approved' ? 'bg-success/10 text-success' :
                'bg-danger/10 text-danger'
              }`}>{report.status}</span>
            </div>
            <p className="text-sm text-text-secondary">{report.reason}</p>
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span>{report.userId?.name || 'Anonymous'}</span>
              <span className="flex items-center gap-1"><Flag size={14} /> {report.upvotes}</span>
            </div>
            {report.jobLink && (
              <a href={report.jobLink} target="_blank" className="text-xs text-primary flex items-center gap-1 truncate">
                <ExternalLink size={12} /> {report.jobLink}
              </a>
            )}
            <div className="flex gap-2 pt-2 border-t border-border">
              {report.status !== 'approved' && (
                <button onClick={() => updateStatus(report._id, 'approved')} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-sm bg-success/10 text-success hover:bg-success/20 transition">
                  <CheckCircle size={14} /> Approve
                </button>
              )}
              {report.status !== 'rejected' && (
                <button onClick={() => updateStatus(report._id, 'rejected')} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-sm bg-danger/10 text-danger hover:bg-danger/20 transition">
                  <XCircle size={14} /> Reject
                </button>
              )}
              <button onClick={() => setViewReport(report)} className="py-1.5 px-3 rounded-lg text-sm bg-bg-secondary text-text-secondary hover:text-text-primary transition">
                <Eye size={14} />
              </button>
              <button onClick={() => deleteReport(report._id)} className="py-1.5 px-3 rounded-lg text-sm bg-bg-secondary text-text-secondary hover:text-danger transition">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {viewReport && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-card-bg border border-border rounded-2xl p-6 w-full max-w-md relative">
            <button onClick={() => setViewReport(null)} className="absolute top-4 right-4 text-text-secondary hover:text-white">
              <XCircle size={20} />
            </button>
            <h2 className="text-xl font-heading font-bold text-text-primary mb-4">Report Details</h2>
            <div className="space-y-3 text-sm">
              <p><span className="text-text-secondary">Company:</span> <span className="text-text-primary font-medium">{viewReport.company || 'N/A'}</span></p>
              <p><span className="text-text-secondary">Platform:</span> <span className="text-text-primary">{viewReport.platform}</span></p>
              <p><span className="text-text-secondary">Reason:</span> <span className="text-text-primary">{viewReport.reason}</span></p>
              {viewReport.jobLink && (
                <p><span className="text-text-secondary">Job Link:</span> <a href={viewReport.jobLink} target="_blank" className="text-primary break-all">{viewReport.jobLink}</a></p>
              )}
              <p><span className="text-text-secondary">Reported by:</span> <span className="text-text-primary">{viewReport.userId?.name || 'Anonymous'}</span></p>
              <p><span className="text-text-secondary">Upvotes:</span> <span className="text-text-primary">{viewReport.upvotes}</span></p>
              <p><span className="text-text-secondary">Status:</span> <span className={`font-medium ${
                viewReport.status === 'pending' ? 'text-warning' :
                viewReport.status === 'approved' ? 'text-success' : 'text-danger'
              }`}>{viewReport.status}</span></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}