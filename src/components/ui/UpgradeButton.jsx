import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';
import toast from 'react-hot-toast';

export default function UpgradeButton() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState('none');

  useEffect(() => {
    if (!user) return;
    api('/subscription/my-status')
      .then(data => setStatus(data.status || 'none'))
      .catch(() => {});
  }, [user]);

  const handleUpgrade = () => {
    if (!user) {
      navigate('/?login=true');
      return;
    }
    // Logged in: go to fake payment page
    navigate('/payment');
  };

  if (user && user.plan === 'pro') {
    return (
      <span className="inline-block w-full py-4 text-center text-green-400 font-bold text-lg">
        Pro User ✓
      </span>
    );
  }

  // The "pending" status is for the old manual request flow – you can keep it or remove it.
  // Since we now have a direct payment page, we can simplify: always show the upgrade button.
  return (
    <button
      onClick={handleUpgrade}
      className="w-full py-4 rounded-full bg-primary text-black font-bold text-lg hover:-translate-y-1 transition-transform"
    >
      Upgrade to Pro
    </button>
  );
}