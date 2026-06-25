import { useEffect, useState } from 'react';
import { Eye, Download, Trash2, X } from 'lucide-react';
import { adminApi } from '../../adminApi';
import ScanPDF from '../../components/ScanPDF';

export default function AdminScans() {
  const [scans, setScans] = useState([]);
  const [filter, setFilter] = useState('All');
  const [viewScan, setViewScan] = useState(null);   // for detail modal

  useEffect(() => {
    adminApi('/scans')
      .then(setScans)
      .catch(console.error);
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this scan?')) return;
    try {
      await adminApi(`/scans/${id}`, { method: 'DELETE' });
      setScans(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const types = ['All', 'jobPost', 'message', 'contract', 'client'];
  const filtered = filter === 'All' ? scans : scans.filter(s => s.scanType === filter);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-text-primary">Scan Management</h1>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${filter === t
                ? 'bg-primary/20 text-primary border border-primary'
                : 'bg-bg-secondary text-text-secondary border border-border hover:bg-primary/10'
              }`}
          >
            {t === 'All' ? 'All' : t.replace('Post', ' Post')}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card-bg border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-bg-secondary text-text-secondary">
            <tr>
              <th className="p-3 text-left">User</th>
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
                <td className="p-3 text-text-primary">{scan.userId?.name || 'N/A'}</td>
                <td className="p-3 text-text-primary capitalize">{scan.scanType}</td>
                <td className="p-3 text-text-primary">{scan.riskScore}%</td>
                <td className="p-3 text-text-secondary">{new Date(scan.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${scan.riskLevel === 'danger'
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

                  {/* Download – as PDF */}
                  <ScanPDF scan={scan}>
                    <Download size={18} className="text-primary hover:text-primary/80 transition" />
                  </ScanPDF>

                  {/* Delete */}
                  <button onClick={() => handleDelete(scan._id)} title="Delete">
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
                <span className="text-text-secondary">User:</span>
                <span className="text-text-primary font-medium">{viewScan.userId?.name || 'N/A'}</span>
              </div>
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
                <span className={`font-medium ${viewScan.riskLevel === 'danger' ? 'text-danger' :
                    viewScan.riskLevel === 'caution' ? 'text-warning' : 'text-success'
                  }`}>{viewScan.riskLevel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Date:</span>
                <span className="text-text-primary">{new Date(viewScan.createdAt).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-text-secondary">Red Flags:</span>
                <ul className="list-disc list-inside text-danger text-xs mt-1">
                  {viewScan.redFlags?.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
              <div>
                <span className="text-text-secondary">Safe Signs:</span>
                <ul className="list-disc list-inside text-success text-xs mt-1">
                  {viewScan.safeSigns?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div>
                <span className="text-text-secondary">AI Summary:</span>
                <p className="text-text-primary text-xs mt-1">{viewScan.aiSummary}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <ScanPDF scan={viewScan} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}