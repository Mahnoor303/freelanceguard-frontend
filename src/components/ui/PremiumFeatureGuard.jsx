import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function PremiumFeatureGuard({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || (user.plan !== 'pro' && user.plan !== 'elite')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <span className="text-6xl mb-6">🔒</span>
        <h2 className="text-3xl font-bold text-white mb-3">Premium Feature</h2>
        <p className="text-gray-400 max-w-md mb-6">
          Upgrade to Pro Shield to unlock Contract Analysis and Client Trust Checking.
        </p>
        <button
          onClick={() => navigate('/payment?plan=pro')}
          className="bg-primary text-black px-8 py-3 rounded-full font-bold text-lg hover:-translate-y-1 transition"
        >
          Upgrade Now
        </button>
      </div>
    );
  }

  return children;
}