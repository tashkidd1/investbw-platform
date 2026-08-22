import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Shield } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import type { ChatMessage } from '@/types';

const DISCLAIMER = 'I am an educational assistant, not a licensed financial adviser. I cannot recommend specific investments or guarantee returns.';

const SUGGESTIONS = [
  'What is diversification?',
  'Explain ETFs',
  'What are dividends?',
  'How does a P/E ratio work?',
];

function generateResponse(question: string): string {
  const q = question.toLowerCase();
  if (q.includes('diversif')) {
    return 'Diversification means spreading your investments across different assets to reduce risk. Instead of putting all your money into one stock, you invest in multiple stocks across different sectors, or mix stocks with bonds and ETFs. If one investment performs poorly, others may perform well, cushioning your overall portfolio. A well-diversified portfolio might include Botswana equities, global ETFs, bonds, and real estate.';
  }
  if (q.includes('etf')) {
    return 'An ETF (Exchange-Traded Fund) is a collection of investments you can buy as a single unit. Instead of buying individual stocks, an ETF lets you buy a basket of stocks in one purchase. For example, a Botswana Diversified ETF might hold shares in multiple BSE-listed companies. ETFs offer instant diversification and lower costs than buying individual stocks.';
  }
  if (q.includes('dividend')) {
    return 'A dividend is a portion of a company\'s profits paid to shareholders. Not all companies pay dividends — growing companies often reinvest profits instead. But established companies like banks and utility providers typically pay dividends regularly. The dividend yield tells you the annual dividend as a percentage of the share price, making it easy to compare income potential across investments.';
  }
  if (q.includes('p/e') || q.includes('pe ratio') || q.includes('price')) {
    return 'The Price-to-Earnings (P/E) ratio compares a company\'s share price to its earnings per share. A P/E of 15 means investors pay 15 times the company\'s annual earnings for each share. A high P/E might indicate expected growth or overvaluation; a low P/E might suggest a bargain or weak expected performance. Always compare a company\'s P/E to its sector average and historical range.';
  }
  if (q.includes('reit') || q.includes('real estate')) {
    return 'A REIT (Real Estate Investment Trust) is a company that owns income-producing real estate. When you invest in a REIT, you gain exposure to the property market without buying buildings yourself. REITs collect rent and distribute most of it to investors as dividends, making them attractive for income-seeking investors.';
  }
  if (q.includes('bond')) {
    return 'A bond is a loan you make to a government or company. In return, the issuer pays you regular interest and returns your money at a set date. Bonds are generally safer than stocks because their payments are more predictable. Government bonds, like those issued by Botswana, are among the safest investments available.';
  }
  if (q.includes('portfolio')) {
    return 'Your portfolio is the collection of all your investments. A healthy portfolio is typically diversified across different asset types — equities, ETFs, bonds, and cash. You can track your portfolio\'s total value, gains and losses, and how your investments are allocated. The goal is to balance growth potential with risk management.';
  }
  if (q.includes('risk')) {
    return 'Investment risk is the chance that your investments lose value. All investments carry some risk, but the level varies: stocks are generally riskier than bonds, and individual stocks are riskier than diversified ETFs. The key is to match your risk level to your goals and timeline — longer timelines can handle more risk because you have time to recover from downturns.';
  }
  return 'That\'s a great question. In investing, understanding the fundamentals is key. I can explain concepts like diversification, ETFs, dividends, bonds, REITs, P/E ratios, portfolio management, and risk. Try asking about any of these topics, or explore the Learn section for structured articles.';
}

export function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hi! I\'m your Invest Assistant. I can help explain investment concepts in plain language. What would you like to learn about?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const reply: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: generateResponse(content),
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Invest Assistant" subtitle="Educational AI — not financial advice" />

      <Card padding="none" className="flex flex-col h-[calc(100vh-280px)] min-h-[400px]">
        {/* Disclaimer */}
        <div className="flex items-start gap-2 px-4 py-2.5 bg-accent-50 border-b border-accent-100 rounded-t-2xl">
          <Shield size={14} className="text-accent-600 mt-0.5 shrink-0" />
          <p className="text-xs text-accent-700">{DISCLAIMER}</p>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start gap-2 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white shrink-0">
                    <Sparkles size={14} />
                  </div>
                )}
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-brand-600 text-white rounded-tr-sm'
                    : 'bg-neutral-100 text-neutral-800 rounded-tl-sm'
                }`}>
                  {m.content}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                  <Sparkles size={14} />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-neutral-100 rounded-tl-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="px-3 py-1.5 rounded-full bg-neutral-100 text-sm text-neutral-600 hover:bg-brand-50 hover:text-brand-700 transition"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t border-neutral-100">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about any investment concept..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition"
            />
            <Button size="sm" onClick={() => handleSend()} disabled={!input.trim()}>
              <Send size={16} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
