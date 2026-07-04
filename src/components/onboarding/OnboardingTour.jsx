import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Shield, ScanLine, LayoutDashboard, Crown } from 'lucide-react';

const POPUP_STEPS = [
  {
    icon: LayoutDashboard,
    title: 'Your Dashboard',
    description:
      'The dashboard shows your scan stats, risk distribution, charts, and recent activity at a glance.',
  },
  {
    icon: ScanLine,
    title: 'Start Scanning',
    description:
      'Use the "Start Free Scan" button or the sidebar to analyse job posts, messages, contracts, and clients.',
  },
  {
    icon: Shield,
    title: 'Navigate with the Sidebar',
    description:
      'Access all tools from the sidebar: scanners, history, community reports, and more.',
  },
  {
    icon: Crown,
    title: 'Unlock Pro Features',
    description:
      'Upgrade to Pro for unlimited scans, contract analysis, advanced reports, and priority AI.',
  },
];

export default function OnboardingTour() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const done = localStorage.getItem('onboardingDone');
    if (!done) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const finish = () => {
    setVisible(false);
    localStorage.setItem('onboardingDone', 'true');
  };

  const next = () => setStep((prev) => Math.min(prev + 1, POPUP_STEPS.length - 1));
  const prev = () => setStep((prev) => Math.max(prev - 1, 0));

  if (!visible) return null;

  const current = POPUP_STEPS[step];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[99999] p-4">
      <div className="bg-[#0a0a0a] border-2 border-primary rounded-2xl p-8 max-w-md w-full relative shadow-[0_0_40px_rgba(97,255,139,0.3)]">
        {/* Close button */}
        <button
          onClick={finish}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <current.icon className="text-primary" size={32} />
          </div>
        </div>

        {/* Content */}
        <h2 className="text-xl font-heading font-bold text-primary text-center mb-2">
          {current.title}
        </h2>
        <p className="text-gray-300 text-center leading-relaxed mb-6">
          {current.description}
        </p>

        {/* Step indicator */}
        <div className="flex justify-center gap-2 mb-6">
          {POPUP_STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === step ? 'bg-primary' : 'bg-gray-700'
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <div>
            {step > 0 && (
              <button
                onClick={prev}
                className="text-gray-400 hover:text-white p-1 transition"
              >
                <ChevronLeft size={20} />
              </button>
            )}
          </div>
          <span className="text-xs text-gray-500">
            {step + 1} / {POPUP_STEPS.length}
          </span>
          {step < POPUP_STEPS.length - 1 ? (
            <button
              onClick={next}
              className="bg-primary text-black px-4 py-2 rounded-lg font-semibold flex items-center gap-1 hover:scale-105 transition"
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={finish}
              className="bg-primary text-black px-4 py-2 rounded-lg font-semibold hover:scale-105 transition"
            >
              Got it!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}