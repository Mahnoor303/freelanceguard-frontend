import { useEffect, useState } from 'react';
import { adminApi } from '../../adminApi';
import { Search, Trash2, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminScamDatabase() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState('');

  const fetchReports = async () => {
    try {
      // Fetch all reports and filter only scam type, or use a new endpoint if you prefer
      const data = await adminApi('/reports');
      setReports(data.filter(r => r.type === 'scam'));
    } catch (err) {
      toast.error('Failed to load scam database');
    }
  };

  useEffect(() => { fetchReports(); }, []);

  const deleteReport = async (id) => {
    if (!confirm('Delete this record?')) return;
    try {
      await adminApi(`/reports/${id}`, { method: 'DELETE' });
      setReports(prev => prev.filter(r => r._id !== id));
      toast.success('Deleted');
    } catch (err) { toast.error(err.message); }
  };

  const toggleVerify = async (id, currentStatus) => {
    const endpoint = `/reports/${id}/verify`;
    try {
      await adminApi(endpoint, { method: 'PATCH' });
      fetchReports();
      toast.success(currentStatus ? 'Unverified' : 'Verified');
    } catch (err) { toast.error(err.message); }
  };

  const filtered = reports.filter(r =>
    (r.company || '').toLowerCase().includes(search.toLowerCase()) ||
    r.platform.toLowerCase().includes(search.toLowerCase()) ||
    (r.reason || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-text-primary">Scam Database (Verified)</h1>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 text-text-secondary" size={18} />
        <input
          placeholder="Search company or platform..."
          className="pl-10 pr-4 py-2.5 rounded-xl bg-card-bg border border-border text-text-primary w-full focus:outline-none focus:border-primary"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-card-bg border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-bg-secondary text-text-secondary">
            <tr>
              <th className="p-3 text-left">Company</th>
              <th className="p-3 text-left">Platform</th>
              <th className="p-3 text-left">Reason</th>
              <th className="p-3 text-left">Verified</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r._id} className="border-t border-border hover:bg-bg-secondary/50 transition-colors">
                <td className="p-3 font-medium text-text-primary">{r.company || 'N/A'}</td>
                <td className="p-3 text-text-primary">{r.platform}</td>
                <td className="p-3 text-text-secondary truncate max-w-[200px]">{r.reason}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${r.verified ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                    {r.verified ? 'Verified' : 'Pending'}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => toggleVerify(r._id, r.verified)} title={r.verified ? 'Unverify' : 'Verify'}>
                    {r.verified ? <XCircle size={18} className="text-warning" /> : <CheckCircle size={18} className="text-success" />}
                  </button>
                  <button onClick={() => deleteReport(r._id)}><Trash2 size={18} className="text-danger" /></button>
                  {r.jobLink && (
                    <a href={r.jobLink} target="_blank" className="text-primary"><ExternalLink size={18} /></a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}