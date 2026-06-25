import { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import i18n from '../../i18n';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'ur', label: 'اردو' },
  { code: 'it', label: 'Italiano' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'ar', label: 'العربية' },
  { code: 'ru', label: 'Русский' },
];

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('language', code);
    setCurrentLang(code);
    setOpen(false);
  };

  const currentLabel = languages.find(l => l.code === currentLang)?.label || 'English';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-sm px-2 py-1 rounded hover:bg-gray-800 transition"
      >
        <Globe size={16} />
        {currentLabel}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-[#0a0a0a] border border-gray-700 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-800 transition ${
                currentLang === lang.code ? 'text-primary font-semibold' : 'text-gray-300'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}