import { useState } from 'react';
import TypingEffect from '../ui/TypingEffect';
import RiskMeter from '../ui/RiskMeter';

export default function LiveDemo() {
  const [step, setStep] = useState('input');
  const [score] = useState(82);

  const handleAnalyze = () => {
    setStep('analyzing');
    setTimeout(() => setStep('result'), 3000);
  };

  return (
    <section className="bg-bg-secondary py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-heading font-bold text-center mb-12">Live AI Analysis Demo</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <textarea
              placeholder="Paste Job Description..."
              className="w-full h-40 p-4 rounded-xl bg-card-bg border border-border focus:ring-2 focus:ring-primary outline-none resize-none"
              disabled={step !== 'input'}
            />
            {step === 'input' && (
              <button onClick={handleAnalyze} className="mt-4 bg-primary text-black font-semibold px-6 py-3 rounded-lg">
                Analyze Demo
              </button>
            )}
          </div>
          <div>
            {step === 'analyzing' && (
              <div className="p-6 glass rounded-xl">
                <TypingEffect
                  sequence={['Analyzing...', 1500, '✓ Missing Company Details', 1500, '✓ Unrealistic Payment', 1500, '✓ External Communication Request', 1500]}
                  className="text-lg font-mono"
                />
              </div>
            )}
            {step === 'result' && (
              <div className="flex flex-col items-center">
                <RiskMeter score={score} />
                <p className="mt-2 font-mono text-lg text-danger">High Risk</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}