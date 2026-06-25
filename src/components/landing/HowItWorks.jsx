const steps = [
  { title: 'Paste Content', desc: 'Job post, message, or contract' },
  { title: 'AI Detection', desc: 'Scans for scam patterns' },
  { title: 'Risk Analysis', desc: 'Instant danger score' },
  { title: 'Stay Protected', desc: 'Actionable safety report' },
];

export default function HowItWorks() {
  return (
    <section className="relative bg-black py-20 px-8 md:px-16 overflow-hidden">
      {/* Cyber Background (green dots) */}
      <div
        className="absolute inset-0 opacity-60 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, var(--color-primary) 1px, transparent 2px),
            radial-gradient(circle at 60% 20%, var(--color-primary) 1px, transparent 2px),
            radial-gradient(circle at 80% 70%, var(--color-primary) 1px, transparent 2px),
            radial-gradient(circle at 30% 80%, var(--color-primary) 1px, transparent 2px)
          `,
        }}
      />

      {/* Badge */}
      <div className="relative z-10 inline-flex items-center gap-3 bg-white text-gray-900 px-6 py-4 md:px-8 md:py-5 rounded-2xl text-2xl md:text-3xl font-semibold mb-16 md:mb-24">
        <span className="w-3 h-3 bg-black rounded-full" />
        How It Works
      </div>

      {/* Circular Cards */}
      <div className="relative z-10 flex flex-wrap justify-center gap-8 md:gap-12">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className={`w-44 h-44 md:w-52 md:h-52 border rounded-full flex flex-col justify-center items-center text-center px-2 transition-transform hover:-translate-y-2 ${
              idx === 1
                ? 'border-primary text-primary shadow-[0_0_25px_rgba(97,255,139,0.15)]' // active card
                : 'border-white/70 text-gray-400 bg-white/[0.01]'
            }`}
          >
            <h3 className="text-base md:text-lg font-bold leading-tight">{step.title}</h3>
            <p className="text-xs md:text-sm mt-1 opacity-80">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* Bottom Line */}
      <div className="relative z-10 mt-16 md:mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between text-gray-500 text-base md:text-lg gap-4 text-center md:text-left">
        <span>• Enterprise security since 2014</span>
        <span>• 500+ satisfied freelancers</span>
        <span>• Available in 40+ countries</span>
      </div>
    </section>
  );
}