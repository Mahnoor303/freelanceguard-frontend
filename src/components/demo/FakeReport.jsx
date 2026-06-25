import { FileText, Download, Eye } from 'lucide-react';

export default function FakeReport() {
  return (
    <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-light-border dark:border-dark-border max-w-md mx-auto text-center">
      <FileText size={48} className="mx-auto text-primary mb-4" />
      <h3 className="font-heading text-lg font-semibold mb-2">Scan Report</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">FreelanceGuard_Report_2026-06-04.pdf</p>
      <div className="flex gap-3 justify-center">
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition">
          <Eye size={16} /> Preview
        </button>
        <button className="flex items-center gap-2 border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary/5 transition">
          <Download size={16} /> Download
        </button>
      </div>
    </div>
  );
}