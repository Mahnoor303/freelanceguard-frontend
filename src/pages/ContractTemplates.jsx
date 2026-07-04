import { useState } from 'react';
import { FileText, Download, Search } from 'lucide-react';

const templates = [
  {
    id: 1,
    title: 'General Freelance Contract',
    description: 'A simple, standard contract suitable for most freelance projects.',
    file: '/templates/general-freelance-contract.pdf',
    category: 'general',
    size: '45 KB',
  },
  {
    id: 2,
    title: 'Graphic Design Contract',
    description: 'Includes IP transfer and revision clauses for designers.',
    file: '/templates/graphic-design-contract.pdf',
    category: 'design',
    size: '52 KB',
  },
  {
    id: 3,
    title: 'Web Development Contract',
    description: 'Covers milestones, testing, and maintenance terms.',
    file: '/templates/web-development-contract.pdf',
    category: 'development',
    size: '48 KB',
  },
  {
    id: 4,
    title: 'Content Writing Contract',
    description: 'Specifies word count, revisions, and copyright ownership.',
    file: '/templates/content-writing-contract.pdf',
    category: 'writing',
    size: '38 KB',
  },
  {
    id: 5,
    title: 'Non‑Disclosure Agreement (NDA)',
    description: 'Protects sensitive information before starting a project.',
    file: '/templates/nda.pdf',
    category: 'legal',
    size: '30 KB',
  },
  {
    id: 6,
    title: 'Social Media Management Contract',
    description: 'Covers posting schedule, content ownership, and analytics.',
    file: '/templates/social-media-contract.pdf',
    category: 'marketing',
    size: '42 KB',
  },
];

const categories = [
  { key: 'all', label: 'All' },
  { key: 'general', label: 'General' },
  { key: 'design', label: 'Design' },
  { key: 'development', label: 'Development' },
  { key: 'writing', label: 'Writing' },
  { key: 'legal', label: 'Legal' },
  { key: 'marketing', label: 'Marketing' },
];

export default function ContractTemplates() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = templates
    .filter((t) => filter === 'all' || t.category === filter)
    .filter(
      (t) =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
          Contract Template Library
        </h1>
        <p className="text-text-secondary">
          Download free, vetted contract templates for your freelance business.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 text-text-secondary" size={18} />
          <input
            placeholder="Search templates..."
            className="pl-10 pr-4 py-2.5 rounded-xl bg-card-bg border border-border text-text-primary w-full placeholder:text-text-secondary focus:outline-none focus:border-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setFilter(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                filter === cat.key
                  ? 'bg-primary text-black'
                  : 'bg-bg-secondary text-text-secondary border border-border hover:bg-primary/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Template Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((template) => (
          <div
            key={template.id}
            className="bg-card-bg border border-border rounded-2xl p-6 flex flex-col justify-between hover:border-primary/50 transition-all group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="text-primary" size={24} />
              </div>
              <h3 className="font-semibold text-text-primary mb-2">{template.title}</h3>
              <p className="text-sm text-text-secondary mb-4">{template.description}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">{template.size}</span>
              <a
                href={template.file}
                download
                className="bg-primary text-black px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-primary-dark transition"
              >
                <Download size={16} /> Download
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder message – replace with real PDFs */}
      <p className="text-center text-xs text-text-secondary mt-8">
        * Placeholder PDFs – replace with real contract templates in the <code>/public/templates</code> folder.
      </p>
    </div>
  );
}