import { Shield, MessageSquare, FileText, Search, BarChart3, Users } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Job Post Analyzer',
    desc: 'AI scans job posts for red flags like fake payments, requests for personal ID/passport, unrealistic salary, and unverified companies. You’ll get a clear risk percentage, a list of flagged issues, and an AI summary.',
  },
  {
    icon: MessageSquare,
    title: 'Message Scanner',
    desc: 'Copy‑paste any client message. Our AI checks for manipulation tactics, urgency traps, off‑platform payment requests, and phishing patterns. Instantly see a safety score and highlighted warning signs.',
  },
  {
    icon: FileText,
    title: 'Contract Checker',
    desc: 'Paste your contract text or upload a .txt file. The AI reviews clauses for IP theft, unfair termination terms, delayed payment schedules, and hidden penalties. You get a detailed breakdown of each risky clause, plus an overall contract safety score.',
  },
  {
    icon: Search,
    title: 'Client Trust Checker',
    desc: 'Enter a company name, domain, or email. Our system checks community‑reported scams, verifies online presence, and flags unregistered or brand‑new entities. You’ll see a trustworthiness percentage and specific reasons why the client may (or may not) be reliable.',
  },
  {
    icon: BarChart3,
    title: 'Dashboard',
    desc: 'Track all your scans, see trends, and access detailed reports and history.',
  },
  {
    icon: Users,
    title: 'Community Reports',
    desc: 'A crowdsourced database of scam alerts and legit job reviews. Search by platform, company, or keyword. Each report includes the job link, reason, evidence screenshots, and reliability status. Contribute your own reports to help the community.',
  },
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