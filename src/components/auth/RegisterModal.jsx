import { useState, useEffect } from 'react';   // ✅ added useEffect
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

const countries = [
  'Pakistan', 'India', 'United States', 'Italy', 'Turkey', 'Saudi Arabia', 'Russia',
  'United Kingdom', 'Germany', 'France', 'Spain', 'Brazil', 'China', 'Japan',
  'South Korea', 'Australia', 'Canada', 'Egypt', 'Nigeria', 'South Africa'
];

const countryToLang = {
  'Pakistan': 'ur', 'India': 'en', 'United States': 'en', 'Italy': 'it',
  'Turkey': 'tr', 'Saudi Arabia': 'ar', 'Russia': 'ru', 'United Kingdom': 'en',
  'Germany': 'en', 'France': 'en', 'Spain': 'en', 'Brazil': 'en', 'China': 'en',
  'Japan': 'en', 'South Korea': 'en', 'Australia': 'en', 'Canada': 'en',
  'Egypt': 'ar', 'Nigeria': 'en', 'South Africa': 'en'
};

export default function RegisterModal({ onClose, switchToLogin }) {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', password: '', freelanceNiche: '', country: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
 useEffect(() => {
    document.body.classList.add('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, []);
  const handleCountryChange = (e) => {
    const selected = e.target.value;
    setForm({ ...form, country: selected });
    const lang = countryToLang[selected];
    if (lang) {
      i18n.changeLanguage(lang);
      localStorage.setItem('language', lang);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.freelanceNiche, form.country);
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
        backgroundColor: 'rgba(0,0,0,0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#0a0a0a',
          border: '1px solid #333',
          borderRadius: '16px',
          padding: '30px',
          width: '100%',
          maxWidth: '400px',
          position: 'relative',
          outline: 'none',
          boxShadow: 'none',
        }}
      >
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
          {t('createAccount')}
        </h2>
        {error && <p style={{ color: '#FF4D4D', fontSize: '14px', marginBottom: '12px' }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input required placeholder={t('fullName')} value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
            style={{ padding: '12px', background: '#000', border: '1px solid #444', borderRadius: '12px', color: 'white', outline: 'none' }} />
          <input required type="email" placeholder={t('email')} value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
            style={{ padding: '12px', background: '#000', border: '1px solid #444', borderRadius: '12px', color: 'white', outline: 'none' }} />
          <input required type="password" placeholder={t('password')} value={form.password}
            onChange={(e) => setForm({...form, password: e.target.value})}
            style={{ padding: '12px', background: '#000', border: '1px solid #444', borderRadius: '12px', color: 'white', outline: 'none' }} />
          <input placeholder={t('freelanceNiche')} value={form.freelanceNiche}
            onChange={(e) => setForm({...form, freelanceNiche: e.target.value})}
            style={{ padding: '12px', background: '#000', border: '1px solid #444', borderRadius: '12px', color: 'white', outline: 'none' }} />
          <select required value={form.country} onChange={handleCountryChange}
            style={{ padding: '12px', background: '#000', border: '1px solid #444', borderRadius: '12px', color: 'white', outline: 'none' }}>
            <option value="">{t('selectCountry')}</option>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button type="submit" disabled={loading}
            style={{ padding: '14px', background: '#1DB954', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
            {loading ? t('creating') : t('createAccount')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#aaa' }}>
          {t('alreadyHaveAccount')}{' '}
          <button onClick={switchToLogin} style={{ color: '#1DB954', background: 'none', border: 'none', cursor: 'pointer' }}>
            {t('login')}
          </button>
        </p>
      </div>
    </div>
  );
}