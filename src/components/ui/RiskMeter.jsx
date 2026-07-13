import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function RiskMeter({ score = 0 }) {
  const risk = Math.min(100, Math.max(0, score));
  const color =
    risk <= 20 ? '#10B981'      // low risk → green
    : risk <= 70 ? '#F59E0B'   // moderate → yellow
    : '#EF4444';               // high risk → red

  return (
    <div className="flex flex-col items-center justify-center w-32 h-32">
      <CircularProgressbar
        value={risk}
        text={`${risk}%`}
        styles={buildStyles({
          textSize: '22px',
          pathColor: color,
          textColor: color,
          trailColor: '#1E293B',
        })}
      />
      <span className="text-xs text-text-secondary mt-1">Risk Score</span>
    </div>
  );
}