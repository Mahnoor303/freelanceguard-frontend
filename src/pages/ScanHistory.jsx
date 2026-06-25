import { useEffect, useState } from 'react';
import { api } from '../api';
import { Eye, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ScanHistory() {
  const [scans, setScans] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewScan, setViewScan] = useState(null);

  const fetchScans = async () => {
    try {
      const data = await api('/scan/history');
      setScans(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScans();
  }, []);

  const deleteScan = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api(`/scan/${id}`, { method: 'DELETE' });
      setScans((prev) => prev.filter((s) => s._id !== id));
      toast.success('Scan deleted');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filtered =
    filter === 'All'
      ? scans
      : scans.filter((s) => s.scanType === filter);

  if (loading) return <div className="text-center py-20 text-text-secondary">Loading scans...</div>;
  if (error) return <div className="text-center py-20 text-danger">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-text-primary">Scan History</h1>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['All', 'jobPost', 'message', 'contract', 'client'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
              filter === type
                ? 'bg-primary/20 text-primary border border-primary'
                : 'bg-bg-secondary text-text-secondary border border-border hover:bg-primary/10'
            }`}
          >
            {type === 'All' ? 'All' : type.replace('Post', ' Post')}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card-bg border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-bg-secondary text-text-secondary">
            <tr>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Risk Score</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((scan) => (
              <tr key={scan._id} className="border-t border-border hover:bg-bg-secondary/50 transition-colors">
                <td className="p-3 text-text-primary capitalize">{scan.scanType}</td>
                <td className="p-3 text-text-primary">{scan.riskScore}%</td>
                <td className="p-3 text-text-secondary">
                  {new Date(scan.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      scan.riskLevel === 'danger'
                        ? 'bg-danger/10 text-danger'
                        : scan.riskLevel === 'caution'
                        ? 'bg-warning/10 text-warning'
                        : 'bg-success/10 text-success'
                    }`}
                  >
                    {scan.riskLevel}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                  {/* View – opens detail modal */}
                  <button onClick={() => setViewScan(scan)} title="View Details">
                    <Eye size={18} className="text-primary hover:text-primary/80 transition" />
                  </button>
                  {/* Delete */}
                  <button onClick={() => deleteScan(scan._id)} title="Delete">
                    <Trash2 size={18} className="text-danger hover:text-danger/80 transition" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Scan Detail Modal */}
      {viewScan && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-card-bg border border-border rounded-2xl p-6 w-full max-w-lg relative">
            <button
              onClick={() => setViewScan(null)}
              className="absolute top-4 right-4 text-text-secondary hover:text-white transition"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-heading font-bold text-text-primary mb-4">Scan Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Type:</span>
                <span className="text-text-primary capitalize">{viewScan.scanType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Risk Score:</span>
                <span className="text-text-primary font-bold">{viewScan.riskScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Risk Level:</span>
                <span className={`font-medium ${
                  viewScan.riskLevel === 'danger' ? 'text-danger' :
                  viewScan.riskLevel === 'caution' ? 'text-warning' : 'text-success'
                }`}>{viewScan.riskLevel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Date:</span>
                <span className="text-text-primary">{new Date(viewScan.createdAt).toLocaleString()}</span>
              </div>
              {viewScan.redFlags?.length > 0 && (
                <div>
                  <span className="text-text-secondary">Red Flags:</span>
                  <ul className="list-disc list-inside text-danger text-xs mt-1">
                    {viewScan.redFlags.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                </div>
              )}
              {viewScan.safeSigns?.length > 0 && (
                <div>
                  <span className="text-text-secondary">Safe Signs:</span>
                  <ul className="list-disc list-inside text-success text-xs mt-1">
                    {viewScan.safeSigns.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
              <div>
                <span className="text-text-secondary">AI Summary:</span>
                <p className="text-text-primary text-xs mt-1">{viewScan.aiSummary}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}