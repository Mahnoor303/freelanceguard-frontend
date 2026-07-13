import { useState, useEffect } from 'react';
import {
  Search, AlertTriangle, Save, Sparkles, Building2, Lightbulb, Zap, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RiskMeter from '../components/ui/RiskMeter';
import TypingEffect from '../components/ui/TypingEffect';
import GlassCard from '../components/ui/GlassCard';
import ScanPDF from '../components/ScanPDF';
import { api } from '../api';
import toast from 'react-hot-toast';

export default function ClientLookup() {
  const [input, setInput] = useState('');
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runScan = async (text) => {
    if (!text || text.trim().length < 5) {
      toast.error('Input is too short');
      return;
    }
    setLoading(true);
    try {
      const data = await api('/scan/client', {
        method: 'POST',
        body: JSON.stringify({ inputText: text }),
      });
      setResult(data);
      setSearched(true);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const demoText = sessionStorage.getItem('demoScanText');
    const demoType = sessionStorage.getItem('demoScanType');
    if (demoText && demoType === 'client') {
      setInput(demoText);
      sessionStorage.removeItem('demoScanText');
      sessionStorage.removeItem('demoScanType');
      runScan(demoText);
    }
  }, []);

  const handleSearch = () => {
    const text = input.trim();
    if (text.length < 2) {
      toast.error('Input is too short');
      return;
    }
    if (text.length > 100) {
      toast.error('Please enter a company name, email, or domain (max 100 characters)');
      return;
    }
    if (!/[a-zA-Z]/.test(text)) {
      toast.error('Please enter a valid company name, email, or domain');
      return;
    }
    runScan(text);
  };

  const handleSave = async () => {
    if (!result) return;
    try {
      await api('/reports/save', {
        method: 'POST',
        body: JSON.stringify({ scanId: result._id, reportName: 'Client Check Report' }),
      });
      toast.success('Report saved!');
    } catch (err) {
      toast.error(err.message);
    }
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
            <Globe size={42} />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-primary">
            Client Trust Checker
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            Verify a company or client by name, domain, or email. We check <span className="text-primary font-medium">online presence</span>, <span className="text-primary font-medium">reported scams</span>, and <span className="text-primary font-medium">trust signals</span> to give you a clear score.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            { icon: Building2, title: '1. Enter Details', desc: 'Company name, domain, or email.' },
            { icon: Sparkles, title: '2. AI Checks', desc: 'Online presence, scam reports, signals.' },
            { icon: Lightbulb, title: '3. Trust Score', desc: 'See trust % and reasons to trust or avoid.' },
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
          <motion.div
            key="input"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-card-bg border border-border rounded-2xl p-6 space-y-4 neon-border"
          >
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Search size={18} /> Enter Company / Domain / Email
            </div>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., google.com, microsoft, admin@company.com"
              className="w-full p-4 rounded-xl bg-black border border-gray-700 focus:ring-2 focus:ring-primary outline-none text-white placeholder-gray-500"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-primary text-black py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-dark transition disabled:opacity-70"
            >
              <Zap size={20} /> Lookup
            </motion.button>
          </motion.div>

          {searched && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="flex flex-col items-center">
                <RiskMeter score={result.riskScore} />
                <motion.p
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className={`mt-4 text-2xl font-bold ${
                    result.riskLevel === 'safe' ? 'text-green-400' : result.riskLevel === 'danger' ? 'text-red-400' : 'text-yellow-400'
                  }`}
                >
                  {result.riskLevel.toUpperCase()}
                </motion.p>
                <p className="text-sm text-text-secondary text-center mt-2 max-w-md">
                  {result.riskLevel === 'safe'
                    ? 'This client appears trustworthy. Minor notes below.'
                    : result.riskLevel === 'caution'
                    ? 'Some caution – check the flags below.'
                    : 'High risk – review the red flags carefully.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.redFlags?.map((flag, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-red-900/20 rounded-lg border border-red-800">
                    <AlertTriangle className="text-danger shrink-0 mt-0.5" size={18} />
                    <p className="text-sm text-red-200">{flag}</p>
                  </div>
                ))}
                {result.safeSigns?.map((sign, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-green-900/20 rounded-lg border border-green-800">
                    <AlertTriangle className="text-success shrink-0 mt-0.5" size={18} />
                    <p className="text-sm text-green-200">{sign}</p>
                  </div>
                ))}
              </div>

              <GlassCard className="border-primary/30 !bg-primary/5">
                <h3 className="font-heading font-semibold mb-2 flex items-center gap-2 text-primary">
                  <Sparkles size={18} /> AI Summary
                </h3>
                <p className="text-gray-200 leading-relaxed">{result.aiSummary}</p>
              </GlassCard>

              <div className="flex flex-wrap gap-3 justify-center">
                <button onClick={() => { setInput(''); setResult(null); setSearched(false); }} className="border border-primary text-primary px-6 py-2 rounded-lg hover:bg-primary/5 transition">New Lookup</button>
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