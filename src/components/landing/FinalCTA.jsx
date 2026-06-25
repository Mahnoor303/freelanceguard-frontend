import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function FinalCTA() {
  const navigate = useNavigate();
  const { user, openLogin } = useAuth();

  const handleClick = () => {
    if (!user) {
      openLogin();
    } else {
      navigate('/job-analyzer');
    }
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-5 py-10 bg-black">
      {/* Heading */}
      <h1 className="leading-[0.88] tracking-[-6px] md:tracking-[-6px]">
        <div className="text-[clamp(70px,10vw,170px)] font-black text-white">
          Stop Guessing.
        </div>
        <div className="text-[clamp(70px,10vw,170px)] font-black text-[#184023]">
          Start Protecting.
        </div>
      </h1>

      {/* Subtitle */}
      <p className="mt-7 text-[22px] text-white/55 font-medium">
        Join FreelanceGuard Today.
      </p>

      {/* Button */}
      <button
        onClick={handleClick}
        className="mt-11 w-[180px] h-[62px] border-none rounded-xl bg-[#57FF84] text-black text-[17px] font-extrabold cursor-pointer transition-all duration-300 shadow-[0_0_15px_rgba(87,255,132,0.7),0_0_35px_rgba(87,255,132,0.35)] hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(87,255,132,0.9),0_0_50px_rgba(87,255,132,0.45)]"
      >
        Get Started
      </button>
    </section>
  );
}