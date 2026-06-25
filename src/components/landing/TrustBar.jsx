import { useTranslation } from 'react-i18next';

export default function TrustBar() {
  const { t } = useTranslation();   // ✅ inside the component

  const platforms = ['Fiverr', 'LinkedIn', 'Freelancer', 'PeoplePerHour', 'Upwork'];
  const allItems = [...platforms, ...platforms];

  return (
    <div className="w-full overflow-hidden py-8 border-t border-b border-white/10 bg-black">
      <div className="flex gap-14 md:gap-20 w-max animate-[scroll_18s_linear_infinite]">
        {allItems.map((platform, idx) => (
          <div key={idx} className="flex items-center gap-14 md:gap-20">
            <span className="text-lg md:text-2xl font-semibold text-white whitespace-nowrap tracking-wide">
              {platform}
            </span>
            <span className="text-primary text-2xl font-bold">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}