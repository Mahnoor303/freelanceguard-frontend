import { useState, useEffect } from 'react';
import { Upload, FileText, AlertTriangle, Save, CheckCircle } from 'lucide-react';
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
  const [activeClause, setActiveClause] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const ALLOWED_EXTENSIONS = ['.txt', '.md', '.json', '.xml'];

  const isValidTextFile = (file) => {
    if (file.type === 'text/html') return false;
    const name = file.name.toLowerCase();
    return ALLOWED_EXTENSIONS.some(ext => name.endsWith(ext));
  };

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

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!isValidTextFile(file)) {
      toast.error('Only text files (.txt, .md, .json, .xml) are allowed. HTML files are not supported.');
      return;
    }

    try {
      const text = await readFileAsText(file);
      setInput(text);
      toast.success(`File "${file.name}" loaded`);
    } catch (err) {
      toast.error('Could not read file');
    }
  };

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject();
      reader.readAsText(file);
    });
  };

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
    result.redFlags?.forEach((f, i) => clauses.push({ id: `r${i}`, title: f, status: 'danger', desc: 'This clause was flagged as risky.' }));
    result.safeSigns?.forEach((s, i) => clauses.push({ id: `s${i}`, title: s, status: 'safe', desc: 'This clause appears acceptable.' }));
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-heading font-bold">Contract Checker</h1>

      {step === 'input' && (
        <>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-10 text-center mb-4 transition-colors ${
              dragOver ? 'border-primary bg-primary/5' : 'border-gray-700'
            }`}
          >
            <Upload size={40} className="mx-auto text-gray-400" />
            <p className="mt-2 text-gray-500">Drop a text file (.txt, .md) or paste below</p>
            <p className="text-xs text-gray-600 mt-1">HTML and other formats are not supported</p>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste Contract Text..."
            className="w-full h-32 p-4 rounded-xl bg-black border border-gray-700 focus:ring-2 focus:ring-primary outline-none resize-none"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-primary text-black px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
          >
            <FileText size={18} /> Analyze Contract
          </button>
        </>
      )}

      {step === 'analyzing' && (
        <GlassCard className="text-center py-8">
          <TypingEffect
            sequence={['Reviewing clauses...', 1500, 'Identifying red flags...', 1500, 'Generating report...', 1500]}
            className="text-lg"
          />
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
            <p className="text-sm text-text-secondary text-center mt-2 max-w-md">
              {result.riskLevel === 'safe'
                ? 'This contract looks fair! Minor notes below.'
                : result.riskLevel === 'caution'
                ? 'Some caution – check the clauses below.'
                : 'High risk – review the red flags carefully.'}
            </p>
            {result.redFlags?.length > 0 && (
              <p className="text-xs text-text-secondary mt-1">
                These issues contributed to the risk score.
              </p>
            )}
          </div>

          <GlassCard>
            <h2 className="font-heading font-semibold mb-2">AI Summary</h2>
            <p className="text-gray-300">{result.aiSummary}</p>
          </GlassCard>

          {clauses.length > 0 && (
            <div className="space-y-4">
              {clauses.map((clause) => (
                <div key={clause.id} className="border border-gray-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setActiveClause(activeClause === clause.id ? null : clause.id)}
                    className="w-full flex justify-between items-center p-4 bg-gray-900 hover:bg-gray-800"
                  >
                    <span className="font-medium flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${clause.status === 'danger' ? 'bg-red-400' : 'bg-green-400'}`} />
                      {clause.title}
                    </span>
                    <FileText size={18} />
                  </button>
                  {activeClause === clause.id && (
                    <div className="p-4 bg-black border-t border-gray-800">
                      <p className="text-sm text-gray-300">{clause.desc}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3 items-center">
            <button onClick={() => { setStep('input'); setInput(''); setResult(null); }} className="border border-primary text-primary px-6 py-2 rounded-lg">New Scan</button>
            <button onClick={handleSave} className="bg-primary text-black px-6 py-2 rounded-lg flex items-center gap-2"><Save size={16} /> Save Report</button>
            <ScanPDF scan={result} />
          </div>
        </div>
      )}
    </div>
  );
}