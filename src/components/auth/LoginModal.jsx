import { X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function LoginModal({ onClose, switchToRegister }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      onClose();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6 w-full max-w-md relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={20} />
        </button>

        <h2 className="text-2xl font-heading font-bold mb-6 text-white">Login</h2>
        {error && <p className="text-red-400 mb-3 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required type="email" placeholder="Email"
            className="w-full p-3 rounded-xl bg-black border border-gray-700 text-white"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <input
            required type="password" placeholder="Password"
            className="w-full p-3 rounded-xl bg-black border border-gray-700 text-white"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          <button
            disabled={loading} type="submit"
            className="w-full bg-primary text-black font-semibold py-3 rounded-xl disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-400">
          Don't have an account?{' '}
          <button onClick={switchToRegister} className="text-primary">Register</button>
        </p>

        {/* Admin login link */}
        <div className="mt-3 text-center">
          <button
            onClick={() => {
              onClose();
              navigate('/admin/login');
            }}
            className="text-xs text-gray-500 hover:text-primary"
          >
            Login as Admin
          </button>
        </div>
      </div>
    </div>
  );
}