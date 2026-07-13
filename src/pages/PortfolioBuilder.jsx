import { useState } from 'react';
import { Shield, Loader, ExternalLink } from 'lucide-react';
import { api } from '../api';
import toast from 'react-hot-toast';

export default function PortfolioAnalyzer() {
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = async () => {
    if (!portfolioUrl.trim()) {
      toast.error('Please enter your portfolio URL');
      return;
    }

    setLoading(true);
    setAnalysis(null);
    try {
      // Get rate calculator data from localStorage
      const savedSkills = localStorage.getItem('selectedSkills') || '[]';
      const savedRate = localStorage.getItem('calculatedRate') || '0';

      const response = await api('/portfolio/analyze', {
        method: 'POST',
        body: JSON.stringify({
          url: portfolioUrl,
          skills: JSON.parse(savedSkills),
          targetRate: parseFloat(savedRate)
        }),
      });
      setAnalysis(response.analysis);
      toast.success('Portfolio analyzed!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
          Portfolio Analyzer
        </h1>
        <p className="text-text-secondary">
          Paste your portfolio URL to get AI‑powered suggestions based on your target rate.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-card-bg border border-border rounded-2xl p-6 space-y-4">
        <label className="text-sm text-text-secondary">Your Portfolio URL</label>
        <input
          type="url"
          placeholder="https://yourportfolio.com"
          className="w-full p-3 rounded-xl bg-bg-secondary border border-border text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary"
          value={portfolioUrl}
          onChange={(e) => setPortfolioUrl(e.target.value)}
        />
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full bg-primary text-black py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-dark transition disabled:opacity-70"
        >
          {loading ? (
            <Loader className="animate-spin" size={20} />
          ) : (
            <Shield size={20} />
          )}
          {loading ? 'Analyzing...' : 'Analyze Portfolio'}
        </button>
      </div>

      {/* Analysis Result */}
      {analysis && (
        <div className="bg-card-bg border border-primary/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(97,255,139,0.1)]">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="text-primary" size={24} />
            <h2 className="text-xl font-heading font-bold text-primary">AI Analysis</h2>
          </div>
          <div className="prose prose-invert max-w-none text-text-secondary whitespace-pre-wrap">
            {analysis}
          </div>
          <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
            <span className="text-xs text-text-secondary">
              Based on your target rate & skills from Rate Calculator
            </span>
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-sm flex items-center gap-1 hover:underline"
            >
              Open Portfolio <ExternalLink size={14} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}