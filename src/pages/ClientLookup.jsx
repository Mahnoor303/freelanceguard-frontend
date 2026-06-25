import { useState } from 'react';
import { Search, Globe, Building2, Calendar, AlertTriangle, Save } from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { api } from '../api';
import toast from 'react-hot-toast';

export default function ClientLookup() {
  const [input, setInput] = useState('');
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const data = await api('/scan/client', {
        method: 'POST',
        body: JSON.stringify({ inputText: input }),
      });
      setResult(data);
      setSearched(true);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
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

  const trustScore = result?.riskScore || 0;
  const riskLevel = result?.riskLevel || 'caution';

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
        <button onClick={handleSearch} disabled={loading} className="bg-primary text-black px-6 rounded-xl flex items-center gap-2">
          <Search size={18} /> Lookup
        </button>
      </div>

      {searched && result && (
        <div className="glass rounded-xl p-8 text-center animate-fadeIn">
          <div className="w-32 mx-auto mb-4">
            <CircularProgressbar
              value={trustScore}
              text={`${trustScore}%`}
              styles={buildStyles({
                textSize: '20px',
                pathColor: trustScore > 70 ? '#10B981' : trustScore > 40 ? '#F59E0B' : '#EF4444',
                textColor: trustScore > 70 ? '#10B981' : trustScore > 40 ? '#F59E0B' : '#EF4444',
                trailColor: '#1E293B',
              })}
            />
          </div>
          <h2 className="text-xl font-heading font-semibold">Trust Score</h2>
          <p className={`text-sm mt-1 ${riskLevel === 'safe' ? 'text-green-400' : riskLevel === 'danger' ? 'text-red-400' : 'text-yellow-400'}`}>
            {riskLevel.toUpperCase()}
          </p>

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

          <div className="mt-6">
            <button onClick={handleSave} className="bg-primary text-black px-6 py-2 rounded-lg flex items-center gap-2 mx-auto">
              <Save size={16} /> Save Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}