import { useEffect, useState } from 'react';
import { Users, Shield, AlertTriangle, Flag, Download } from 'lucide-react';
import { adminApi } from '../../adminApi';
import { CSVLink } from 'react-csv';
import StatCard from '../../components/ui/StatCard';
import BarChartCard from '../../components/charts/BarChartCard';
import PieChartCard from '../../components/charts/PieChartCard';
import LineChartCard from '../../components/charts/LineChartCard';   // 👈 new component

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [csvData, setCsvData] = useState([]);

  const fetchData = async () => {
    try {
      const statsRes = await adminApi('/dashboard');
      setStats(statsRes);
      const chartsRes = await adminApi('/charts');
      setCharts(chartsRes);

      setCsvData([
        ['Total Users', statsRes.totalUsers],
        ['Total Scans', statsRes.totalScans],
        ['Danger Scans', statsRes.dangerScans],
        ['Community Reports', statsRes.communityReports],
      ]);
    } catch (err) {
      console.error('Failed to fetch admin dashboard data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!stats || !charts) {
    return <div className="text-center py-20 text-text-secondary">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-text-primary">Admin Overview</h1>
        <CSVLink
          data={csvData}
          filename="admin-stats.csv"
          className="bg-primary text-black px-4 py-2 rounded-lg text-sm flex items-center gap-2"
        >
          <Download size={16} /> Export CSV
        </CSVLink>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users} value={stats.totalUsers} label="Total Users" color="primary" />
        <StatCard icon={Shield} value={stats.totalScans} label="Total Scans" color="primary" />
        <StatCard icon={AlertTriangle} value={stats.dangerScans} label="Danger Scans" color="danger" />
        <StatCard icon={Flag} value={stats.communityReports} label="Reports" color="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth – using the reusable LineChartCard */}
        <LineChartCard data={charts.months} />

        {/* Scan Activity – BarChartCard */}
        <BarChartCard data={charts.days} />

        {/* Scam Categories – PieChartCard */}
        <PieChartCard data={charts.scamCategories} />
      </div>
    </div>
  );
}