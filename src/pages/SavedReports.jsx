import { useEffect, useState } from 'react';
import { api } from '../api';
import { FileText, Download, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import ScanPDF from '../components/ScanPDF';

export default function SavedReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewReport, setViewReport] = useState(null); // holds full scan data

  const fetchReports = async () => {
    try {
      const data = await api('/reports'); // populated scanId
      setReports(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const deleteReport = async (id) => {
    if (!confirm('Delete this saved report?')) return;
    try {
      await api(`/reports/${id}`, { method: 'DELETE' });
      setReports((prev) => prev.filter((r) => r._id !== id));
      toast.success('Report deleted');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleView = async (scanId) => {
    try {
      // fetch full scan details
      const scanData = await api(`/scan/${scanId}`); // need a route to get single scan
      setViewReport(scanData);
    } catch (err) {
      toast.error('Could not load scan details');
    }
  };

  // Fake download function – in real app you'd generate PDF
  const handleDownload = (report) => {
    const content = `FreelanceGuard Report\nReport Name: ${report.reportName}\nScan Type: ${report.scanId?.scanType}\nRisk Score: ${report.scanId?.riskScore}%\nDate: ${new Date(report.createdAt).toLocaleDateString()}\nSummary: ${report.scanId?.aiSummary || 'N/A'}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.reportName}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading saved reports...</div>;
  if (error) return <div className="text-center py-20 text-red-400">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">Saved Reports</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {reports.length === 0 ? (
          <p className="text-gray-500 col-span-2">No saved reports yet.</p>
        ) : (
          reports.map((report) => (
            <div key={report._id} className="bg-black border border-gray-800 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="text-primary" />
                <h3 className="font-semibold">{report.reportName}</h3>
              </div>
              <p className="text-sm text-gray-400 mb-3">
                {new Date(report.createdAt).toLocaleDateString()}
              </p>
              <div className="flex gap-3">
                <button onClick={() => handleView(report.scanId?._id || report.scanId)} className="text-sm text-primary flex items-center gap-1">
                  <Eye size={16} /> View
                </button>
                <button onClick={() => handleDownload(report)} className="text-sm text-primary flex items-center gap-1">
                  <Download size={16} /> Download
                </button>
                <button onClick={() => deleteReport(report._id)} className="text-sm text-red-400 flex items-center gap-1">
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Report Modal */}
      {viewReport && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6 w-full max-w-md relative">
            <button onClick={() => setViewReport(null)} className="absolute top-4 right-4 text-gray-400">
              <X size={20} />
            </button>
            <h2 className="text-xl font-heading font-bold mb-4">Report Details</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Type:</strong> {viewReport.scanType}</p>
              <p><strong>Risk Score:</strong> {viewReport.riskScore}%</p>
              <p><strong>Risk Level:</strong> {viewReport.riskLevel}</p>
              <p><strong>Red Flags:</strong> {viewReport.redFlags?.join(', ') || 'None'}</p>
              <p><strong>Safe Signs:</strong> {viewReport.safeSigns?.join(', ') || 'None'}</p>
              <p><strong>Summary:</strong> {viewReport.aiSummary}</p>
            </div>
            {/* 👇 PDF Download link */}
            <div className="mt-4 text-center">
              <ScanPDF scan={viewReport} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}