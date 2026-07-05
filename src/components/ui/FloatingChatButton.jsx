import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { api } from '../../api';
import toast from 'react-hot-toast';

export default function FloatingChatButton() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your freelance safety assistant. Ask me anything.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
  const text = input.trim();
  if (!text || loading) return;

  const userMsg = { role: 'user', content: text };
  setMessages((prev) => [...prev, userMsg]);
  setInput('');
  setLoading(true);

  try {
    // Try real API first
    const data = await api('/chat', {
      method: 'POST',
      body: JSON.stringify({ message: text }),
    });
    setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
  } catch (err) {
    console.error('Chat error:', err);
    // Fallback dummy reply
    const dummyReply = getDummyReply(text);
    setMessages((prev) => [...prev, { role: 'assistant', content: dummyReply }]);
  } finally {
    setLoading(false);
  }
};

// Smart dummy reply function (add this OUTSIDE the component, at the bottom of the file)
function getDummyReply(message) {
  const lower = message.toLowerCase();

  if (lower.includes('scam') || lower.includes('fraud')) {
    return 'Common freelance scams include: fake job posts asking for upfront payment, clients who disappear after work is delivered, and phishing messages that steal your login credentials. Always use the Job Analyzer and Message Scanner to check for red flags.';
  }
  if (lower.includes('payment') || lower.includes('pay')) {
    return 'Never pay to get a job. Legitimate clients will pay you, not the other way around. Use milestone payments on trusted platforms and check contracts with our Contract Checker.';
  }
  if (lower.includes('contract') || lower.includes('agreement')) {
    return 'Always sign a contract before starting work. Download free templates from our Contract Library and use the Contract Checker to spot dangerous clauses.';
  }
  if (lower.includes('profile') || lower.includes('portfolio')) {
    return 'Build a strong profile by showcasing your best work. Use our Portfolio Builder to create a professional gallery, and keep your skills updated.';
  }
  if (lower.includes('rate') || lower.includes('charge') || lower.includes('price')) {
    return 'Use our Rate Calculator to find out how much you should charge based on your skills and experience. It also gives tips on which skills to improve.';
  }
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return "Hello! I'm your freelance safety assistant. You can ask me about scams, contracts, payments, or how to use any feature of FreelanceGuard.";
  }

  return "I'm here to help with freelance safety questions. You can ask about scams, contracts, payments, rates, or how to use FreelanceGuard's tools.";
}

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-[9999] bg-primary text-black w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Popup */}
      {open && (
        <div className="fixed bottom-20 right-6 z-[9998] w-80 sm:w-96 h-96 bg-card-bg border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-black px-4 py-3 font-semibold flex items-center justify-between">
            <span className="flex items-center gap-2"><Bot size={18} /> AI Assistant</span>
            <button onClick={() => setOpen(false)}><X size={18} /></button>
          </div>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'}`}>
                  {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-3 py-1.5 text-sm ${msg.role === 'user' ? 'bg-primary text-black' : 'bg-bg-secondary text-text-primary border border-border'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Loader2 size={12} className="animate-spin text-primary" />
                </div>
                <div className="bg-bg-secondary border border-border rounded-2xl px-3 py-1.5 text-sm text-text-secondary">Thinking…</div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          {/* Input */}
          <div className="p-3 border-t border-border flex gap-2">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask something..."
              className="flex-1 p-2 rounded-xl bg-bg-secondary border border-border text-text-primary text-sm resize-none focus:outline-none focus:border-primary"
            />
            <button onClick={handleSend} disabled={loading || !input.trim()} className="bg-primary text-black px-3 rounded-xl text-sm font-semibold disabled:opacity-50">
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}