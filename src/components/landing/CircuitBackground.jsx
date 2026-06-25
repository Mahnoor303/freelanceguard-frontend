export default function CircuitBackground() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--color-primary)" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Circuit lines */}
      {[...Array(8)].map((_, i) => (
        <path
          key={i}
          d={`M${Math.random()*100} ${Math.random()*100} L${Math.random()*100} ${Math.random()*100} L${Math.random()*100} ${Math.random()*100}`}
          stroke="url(#lineGrad)"
          strokeWidth="0.5"
          fill="none"
          strokeDasharray="2 4"
          style={{ animation: `circuit-move ${5 + i * 2}s linear infinite` }}
        />
      ))}
      {/* Glowing nodes */}
      {[...Array(20)].map((_, i) => (
        <circle
          key={`n${i}`}
          cx={Math.random() * 100}
          cy={Math.random() * 100}
          r="0.8"
          fill="var(--color-primary)"
          className="neon-glow"
        />
      ))}
    </svg>
  );
}