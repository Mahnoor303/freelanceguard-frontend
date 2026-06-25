import { useNavigate } from 'react-router-dom';
import { Shield, Sun, Moon, UserX, CreditCard, FileWarning } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import TrustBar from '../components/landing/TrustBar';
import ProblemCard from '../components/landing/ProblemCard';
import FeatureSection from '../components/landing/FeatureSection';
import HowItWorks from '../components/landing/HowItWorks';
import Testimonials from '../components/landing/Testimonials';
import FAQ from '../components/landing/FAQ';
import FinalCTA from '../components/landing/FinalCTA';
import PricingCard from '../components/landing/PricingCard';
import ExperienceSection from '../components/landing/ExperienceSection';
import Footer from '../components/layout/Footer';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import ScrollToTop from '../components/ui/ScrollToTop';
import LoginModal from '../components/auth/LoginModal';
import RegisterModal from '../components/auth/RegisterModal';
import SEO from '../components/ui/SEO';
import { useState } from 'react';

export default function Landing({ dark, setDark, openLogin, openRegister }) {
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);
  const { user } = useAuth();
  const { t } = useTranslation();

  // ----- Local modal state -----
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const localOpenLogin = () => setShowLogin(true);
  const localOpenRegister = () => setShowRegister(true);
  const closeModals = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  const effectiveOpenLogin = openLogin || localOpenLogin;
  const effectiveOpenRegister = openRegister || localOpenRegister;

  const handleStartScan = () => {
    if (!user) {
      effectiveOpenLogin();
    } else {
      navigate('/job-analyzer');
    }
  };

  return (
    <div className="relative">
      <SEO title="Home" description="Protect your freelance work with AI scam detection." />
      {/* Nav */}
      <nav className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto flex justify-between items-center px-6 h-16">
          <span className="font-heading font-bold text-2xl text-primary flex items-center gap-2">
            <Shield size={28} /> FreelanceGuard
          </span>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="hover:text-primary">{t('features')}</a>
            <a href="#pricing" className="hover:text-primary">{t('pricing')}</a>
            <a href="#community" className="hover:text-primary">{t('community')}</a>
            <a href="/about" className="hover:text-primary">{t('about')}</a>
            <a href="/contact" className="hover:text-primary">{t('contact')}</a>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button onClick={() => setDark(!dark)} className="p-2 rounded-full hover:bg-primary/10">
              {dark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {!user ? (
              <>
                <button onClick={effectiveOpenLogin} className="text-sm font-medium hover:text-primary">{t('login')}</button>
                <button onClick={effectiveOpenRegister} className="bg-primary text-black px-4 py-2 rounded-lg font-semibold">
                  {t('getStarted')}
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/dashboard')} className="text-sm font-medium hover:text-primary">
                  {t('dashboard')}
                </button>
                <button onClick={() => navigate('/profile')} className="text-sm font-medium hover:text-primary">
                  {t('profile')}
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative w-full h-screen flex justify-center items-center overflow-hidden bg-black">
        <div className="absolute w-[900px] h-[500px] bg-primary/20 rounded-full blur-[180px] opacity-20 -top-20 left-1/2 -translate-x-1/2" />
        <div className="absolute w-[700px] h-[700px] bg-[#225931] rounded-full blur-[180px] opacity-50 bottom-0 right-0" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute w-[300px] h-[120%] bg-gradient-to-r from-transparent via-primary/10 to-transparent rotate-[20deg] -left-96 top-1/2 -translate-y-1/2 animate-sweep" />
        <div className="absolute inset-0 bg-black z-10 animate-revealUp" />
        <div className="relative z-20 flex flex-col items-center text-center px-6">
          <p className="text-primary tracking-[4px] text-sm mb-5 opacity-0 animate-fadeIn delay-100">
            {t('heroTag')}
          </p>
          <h1 className="text-[clamp(60px,9vw,130px)] leading-[0.9] font-extrabold text-white opacity-0 animate-fadeIn delay-300">
            {t('stopGuessing')}<br />
            <span className="text-primary">{t('startProtecting')}</span>
          </h1>
          <p className="mt-6 max-w-xl text-gray-300 leading-relaxed opacity-0 animate-fadeIn delay-500">
            {t('heroSubtitle')}
          </p>
          <div className="flex gap-4 mt-8 opacity-0 animate-fadeIn delay-700">
            <button
              onClick={handleStartScan}
              className="px-8 py-4 rounded-full bg-primary text-black font-bold shadow-[0_0_35px_rgba(97,255,139,0.4)] hover:-translate-y-1 transition"
            >
              {t('startFreeScan')}
            </button>
            <button
              onClick={() => setShowDemo(true)}
              className="px-8 py-4 rounded-full border border-white/10 text-white hover:bg-white/5 transition"
            >
              {t('watchDemo')}
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="bg-bg-secondary py-8 border-y border-border">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 text-center gap-6">
          {[
            { value: '50K+', label: t('statsScans') },
            { value: '92%', label: t('statsAccuracy') },
            { value: '20K+', label: t('statsUsers') },
            { value: '100+', label: t('statsReports') },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-2xl font-bold text-primary">{s.value}</div>
              <div className="text-sm text-text-secondary">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <TrustBar />
      <ProblemCard />
      <FeatureSection />
      <HowItWorks />
      <Testimonials />
      <ExperienceSection />

      {/* Pricing */}
      <PricingCard />

      <FAQ />
      <FinalCTA />
      <Footer />

      {/* Demo Video Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="relative bg-black border border-gray-800 rounded-2xl overflow-hidden max-w-4xl w-full">
            <button onClick={() => setShowDemo(false)} className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full">
              ✕
            </button>
            <video src="/img/your-video.mp4" poster="/img/video-poster.jpg" controls autoPlay muted playsInline className="w-full h-auto max-h-[80vh] object-contain">
              {t('videoNotSupported')}
            </video>
          </div>
        </div>
      )}

      {/* Login / Register Modals */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          switchToRegister={() => { setShowLogin(false); setShowRegister(true); }}
        />
      )}
      {showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)}
          switchToLogin={() => { setShowRegister(false); setShowLogin(true); }}
        />
      )}
      <button onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'} className="...">
        Sign in with Google
      </button>
      <ScrollToTop />
    </div>
  );
}