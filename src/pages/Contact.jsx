import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Mail, MapPin, Phone } from 'lucide-react';
import Footer from '../components/layout/Footer';
import toast from 'react-hot-toast';

export default function Contact({ dark, setDark }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent (demo)');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto flex justify-between items-center px-6 h-16">
          <span
            onClick={() => navigate('/')}
            className="cursor-pointer font-heading font-bold text-2xl text-primary"
          >
            🛡️ FreelanceGuard
          </span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDark(!dark)}
              className="p-2 rounded-full hover:bg-primary/10"
            >
              {dark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Contact Form & Info */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl w-full">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="glass rounded-2xl p-8 space-y-5"
          >
            <h1 className="text-3xl font-heading font-bold">Contact Us</h1>
            <p className="text-text-secondary text-sm">
              Have a question or feedback? We’d love to hear from you.
            </p>
            <input
              required
              placeholder="Your name"
              className="w-full p-3 rounded-xl bg-card-bg border border-border"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              required
              type="email"
              placeholder="you@example.com"
              className="w-full p-3 rounded-xl bg-card-bg border border-border"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <textarea
              required
              placeholder="Your message"
              rows={5}
              className="w-full p-3 rounded-xl bg-card-bg border border-border resize-none"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            <button
              type="submit"
              className="w-full bg-primary text-black font-semibold py-3 rounded-xl neon-glow hover:scale-105 transition"
            >
              Send Message
            </button>
          </form>

          {/* Contact Info */}
          <div className="space-y-6 flex flex-col justify-center">
            <div className="flex items-start gap-3">
              <Mail size={20} className="text-primary mt-1" />
              <div>
                <h4 className="font-semibold">Email</h4>
                <p className="text-text-secondary text-sm">support@freelanceguard.io</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-primary mt-1" />
              <div>
                <h4 className="font-semibold">Office</h4>
                <p className="text-text-secondary text-sm">Remote – Worldwide</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={20} className="text-primary mt-1" />
              <div>
                <h4 className="font-semibold">Phone</h4>
                <p className="text-text-secondary text-sm">+1 (555) 000-0000</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}