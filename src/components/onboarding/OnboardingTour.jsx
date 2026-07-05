import { useState, useEffect, useCallback } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

const STEPS = [
  {
    selector: '.dashboard-header',
    title: 'Your Dashboard',
    content: 'Here you can see your total scans, risk distribution, and recent activity.',
    placement: 'bottom',
  },
  {
    selector: '.scan-button',
    title: 'Start a Scan',
    content: 'Use this button to analyse job posts, messages, contracts, or clients.',
    placement: 'top',
  },
  {
    selector: '.sidebar',
    title: 'Navigation',
    content: 'Access scanners, history, community reports, and settings from the sidebar.',
    placement: 'right',
  },
  {
    selector: '.upgrade-card',
    title: 'Upgrade to Pro',
    content: 'Get unlimited scans, contract analysis, and advanced reports.',
    placement: 'top',
  },
];

export default function OnboardingTour() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);

  // Show tour only once
  useEffect(() => {
    const done = localStorage.getItem('onboardingDone');
    if (!done) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  // Scroll to the target element after a tiny delay, so the layout is stable
  const scrollToTarget = useCallback(() => {
    if (!visible || current >= STEPS.length) return;
    const el = document.querySelector(STEPS[current].selector);
    if (el) {
      // Wait a few frames for any CSS transitions to finish
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      });
    }
  }, [current, visible]);

  // Trigger scroll when the step changes
  useEffect(() => {
    scrollToTarget();
  }, [scrollToTarget]);

  if (!visible || current >= STEPS.length) return null;

  const step = STEPS[current];
  const el = document.querySelector(step.selector);

  // --- Styles ---
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

  let spotlightStyle = null;

  if (el) {
    const rect = el.getBoundingClientRect();
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    spotlightStyle = {
      position: 'fixed',
      top: rect.top - 4,
      left: rect.left - 4,
      width: rect.width + 8,
      height: rect.height + 8,
      borderRadius: 8,
      boxShadow: '0 0 0 9999px rgba(0,0,0,0.75), 0 0 15px rgba(97,255,139,0.5)',
      zIndex: 99998,
      pointerEvents: 'none',
    };

    // Position tooltip based on placement, but keep it inside the viewport
    if (step.placement === 'bottom') {
      tooltipStyle.top = Math.min(viewportH - 280, rect.bottom + 12);
      tooltipStyle.left = Math.min(Math.max(10, rect.left + rect.width / 2 - 160), viewportW - 340);
    } else if (step.placement === 'top') {
      tooltipStyle.top = Math.max(10, rect.top - 220);
      tooltipStyle.left = Math.min(Math.max(10, rect.left + rect.width / 2 - 160), viewportW - 340);
    } else if (step.placement === 'right') {
      tooltipStyle.top = Math.min(viewportH - 280, Math.max(10, rect.top + rect.height / 2 - 120));
      tooltipStyle.left = Math.min(viewportW - 340, rect.right + 12);
    } else {
      // centered fallback
      tooltipStyle.top = '50%';
      tooltipStyle.left = '50%';
      tooltipStyle.transform = 'translate(-50%, -50%)';
    }
  } else {
    // Element not found – show tooltip in the center
    tooltipStyle.top = '50%';
    tooltipStyle.left = '50%';
    tooltipStyle.transform = 'translate(-50%, -50%)';
  }

  const next = () => setCurrent((prev) => prev + 1);
  const prev = () => setCurrent((prev) => Math.max(0, prev - 1));
  const finish = () => {
    setVisible(false);
    localStorage.setItem('onboardingDone', 'true');
  };

  return (
    <div className="fixed inset-0 z-[99998] pointer-events-none">
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
    </div>
  );
}