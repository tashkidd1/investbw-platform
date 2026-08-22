import { HelpCircle, Search, MessageCircle, BookOpen, Mail } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { PageHeader, SectionHeader } from '@/components/ui/PageHeader';

const faqs = [
  { q: 'Is this a real investment platform?', a: 'No. InvestBW is a prototype operating in Demo Mode. All securities, prices, and transactions are simulated. No real money is involved.' },
  { q: 'How do I get started?', a: 'Click "Explore the Demo" on the landing page. You will receive P10,000 in virtual funds and a pre-built portfolio to explore freely.' },
  { q: 'Can I lose money?', a: 'No. All funds are virtual. This platform is designed for learning and exploration without any financial risk.' },
  { q: 'What is the Invest Assistant?', a: 'The Invest Assistant is an educational AI tool that explains investment concepts in plain language. It is not a licensed financial adviser and cannot recommend specific investments.' },
  { q: 'What investments are available?', a: 'The demo includes Botswana equities (like FNBB, Choppies, Letshego), ETFs, REITs, bonds, and global ETFs. All prices are simulated.' },
  { q: 'How do I exit demo mode?', a: 'Go to Profile and click "Exit Demo", or use the Exit Demo button in the sidebar. You will return to the landing page.' },
];

export function HelpPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader title="Help & Support" subtitle="Find answers to common questions" />

      <Input placeholder="Search for help..." leftIcon={<Search size={16} />} />

      <div className="grid sm:grid-cols-3 gap-4">
        <Card hover className="text-center">
          <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 mx-auto mb-3">
            <BookOpen size={24} />
          </div>
          <h3 className="font-semibold text-sm text-neutral-900">Learn Section</h3>
          <p className="text-xs text-neutral-500 mt-1">Browse educational articles about investing</p>
        </Card>
        <Card hover className="text-center">
          <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center text-accent-600 mx-auto mb-3">
            <MessageCircle size={24} />
          </div>
          <h3 className="font-semibold text-sm text-neutral-900">Ask Assistant</h3>
          <p className="text-xs text-neutral-500 mt-1">Get instant answers from the AI assistant</p>
        </Card>
        <Card hover className="text-center">
          <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-600 mx-auto mb-3">
            <Mail size={24} />
          </div>
          <h3 className="font-semibold text-sm text-neutral-900">Contact</h3>
          <p className="text-xs text-neutral-500 mt-1">Reach out to the InvestBW team</p>
        </Card>
      </div>

      <Card padding="lg">
        <SectionHeader title="Frequently Asked Questions" />
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-neutral-100 last:border-0 pb-4 last:pb-0">
              <div className="flex items-start gap-2">
                <HelpCircle size={16} className="text-brand-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-neutral-900">{faq.q}</p>
                  <p className="text-sm text-neutral-600 mt-1 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
