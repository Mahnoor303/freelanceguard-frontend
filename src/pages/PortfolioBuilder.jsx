import { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, Link2, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PortfolioBuilder() {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('portfolioProjects');
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', imageUrl: '' });

  // Save to localStorage whenever projects change
  useEffect(() => {
    localStorage.setItem('portfolioProjects', JSON.stringify(projects));
  }, [projects]);

  const handleAdd = () => {
    if (!form.title || !form.description || !form.imageUrl) {
      toast.error('Please fill all fields');
      return;
    }
    const newProject = { id: Date.now(), ...form };
    setProjects((prev) => [newProject, ...prev]);
    setForm({ title: '', description: '', imageUrl: '' });
    setShowForm(false);
    toast.success('Project added!');
  };

  const handleDelete = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    toast.success('Project deleted');
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
          Portfolio Builder
        </h1>
        <p className="text-text-secondary">
          Showcase your best work to potential clients.
        </p>
      </div>

      {/* Add Project Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-primary-dark transition"
        >
          <Plus size={20} /> Add Project
        </button>
        {projects.length > 0 && (
          <button
            onClick={() => setShowPreview(true)}
            className="ml-4 border border-primary text-primary px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-primary/10 transition"
          >
            <Eye size={20} /> Preview Portfolio
          </button>
        )}
      </div>

      {/* Add Project Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-card-bg border border-border rounded-2xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-text-secondary hover:text-white transition"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-heading font-bold text-text-primary mb-4">New Project</h2>
            <div className="space-y-4">
              <input
                placeholder="Project Title"
                className="w-full p-3 rounded-xl bg-bg-secondary border border-border text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <textarea
                placeholder="Short description"
                rows={3}
                className="w-full p-3 rounded-xl bg-bg-secondary border border-border text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary resize-none"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <input
                placeholder="Image URL (e.g., https://i.imgur.com/abc.png)"
                className="w-full p-3 rounded-xl bg-bg-secondary border border-border text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />
              <button
                onClick={handleAdd}
                className="w-full bg-primary text-black py-3 rounded-xl font-semibold hover:bg-primary-dark transition"
              >
                Add Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-16 text-text-secondary">
          <Upload size={48} className="mx-auto mb-4 opacity-30" />
          <p>No projects yet. Click "Add Project" to start building your portfolio.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-card-bg border border-border rounded-2xl overflow-hidden group hover:border-primary/50 transition-all"
            >
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                }}
              />
              <div className="p-4">
                <h3 className="font-semibold text-text-primary mb-1">{project.title}</h3>
                <p className="text-sm text-text-secondary mb-3">{project.description}</p>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="text-text-secondary hover:text-danger transition flex items-center gap-1 text-sm"
                >
                  <Trash2 size={16} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Portfolio Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[99999] p-4">
          <div className="bg-black w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl p-8 relative">
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/80 transition"
            >
              <X size={24} />
            </button>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-heading font-bold text-primary mb-2">My Portfolio</h1>
              <p className="text-gray-400">A collection of my best freelance projects</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-[#0a0a0a] border border-gray-800 rounded-2xl overflow-hidden"
                >
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-1">{project.title}</h3>
                    <p className="text-sm text-gray-400">{project.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin + '/portfolio-builder');
                  toast.success('Link copied! Share this page with clients.');
                }}
                className="bg-primary text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 mx-auto"
              >
                <Link2 size={18} /> Copy Share Link
              </button>
              <p className="text-xs text-gray-500 mt-2">This preview is a demo of how your portfolio will look.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}