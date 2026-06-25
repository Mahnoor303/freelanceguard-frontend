import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function RiskMeter({ score }) {
  const color = score > 70 ? '#EF4444' : score > 40 ? '#F59E0B' : '#10B981';

  return (
    <div className="w-48 h-48 mx-auto">
      <CircularProgressbar
        value={score}
        text={`${score}%`}
        styles={buildStyles({
          textSize: '16px',
          pathColor: color,
          textColor: color,
          trailColor: '#E2E8F0',
          backgroundColor: '#3e98c7',
        })}
      />
    </div>
  );
}