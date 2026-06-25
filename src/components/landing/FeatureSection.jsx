import { Shield, MessageSquare, FileText, Search, BarChart3, Users } from 'lucide-react';

const features = [
  { icon: Shield, title: 'Job Post Analyzer', desc: 'Instant risk score, scam indicators.' },
  { icon: MessageSquare, title: 'Message Scanner', desc: 'Detect manipulation & urgency.' },
  { icon: FileText, title: 'Contract Checker', desc: 'Find hidden dangerous clauses.' },
  { icon: Search, title: 'Client Trust Checker', desc: 'Verify clients before you start.' },
  { icon: BarChart3, title: 'Dashboard', desc: 'Full scan history & insights.' },
  { icon: Users, title: 'Community Reports', desc: 'Crowdsourced scam database.' },
];

export default function FeatureSection() {
  return (
    <section className="container mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-16">
        Features
      </h2>
      <div className="grid md:grid-cols-2 gap-12">
        {features.map((f, idx) => (
          <div
            key={idx}
            className={`flex gap-6 items-center ${
              idx % 2 === 1 ? 'md:flex-row-reverse' : ''
            }`}
          >
            <div className="p-4 rounded-xl bg-primary/10 text-primary">
              <f.icon size={36} />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-xl mb-2">{f.title}</h3>
              <p className="text-text-secondary">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}