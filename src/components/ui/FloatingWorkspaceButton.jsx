import { useState } from 'react';
import { BookOpen, X, Plus, Trash2, Edit3, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FloatingWorkspaceButton() {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('workspaceNotes');
    return saved ? JSON.parse(saved) : [];
  });
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', content: '' });

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
      setNotes((prev) =>
        prev.map((note) =>
          note.id === editingId ? { ...note, title: form.title, content: form.content } : note
        )
      );
      toast.success('Note updated!');
    } else {
      const newNote = { id: Date.now(), title: form.title, content: form.content, createdAt: new Date().toISOString() };
      setNotes((prev) => [newNote, ...prev]);
      toast.success('Note saved!');
    }
    localStorage.setItem('workspaceNotes', JSON.stringify(notes));
    resetForm();
  };

  const handleEdit = (note) => {
    setForm({ title: note.title, content: note.content });
    setEditingId(note.id);
  };

  const handleDelete = (id) => {
    if (!confirm('Delete this note?')) return;
    setNotes((prev) => prev.filter((n) => n.id !== id));
    localStorage.setItem('workspaceNotes', JSON.stringify(notes));
    toast.success('Note deleted');
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-24 z-[9999] bg-primary text-black w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition"
      >
        {open ? <X size={24} /> : <BookOpen size={24} />}
      </button>

      {/* Workspace Popup */}
      {open && (
        <div className="fixed bottom-20 right-24 z-[9998] w-80 sm:w-96 h-96 bg-card-bg border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-black px-4 py-3 font-semibold flex items-center justify-between">
            <span className="flex items-center gap-2"><BookOpen size={18} /> Quick Notes</span>
            <button onClick={() => setOpen(false)}><X size={18} /></button>
          </div>
          {/* Note list / form */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Form */}
            <div className="bg-bg-secondary rounded-xl p-3 space-y-2">
              <input
                placeholder="Title"
                className="w-full p-2 rounded-lg bg-bg-secondary border border-border text-text-primary text-sm focus:outline-none focus:border-primary"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <textarea
                placeholder="Content"
                rows={2}
                className="w-full p-2 rounded-lg bg-bg-secondary border border-border text-text-primary text-sm resize-none focus:outline-none focus:border-primary"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
              <div className="flex gap-2">
                <button onClick={handleSave} className="bg-primary text-black px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                  <Save size={12} /> {editingId ? 'Update' : 'Save'}
                </button>
                {editingId && (
                  <button onClick={resetForm} className="border border-border text-text-primary px-3 py-1 rounded-lg text-xs">
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Notes List */}
            {notes.length === 0 ? (
              <p className="text-center text-text-secondary text-sm py-4">No notes yet. Create one above.</p>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="bg-bg-secondary border border-border rounded-xl p-3 text-sm">
                  <h4 className="font-medium text-text-primary">{note.title}</h4>
                  <p className="text-text-secondary text-xs mt-1">{note.content}</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => handleEdit(note)} className="text-text-secondary hover:text-primary text-xs flex items-center gap-1">
                      <Edit3 size={12} /> Edit
                    </button>
                    <button onClick={() => handleDelete(note.id)} className="text-text-secondary hover:text-danger text-xs flex items-center gap-1">
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}