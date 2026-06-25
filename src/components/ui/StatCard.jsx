import AnimatedCounter from './AnimatedCounter';

const iconBgMap = {
  primary: 'bg-primary/10 text-primary',
  danger: 'bg-red-500/10 text-red-400',
  success: 'bg-green-500/10 text-green-400',
  warning: 'bg-yellow-500/10 text-yellow-400',
};

const borderGlowMap = {
  primary: 'hover:border-primary/40 hover:shadow-primary/10',
  danger: 'hover:border-red-500/40 hover:shadow-red-500/10',
  success: 'hover:border-green-500/40 hover:shadow-green-500/10',
  warning: 'hover:border-yellow-500/40 hover:shadow-yellow-500/10',
};

export default function StatCard({ icon: Icon, value, suffix, label, color = 'primary' }) {
  return (
    <div
      className={`
        relative group bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl p-5
        transition-all duration-300 hover:-translate-y-1 hover:border-white/20
        ${borderGlowMap[color] || borderGlowMap.primary}
      `}
    >
      {/* Subtle top gradient line */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 h-1 w-1/2 rounded-full bg-gradient-to-r from-transparent via-current to-transparent opacity-50 group-hover:opacity-100 transition-opacity ${
        color === 'danger' ? 'text-red-400' :
        color === 'success' ? 'text-green-400' :
        color === 'warning' ? 'text-yellow-400' :
        'text-primary'
      }`} />

      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2.5 rounded-xl ${iconBgMap[color] || iconBgMap.primary}`}>
          <Icon size={22} />
        </div>
        <h3 className="text-sm font-medium text-gray-400">{label}</h3>
      </div>

      <div className="text-3xl font-bold font-heading">
        <AnimatedCounter value={value} suffix={suffix || ''} />
      </div>
    </div>
  );
}