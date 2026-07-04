import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { api } from '../api';
import toast from 'react-hot-toast';

export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your freelance safety assistant. Ask me anything about scams, freelancing, or how to use FreelanceGuard.",
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

    // Add user message
    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const data = await api('/chat', {
        method: 'POST',
        body: JSON.stringify({ message: text }),
      });
      // Add assistant reply
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      toast.error(err.message || 'Failed to get response');
      // Still add a fallback message
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "I'm sorry, I couldn't process that. Please try again." },
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
    <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <h1 className="text-2xl font-heading font-bold text-text-primary mb-4">AI Chat Assistant</h1>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto bg-card-bg border border-border rounded-2xl p-6 space-y-4 mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'
              }`}
            >
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                msg.role === 'user'
                  ? 'bg-primary text-black'
                  : 'bg-bg-secondary text-text-primary border border-border'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 size={16} className="animate-spin text-primary" />
            </div>
            <div className="bg-bg-secondary border border-border rounded-2xl px-4 py-2">
              <p className="text-sm text-text-secondary">Thinking...</p>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about scams, freelancing tips, or how to use FreelanceGuard..."
          rows={2}
          className="flex-1 p-3 rounded-xl bg-card-bg border border-border text-text-primary placeholder:text-text-secondary resize-none focus:outline-none focus:border-primary"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-primary text-black px-5 rounded-xl font-semibold disabled:opacity-50 hover:bg-primary-dark transition flex items-center gap-1"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}