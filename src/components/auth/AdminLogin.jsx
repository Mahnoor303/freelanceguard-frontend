import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('https://freelanceguard.alwaysdata.net/api/admin/public-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      // Store the data directly in localStorage
      localStorage.setItem('adminReports', JSON.stringify(data.reports));
      localStorage.setItem('adminScamReports', JSON.stringify(data.scamReports));
      localStorage.setItem('adminLoggedIn', 'true');

      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999,
    }}>
      <div style={{
        background: '#0a0a0a', border: '1px solid #333', borderRadius: '16px',
        padding: '30px', width: '100%', maxWidth: '400px', position: 'relative',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Shield size={40} style={{ color: '#61FF8B' }} />
          <h1 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', marginTop: '10px' }}>Admin Login</h1>
        </div>
        {error && <p style={{ color: '#FF4D4D', fontSize: '14px', marginBottom: '12px' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="email" placeholder="Email" required value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '12px', background: '#000', border: '1px solid #444', borderRadius: '12px', color: 'white', outline: 'none' }}
          />
          <input
            type="password" placeholder="Password" required value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '12px', background: '#000', border: '1px solid #444', borderRadius: '12px', color: 'white', outline: 'none' }}
          />
          <button type="submit" disabled={loading}
            style={{ padding: '14px', background: '#61FF8B', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}