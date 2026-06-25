export default function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(80)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-primary opacity-30"
          style={{
            width: `${Math.random()*6 + 2}px`,
            height: `${Math.random()*6 + 2}px`,
            left: `${Math.random()*100}%`,
            top: `${Math.random()*100}%`,
            animation: `float ${Math.random()*10 + 10}s infinite ease-in-out`,
            animationDelay: `${Math.random()*5}s`,
          }}
        />
      ))}
    </div>
  );
}