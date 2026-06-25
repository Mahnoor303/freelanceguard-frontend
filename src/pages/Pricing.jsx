import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Shield, Zap, Crown } from 'lucide-react';
import Footer from '../components/layout/Footer';

export default function Pricing({ dark, setDark }) {
  const navigate = useNavigate();

  const plans = [
    {
      icon: Shield,
      title: 'Essential Guard',
      price: '$499',
      period: '/mo',
      features: [
        '24/7 SIEM monitoring',
        'Automated threat alerts',
        'Monthly vulnerability scans',
      ],
      cta: 'GET STARTED',
    },
    {
      icon: Zap,
      title: 'Advanced Defense',
      price: '$1,499',
      period: '/mo',
      features: [
        'All Essential features',
        '24/7 SOC with live analysts',
        'Quarterly penetration testing',
        'Incident response retainer',
      ],
      cta: 'GET STARTED',
    },
    {
      icon: Crown,
      title: 'Enterprise Fortress',
      customPrice: 'Custom',
      features: [
        'All Advanced features',
        'Dedicated security architect',
        'Zero-trust implementation',
        'Dark web monitoring',
        'Compliance management',
      ],
      cta: 'CONTACT SALES',
    },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass border-b border-border bg-black/80">
        <div className="container mx-auto flex justify-between items-center px-6 h-16">
          <span
            onClick={() => navigate('/')}
            className="cursor-pointer font-heading font-bold text-2xl text-primary"
          >
            🛡️ FreelanceGuard
          </span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDark(!dark)}
              className="p-2 rounded-full hover:bg-primary/10"
            >
              {dark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Pricing Section */}
      <section className="relative flex-1 py-16 md:py-24 px-[5%] bg-black overflow-hidden">
        {/* Background Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 20% 20%, rgba(97,255,139,0.08), transparent 40%)',
          }}
        />

        <div className="relative z-10">
          {/* Heading */}
          <div className="mb-12 md:mb-16">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-none">
              Protection <span className="text-primary">Plans</span>
            </h2>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className="bg-[#050816] border border-primary/20 rounded-3xl p-6 md:p-8 transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-[0_0_30px_rgba(97,255,139,0.15)]"
              >
                {/* Icon */}
                <div className="text-primary mb-6 text-4xl">
                  <plan.icon size={48} />
                </div>

                {/* Title */}
                <h3 className="text-white text-3xl md:text-4xl font-bold mb-6">
                  {plan.title}
                </h3>

                {/* Price */}
                {plan.customPrice ? (
                  <div className="text-5xl md:text-6xl font-extrabold text-white mb-8">
                    {plan.customPrice}
                  </div>
                ) : (
                  <div className="mb-8">
                    <span className="text-5xl md:text-6xl font-extrabold text-white">
                      {plan.price}
                    </span>
                    <span className="text-xl md:text-2xl text-gray-400 ml-1">
                      {plan.period}
                    </span>
                  </div>
                )}

                {/* Features */}
                <ul className="list-none mb-10 space-y-1">
                  {plan.features.map((feat, fIdx) => (
                    <li
                      key={fIdx}
                      className="text-gray-400 text-lg py-4 border-b border-white/10 pl-8 relative"
                    >
                      <span className="absolute left-0 text-primary font-bold">
                        ✓
                      </span>
                      {feat}
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <button className="inline-flex items-center justify-center min-w-[220px] h-16 border-2 border-primary rounded-full text-primary font-bold text-lg hover:bg-primary hover:text-black transition-all duration-300">
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}