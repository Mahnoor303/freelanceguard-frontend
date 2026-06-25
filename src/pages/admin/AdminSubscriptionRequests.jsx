import { useEffect, useState } from 'react';
import { adminApi } from '../../adminApi';
import { Search } from 'lucide-react';

export default function AdminSubscriptionRequests() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      // Fetch all users (you can later add a filter for paid users only)
      const data = await adminApi('/users');
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">User Subscriptions</h1>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          placeholder="Search user..."
          className="pl-10 pr-4 py-2.5 rounded-xl bg-[#050914] border border-gray-700 text-white w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-[#050914] border border-gray-800 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-900">
            <tr>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Plan</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Start Date</th>
              <th className="p-3 text-left">End Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u._id} className="border-t border-gray-800">
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3 text-gray-400">{u.email}</td>
                <td className="p-3 uppercase">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      u.plan === 'pro' || u.plan === 'elite'
                        ? 'bg-green-900/30 text-green-400'
                        : 'bg-gray-900/30 text-gray-400'
                    }`}
                  >
                    {u.plan}
                  </span>
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      u.subscriptionStatus === 'active'
                        ? 'bg-green-900/30 text-green-400'
                        : 'bg-red-900/30 text-red-400'
                    }`}
                  >
                    {u.subscriptionStatus || 'inactive'}
                  </span>
                </td>
                <td className="p-3 text-gray-400">
                  {u.subscriptionStartDate
                    ? new Date(u.subscriptionStartDate).toLocaleDateString()
                    : '–'}
                </td>
                <td className="p-3 text-gray-400">
                  {u.subscriptionEndDate
                    ? new Date(u.subscriptionEndDate).toLocaleDateString()
                    : '–'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}