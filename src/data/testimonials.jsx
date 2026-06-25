import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const sliderRef = useRef(null);
  const [scrollPos, setScrollPos] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  // Fetch approved testimonials from backend
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/testimonials/approved`)
      .then(res => res.json())
      .then(data => setTestimonials(data))
      .catch(console.error);
  }, []);

  // Measure slider dimensions once testimonials are loaded
  useEffect(() => {
    if (!sliderRef.current || testimonials.length === 0) return;
    const container = sliderRef.current;
    const updateMax = () => {
      setMaxScroll(container.scrollWidth - container.clientWidth);
    };
    updateMax();
    window.addEventListener('resize', updateMax);
    return () => window.removeEventListener('resize', updateMax);
  }, [testimonials]);

  const cardWidth = 260; // step for scrolling

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

  // Show a placeholder if no testimonials yet
  if (testimonials.length === 0) {
    return (
      <section className="py-20 px-8 bg-black text-white text-center">
        <h2 className="text-3xl font-heading font-bold mb-4">Trusted by Freelancers</h2>
        <p className="text-gray-400">No testimonials yet. Be the first to share your experience!</p>
      </section>
    );
  }

  return (
    <section className="py-20 px-8 bg-black text-white overflow-hidden">
      {/* Top Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-10 mb-12">
        <div className="heading">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light leading-[0.95]">
            More than
            <span className="text-primary/35"> protection</span>
            <br />
            <span className="font-extrabold text-white">Your freelance safety net</span>
          </h2>
        </div>
        <div className="description w-full lg:w-[320px] text-gray-400 leading-relaxed">
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
              key={t._id}
              className="min-w-[220px] md:min-w-[240px] h-[350px] bg-[#111] border border-primary/20 rounded-2xl p-6 relative flex-shrink-0 transition-all hover:-translate-y-2 hover:border-primary"
            >
              <h3 className="text-2xl font-semibold mb-4">{t.name}</h3>
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">{t.quote}</p>
              <div className="absolute right-4 -bottom-1 text-7xl font-bold text-primary/10 select-none">
                {String(testimonials.indexOf(t) + 1).padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}