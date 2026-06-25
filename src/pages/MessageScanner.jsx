import { useState } from 'react';
import { Shield, AlertTriangle, Save } from 'lucide-react';
import RiskMeter from '../components/ui/RiskMeter';
import TypingEffect from '../components/ui/TypingEffect';
import GlassCard from '../components/ui/GlassCard';
import { api } from '../api';
import toast from 'react-hot-toast';

export default function MessageScanner() {
  const [input, setInput] = useState('');
  const [step, setStep] = useState('input');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!input.trim()) return;
    setStep('analyzing');
    setLoading(true);
    try {
      const data = await api('/scan/message', {
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
        body: JSON.stringify({ scanId: result._id, reportName: 'Message Scan Report' }),
      });
      toast.success('Report saved!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-heading font-bold">Message Scanner</h1>

      {step === 'input' && (
        <>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste Client Message..."
            className="w-full h-32 p-4 rounded-xl bg-black border border-gray-700 focus:ring-2 focus:ring-primary outline-none resize-none"
          />
          <button onClick={handleScan} disabled={loading} className="bg-primary text-black px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
            <Shield size={18} /> Scan Message
          </button>
        </>
      )}

      {step === 'analyzing' && (
        <GlassCard className="text-center py-8">
          <TypingEffect sequence={['Scanning message...', 1500, 'Checking patterns...', 1500, 'Evaluating risk...', 1500]} className="text-lg" />
        </GlassCard>
      )}

      {step === 'result' && result && (
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <RiskMeter score={result.riskScore} />
            <p className={`mt-2 text-lg font-semibold ${
              result.riskLevel === 'danger' ? 'text-red-400' : result.riskLevel === 'caution' ? 'text-yellow-400' : 'text-green-400'
            }`}>
              {result.riskLevel.toUpperCase()}
            </p>
          </div>

          {result.redFlags?.length > 0 && (
            <div className="space-y-4">
              {result.redFlags.map((flag, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-danger" />
                    {idx < result.redFlags.length - 1 && <div className="w-0.5 h-full bg-gray-700" />}
                  </div>
                  <GlassCard className="flex-1">
                    <h3 className="font-semibold flex items-center gap-2"><AlertTriangle size={18} className="text-danger" />{flag}</h3>
                  </GlassCard>
                </div>
              ))}
            </div>
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
          </div>
        </div>
      )}
    </div>
  );
}