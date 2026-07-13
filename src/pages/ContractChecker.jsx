import { useState, useEffect } from 'react';
import {
  FileText, AlertTriangle, Save, Sparkles, Upload, Lightbulb, Zap, ChevronDown, ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RiskMeter from '../components/ui/RiskMeter';
import TypingEffect from '../components/ui/TypingEffect';
import GlassCard from '../components/ui/GlassCard';
import ScanPDF from '../components/ScanPDF';
import { api } from '../api';
import toast from 'react-hot-toast';

export default function ContractChecker() {
  const [input, setInput] = useState('');
  const [step, setStep] = useState('input');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedClauses, setExpandedClauses] = useState({});

  const runScan = async (text) => {
    if (!text || text.trim().length < 5) {
      toast.error('Input text is too short');
      return;
    }
    setStep('analyzing');
    setLoading(true);
    try {
      const data = await api('/scan/contract', {
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
    if (demoText && demoType === 'contract') {
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
        body: JSON.stringify({ scanId: result._id, reportName: 'Contract Check Report' }),
      });
      toast.success('Report saved!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const clauses = [];
  if (result) {
    result.redFlags?.forEach((f, i) => clauses.push({ id: `r${i}`, title: f, type: 'danger', desc: 'This clause was flagged as risky.' }));
    result.safeSigns?.forEach((s, i) => clauses.push({ id: `s${i}`, title: s, type: 'safe', desc: 'This clause appears acceptable.' }));
  }

  const toggleClause = (id) => {
    setExpandedClauses(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-30 animate-spin-slow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-20 animate-spin-slow-reverse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/10 rounded-full animate-spin-slow" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center space-y-5"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-primary neon-border">
            <FileText size={42} />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-primary">
            Contract Checker
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            Review freelance contracts for <span className="text-primary font-medium">hidden fees</span>, <span className="text-primary font-medium">IP theft</span>, <span className="text-primary font-medium">unfair terms</span>, and more. AI breaks down every clause so you can negotiate safely.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            { icon: Upload, title: '1. Upload Contract', desc: 'Paste text or drop a .txt file.' },
            { icon: Sparkles, title: '2. AI Reviews', desc: 'Finds dangerous clauses and unfair terms.' },
            { icon: Lightbulb, title: '3. Get Breakdown', desc: 'See risk %, clause details, and summary.' },
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
                <FileText size={18} /> Paste Contract Text
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your contract clauses here..."
                className="w-full h-48 p-4 rounded-xl bg-black border border-gray-700 focus:ring-2 focus:ring-primary outline-none resize-none text-white placeholder-gray-500"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full bg-primary text-black py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-dark transition disabled:opacity-70"
              >
                <Zap size={20} /> Analyze Contract
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
                  sequence={['Reviewing clauses...', 1500, 'Identifying red flags...', 1500, 'Generating report...', 1500]}
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
                    ? 'This contract looks fair! Minor notes below.'
                    : result.riskLevel === 'caution'
                    ? 'Some caution – check the clauses below.'
                    : 'High risk – review the red flags carefully.'}
                </p>
              </div>

              {/* Clauses Accordion */}
              {clauses.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                    <FileText size={20} /> Clause Details
                  </h3>
                  {clauses.map((clause) => (
                    <div
                      key={clause.id}
                      className={`bg-card-bg border rounded-xl overflow-hidden ${
                        clause.type === 'danger' ? 'border-red-800' : 'border-green-800'
                      }`}
                    >
                      <button
                        onClick={() => toggleClause(clause.id)}
                        className="w-full flex justify-between items-center p-4 hover:bg-bg-secondary transition"
                      >
                        <span className={`text-sm font-medium flex items-center gap-2 ${
                          clause.type === 'danger' ? 'text-red-400' : 'text-green-400'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${
                            clause.type === 'danger' ? 'bg-red-400' : 'bg-green-400'
                          }`} />
                          {clause.title}
                        </span>
                        {expandedClauses[clause.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      {expandedClauses[clause.id] && (
                        <div className="p-4 border-t border-border bg-black/50">
                          <p className="text-sm text-gray-400">{clause.desc}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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