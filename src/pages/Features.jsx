import { Shield, Sun, Moon } from 'lucide-react';
import FeatureSection from '../components/landing/FeatureSection';
import { useNavigate } from 'react-router-dom';

export default function Features({ dark, setDark }) {
  return (
    <div>
      <nav className="sticky top-0 glass border-b border-border z-50">
        <div className="container mx-auto flex justify-between items-center px-6 h-16">
          <span onClick={()=>navigate('/')} className="cursor-pointer font-heading font-bold text-2xl text-primary">🛡️ FreelanceGuard</span>
          <button onClick={()=>setDark(!dark)} className="p-2 rounded-full"><Sun size={20}/></button>
        </div>
      </nav>
      <FeatureSection />
    </div>
  );
}