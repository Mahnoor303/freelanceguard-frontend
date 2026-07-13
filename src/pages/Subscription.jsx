import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';
import { Clock, Zap, BarChart3, FileText, Search, ShieldCheck, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

// Plan limits (yeh backend se bhi aa sakte hain, lekin hardcode bhi chalega)
const PLAN_LIMITS = {
  free: { jobScans: 5, messageScans: 5, contractScans: 2, clientChecks: 2 },
  pro: { jobScans: 100, messageScans: 100, contractScans: 50, clientChecks: 50 },
  elite: { jobScans: Infinity, messageScans: Infinity, contractScans: Infinity, clientChecks: Infinity },
};

export default function Subscription() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [usage, setUsage] = useState(null);
  const [loadingUsage, setLoadingUsage] = useState(false);

  const fetchDetails = useCallback(async () => {
    try {
      const data = await api('/subscription/details');
      setDetails(data);
    } catch (err) {
      console.error('Failed to fetch subscription details:', err);
    }
  }, []);

  const fetchUsage = useCallback(async () => {
    setLoadingUsage(true);
    try {
      // Maan lo aapne backend mein /subscription/usage route banaya hai
      const data = await api('/subscription/usage');
      setUsage(data);
    } catch (err) {
      toast.error('Failed to fetch usage stats');
    } finally {
      setLoadingUsage(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchDetails();
      fetchUsage();
    }
  }, [user, fetchDetails, fetchUsage]);

  // Refresh button handler
  const handleRefreshUsage = () => {
    fetchUsage();
  };

  if (!details) return <div className="text-center py-20 text-gray-400">Loading subscription...</div>;

  const startDate = details.subscriptionStartDate ? new Date(details.subscriptionStartDate) : null;
  const endDate = details.subscriptionEndDate ? new Date(details.subscriptionEndDate) : null;
  const now = new Date();
  const remainingMs = endDate ? endDate.getTime() - now.getTime() : 0;
  const remainingDays = Math.floor(remainingMs / (1000 * 60 * 60 * 24));

  const plan = details.plan || 'free';
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

  // usage object se current counts lo, nahi to 0
  const usageStats = usage || {
    jobScans: 0,
    messageScans: 0,
    contractScans: 0,
    clientChecks: 0,
  };

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
            {plan === 'pro' ? 'Pro Shield' : plan === 'elite' ? 'Elite Shield' : 'Free Plan'}
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

      {/* Usage Stats (Real-time) */}
      <div className="bg-[#0b0b0b] border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Usage Stats</h2>
          <button
            onClick={handleRefreshUsage}
            disabled={loadingUsage}
            className="text-gray-400 hover:text-white transition disabled:opacity-50"
            title="Refresh stats"
          >
            <RefreshCw size={18} className={loadingUsage ? 'animate-spin' : ''} />
          </button>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Job Scans', key: 'jobScans', icon: FileText },
            { label: 'Message Scans', key: 'messageScans', icon: FileText },
            { label: 'Contract Scans', key: 'contractScans', icon: FileText },
            { label: 'Client Checks', key: 'clientChecks', icon: Search },
          ].map(({ label, key, icon: Icon }) => {
            const used = usageStats[key] || 0;
            const limit = limits[key];
            const isUnlimited = limit === Infinity;
            const percent = isUnlimited ? 100 : Math.min(100, (used / limit) * 100);
            return (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Icon size={14} /> {label}
                  </span>
                  <span className="text-white">
                    {used}{' '}
                    {isUnlimited ? '' : `/ ${limit}`}
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isUnlimited ? 'bg-green-400' : used >= limit ? 'bg-red-500' : 'bg-primary'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-4">
          * Free plan limits reset monthly. Pro & Elite limits reset with subscription.
        </p>
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