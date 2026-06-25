import { useEffect, useState } from 'react';
import { Search, Eye, Ban, CheckCircle, Trash2, X } from 'lucide-react';
import { adminApi } from '../../adminApi';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    adminApi('/users')
      .then(setUsers)
      .catch(console.error);
  }, []);

  const filtered = users.filter(u =>
    (filter === 'All' || u.status === filter) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) ||
     u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await adminApi(`/users/${id}`, { method: 'DELETE' });
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSuspend = async (id) => {
    try {
      const updated = await adminApi(`/users/suspend/${id}`, { method: 'PATCH' });
      setUsers(prev => prev.map(u => u._id === id ? updated : u));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleActivate = async (id) => {
    try {
      const updated = await adminApi(`/users/activate/${id}`, { method: 'PATCH' });
      setUsers(prev => prev.map(u => u._id === id ? updated : u));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-text-primary">User Management</h1>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-text-secondary" size={18} />
          <input
            type="text"
            placeholder="Search user..."
            className="pl-10 pr-4 py-2.5 rounded-xl bg-card-bg border border-border text-text-primary w-64 focus:outline-none focus:border-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['All', 'active', 'suspended'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${filter === f ? 'bg-primary/20 text-primary border border-primary' : 'bg-bg-secondary text-text-secondary'}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* User Table */}
      <div className="bg-card-bg border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-bg-secondary">
            <tr>
              <th className="p-3 text-left text-text-secondary">Name</th>
              <th className="p-3 text-left text-text-secondary">Email</th>
              <th className="p-3 text-left text-text-secondary">Scans</th>
              <th className="p-3 text-left text-text-secondary">Status</th>
              <th className="p-3 text-left text-text-secondary">Joined</th>
              <th className="p-3 text-left text-text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user._id} className="border-t border-border hover:bg-bg-secondary/50 transition-colors">
                <td className="p-3 font-medium text-text-primary">{user.name}</td>
                <td className="p-3 text-text-secondary">{user.email}</td>
                <td className="p-3 text-text-primary">{user.totalScans}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${user.status === 'active' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>{user.status}</span>
                </td>
                <td className="p-3 text-text-secondary">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => setSelectedUser(user)}><Eye size={18} className="text-primary" /></button>
                  {user.status === 'active' ? (
                    <button onClick={() => handleSuspend(user._id)}><Ban size={18} className="text-warning" /></button>
                  ) : (
                    <button onClick={() => handleActivate(user._id)}><CheckCircle size={18} className="text-success" /></button>
                  )}
                  <button onClick={() => handleDelete(user._id)}><Trash2 size={18} className="text-danger" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View User Drawer */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 flex justify-end z-50">
          <div className="w-80 bg-card-bg h-full p-6 relative border-l border-border">
            <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 text-text-secondary"><X size={20} /></button>
            <h2 className="text-xl font-heading font-bold text-text-primary mb-4">User Profile</h2>
            <div className="space-y-4">
              <p className="text-2xl font-semibold text-text-primary">{selectedUser.name}</p>
              <p className="text-text-secondary">{selectedUser.email}</p>
              <p className="text-sm text-text-primary">Status: <span className="text-primary">{selectedUser.status}</span></p>
              <p className="text-sm text-text-primary">Total Scans: {selectedUser.totalScans}</p>
              <p className="text-sm text-text-primary">Joined: {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}