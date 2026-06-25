import { useState } from 'react';
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
  const [form, setForm] = useState({
    name: '', email: '', password: '', freelanceNiche: '', country: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div style={{ position:'fixed', top:0, left:0, width:'100vw', height:'100vh', backgroundColor:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:99999 }}>
      <div onClick={(e) => e.stopPropagation()} className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
        <h2 className="text-2xl font-heading font-bold mb-6 text-white">{t('createAccount')}</h2>
        {error && <p className="text-red-400 mb-3 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required placeholder={t('fullName')} className="w-full p-3 rounded-xl bg-black border border-gray-700 text-white" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
          <input required type="email" placeholder={t('email')} className="w-full p-3 rounded-xl bg-black border border-gray-700 text-white" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
          <input required type="password" placeholder={t('password')} className="w-full p-3 rounded-xl bg-black border border-gray-700 text-white" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} />
          <input placeholder={t('freelanceNiche')} className="w-full p-3 rounded-xl bg-black border border-gray-700 text-white" value={form.freelanceNiche} onChange={(e) => setForm({...form, freelanceNiche: e.target.value})} />
          <select required value={form.country} onChange={handleCountryChange} className="w-full p-3 rounded-xl bg-black border border-gray-700 text-white">
            <option value="">{t('selectCountry')}</option>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button disabled={loading} type="submit" className="w-full bg-primary text-black font-semibold py-3 rounded-xl disabled:opacity-50">
            {loading ? t('creating') : t('createAccount')}
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-400">
          {t('alreadyHaveAccount')}{' '}
          <button onClick={switchToLogin} className="text-primary">{t('login')}</button>
        </p>
      </div>
    </div>
  );
}