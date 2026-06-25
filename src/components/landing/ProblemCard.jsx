import { UserX, CreditCard, FileWarning } from 'lucide-react';

const problems = [
  {
    icon: UserX,
    number: '01',
    title: 'Fake Jobs',
    description: 'Postings designed to steal your work or personal info.',
  },
  {
    icon: CreditCard,
    number: '02',
    title: 'Payment Fraud',
    description: 'Fake payments, chargebacks, and never‑paid schemes.',
  },
  {
    icon: FileWarning,
    number: '03',
    title: 'Contract Abuse',
    description: 'Hidden clauses that lock you into unfair terms.',
  },
];

export default function ProblemCard() {
  return (
    <section className="py-20 px-[6%] bg-black text-white">
      {/* Heading */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm mb-6">
          ✦ COMMON SCAMS
        </div>
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
          Scammers Are Getting{' '}
          <span className="text-primary">Smarter.</span>
        </h2>
        <p className="mt-4 text-text-secondary text-lg max-w-xl mx-auto">
          So Should Freelancers.
        </p>
        <div className="w-20 h-1 bg-primary rounded-full mx-auto mt-6" />
      </div>

      {/* Cards Grid – 3 columns on desktop, stacks on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {problems.map((item) => (
          <div
            key={item.number}
            className="relative bg-[#0d0d0d] border border-primary/15 rounded-3xl p-8 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(97,255,139,0.1)] group"
          >
            {/* Background circle */}
            <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-primary/5 group-hover:scale-125 transition-transform duration-500" />

            {/* Number */}
            <span className="absolute top-4 right-6 text-7xl font-extrabold text-primary/10 leading-none">
              {item.number}
            </span>

            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 relative z-10">
              <item.icon size={28} className="text-primary" />
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold mb-3">{item.title}</h3>

            {/* Description */}
            <p className="text-gray-400 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}