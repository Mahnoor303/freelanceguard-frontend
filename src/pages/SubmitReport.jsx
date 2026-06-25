import { useState } from 'react';
import toast from 'react-hot-toast';

export default function SubmitReport() {
  const [form, setForm] = useState({ name:'', platform:'', description:'' });
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Report submitted (demo)');
  };
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-heading font-bold mb-6">Submit a Scam Report</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required placeholder="Scammer Name" className="w-full p-3 rounded-xl bg-card-bg border border-border" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <select required className="w-full p-3 rounded-xl bg-card-bg border border-border" value={form.platform} onChange={e=>setForm({...form, platform:e.target.value})}>
          <option value="">Select Platform</option>
          <option>Upwork</option><option>Fiverr</option><option>Freelancer</option>
        </select>
        <textarea required placeholder="Description" rows={4} className="w-full p-3 rounded-xl bg-card-bg border border-border" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
        <button type="submit" className="bg-primary text-black font-semibold px-6 py-3 rounded-xl">Submit</button>
      </form>
    </div>
  );
}