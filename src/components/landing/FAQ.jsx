import { useState } from 'react';

const faqItems = [
  {
    id: 1,
    question: 'How accurate is the scan?',
    answer:
      'Our AI is trained on thousands of real scam reports, achieving 92% detection accuracy.',
  },
  {
    id: 2,
    question: 'Can I upload contracts?',
    answer:
      'Yes, you can paste text or upload PDF files. Both work with our smart analyzer.',
  },
  {
    id: 3,
    question: 'Is my data stored?',
    answer:
      'No. We never store your scans or personal information. Everything runs in your browser.',
  },
  {
    id: 4,
    question: 'What if a scan misses something?',
    answer:
      'You can submit community reports. Our moderator team reviews them quickly.',
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState(1); // First item open by default

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="min-h-screen flex flex-col lg:flex-row justify-between px-8 py-20 gap-20 bg-black text-white">
      {/* Left Content */}
      <div className="w-full lg:w-[45%]">
        <h1 className="text-6xl font-light leading-[0.95]">
          Questions?<br />
          <span className="text-primary font-black">Answers</span><br />
          <span className="text-primary/35">for you</span>
        </h1>

        {/* Image Card (optional – can be a freelancer-related image) */}
        <div className="w-[320px] h-[380px] mt-16 relative overflow-hidden rounded-2xl">
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800"
            alt="Freelancer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/20 flex flex-col justify-end p-6">
            <p className="text-sm text-gray-300 mb-4">
              Real freelancers, real protection. Join thousands who trust FreelanceGuard.
            </p>
            <button className="w-14 h-14 rounded-full border-2 border-primary text-primary flex items-center justify-center">
              ▶
            </button>
          </div>
        </div>
      </div>

      {/* Accordion (Right Side) */}
      <div className="w-full lg:w-[50%]">
        {faqItems.map((item, idx) => (
          <div
            key={item.id}
            className="border-t border-primary/25 py-8"
          >
            <div
              onClick={() => toggle(item.id)}
              className="flex items-center justify-between cursor-pointer"
            >
              <span className="text-primary font-mono text-lg">{String(idx + 1).padStart(2, '0')}</span>
              <h3 className="flex-1 ml-5 text-3xl font-semibold">{item.question}</h3>
              <span className="text-primary text-2xl">
                {openId === item.id ? '×' : '+'}
              </span>
            </div>
            {/* Content – animated via max-height (no GSAP) */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-out ${
                openId === item.id ? 'max-h-40 mt-4' : 'max-h-0'
              }`}
            >
              <p className="text-gray-400 max-w-lg mb-4">{item.answer}</p>
              <a
                href="#"
                className="inline-block px-7 py-3 rounded-full bg-primary text-black font-bold text-sm"
              >
                Learn More
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}