import { useState } from 'react';
import { Shield, AlertTriangle, Save } from 'lucide-react';
import RiskMeter from '../components/ui/RiskMeter';
import TypingEffect from '../components/ui/TypingEffect';
import GlassCard from '../components/ui/GlassCard';
import ScanPDF from '../components/ScanPDF';
import { api } from '../api';
import toast from 'react-hot-toast';

export default function JobAnalyzer() {
  const [input, setInput] = useState('');
  const [step, setStep] = useState('input');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setStep('analyzing');
    setLoading(true);
    try {
      const data = await api('/scan/job', {
        method: 'POST',
        body: JSON.stringify({ inputText: input }),
      });
      setResult(data);
      setStep('result');
    } catch (err) {
      toast.error(err.message);
      setStep('input');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    try {
      await api('/reports/save', {
        method: 'POST',
        body: JSON.stringify({ scanId: result._id, reportName: 'Job Analysis Report' }),
      });
      toast.success('Report saved!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-heading font-bold">Job Post Analyzer</h1>

      {step === 'input' && (
        <>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste Job Description Here..."
            className="w-full h-48 p-4 rounded-xl bg-black border border-gray-700 focus:ring-2 focus:ring-primary outline-none resize-none"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-primary text-black px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
          >
            <Shield size={18} /> Analyze Job
          </button>
        </>
      )}

      {step === 'analyzing' && (
        <GlassCard className="text-center py-8">
          <TypingEffect
            sequence={['Analyzing...', 1500, 'Checking Scam Patterns...', 1500, 'Calculating Risk Score...', 1500]}
            className="text-lg"
          />
        </GlassCard>
      )}

      {step === 'result' && result && (
        <div className="space-y-6">
          <RiskMeter score={result.riskScore} />

          {result.redFlags?.length > 0 && (
            <GlassCard>
              <h2 className="font-heading font-semibold mb-3">Red Flags Found</h2>
              <div className="space-y-3">
                {result.redFlags.map((flag, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-red-900/20 rounded-lg border border-red-800">
                    <AlertTriangle className="text-danger shrink-0 mt-0.5" size={20} />
                    <div><h4 className="font-medium">{flag}</h4></div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {result.safeSigns?.length > 0 && (
            <GlassCard>
              <h2 className="font-heading font-semibold mb-3 text-green-400">Safe Signs</h2>
              <ul className="list-disc list-inside text-gray-300">
                {result.safeSigns.map((sign, i) => <li key={i}>{sign}</li>)}
              </ul>
            </GlassCard>
          )}

          <GlassCard>
            <h2 className="font-heading font-semibold mb-2">AI Summary</h2>
            <p className="text-gray-300">{result.aiSummary}</p>
          </GlassCard>

          <div className="flex gap-3">
            <button onClick={() => { setStep('input'); setInput(''); setResult(null); }} className="border border-primary text-primary px-6 py-2 rounded-lg">New Scan</button>
            <button onClick={handleSave} className="bg-primary text-black px-6 py-2 rounded-lg flex items-center gap-2"><Save size={16} /> Save Report</button>
            {result && (
              <span className="inline-flex items-center bg-primary/20 text-primary px-6 py-2 rounded-lg font-semibold">
                <ScanPDF scan={result} />
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}