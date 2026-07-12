import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle, CheckCircle, Flag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/ui/StatCard';
import PieChartCard from '../components/charts/PieChartCard';
import BarChartCard from '../components/charts/BarChartCard';
import SubscriptionCard from '../components/ui/SubscriptionCard';
import { api } from '../api';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'https://freelanceguard.alwaysdata.net';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setError(null);
    try {
      const statsData = await api('/dashboard/stats');
      setStats(statsData);
      const scansData = await api('/scan/history');
      setScans(scansData);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const socket = io(SOCKET_URL, {
      transports: ['polling'],
    });
    socket.on('new-scan', () => fetchData());
    return () => socket.disconnect();
  }, []);
  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-400">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-400">
        <div>
          <p className="text-xl font-bold mb-2">Error loading dashboard</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const { totalScans, safeResults, dangerResults, cautionResults } = stats;

  const pieData = [
    { name: 'Safe', value: safeResults, color: '#10B981' },
    { name: 'Caution', value: cautionResults, color: '#F59E0B' },
    { name: 'Danger', value: dangerResults, color: '#EF4444' },
  ];

  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayStr = date.toLocaleDateString('en-US', { weekday: 'short' });
    const count = scans.filter(s => {
      const sDate = new Date(s.createdAt).toLocaleDateString();
      return sDate === date.toLocaleDateString();
    }).length;
    last7Days.push({ day: dayStr, scans: count });
  }

  return (
    <div className="space-y-6">
      {/* ✅ onboarding class */}
      <h1 className="text-2xl font-heading font-bold dashboard-header" data-onboarding="dashboard-header">Dashboard</h1>

      {/* Upgrade Success Marquee */}
      {(user?.plan === 'pro' || user?.plan === 'elite') && (
        <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-lg py-2 overflow-hidden">
          <div className="animate-marquee">
            <span className="text-yellow-400 font-medium mx-4">
              ⭐ Pro Shield Active &nbsp;&nbsp; Thank you for upgrading. Your account is now protected with Pro Shield. &nbsp;&nbsp;
              Unlimited scans, contract analysis, and priority AI support unlocked.⭐ Pro Shield Active &nbsp;&nbsp; Thank you for upgrading. Your account is now protected with Pro Shield. &nbsp;&nbsp;
              Unlimited scans, contract analysis, and priority AI support unlocked.⭐ Pro Shield Active &nbsp;&nbsp; Thank you for upgrading. Your account is now protected with Pro Shield. &nbsp;&nbsp;
              Unlimited scans, contract analysis, and priority AI support unlocked.⭐ Pro Shield Active &nbsp;&nbsp; Thank you for upgrading. Your account is now protected with Pro Shield. &nbsp;&nbsp;
              Unlimited scans, contract analysis, and priority AI support unlocked.⭐ Pro Shield Active &nbsp;&nbsp; Thank you for upgrading. Your account is now protected with Pro Shield. &nbsp;&nbsp;
              Unlimited scans, contract analysis, and priority AI support unlocked.
            </span>
          </div>
        </div>
      )}

      {/* ✅ onboarding class */}
      <div className="upgrade-card" data-onboarding="upgrade-card">
        <SubscriptionCard />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Shield} value={totalScans} label="Total Scans" color="primary" />
        <StatCard icon={AlertTriangle} value={dangerResults} label="Dangerous Results" color="danger" />
        <StatCard icon={CheckCircle} value={safeResults} label="Safe Results" color="success" />
        <StatCard icon={Flag} value={cautionResults} label="Caution" color="warning" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <PieChartCard data={pieData} />
        <BarChartCard data={last7Days} />
      </div>

      {/* Recent Activity Table */}
      <div className="bg-black border border-gray-800 rounded-xl p-5">
        <h2 className="font-semibold mb-4">Recent Activity</h2>
        {scans.length === 0 ? (
          <p className="text-gray-500">No scans yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-gray-400 border-b border-gray-800">
              <tr>
                <th className="text-left py-2">Type</th>
                <th className="text-left py-2">Score</th>
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {scans.slice(0, 5).map((scan) => (
                <tr key={scan._id} className="border-b border-gray-800">
                  <td className="py-2 capitalize">{scan.scanType}</td>
                  <td className="py-2">{scan.riskScore}%</td>
                  <td className="py-2 text-gray-400">
                    {new Date(scan.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${scan.riskLevel === 'danger'
                        ? 'bg-red-900/30 text-red-400'
                        : scan.riskLevel === 'caution'
                          ? 'bg-yellow-900/30 text-yellow-400'
                          : 'bg-green-900/30 text-green-400'
                        }`}
                    >
                      {scan.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ✅ onboarding class */}
      <div className="text-center scan-button" data-onboarding="scan-button">

        <button
          onClick={() => navigate('/job-analyzer')}
          className="bg-primary text-black px-6 py-3 rounded-full font-bold"
        >
          Start Free Scan
        </button>
      </div>
    </div>
  );
}