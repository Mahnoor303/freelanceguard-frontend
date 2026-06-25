import { useEffect, useState } from 'react';
import { adminApi } from '../../adminApi';
import { Search, Trash2, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminScamDatabase() {
  const [scammers, setScammers] = useState([]);
  const [search, setSearch] = useState('');

  const fetchScammers = async () => {
    try {
      const data = await adminApi('/reports/scammers');
      setScammers(data);
    } catch (err) {
      toast.error('Failed to load scammer database');
    }
  };

  useEffect(() => { fetchScammers(); }, []);

  const deleteScammer = async (id) => {
    if (!confirm('Delete this scammer record?')) return;
    try {
      await adminApi(`/reports/${id}`, { method: 'DELETE' });
      setScammers(prev => prev.filter(s => s._id !== id));
      toast.success('Deleted');
    } catch (err) { toast.error(err.message); }
  };

  const toggleVerify = async (id, currentStatus) => {
    const endpoint = currentStatus ? '/reports/scammers/unverify' : '/reports/scammers/verify';
    try {
      await adminApi(`${endpoint}/${id}`, { method: 'PATCH' });
      fetchScammers();
      toast.success(currentStatus ? 'Unverified' : 'Verified');
    } catch (err) { toast.error(err.message); }
  };

  const filtered = scammers.filter(s =>
    s.scammerName.toLowerCase().includes(search.toLowerCase()) ||
    s.platform.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-text-primary">Scam Database (Verified)</h1>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 text-text-secondary" size={18} />
        <input
          placeholder="Search scammer..."
          className="pl-10 pr-4 py-2.5 rounded-xl bg-card-bg border border-border text-text-primary w-full focus:outline-none focus:border-primary"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-card-bg border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-bg-secondary text-text-secondary">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Platform</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s._id} className="border-t border-border hover:bg-bg-secondary/50 transition-colors">
                <td className="p-3 font-medium text-text-primary">{s.scammerName}</td>
                <td className="p-3 text-text-primary">{s.platform}</td>
                <td className="p-3 text-text-secondary truncate max-w-[200px]">{s.description}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${s.verified ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                    {s.verified ? 'Verified' : 'Pending'}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => toggleVerify(s._id, s.verified)} title={s.verified ? 'Unverify' : 'Verify'}>
                    {s.verified ? <XCircle size={18} className="text-warning" /> : <CheckCircle size={18} className="text-success" />}
                  </button>
                  <button onClick={() => deleteScammer(s._id)}><Trash2 size={18} className="text-danger" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}