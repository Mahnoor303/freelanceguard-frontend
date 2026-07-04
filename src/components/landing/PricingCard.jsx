import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function PricingCard() {
  const { user, openRegister } = useAuth();
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Free Shield',
      price: '$0',
      period: 'mo',
      tag: 'For Beginners',
      features: [
        '5 Job Scans / Day',
        '5 Message Scans / Day',
        'Community Reports Access',
        'Scan History',
      ],
      notIncluded: ['Contract Checker', 'Client Trust Checker', 'PDF Reports', 'Priority Analysis'],
      cta: 'Start Free',
      popular: false,
      planCode: 'free',
    },
    {
      name: 'Pro Shield',
      price: '$9.99',
      period: 'mo',
      tag: 'Most Popular',
      features: [
        'Unlimited Job Scans',
        'Unlimited Message Scans',
        'Contract Checker',
        'Client Trust Checker',
        'PDF Export',
        'Saved Reports',
        'Advanced Dashboard Analytics',
        'Priority AI Analysis',
      ],
      notIncluded: [],
      cta: 'Upgrade Now',
      popular: true,
      planCode: 'pro',
    },
    {
      name: 'Elite Shield',
      price: '$19.99',
      period: 'mo',
      tag: 'Best Protection',
      features: [
        'Everything in Pro',
        'Unlimited Everything',
        'Scam Trends Analytics',
        'Premium Community Access',
        'Early Features Access',
        'Priority Support',
      ],
      notIncluded: [],
      cta: 'Go Elite',
      popular: false,
      planCode: 'elite',
    },
  ];

  const handleCardClick = (planCode) => {
    window.scrollTo(0, 0); 
    if (!user) {
      // Not logged in → open register modal with message
      if (openRegister) {
        openRegister();
        toast('Create an account to activate your protection plan.', { icon: '🛡️' });
      } else {
        navigate('/?register=true');
      }
      return;
    }
    // Logged in
    if (planCode === 'free') {
      if (user.plan === 'free') {
        toast.success('You are already on the Free plan.');
      } else {
        toast('You are already on a paid plan. No action needed.', { icon: 'ℹ️' });
      }
      return;
    }
    // Pro or Elite → go to fake payment page with plan in query
    navigate(`/payment?plan=${planCode}`);
  };

  return (
    <section className="py-20 px-[6%] bg-black overflow-hidden" id="pricing">
      {/* Heading */}
      <div className="mb-20">
        <h2 className="text-[clamp(70px,9vw,130px)] leading-[0.9] tracking-[-4px]">
          <span className="font-light">
            More than{' '}
            <span className="text-primary/25">a paradise</span>
          </span>
          <br />
          <span className="font-black">Choose Your Protection</span>
        </h2>
        <p className="mt-8 max-w-xl text-gray-400 text-lg leading-relaxed">
          Select the perfect plan designed for freelancers, with AI‑powered security at every level.
        </p>
      </div>

      {/* Cards */}
      <div className="flex justify-center gap-8 flex-wrap">
        {plans.map((p) => (
          <div
            key={p.planCode}
            className={`relative w-full max-w-[370px] bg-[#0b0b0b] border rounded-3xl p-10 transition-all duration-300 overflow-hidden group ${
              p.popular
                ? 'border-primary scale-105 shadow-[0_0_25px_rgba(97,255,139,0.15)]'
                : 'border-primary/20'
            }`}
          >
            {/* Popular Badge */}
            {p.popular && (
              <span className="absolute top-5 right-5 bg-primary text-black text-xs font-bold px-3 py-2 rounded-full z-10">
                {p.tag}
              </span>
            )}
            {!p.popular && p.tag && (
              <span className="absolute top-5 right-5 text-xs text-gray-500">{p.tag}</span>
            )}

            {/* Plan Name */}
            <h3 className="text-3xl font-heading font-bold mb-2">{p.name}</h3>

            {/* Price */}
            <div className="text-7xl md:text-8xl font-extrabold mt-4 leading-none">
              {p.price}
            </div>
            <div className="text-gray-400 mt-2 mb-8">{p.period ? `Per ${p.period}` : ''}</div>

            {/* Features */}
            <ul className="list-none space-y-0 mb-6">
              {p.features.map((feat, i) => (
                <li key={i} className="text-gray-300 py-3.5 border-b border-white/10 last:border-b-0">
                  ✅ {feat}
                </li>
              ))}
              {p.notIncluded.map((feat, i) => (
                <li key={`no-${i}`} className="text-gray-600 py-3.5 border-b border-white/10 last:border-b-0">
                  ❌ {feat}
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <button
              onClick={() => handleCardClick(p.planCode)}
              className="w-full mt-8 py-4 rounded-full bg-primary text-black font-bold text-lg hover:-translate-y-1 transition-transform"
            >
              {p.cta}
            </button>

            {/* Giant Background Number */}
            <div className="absolute -bottom-8 right-5 text-[170px] font-extrabold text-primary/10 pointer-events-none select-none leading-none">
              {p.planCode === 'free' ? '01' : p.planCode === 'pro' ? '02' : '03'}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}