import { useState, useRef, useCallback, useLayoutEffect, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import gsap from 'gsap';

const testimonials = [
  {
    id: '01',
    name: 'Priya Sharma',
    role: 'Graphic Designer',
    quote:
      'FreelanceGuard saved me from a fake client. The job analyzer flagged it instantly!',
  },
  {
    id: '02',
    name: 'Alex Johnson',
    role: 'Web Developer',
    quote:
      'The contract checker found a dangerous clause I would have missed. This tool is a lifesaver.',
  },
  {
    id: '03',
    name: 'Maria Garcia',
    role: 'Content Writer',
    quote:
      'I always check messages with the scanner. It detected pressure tactics and saved me from a scam.',
  },
  {
    id: '04',
    name: 'Sam Wilson',
    role: 'Penetration Tester',
    quote:
      'Even as a security expert, FreelanceGuard adds an extra layer of trust before I accept any job.',
  },
  {
    id: '05',
    name: 'Sarah Khan',
    role: 'Cyber Defense Analyst',
    quote:
      'Finally a tool that understands freelance scams at a deep level. Highly recommended.',
  },
];

export default function Testimonials() {
  const sliderRef = useRef(null);
  const [scrollPos, setScrollPos] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  useLayoutEffect(() => {
    if (sliderRef.current) {
      const container = sliderRef.current;
      const updateMax = () => {
        setMaxScroll(container.scrollWidth - container.clientWidth);
      };
      updateMax();
      window.addEventListener('resize', updateMax);
      return () => window.removeEventListener('resize', updateMax);
    }
  }, []);

  const cardWidth = 260;

  const scroll = useCallback(
    (direction) => {
      if (!sliderRef.current) return;
      let newPos;
      if (direction === 'left') {
        newPos = scrollPos - cardWidth;
        if (newPos < 0) newPos = 0;
      } else {
        newPos = scrollPos + cardWidth;
        if (newPos > maxScroll) newPos = maxScroll;
      }
      setScrollPos(newPos);
      gsap.to(sliderRef.current, {
        x: -newPos,
        duration: 0.7,
        ease: 'power3.out',
      });
    },
    [scrollPos, maxScroll]
  );

  return (
    <section className="py-20 px-8 bg-black text-white overflow-hidden">
      {/* Top Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-10 mb-12">
        <div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light leading-[0.95]">
            More than
            <span className="text-primary/35"> protection</span>
            <br />
            <span className="font-extrabold text-white">Your freelance safety net</span>
          </h2>
        </div>
        <div className="w-full lg:w-[320px] text-gray-400 leading-relaxed">
          Real freelancers share how FreelanceGuard saved them from scams, fraud, and untrustworthy clients.
        </div>
      </div>

      {/* Arrow Controls */}
      <div className="flex justify-end gap-4 mb-10">
        <button
          onClick={() => scroll('left')}
          className="w-14 h-14 rounded-full border border-primary text-primary flex items-center justify-center hover:bg-primary/10 transition"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => scroll('right')}
          className="w-14 h-14 rounded-full border border-primary text-primary flex items-center justify-center hover:bg-primary/10 transition"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Cards Wrapper */}
      <div className="overflow-hidden">
        <div ref={sliderRef} className="flex gap-5">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="min-w-[220px] md:min-w-[240px] h-[350px] bg-[#111] border border-primary/20 rounded-2xl p-6 relative flex-shrink-0 transition-all hover:-translate-y-2 hover:border-primary"
            >
              <h3 className="text-2xl font-semibold mb-4">{t.name}</h3>
              {/* Quote – 2 lines only */}
              <p
                className="text-gray-300 text-sm leading-relaxed"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {t.quote}
              </p>
              <div className="absolute right-4 -bottom-1 text-7xl font-bold text-primary/10 select-none">
                {t.id}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}