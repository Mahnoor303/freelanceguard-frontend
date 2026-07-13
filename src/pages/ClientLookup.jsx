import { useState, useEffect } from 'react';
import { Search, AlertTriangle, Save, CheckCircle } from 'lucide-react';
import RiskMeter from '../components/ui/RiskMeter';
import { api } from '../api';
import toast from 'react-hot-toast';
import ScanPDF from '../components/ScanPDF';

export default function ClientLookup() {
  const [input, setInput] = useState('');
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runScan = async (text) => {
    if (!text || text.trim().length < 5) {
      toast.error('Input text is too short');
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
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-heading font-bold">Client Trust Checker</h1>

      <div className="flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Company Name / Email / Domain"
          className="flex-1 p-3 rounded-xl bg-black border border-gray-700"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-primary text-black px-6 rounded-xl flex items-center gap-2"
        >
          <Search size={18} /> Lookup
        </button>
      </div>

      {searched && result && (
        <div className="glass rounded-xl p-8 text-center animate-fadeIn">
          <div className="flex flex-col items-center">
            <RiskMeter score={result.riskScore} />
            <p className={`mt-2 text-lg font-semibold ${
              result.riskLevel === 'safe' ? 'text-green-400' : result.riskLevel === 'danger' ? 'text-red-400' : 'text-yellow-400'
            }`}>
              {result.riskLevel.toUpperCase()}
            </p>
            <p className="text-sm text-text-secondary text-center mt-2 max-w-md">
              {result.riskLevel === 'safe'
                ? 'This client appears trustworthy. Minor notes below.'
                : result.riskLevel === 'caution'
                ? 'Some caution – check the flags below.'
                : 'High risk – review the red flags carefully.'}
            </p>
            {result.redFlags?.length > 0 && (
              <p className="text-xs text-text-secondary mt-1">
                These issues contributed to the risk score.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6 text-left">
            {result.safeSigns?.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-green-400">
                <CheckCircle size={16} /> {s}
              </div>
            ))}
            {result.redFlags?.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-red-400">
                <AlertTriangle size={16} /> {f}
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <button onClick={handleSave} className="bg-primary text-black px-6 py-2 rounded-lg flex items-center gap-2">
              <Save size={16} /> Save Report
            </button>
            <ScanPDF scan={result} />
          </div>
        </div>
      )}
    </div>
  );
}