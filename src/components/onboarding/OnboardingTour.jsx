import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

// 🔥 Set to false when you want the tour only once per user
const FORCE_TEST_MODE = true;

const STEPS = [
  {
    // Dashboard heading
    selector: '[data-onboarding="dashboard-header"], .dashboard-header',
    title: 'Your Dashboard',
    content: 'Here you can see your total scans, risk distribution, and recent activity.',
    placement: 'bottom',
  },
  {
    // The actual "Start Free Scan" button (not just the wrapper)
    selector:
      '[data-onboarding="scan-button"] button, .scan-button button',
    title: 'Start a Scan',
    content:
      'Use this button to analyse job posts, messages, contracts, or clients.',
    placement: 'top',
  },
  {
    // Sidebar
    selector: '[data-onboarding="sidebar"], .sidebar',
    title: 'Navigation',
    content:
      'Access scanners, history, community reports, and settings from the sidebar.',
    placement: 'right',
  },
  {
    // Upgrade card (SubscriptionCard wrapper)
    selector: '[data-onboarding="upgrade-card"], .upgrade-card',
    title: 'Upgrade to Pro',
    content:
      'Get unlimited scans, contract analysis, and advanced reports.',
    placement: 'top',
  },
];

/**
 * Build an SVG data URI for the mask.
 * White = visible overlay, Black = transparent hole.
 */
const buildMaskURI = (target) => {
  if (!target || target.width <= 0 || target.height <= 0) return '';
  const { left, top, width, height } = target;
  const screenW = window.innerWidth;
  const screenH = window.innerHeight;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${screenW}" height="${screenH}">
      <defs>
        <mask id="hole">
          <rect width="100%" height="100%" fill="white" />
          <rect x="${left}" y="${top}" width="${width}" height="${height}" fill="black" />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="rgba(0,0,0,0.75)" mask="url(#hole)" />
    </svg>
  `.trim();

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

export default function OnboardingTour() {
  const location = useLocation();
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);
  const [targetRect, setTargetRect] = useState(null);
  const intervalRef = useRef(null);
  const rafRef = useRef(null);
  const targetElRef = useRef(null);

  // ---------- Start only on /dashboard ----------
  useEffect(() => {
    if (location.pathname !== '/dashboard') {
      setVisible(false);
      return;
    }

    if (FORCE_TEST_MODE) {
      const t = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(t);
    }

    const done = localStorage.getItem('onboardingDone');
    if (!done) {
      const t = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(t);
    }
  }, [location.pathname]);

  // ---------- Live tracking of the target element ----------
  const updateRect = useCallback(() => {
    if (targetElRef.current) {
      const rect = targetElRef.current.getBoundingClientRect();
      // Keep only the portion inside the viewport
      const visibleLeft = Math.max(0, rect.left);
      const visibleTop = Math.max(0, rect.top);
      const visibleRight = Math.min(window.innerWidth, rect.right);
      const visibleBottom = Math.min(window.innerHeight, rect.bottom);
      const width = Math.max(0, visibleRight - visibleLeft);
      const height = Math.max(0, visibleBottom - visibleTop);
      setTargetRect({ left: visibleLeft, top: visibleTop, width, height });
    }
  }, []);

  useEffect(() => {
    if (!visible || current >= STEPS.length) return;

    const selector = STEPS[current].selector;
    let retries = 0;
    const maxRetries = 15;

    const tryFind = () => {
      const el = document.querySelector(selector);
      if (el) {
        targetElRef.current = el;
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        updateRect();

        const loop = () => {
          updateRect();
          rafRef.current = requestAnimationFrame(loop);
        };
        rafRef.current = requestAnimationFrame(loop);

        clearInterval(intervalRef.current);
      } else {
        retries++;
        if (retries >= maxRetries) {
          clearInterval(intervalRef.current);
          targetElRef.current = null;
          setTargetRect(null);
        }
      }
    };

    tryFind();
    intervalRef.current = setInterval(tryFind, 300);

    return () => {
      clearInterval(intervalRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      targetElRef.current = null;
      setTargetRect(null);
    };
  }, [current, visible, updateRect]);

  if (!visible || current >= STEPS.length) return null;

  const step = STEPS[current];

  // ==================== OVERLAY (blur + mask cutout) ====================
  const maskURI = targetRect ? buildMaskURI(targetRect) : '';

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.75)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    zIndex: 99997,
    pointerEvents: 'none',
  };

  if (maskURI) {
    overlayStyle.maskImage = `url(${maskURI})`;
    overlayStyle.WebkitMaskImage = `url(${maskURI})`;
    overlayStyle.maskSize = '100% 100%';
    overlayStyle.maskRepeat = 'no-repeat';
  }

  // ==================== SPOTLIGHT (green border) ====================
  let spotlightStyle = null;
  if (targetRect && targetRect.width > 0 && targetRect.height > 0) {
    spotlightStyle = {
      position: 'fixed',
      top: targetRect.top - 6,
      left: targetRect.left - 6,
      width: targetRect.width + 12,
      height: targetRect.height + 12,
      border: '2px solid #61FF8B',
      borderRadius: 12,
      boxShadow: '0 0 20px rgba(97,255,139,0.5)',
      backgroundColor: 'transparent',
      zIndex: 99999,
      pointerEvents: 'none',
    };
  }

  // ==================== TOOLTIP ====================
  const tooltipStyle = {
    position: 'fixed',
    zIndex: 100000,
    background: '#0a0a0a',
    border: '1px solid #61FF8B',
    borderRadius: '16px',
    padding: '20px',
    maxWidth: '320px',
    width: '90%',
    color: '#E2E8F0',
    boxShadow: '0 0 30px rgba(97,255,139,0.25)',
  };

  if (targetRect && targetRect.width > 0 && targetRect.height > 0) {
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const rect = targetRect;

    if (step.placement === 'bottom') {
      tooltipStyle.top = Math.min(viewportH - 280, rect.top + rect.height + 16);
      tooltipStyle.left = Math.min(
        Math.max(10, rect.left + rect.width / 2 - 160),
        viewportW - 340
      );
    } else if (step.placement === 'top') {
      tooltipStyle.top = Math.max(10, rect.top - 230);
      tooltipStyle.left = Math.min(
        Math.max(10, rect.left + rect.width / 2 - 160),
        viewportW - 340
      );
    } else if (step.placement === 'right') {
      tooltipStyle.top = Math.min(
        viewportH - 280,
        Math.max(10, rect.top + rect.height / 2 - 120)
      );
      tooltipStyle.left = Math.min(viewportW - 340, rect.left + rect.width + 16);
    } else {
      // centered fallback
      tooltipStyle.top = '50%';
      tooltipStyle.left = '50%';
      tooltipStyle.transform = 'translate(-50%, -50%)';
    }
  } else {
    tooltipStyle.top = '50%';
    tooltipStyle.left = '50%';
    tooltipStyle.transform = 'translate(-50%, -50%)';
  }

  const next = () => {
    setCurrent((prev) => prev + 1);
    targetElRef.current = null;
    setTargetRect(null);
  };
  const prev = () => {
    setCurrent((prev) => Math.max(0, prev - 1));
    targetElRef.current = null;
    setTargetRect(null);
  };
  const finish = () => {
    setVisible(false);
    if (!FORCE_TEST_MODE) localStorage.setItem('onboardingDone', 'true');
  };

  return (
    <>
      <div style={overlayStyle} />
      {spotlightStyle && <div style={spotlightStyle} />}
      <div style={tooltipStyle} className="pointer-events-auto">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-heading font-bold text-primary text-lg">{step.title}</h3>
          <button onClick={finish} className="text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>
        <p className="text-sm text-gray-300 mb-4">{step.content}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Step {current + 1} of {STEPS.length}
          </span>
          <div className="flex gap-2">
            {current > 0 && (
              <button onClick={prev} className="text-gray-400 hover:text-white p-1">
                <ChevronLeft size={18} />
              </button>
            )}
            {current < STEPS.length - 1 ? (
              <button onClick={next} className="bg-primary text-black px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-1">
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button onClick={finish} className="bg-primary text-black px-3 py-1 rounded-lg text-sm font-semibold">
                Got it!
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}