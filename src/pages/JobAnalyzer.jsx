import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Save, ArrowRight, Lightbulb, FileSearch, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

  const runScan = async (text) => {
    if (!text || text.trim().length < 5) {
      toast.error('Input text is too short');
      return;
    }
    setStep('analyzing');
    setLoading(true);
    try {
      const data = await api('/scan/job', {
        method: 'POST',
        body: JSON.stringify({ inputText: text }),
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

  useEffect(() => {
    const demoText = sessionStorage.getItem('demoScanText');
    const demoType = sessionStorage.getItem('demoScanType');
    if (demoText && demoType === 'jobPost') {
      setInput(demoText);
      sessionStorage.removeItem('demoScanText');
      sessionStorage.removeItem('demoScanType');
      runScan(demoText);
    }
  }, []);

  const handleAnalyze = () => runScan(input);

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
    <div className="max-w-4xl mx-auto space-y-10 px-4 sm:px-6">
      {/* Animated Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4">
          <Shield size={36} />
        </div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-text-primary">
          Job Post Analyzer
        </h1>
        <p className="text-text-secondary max-w-xl mx-auto text-base md:text-lg">
          Paste any job description to instantly see its risk score, red flags, and AI‑powered safety summary.
        </p>
      </motion.div>

      {/* Quick How‑To Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center"
      >
        {[
          { icon: FileSearch, title: '1. Paste Job Post', desc: 'Copy any job description from Upwork, Fiverr, etc.' },
          { icon: Sparkles, title: '2. AI Analyzes', desc: 'Scans for scams, fake payments, urgency traps.' },
          { icon: Lightbulb, title: '3. Get Insights', desc: 'Risk %, red flags, and expert advice to decide.' },
        ].map((step, i) => (
          <div key={i} className="bg-card-bg border border-border rounded-xl p-5 space-y-3">
            <step.icon className="mx-auto text-primary" size={28} />
            <h3 className="font-semibold text-text-primary">{step.title}</h3>
            <p className="text-text-secondary text-sm">{step.desc}</p>
          </div>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {step === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-card-bg border border-border rounded-2xl p-6 space-y-4">
              <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
                <FileSearch size={18} /> Paste Job Description
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., We are hiring a graphic designer. Must send passport and $50 registration fee..."
                className="w-full h-48 p-4 rounded-xl bg-black border border-gray-700 focus:ring-2 focus:ring-primary outline-none resize-none text-white placeholder-gray-500"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full bg-primary text-black py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-dark transition"
              >
                <Shield size={20} /> Analyze Job
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center"
          >
            <GlassCard className="w-full max-w-md text-center py-10">
              <TypingEffect
                sequence={['Analyzing...', 1500, 'Checking Scam Patterns...', 1500, 'Calculating Risk Score...', 1500]}
                className="text-lg"
              />
            </GlassCard>
          </motion.div>
        )}

        {step === 'result' && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="flex flex-col items-center">
              <RiskMeter score={result.riskScore} />
              <p className={`mt-3 text-lg font-semibold ${
                result.riskLevel === 'danger' ? 'text-red-400' : result.riskLevel === 'caution' ? 'text-yellow-400' : 'text-green-400'
              }`}>
                {result.riskLevel.toUpperCase()}
              </p>
              <p className="text-sm text-text-secondary text-center mt-2 max-w-md">
                {result.riskLevel === 'safe'
                  ? 'This job looks trustworthy! A few minor notes below.'
                  : result.riskLevel === 'caution'
                  ? 'Some caution needed – check the flags below.'
                  : 'High risk – review the red flags carefully.'}
              </p>
            </div>

            {result.redFlags?.length > 0 && (
              <GlassCard>
                <h2 className="font-heading font-semibold mb-3 text-danger flex items-center gap-2">
                  <AlertTriangle size={20} /> Red Flags Found
                </h2>
                <div className="space-y-3">
                  {result.redFlags.map((flag, i) => (
                    <div key={i} className="flex gap-3 p-3 bg-red-900/20 rounded-lg border border-red-800">
                      <AlertTriangle className="text-danger shrink-0 mt-0.5" size={16} />
                      <p className="text-sm text-red-200">{flag}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {result.safeSigns?.length > 0 && (
              <GlassCard>
                <h2 className="font-heading font-semibold mb-3 text-green-400">Safe Signs</h2>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {result.safeSigns.map((sign, i) => (
                    <li key={i}>{sign}</li>
                  ))}
                </ul>
              </GlassCard>
            )}

            <GlassCard>
              <h2 className="font-heading font-semibold mb-2">AI Summary</h2>
              <p className="text-gray-300 leading-relaxed">{result.aiSummary}</p>
            </GlassCard>

            <div className="flex flex-wrap gap-3 items-center justify-center">
              <button
                onClick={() => { setStep('input'); setInput(''); setResult(null); }}
                className="border border-primary text-primary px-6 py-2 rounded-lg hover:bg-primary/5 transition"
              >
                New Scan
              </button>
              <button
                onClick={handleSave}
                className="bg-primary text-black px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark transition"
              >
                <Save size={16} /> Save Report
              </button>
              <ScanPDF scan={result} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}