import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import toast from 'react-hot-toast';

export default function FakePayment() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        cardNumber: '4242424242424242',
        expiry: '12/28',
        cvv: '123',
        cardHolder: 'John Doe',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');

    const validate = () => {
        const newErrors = {};
        if (!form.cardHolder.trim()) newErrors.cardHolder = 'Card holder name is required';
        if (form.cardNumber.replace(/\s/g, '').length < 16) newErrors.cardNumber = 'Enter a valid 16‑digit card number';
        if (!/^\d{2}\/\d{2}$/.test(form.expiry)) newErrors.expiry = 'Use MM/YY format';
        if (form.cvv.length < 3) newErrors.cvv = 'CVV must be at least 3 digits';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');

        if (!user) {
            toast.error('Please login first');
            navigate('/?login=true');
            return;
        }
        if (!validate()) {
            toast.error('Please fix the errors below');
            return;
        }

        setLoading(true);
        try {
            await api('/subscription/confirm-payment', {
                method: 'POST',
                body: JSON.stringify({ plan: 'pro' }),
            });
            toast.success('Payment successful! Upgraded to Pro.');
            navigate('/dashboard');
        } catch (err) {
            setServerError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCardNumberChange = (e) => {
        const raw = e.target.value.replace(/\s/g, '').replace(/\D/g, '').slice(0, 16);
        setForm({ ...form, cardNumber: raw });
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="bg-[#0b0b0b] border border-gray-800 rounded-3xl p-8 w-full max-w-md">
                <h1 className="text-2xl font-heading font-bold text-white mb-2">Upgrade to Pro</h1>
                <p className="text-gray-400 mb-6">Enter your card details to complete the upgrade.</p>
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
                    <h3 className="text-primary font-semibold mb-2">Pro Plan Benefits</h3>
                    <ul className="text-sm text-gray-300 space-y-1">
                        <li>✅ Unlimited Scans</li>
                        <li>✅ Advanced Reports</li>
                        <li>✅ PDF Export</li>
                        <li>✅ Priority AI Analysis</li>
                        <li>✅ 30‑day access, auto‑renewed (simulated)</li>
                    </ul>
                    <p className="text-xs text-gray-500 mt-2">$19/month – Simulated payment</p>
                </div>
                {serverError && (
                    <div className="bg-red-900/20 border border-red-500 rounded-xl p-3 mb-4">
                        <p className="text-red-400 text-sm">{serverError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-400 block mb-1">Card Holder Name</label>
                        <input
                            placeholder="John Doe"
                            className={`w-full p-3 rounded-xl bg-black border ${errors.cardHolder ? 'border-red-500' : 'border-gray-700'} text-white`}
                            value={form.cardHolder}
                            onChange={(e) => setForm({ ...form, cardHolder: e.target.value })}
                        />
                        {errors.cardHolder && <p className="text-red-400 text-xs mt-1">{errors.cardHolder}</p>}
                    </div>

                    <div>
                        <label className="text-sm text-gray-400 block mb-1">Card Number</label>
                        <input
                            placeholder="4242 4242 4242 4242"
                            maxLength={19}
                            className={`w-full p-3 rounded-xl bg-black border ${errors.cardNumber ? 'border-red-500' : 'border-gray-700'} text-white`}
                            value={form.cardNumber.replace(/(.{4})/g, '$1 ').trim()}
                            onChange={handleCardNumberChange}
                        />
                        {errors.cardNumber && <p className="text-red-400 text-xs mt-1">{errors.cardNumber}</p>}
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-sm text-gray-400 block mb-1">Expiry</label>
                            <input
                                placeholder="MM/YY"
                                maxLength={5}
                                className={`w-full p-3 rounded-xl bg-black border ${errors.expiry ? 'border-red-500' : 'border-gray-700'} text-white`}
                                value={form.expiry}
                                onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                            />
                            {errors.expiry && <p className="text-red-400 text-xs mt-1">{errors.expiry}</p>}
                        </div>
                        <div className="flex-1">
                            <label className="text-sm text-gray-400 block mb-1">CVV</label>
                            <input
                                placeholder="123"
                                maxLength={4}
                                type="password"
                                className={`w-full p-3 rounded-xl bg-black border ${errors.cvv ? 'border-red-500' : 'border-gray-700'} text-white`}
                                value={form.cvv}
                                onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                            />
                            {errors.cvv && <p className="text-red-400 text-xs mt-1">{errors.cvv}</p>}
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-primary text-black font-bold py-4 rounded-full text-lg hover:-translate-y-1 transition disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Pay $19 – Upgrade to Pro'}
                    </button>
                </form>

                <p className="text-xs text-gray-500 mt-4 text-center">
                    This is a simulated payment page. No real transaction will occur.
                </p>
            </div>
        </div>
    );
}