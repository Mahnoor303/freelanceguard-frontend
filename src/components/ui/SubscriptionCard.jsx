import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';
import { useEffect, useState } from 'react';
import { Clock, Zap, ShieldCheck, BarChart3, FileText } from 'lucide-react';

export default function SubscriptionCard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    if (!user) return;
    // Re‑fetch latest user data to get plan and expiry
    api('/auth/me')
      .then(data => setSubscription(data))
      .catch(() => {});
  }, [user]);

  if (!user) return null;

  const isPro = user.plan === 'pro' || subscription?.plan === 'pro';
  const expiryDate = subscription?.subscriptionExpiry ? new Date(subscription.subscriptionExpiry) : null;

  // Calculate remaining time
  const now = new Date();
  const remainingMs = expiryDate ? expiryDate.getTime() - now.getTime() : 0;
  const remainingDays = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
  const remainingHours = Math.floor((remainingMs / (1000 * 60 * 60)) % 24);
  const remainingMinutes = Math.floor((remainingMs / (1000 * 60)) % 60);

  return (
    <div className={`rounded-2xl p-6 border ${
      isPro
        ? 'bg-yellow-500/10 border-yellow-500/30 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
        : 'bg-black border-gray-800'
    }`}>
      {isPro ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-yellow-400">🌟 Pro Plan Active</h3>
            <ShieldCheck className="text-yellow-400" size={28} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Zap className="text-primary" size={18} />
              <span className="text-sm text-gray-300">Unlimited Scans</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="text-primary" size={18} />
              <span className="text-sm text-gray-300">Advanced Reports</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="text-primary" size={18} />
              <span className="text-sm text-gray-300">PDF Export</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="text-primary" size={18} />
              <span className="text-sm text-gray-300">Priority AI</span>
            </div>
          </div>

          {expiryDate && remainingMs > 0 ? (
            <div className="bg-black/50 rounded-xl p-4 mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="text-yellow-400" size={20} />
                <span className="text-sm text-gray-400">Expires</span>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">
                  {expiryDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-sm text-yellow-400">
                  {remainingDays}d {remainingHours}h {remainingMinutes}m left
                </p>
              </div>
            </div>
          ) : expiryDate && remainingMs <= 0 ? (
            <p className="text-red-400 text-sm mt-2">Subscription expired. Please renew.</p>
          ) : null}
        </div>
      ) : (
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold text-white">Upgrade to Pro</h3>
          <p className="text-sm text-gray-400">
            Get unlimited scans, advanced reports, PDF export, and priority AI analysis.
          </p>
          <button
            onClick={() => navigate('/payment')}
            className="bg-primary text-black font-bold px-6 py-3 rounded-full text-lg hover:-translate-y-1 transition"
          >
            Upgrade Now – $19/month
          </button>
        </div>
      )}
    </div>
  );
}