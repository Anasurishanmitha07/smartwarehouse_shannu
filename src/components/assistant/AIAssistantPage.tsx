import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { Bot, Send, Sparkles, User, ArrowRight, ShieldCheck } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  intent?: string;
  actionUrl?: string;
  timestamp: string;
}

export const AIAssistantPage: React.FC = () => {
  const { askAssistant } = useAppData();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: "Hello! I am WareSmart Assistant — your AI Warehouse Decision Engine. Ask me anything about orders at risk, stock shortages, priority explanations, or zone bottlenecks.",
      timestamp: '10:00 AM',
    },
  ]);
  const [input, setInput] = useState('');

  const quickPrompts = [
    "Which orders are delayed?",
    "Which products are low in stock?",
    "Why is order #1042 delayed?",
    "Which order should get the remaining stock?",
    "What should I reorder?",
    "Show critical orders.",
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const res = askAssistant(query);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'assistant',
      text: res.answer,
      intent: res.intent,
      actionUrl: res.actionUrl,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-600/30">
          <Bot className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            WareSmart AI Assistant (NLP Engine)
          </h2>
          <p className="text-xs text-slate-400">
            Natural language query understanding, entity extraction, and decision explainability.
          </p>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">Suggested:</span>
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSend(qp)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 text-xs rounded-xl whitespace-nowrap transition"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl min-h-[400px] flex flex-col justify-between space-y-4">
        <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 text-xs ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-xl p-4 rounded-2xl space-y-2 ${
                  m.sender === 'user'
                    ? 'bg-cyan-600 text-white rounded-tr-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                {m.intent && (
                  <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold border-b border-slate-800 pb-1 mb-1">
                    Intent Classified: {m.intent}
                  </div>
                )}
                <p className="leading-relaxed">{m.text}</p>
                <div className="text-[10px] opacity-60 text-right">{m.timestamp}</div>
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Controls */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
          <input
            type="text"
            placeholder="Ask WareSmart Assistant anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={() => handleSend()}
            className="px-5 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-lg shadow-cyan-600/30"
          >
            <Send className="w-4 h-4" /> Send
          </button>
        </div>
      </div>
    </div>
  );
};
