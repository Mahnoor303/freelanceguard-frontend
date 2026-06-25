import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ExperienceSection() {
  const navigate = useNavigate();
  const { user, openLogin } = useAuth();

  const handleGetStarted = () => {
    if (!user) {
      openLogin();
    } else {
      navigate('/job-analyzer');
    }
  };

  return (
    <section className="min-h-screen px-[5%] py-20 flex flex-col lg:flex-row justify-between items-start gap-20 bg-black text-white overflow-hidden">
      {/* ========== LEFT SIDE ========== */}
      <div className="w-full lg:w-[35%] relative min-h-[700px] lg:min-h-[700px]">
        {/* First text block */}
        <p className="max-w-[260px] text-white/55 text-base leading-loose">
          FreelanceGuard uses advanced AI to detect scams, fake clients, and
          fraudulent contracts before you commit — so you never work for free.
        </p>

        {/* Second text block – pushed down on desktop, closer on mobile */}
        <p className="max-w-[260px] text-white/55 text-base leading-loose mt-10 lg:mt-[220px] lg:ml-[220px] lg:mt-[220px]">
          Real‑time analysis, community‑verified scam reports, and a secure
          dashboard keep your freelance career protected every single day.
        </p>

        {/* Button – absolute on desktop, relative on mobile */}
        <div className="lg:absolute left-0 bottom-0 mt-10 lg:mt-0">
          <button
            onClick={handleGetStarted}
            className="flex items-center justify-center w-[190px] h-[62px] rounded-full bg-primary text-black font-bold text-[15px] hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(97,255,139,0.25)] transition-all duration-300"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* ========== RIGHT SIDE – BIG HEADING ========== */}
      <div className="flex-1 flex justify-end">
        <div className="leading-[0.88] tracking-[-5px] md:tracking-[-5px]">
          <div className="text-[clamp(50px,11vw,90px)] md:text-[clamp(80px,8vw,145px)] font-light">
            Trusted by
          </div>
          <div className="text-[clamp(50px,11vw,90px)] md:text-[clamp(80px,8vw,145px)]">
            over <span className="font-black">20,000+</span>
          </div>
          <div className="text-[clamp(50px,11vw,90px)] md:text-[clamp(80px,8vw,145px)]">
            <span className="text-primary/25 font-black">Freelancers</span>
          </div>
          <div className="text-[clamp(50px,11vw,90px)] md:text-[clamp(80px,8vw,145px)] font-light">
            Worldwide
          </div>
        </div>
      </div>
    </section>
  );
}