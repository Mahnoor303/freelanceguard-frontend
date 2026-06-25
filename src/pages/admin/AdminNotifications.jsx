import { useEffect, useState } from 'react';
import { Send, Trash2 } from 'lucide-react';
import { adminApi } from '../../adminApi';
import toast from 'react-hot-toast';

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');
  const [targetUserId, setTargetUserId] = useState('');
  const [users, setUsers] = useState([]);

  const fetchNotifications = async () => {
    try {
      const data = await adminApi('/notifications');
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await adminApi('/users');
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUsers();
  }, []);

  const send = async () => {
    if (!title || !message) return;
    try {
      await adminApi('/notifications', {
        method: 'POST',
        body: JSON.stringify({
          title,
          message,
          type,
          targetUserId: targetUserId || null,
        }),
      });
      toast.success(targetUserId ? 'Notification sent to selected user' : 'Notification sent to all users');
      setTitle('');
      setMessage('');
      setTargetUserId('');
      fetchNotifications();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteNotif = async (id) => {
    if (!confirm('Delete this notification?')) return;
    try {
      await adminApi(`/notifications/${id}`, { method: 'DELETE' });
      setNotifications(prev => prev.filter(n => n._id !== id));
      toast.success('Deleted');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-text-primary">Notifications</h1>

      {/* Create */}
      <div className="bg-card-bg border border-border rounded-xl p-6">
        <h2 className="font-semibold mb-4 text-text-primary">Create Notification</h2>
        <div className="space-y-3">
          <input
            placeholder="Title"
            className="w-full p-3 bg-bg-secondary border border-border rounded-xl text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Message"
            rows={3}
            className="w-full p-3 bg-bg-secondary border border-border rounded-xl text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary resize-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              className="w-full p-3 bg-bg-secondary border border-border rounded-xl text-text-primary focus:outline-none focus:border-primary"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="alert">Alert</option>
            </select>
            <select
              className="w-full p-3 bg-bg-secondary border border-border rounded-xl text-text-primary focus:outline-none focus:border-primary"
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
            >
              <option value="">All Users (Broadcast)</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={send}
            className="bg-primary text-black px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary-dark transition"
          >
            <Send size={16} /> {targetUserId ? 'Send to User' : 'Send to All'}
          </button>
        </div>
      </div>

      {/* History */}
      <div className="bg-card-bg border border-border rounded-xl overflow-x-auto">
        <div className="p-5 border-b border-border">
          <h2 className="font-semibold text-text-primary">Notification History</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-bg-secondary text-text-secondary">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Message</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Target</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((n) => (
              <tr key={n._id} className="border-t border-border hover:bg-bg-secondary/50 transition-colors">
                <td className="p-3 text-text-primary">{n.title}</td>
                <td className="p-3 text-text-secondary">{n.message}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    n.type === 'alert' ? 'bg-danger/10 text-danger' :
                    n.type === 'warning' ? 'bg-warning/10 text-warning' :
                    'bg-primary/10 text-primary'
                  }`}>{n.type}</span>
                </td>
                <td className="p-3 text-text-secondary text-xs">
                  {n.targetUserId ? 'Specific user' : 'All users'}
                </td>
                <td className="p-3 text-text-secondary">
                  {new Date(n.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <button onClick={() => deleteNotif(n._id)} className="text-text-secondary hover:text-danger transition">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}