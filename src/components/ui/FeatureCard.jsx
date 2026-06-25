export default function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="glass rounded-xl p-6 flex flex-col items-center text-center hover:scale-105 transition-transform">
      <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
        <Icon size={28} />
      </div>
      <h3 className="text-lg font-semibold font-heading mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
    </div>
  );
}