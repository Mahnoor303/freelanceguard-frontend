import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', toggle);
    return () => window.removeEventListener('scroll', toggle);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    visible && (
      <button
        onClick={scrollTop}
        className="fixed bottom-24 right-8 z-50 bg-primary text-black w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition"
      >
        <ArrowUp size={24} />
      </button>
    )
  );
}