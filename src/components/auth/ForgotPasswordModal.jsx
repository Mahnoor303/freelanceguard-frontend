import { X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPasswordModal({ onClose, switchToLogin }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Reset link sent (demo)');
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-card-bg rounded-2xl p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4"><X /></button>
        <h2 className="text-2xl font-heading font-bold mb-4">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required type="email" placeholder="Email" className="w-full p-3 rounded-xl bg-bg-primary border border-border" />
          <button type="submit" className="w-full bg-primary text-black font-semibold py-3 rounded-xl">Send Reset Link</button>
        </form>
        <p className="mt-4 text-sm text-center"><button onClick={switchToLogin} className="text-primary">Back to Login</button></p>
      </div>
    </div>
  );
}