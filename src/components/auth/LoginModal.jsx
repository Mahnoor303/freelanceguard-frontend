import { X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';   // ✅ added useEffect

export default function LoginModal({ onClose, switchToRegister }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Add modal-open class to body when modal opens
  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, []);

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
        backgroundColor: 'rgba(0,0,0,0.9)',   // solid dark overlay, no transparency
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        border: 'none',            // ✅ NO border
        outline: 'none',           // ✅ NO outline
        boxShadow: 'none',         // ✅ NO shadow
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#0a0a0a',
          border: '1px solid #333',    // neutral gray border, not green
          borderRadius: '16px',
          padding: '30px',
          width: '100%',
          maxWidth: '400px',
          position: 'relative',
          outline: 'none',
          boxShadow: 'none',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'none',
            border: 'none',
            color: '#aaa',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
          Login
        </h2>
        {error && <p style={{ color: '#FF4D4D', fontSize: '14px', marginBottom: '12px' }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: '12px',
              background: '#000',
              border: '1px solid #444',
              borderRadius: '12px',
              color: 'white',
              outline: 'none',
            }}
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: '12px',
              background: '#000',
              border: '1px solid #444',
              borderRadius: '12px',
              color: 'white',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '14px',
              background: '#1DB954',      // dark green (your new primary)
              color: '#000',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#aaa' }}>
          Don't have an account?{' '}
          <button
            onClick={switchToRegister}
            style={{ color: '#1DB954', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}