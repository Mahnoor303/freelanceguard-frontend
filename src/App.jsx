import { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import useDarkMode from './hooks/useDarkMode';
import Loader from './components/ui/Loader';
import gsap from 'gsap';
import CookieBanner from './components/ui/CookieBanner';
import PremiumFeatureGuard from './components/ui/PremiumFeatureGuard';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { HelmetProvider } from 'react-helmet-async';

// ---------- Floating Tools ----------
import FloatingChatButton from './components/ui/FloatingChatButton';
import FloatingWorkspaceButton from './components/ui/FloatingWorkspaceButton';
import OnboardingTour from './components/onboarding/OnboardingTour';

// ---------- Layouts ----------
import DashboardLayout from './components/layout/DashboardLayout';
import AdminLayout from './components/layout/AdminLayout';

// ---------- Public Pages ----------
import Landing from './pages/Landing';
const Features = lazy(() => import('./pages/Features'));
const Pricing = lazy(() => import('./pages/Pricing'));
const About = lazy(() => import('./pages/About'));
const CommunityPreview = lazy(() => import('./pages/CommunityPreview'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const NotFound = lazy(() => import('./pages/NotFound'));

// ---------- Auth Modals ----------
import LoginModal from './components/auth/LoginModal';
import RegisterModal from './components/auth/RegisterModal';

// ---------- Dashboard Pages ----------
import Dashboard from './pages/Dashboard';
import JobAnalyzer from './pages/JobAnalyzer';
import MessageScanner from './pages/MessageScanner';
import ContractChecker from './pages/ContractChecker';
import ClientLookup from './pages/ClientLookup';
import ScanHistory from './pages/ScanHistory';
import SavedReports from './pages/SavedReports';
import CommunityReports from './pages/CommunityReports';
import SubmitReport from './pages/SubmitReport';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import FakePayment from './pages/FakePayment';
import SubmitTestimonial from './pages/SubmitTestimonial';
import Subscription from './pages/Subscription';

// ---------- New Beginner Features ----------
import SampleScans from './pages/SampleScans';
import VideoTutorials from './pages/VideoTutorials';
import ContractTemplates from './pages/ContractTemplates';
import ChatAssistant from './pages/ChatAssistant';          // Keep route if direct access needed
import FreelancerRoadmap from './pages/FreelancerRoadmap';
import RateCalculator from './pages/RateCalculator';
import PortfolioBuilder from './pages/PortfolioBuilder';
import JobMatcher from './pages/JobMatcher';
import VirtualWorkspace from './pages/VirtualWorkspace';    // Keep route if direct access needed

// ---------- Admin Pages ----------
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminScans from './pages/admin/AdminScans';
import AdminReports from './pages/admin/AdminReports';
import AdminScamDatabase from './pages/admin/AdminScamDatabase';
import AdminContent from './pages/admin/AdminContent';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminSettings from './pages/admin/AdminSettings';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminSubscriptionRequests from './pages/admin/AdminSubscriptionRequests';

// ---------- Admin Auth & Protection ----------
import { AdminAuthProvider } from './context/AdminAuthContext';
import AdminLogin from './components/auth/AdminLogin';
import ProtectedAdminRoute from './components/ui/ProtectedAdminRoute';

// ---------- Protected Route Wrapper ----------
import ProtectedRoute from './components/ui/ProtectedRoute';

const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
  </div>
);

function AppInner() {
  const [dark, setDark] = useDarkMode();
  const { user } = useAuth();  // 👈 needed for floating buttons

  // Local modal state
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const openLogin = () => setShowLogin(true);
  const openRegister = () => setShowRegister(true);
  const closeModals = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-300">
      <OnboardingTour />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing dark={dark} setDark={setDark} openLogin={openLogin} openRegister={openRegister} />} />
        <Route path="/features" element={<Suspense><Features dark={dark} setDark={setDark} /></Suspense>} />
        <Route path="/pricing" element={<Suspense><Pricing dark={dark} setDark={setDark} /></Suspense>} />
        <Route path="/about" element={<Suspense><About dark={dark} setDark={setDark} /></Suspense>} />
        <Route path="/community" element={<Suspense><CommunityPreview dark={dark} setDark={setDark} /></Suspense>} />
        <Route path="/contact" element={<Suspense><Contact dark={dark} setDark={setDark} /></Suspense>} />
        <Route path="/privacy" element={<Suspense><Privacy /></Suspense>} />

        {/* Dashboard (protected) */}
        <Route element={<DashboardLayout dark={dark} setDark={setDark} />}>
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/job-analyzer" element={<ProtectedRoute><JobAnalyzer /></ProtectedRoute>} />
          <Route path="/message-scanner" element={<ProtectedRoute><MessageScanner /></ProtectedRoute>} />
          <Route path="/contract-checker" element={<ProtectedRoute><PremiumFeatureGuard><ContractChecker /></PremiumFeatureGuard></ProtectedRoute>} />
          <Route path="/client-lookup" element={<ProtectedRoute><PremiumFeatureGuard><ClientLookup /></PremiumFeatureGuard></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><ScanHistory /></ProtectedRoute>} />
          <Route path="/saved-reports" element={<ProtectedRoute><SavedReports /></ProtectedRoute>} />
          <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
          <Route path="/reports" element={<CommunityReports />} />
          <Route path="/job-matcher" element={<ProtectedRoute><JobMatcher /></ProtectedRoute>} />
          <Route path="/submit-report" element={<ProtectedRoute><SubmitReport /></ProtectedRoute>} />
          <Route path="/submit-testimonial" element={<ProtectedRoute><SubmitTestimonial /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><FakePayment /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings dark={dark} setDark={setDark} /></ProtectedRoute>} />

          {/* New Beginner Features */}
          <Route path="/demo-scans" element={<ProtectedRoute><SampleScans /></ProtectedRoute>} />
          <Route path="/video-tutorials" element={<ProtectedRoute><VideoTutorials /></ProtectedRoute>} />
          <Route path="/contract-templates" element={<ProtectedRoute><ContractTemplates /></ProtectedRoute>} />
          <Route path="/chat-assistant" element={<ProtectedRoute><ChatAssistant /></ProtectedRoute>} />        {/* Keep route for direct access */}
          <Route path="/roadmap" element={<ProtectedRoute><FreelancerRoadmap /></ProtectedRoute>} />
          <Route path="/rate-calculator" element={<ProtectedRoute><RateCalculator /></ProtectedRoute>} />
          <Route path="/portfolio-builder" element={<ProtectedRoute><PortfolioBuilder /></ProtectedRoute>} />
          <Route path="/workspace" element={<ProtectedRoute><VirtualWorkspace /></ProtectedRoute>} />        {/* Keep route for direct access */}
        </Route>

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminAuthProvider><AdminLayout dark={dark} setDark={setDark} /></AdminAuthProvider>}>
          <Route index element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
          <Route path="users" element={<ProtectedAdminRoute><AdminUsers /></ProtectedAdminRoute>} />
          <Route path="scans" element={<ProtectedAdminRoute><AdminScans /></ProtectedAdminRoute>} />
          <Route path="reports" element={<ProtectedAdminRoute><AdminReports /></ProtectedAdminRoute>} />
          <Route path="scam-database" element={<ProtectedAdminRoute><AdminScamDatabase /></ProtectedAdminRoute>} />
          <Route path="content" element={<ProtectedAdminRoute><AdminContent /></ProtectedAdminRoute>} />
          <Route path="subscription-requests" element={<ProtectedAdminRoute><AdminSubscriptionRequests /></ProtectedAdminRoute>} />
          <Route path="notifications" element={<ProtectedAdminRoute><AdminNotifications /></ProtectedAdminRoute>} />
          <Route path="testimonials" element={<ProtectedAdminRoute><AdminTestimonials /></ProtectedAdminRoute>} />
          <Route path="settings" element={<ProtectedAdminRoute><AdminSettings /></ProtectedAdminRoute>} />
        </Route>

        <Route path="*" element={<Suspense><NotFound /></Suspense>} />
      </Routes>

      {/* Modals */}
      {showLogin && (
        <LoginModal
          onClose={closeModals}
          switchToRegister={() => { closeModals(); openRegister(); }}
        />
      )}
      {showRegister && (
        <RegisterModal
          onClose={closeModals}
          switchToLogin={() => { closeModals(); openLogin(); }}
        />
      )}

      {/* Floating Tools – only for logged‑in users */}
      {user &&(
        <>
          <FloatingChatButton />
          <FloatingWorkspaceButton />
        </>
      )}
    </div>
  );
}

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const mainContentRef = useRef(null);
  const loaderRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setAppReady(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (appReady && mainContentRef.current && loaderRef.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          if (loaderRef.current) loaderRef.current.style.display = 'none';
        },
      });

      tl.to(loaderRef.current, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
      }).fromTo(
        mainContentRef.current,
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.3'
      );
    }
  }, [appReady]);

  return (
    <HelmetProvider>
      <AuthProvider>
        <ErrorBoundary>
          <CookieBanner />
          <div ref={loaderRef} className={appReady ? 'pointer-events-none' : ''}>
            <Loader />
          </div>
          <div ref={mainContentRef} className="opacity-0">
            <AppInner />
          </div>
        </ErrorBoundary>
      </AuthProvider>
    </HelmetProvider>
  );
}