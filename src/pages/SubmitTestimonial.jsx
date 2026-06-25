import { useState } from 'react';
import { api } from '../api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function SubmitTestimonial() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ role: '', quote: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api('/testimonials', {
        method: 'POST',
        body: JSON.stringify({ role: form.role, quote: form.quote }),
      });
      toast.success('Testimonial submitted! It will appear after admin approval.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-heading font-bold mb-6">Submit Testimonial</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required
          placeholder="Your Role (e.g., Graphic Designer)"
          className="w-full p-3 rounded-xl bg-black border border-gray-700"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        />
        <textarea
          required
          placeholder="Your experience with FreelanceGuard..."
          rows={4}
          className="w-full p-3 rounded-xl bg-black border border-gray-700"
          value={form.quote}
          onChange={(e) => setForm({ ...form, quote: e.target.value })}
        />
        <button disabled={loading} type="submit" className="w-full bg-primary text-black font-semibold py-3 rounded-xl">
          {loading ? 'Submitting...' : 'Submit Testimonial'}
        </button>
      </form>
    </div>
  );
}