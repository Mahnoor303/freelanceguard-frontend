import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';
import { Clock, Zap, BarChart3, FileText, Search, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Subscription() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (user) {
      api('/subscription/details')
        .then(setDetails)
        .catch(console.error);
    }
  }, [user]);

  if (!details) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  const startDate = details.subscriptionStartDate ? new Date(details.subscriptionStartDate) : null;
  const endDate = details.subscriptionEndDate ? new Date(details.subscriptionEndDate) : null;
  const now = new Date();
  const remainingMs = endDate ? endDate.getTime() - now.getTime() : 0;
  const remainingDays = Math.floor(remainingMs / (1000 * 60 * 60 * 24));

  const handleCancel = async () => {
    if (!confirm('Cancel your subscription? You will be downgraded to Free.')) return;
    try {
      await api('/subscription/cancel', { method: 'POST' });
      toast.success('Subscription cancelled. You are now on Free plan.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      <h1 className="text-3xl font-bold text-white">My Subscription</h1>

      {/* Current Plan Card */}
      <div className="bg-[#0b0b0b] border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary">
            {details.plan === 'pro' ? 'Pro Shield' : details.plan === 'elite' ? 'Elite Shield' : 'Free Plan'}
          </h2>
          <ShieldCheck className="text-primary" size={32} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400 text-sm">Activated On</p>
            <p className="text-white">{startDate ? startDate.toLocaleDateString() : 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Expiry Date</p>
            <p className="text-white">{endDate ? endDate.toLocaleDateString() : 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Days Remaining</p>
            <p className="text-yellow-400 font-bold">
              {remainingDays > 0 ? `${remainingDays} Days Left` : 'Expired'}
            </p>
          </div>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="bg-[#0b0b0b] border border-gray-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Usage Stats</h2>
        <div className="space-y-4">
          {[
            { label: 'Job Scans', value: details.totalJobScans || 0, icon: FileText },
            { label: 'Message Scans', value: details.totalMessageScans || 0, icon: FileText },
            { label: 'Contract Scans', value: details.totalContractScans || 0, icon: FileText },
            { label: 'Client Checks', value: details.totalClientChecks || 0, icon: Search },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">{item.label}</span>
                <span className="text-white">{item.value}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${Math.min(100, (item.value / 100) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate('/payment?plan=pro')}
          className="bg-primary text-black px-6 py-3 rounded-full font-bold"
        >
          Renew Plan
        </button>
        <button
          onClick={() => navigate('/payment?plan=elite')}
          className="border border-primary text-primary px-6 py-3 rounded-full font-bold"
        >
          Upgrade to Elite
        </button>
        <button
          onClick={handleCancel}
          className="border border-red-500 text-red-400 px-6 py-3 rounded-full font-bold"
        >
          Cancel Plan
        </button>
      </div>
    </div>
  );
}