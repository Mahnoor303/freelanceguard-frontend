export default function TestimonialCard({ name, role, quote, avatar }) {
  return (
    <div className="glass rounded-xl p-6 text-center">
      <img src={avatar} alt={name} className="w-16 h-16 rounded-full mx-auto mb-4 object-cover" />
      <p className="text-gray-700 dark:text-gray-300 italic mb-3">"{quote}"</p>
      <h4 className="font-heading font-semibold">{name}</h4>
      <span className="text-sm text-gray-500">{role}</span>
    </div>
  );
}