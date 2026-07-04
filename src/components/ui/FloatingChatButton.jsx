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
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);
    try {
      const data = await api('/chat', {
        method: 'POST',
        body: JSON.stringify({ message: text }),
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      toast.error(err.message || 'Failed to get response');
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I could not process that.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

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