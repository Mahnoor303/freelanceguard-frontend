import { useState } from 'react';
import { User, Bell, Moon, Globe } from 'lucide-react';
import useDarkMode from '../hooks/useDarkMode';
import toast from 'react-hot-toast';

export default function ProfileSettings() {
  const [dark, setDark] = useDarkMode();
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-heading font-bold">Profile Settings</h1>
      <div className="glass rounded-xl p-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold"><User size={40} /></div>
        <div>
          <h2 className="font-heading font-semibold text-lg">Alex Johnson</h2>
          <p className="text-sm text-gray-500">alex@example.com</p>
          <p className="text-sm text-gray-500">Freelance Niche: Web Developer</p>
        </div>
      </div>

      <div className="glass rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2"><Bell size={18} /> Notifications</span>
          <button onClick={()=>setNotifications(!notifications)} className={`w-12 h-6 rounded-full transition ${notifications?'bg-primary':'bg-gray-300'}`}><span className={`block w-5 h-5 bg-white rounded-full shadow transform transition ${notifications?'translate-x-6':'translate-x-0.5'}`} /></button>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2"><Moon size={18} /> Dark Mode</span>
          <button onClick={()=>setDark(!dark)} className={`w-12 h-6 rounded-full transition ${dark?'bg-primary':'bg-gray-300'}`}><span className={`block w-5 h-5 bg-white rounded-full shadow transform transition ${dark?'translate-x-6':'translate-x-0.5'}`} /></button>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2"><Globe size={18} /> Language</span>
          <select className="border rounded-lg px-3 py-1 dark:bg-dark-card"><option>English</option><option>Hindi</option></select>
        </div>
      </div>

      <button onClick={()=>toast.success('Settings saved (demo)')} className="bg-primary text-white px-6 py-3 rounded-lg font-semibold">Save</button>
    </div>
  );
}