import { useState, useEffect } from 'react';
import {
  Shield, AlertTriangle, Save, Sparkles, MessageSquare, Lightbulb, Zap, ChevronDown, ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RiskMeter from '../components/ui/RiskMeter';
import TypingEffect from '../components/ui/TypingEffect';
import GlassCard from '../components/ui/GlassCard';
import ScanPDF from '../components/ScanPDF';
import { api } from '../api';
import toast from 'react-hot-toast';

export default function MessageScanner() {
  const [input, setInput] = useState('');
  const [step, setStep] = useState('input');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedFlags, setExpandedFlags] = useState({});

  const runScan = async (text) => {
    if (!text || text.trim().length < 5) {
      toast.error('Input text is too short');
      return;
    }
    setStep('analyzing');
    setLoading(true);
    try {
      const data = await api('/scan/message', {
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
    if (demoText && demoType === 'message') {
      setInput(demoText);
      sessionStorage.removeItem('demoScanText');
      sessionStorage.removeItem('demoScanType');
      runScan(demoText);
    }
  }, []);

  const handleScan = () => runScan(input);

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

  const toggleFlag = (idx) => {
    setExpandedFlags(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-30 animate-spin-slow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-20 animate-spin-slow-reverse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/10 rounded-full animate-spin-slow" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center space-y-5"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-primary neon-border">
            <MessageSquare size={42} />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-primary">
            Message Scanner
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            Detect <span className="text-primary font-medium">manipulation</span>, <span className="text-primary font-medium">urgency traps</span>, and <span className="text-primary font-medium">phishing attempts</span> in client messages. Stay safe before you reply.
          </p>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            { icon: MessageSquare, title: '1. Paste Message', desc: 'Copy any client message you received.' },
            { icon: Sparkles, title: '2. AI Scans', desc: 'Checks for manipulation, off‑platform payment, phishing.' },
            { icon: Lightbulb, title: '3. Get Safety Score', desc: 'See risk % and flagged warning signs.' },
          ].map((step, i) => (
            <div
              key={i}
              className="bg-card-bg border border-border hover:border-primary/50 transition-all duration-300 rounded-2xl p-5 space-y-3 hover:shadow-[0_0_15px_rgba(97,255,139,0.1)]"
            >
              <step.icon className="mx-auto text-primary" size={30} />
              <h3 className="font-semibold text-text-primary text-center">{step.title}</h3>
              <p className="text-text-secondary text-sm text-center">{step.desc}</p>
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
              className="bg-card-bg border border-border rounded-2xl p-6 space-y-4 neon-border"
            >
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <MessageSquare size={18} /> Paste Client Message
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., Hi, I have an urgent task for you. Please contact me on WhatsApp. I'll pay you double after the work."
                className="w-full h-48 p-4 rounded-xl bg-black border border-gray-700 focus:ring-2 focus:ring-primary outline-none resize-none text-white placeholder-gray-500"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleScan}
                disabled={loading}
                className="w-full bg-primary text-black py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-dark transition disabled:opacity-70"
              >
                <Zap size={20} /> Scan Message
              </motion.button>
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
                  sequence={['Scanning message...', 1500, 'Checking patterns...', 1500, 'Evaluating risk...', 1500]}
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
                <motion.p
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className={`mt-4 text-2xl font-bold ${
                    result.riskLevel === 'danger' ? 'text-red-400' : result.riskLevel === 'caution' ? 'text-yellow-400' : 'text-green-400'
                  }`}
                >
                  {result.riskLevel.toUpperCase()}
                </motion.p>
                <p className="text-sm text-text-secondary text-center mt-2 max-w-md">
                  {result.riskLevel === 'safe'
                    ? 'This message looks genuine! Minor notes below.'
                    : result.riskLevel === 'caution'
                    ? 'Some caution needed – check the flags below.'
                    : 'High risk – review the red flags carefully.'}
                </p>
              </div>

              {/* Red Flags – Accordion */}
              {result.redFlags?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-danger flex items-center gap-2">
                    <AlertTriangle size={20} /> Red Flags Found
                  </h3>
                  {result.redFlags.map((flag, idx) => (
                    <div key={idx} className="bg-red-900/10 border border-red-800 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleFlag(idx)}
                        className="w-full flex justify-between items-center p-4 hover:bg-red-900/20 transition"
                      >
                        <span className="text-red-200 text-sm">{flag}</span>
                        {expandedFlags[idx] ? <ChevronUp size={16} className="text-red-300" /> : <ChevronDown size={16} className="text-red-300" />}
                      </button>
                      {expandedFlags[idx] && (
                        <div className="p-4 border-t border-red-800 bg-black/50">
                          <p className="text-sm text-gray-400">This issue contributed to the risk score. Be cautious with such messages.</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {result.safeSigns?.length > 0 && (
                <GlassCard>
                  <h3 className="font-heading font-semibold mb-3 text-green-400">Safe Signs</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    {result.safeSigns.map((sign, i) => <li key={i}>{sign}</li>)}
                  </ul>
                </GlassCard>
              )}

              <GlassCard className="border-primary/30 !bg-primary/5">
                <h3 className="font-heading font-semibold mb-2 flex items-center gap-2 text-primary">
                  <Sparkles size={18} /> AI Summary
                </h3>
                <p className="text-gray-200 leading-relaxed">{result.aiSummary}</p>
              </GlassCard>

              <div className="flex flex-wrap gap-3 justify-center">
                <button onClick={() => { setStep('input'); setInput(''); setResult(null); }} className="border border-primary text-primary px-6 py-2 rounded-lg hover:bg-primary/5 transition">New Scan</button>
                <button onClick={handleSave} className="bg-primary text-black px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark transition"><Save size={16} /> Save Report</button>
                <ScanPDF scan={result} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}