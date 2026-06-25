import { Link } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Footer() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    needs: '',
    time: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Demo: Message sent');
  };

  return (
    <footer
      className="relative overflow-hidden text-white py-20 px-[8%] min-h-[750px]"
      style={{
        background:
          'radial-gradient(circle at left, rgba(97,255,139,.1), var(--color-bg-primary) 40%, var(--color-bg-primary) 100%)',
      }}
    >
      {/* Container */}
      <div className="flex flex-col lg:flex-row justify-between gap-20 relative z-10">
        {/* Left – Locations & Email */}
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-8 mb-14">
            <div>
              <h4 className="text-lg font-semibold mb-2">San Francisco, USA</h4>
              <p className="text-gray-400 text-sm leading-relaxed">1 Market Street</p>
              <p className="text-gray-400 text-sm">CA 94105</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Tokyo, Japan</h4>
              <p className="text-gray-400 text-sm leading-relaxed">Shibuya Crossing 21</p>
              <p className="text-gray-400 text-sm">Tokyo 150-0002</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Berlin, Germany</h4>
              <p className="text-gray-400 text-sm leading-relaxed">Cyber District 09</p>
              <p className="text-gray-400 text-sm">Berlin 10999</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Dubai, UAE</h4>
              <p className="text-gray-400 text-sm leading-relaxed">Security Tower</p>
              <p className="text-gray-400 text-sm">Downtown Dubai</p>
            </div>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold leading-tight max-w-2xl">
            hello@
            <br />
            freelenceguard.io
          </h2>
        </div>

        {/* Right – Form */}
        <div className="w-full lg:w-[45%]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <input
                type="text"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-transparent border-b border-white/20 py-3.5 text-white placeholder:text-gray-500 outline-none text-[15px]"
              />
              <input
                type="tel"
                placeholder="Phone number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="bg-transparent border-b border-white/20 py-3.5 text-white placeholder:text-gray-500 outline-none text-[15px]"
              />
            </div>

            <input
              type="text"
              placeholder="Describe your security needs"
              value={form.needs}
              onChange={(e) => setForm({ ...form, needs: e.target.value })}
              className="bg-transparent border-b border-white/20 py-3.5 text-white placeholder:text-gray-500 outline-none text-[15px]"
            />

            <input
              type="text"
              placeholder="Preferred contact time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="bg-transparent border-b border-white/20 py-3.5 text-white placeholder:text-gray-500 outline-none text-[15px]"
            />

            <button
              type="submit"
              className="w-36 h-14 rounded-full bg-white text-black font-bold tracking-[2px] hover:scale-105 transition-transform"
            >
              SEND
            </button>
          </form>
        </div>
      </div>

      {/* Big Background Text */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[18vw] font-black text-white/[.04] tracking-[8px] leading-none select-none whitespace-nowrap z-0">
        FREELANCEGUARD
      </div>

      {/* Bottom Bar */}
      <div className="absolute left-0 bottom-6 w-full px-[3%] flex flex-col sm:flex-row justify-between text-gray-500 text-[13px] z-10 gap-1">
        <p>© {new Date().getFullYear()} FreelanceGuard. All rights reserved.</p>
        <Link to="/privacy" className="hover:text-white transition-colors">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}