import { useEffect, useState } from 'react';
import { adminApi } from '../../adminApi';
import { CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);

  const fetchData = async () => {
    try {
      const data = await adminApi('/testimonials');
      setTestimonials(data);
    } catch (err) {
      toast.error('Failed to load testimonials');
    }
  };

  useEffect(() => { fetchData(); }, []);

  const approve = async (id) => {
    try {
      await adminApi(`/testimonials/approve/${id}`, { method: 'PATCH' });
      toast.success('Approved');
      fetchData();
    } catch (err) { toast.error(err.message); }
  };

  const reject = async (id) => {
    try {
      await adminApi(`/testimonials/reject/${id}`, { method: 'PATCH' });
      toast.success('Rejected');
      fetchData();
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-text-primary">Testimonials Management</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {testimonials.map((t) => (
          <div key={t._id} className="bg-card-bg border border-border rounded-xl p-5 space-y-3 hover:border-primary/30 transition-all">
            <div className="flex justify-between">
              <h3 className="font-semibold text-text-primary">{t.name}</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                t.status === 'approved' ? 'bg-success/10 text-success' :
                t.status === 'rejected' ? 'bg-danger/10 text-danger' :
                'bg-warning/10 text-warning'
              }`}>{t.status}</span>
            </div>
            <p className="text-sm text-text-secondary">{t.role}</p>
            <p className="text-sm text-text-primary">{t.quote}</p>
            {t.status === 'pending' && (
              <div className="flex gap-2 pt-2 border-t border-border">
                <button onClick={() => approve(t._id)} className="flex-1 bg-success/10 text-success py-1.5 rounded-lg flex items-center justify-center gap-1 hover:bg-success/20 transition">
                  <CheckCircle size={16} /> Approve
                </button>
                <button onClick={() => reject(t._id)} className="flex-1 bg-danger/10 text-danger py-1.5 rounded-lg flex items-center justify-center gap-1 hover:bg-danger/20 transition">
                  <XCircle size={16} /> Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}