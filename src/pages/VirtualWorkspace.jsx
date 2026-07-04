import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X, Edit3, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VirtualWorkspace() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('workspaceNotes');
    return saved ? JSON.parse(saved) : [];
  });
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', content: '' });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('workspaceNotes', JSON.stringify(notes));
  }, [notes]);

  const resetForm = () => {
    setForm({ title: '', content: '' });
    setEditingId(null);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Both title and content are required.');
      return;
    }

    if (editingId) {
      // Update existing note
      setNotes((prev) =>
        prev.map((note) =>
          note.id === editingId ? { ...note, title: form.title, content: form.content } : note
        )
      );
      toast.success('Note updated!');
    } else {
      // Add new note
      const newNote = {
        id: Date.now(),
        title: form.title,
        content: form.content,
        createdAt: new Date().toISOString(),
      };
      setNotes((prev) => [newNote, ...prev]);
      toast.success('Note saved!');
    }
    resetForm();
  };

  const handleEdit = (note) => {
    setForm({ title: note.title, content: note.content });
    setEditingId(note.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (!confirm('Delete this note?')) return;
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (editingId === id) resetForm();
    toast.success('Note deleted');
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-heading font-bold text-text-primary mb-2 flex items-center justify-center gap-2">
          <BookOpen className="text-primary" size={32} /> Virtual Workspace
        </h1>
        <p className="text-text-secondary">
          Your private notepad for client requirements, ideas, and reminders.
        </p>
      </div>

      {/* Add / Edit Note Form */}
      <div className="bg-card-bg border border-border rounded-2xl p-6 max-w-3xl mx-auto">
        <h2 className="text-lg font-heading font-semibold text-text-primary mb-4 flex items-center gap-2">
          {editingId ? (
            <>
              <Edit3 size={18} className="text-primary" /> Edit Note
            </>
          ) : (
            <>
              <Plus size={18} className="text-primary" /> New Note
            </>
          )}
        </h2>
        <div className="space-y-4">
          <input
            placeholder="Note title"
            className="w-full p-3 rounded-xl bg-bg-secondary border border-border text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            placeholder="Write your note here..."
            rows={5}
            className="w-full p-3 rounded-xl bg-bg-secondary border border-border text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary resize-none"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="bg-primary text-black px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-primary-dark transition"
            >
              <Save size={18} /> {editingId ? 'Update' : 'Save'}
            </button>
            {editingId && (
              <button
                onClick={resetForm}
                className="border border-border text-text-primary px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-bg-secondary transition"
              >
                <X size={18} /> Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {notes.length === 0 ? (
          <div className="col-span-full text-center py-12 text-text-secondary">
            <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
            <p>No notes yet. Create your first note above.</p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="bg-card-bg border border-border rounded-2xl p-5 flex flex-col justify-between hover:border-primary/30 transition-all group"
            >
              <div>
                <h3 className="font-semibold text-text-primary mb-2">{note.title}</h3>
                <p className="text-sm text-text-secondary mb-3 whitespace-pre-wrap">
                  {note.content.length > 150
                    ? note.content.substring(0, 150) + '...'
                    : note.content}
                </p>
                <p className="text-xs text-text-secondary mb-4">
                  {new Date(note.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(note)}
                  className="text-text-secondary hover:text-primary transition text-xs flex items-center gap-1"
                >
                  <Edit3 size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="text-text-secondary hover:text-danger transition text-xs flex items-center gap-1"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}