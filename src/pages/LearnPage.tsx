import { GraduationCap, Clock, ArrowRight, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader, EmptyState } from '@/components/ui/PageHeader';
import { supabase } from '@/lib/supabase';
import { useEffect, useState, useCallback } from 'react';
import type { EducationalContent } from '@/types';
import { formatDate } from '@/lib/format';

const difficultyColors: Record<string, 'success' | 'warning' | 'error'> = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'error',
};

function mapRow(row: Record<string, unknown>): EducationalContent {
  return {
    id: String(row.id),
    title: String(row.title ?? ''),
    summary: String(row.summary ?? ''),
    category: String(row.category ?? 'General'),
    readTimeMinutes: Number(row.read_time_minutes ?? 5),
    difficulty: (row.difficulty as EducationalContent['difficulty']) ?? 'beginner',
    content: String(row.content ?? ''),
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
    publishedAt: String(row.published_at ?? new Date().toISOString()),
  };
}

const FALLBACK_ARTICLES: EducationalContent[] = [
  {
    id: 'fallback-1',
    title: 'What is a Stock?',
    summary: 'Learn the fundamentals of stocks and how they represent ownership in a company.',
    category: 'Basics',
    readTimeMinutes: 4,
    difficulty: 'beginner',
    content: 'A stock represents a share in the ownership of a company. When you buy a stock, you become a partial owner of that company. As the company grows and earns profits, the value of your shares may increase. Stocks are traded on stock exchanges like the Botswana Stock Exchange (BSE).\n\nKey concepts:\n- Share price: The cost of one share of stock\n- Dividend: A portion of company profits paid to shareholders\n- Capital gain: Profit from selling a stock at a higher price than you paid\n\nInvesting in stocks carries risk — share prices can go down as well as up. Diversifying across multiple stocks can help manage that risk.',
    tags: ['stocks', 'basics', 'beginner'],
    publishedAt: '2026-08-01',
  },
  {
    id: 'fallback-2',
    title: 'Understanding Diversification',
    summary: 'Why spreading your investments across different assets reduces risk.',
    category: 'Strategy',
    readTimeMinutes: 5,
    difficulty: 'beginner',
    content: 'Diversification is the practice of spreading your investments across different assets to reduce risk. The idea is simple: don\'t put all your eggs in one basket.\n\nIf you invest all your money in a single company and that company struggles, you could lose a significant portion of your investment. By spreading your money across multiple companies, sectors, and asset types (stocks, bonds, ETFs), a loss in one investment may be offset by gains in another.\n\nWays to diversify:\n- Across companies: Invest in multiple stocks\n- Across sectors: Banking, retail, telecom, etc.\n- Across asset types: Stocks, bonds, ETFs, REITs\n- Across regions: Botswana and global markets',
    tags: ['diversification', 'risk', 'strategy'],
    publishedAt: '2026-08-05',
  },
  {
    id: 'fallback-3',
    title: 'Introduction to ETFs',
    summary: 'Exchange-traded funds let you buy a basket of investments in a single purchase.',
    category: 'Funds',
    readTimeMinutes: 6,
    difficulty: 'intermediate',
    content: 'An Exchange-Traded Fund (ETF) is a collection of investments that you can buy or sell on a stock exchange, just like a single stock. When you buy one share of an ETF, you are buying a small piece of a whole portfolio.\n\nBenefits of ETFs:\n- Instant diversification: One purchase gives you exposure to many companies\n- Low cost: ETFs typically have lower fees than actively managed funds\n- Easy to trade: Buy and sell during market hours like any stock\n\nExamples include the Botswana Diversified ETF (BETF), which tracks a basket of BSE-listed companies, or global ETFs that track indices like the S&P 500.',
    tags: ['etf', 'funds', 'diversification'],
    publishedAt: '2026-08-10',
  },
];

export function LearnPage() {
  const [articles, setArticles] = useState<EducationalContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<EducationalContent | null>(null);

  const loadArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: queryError } = await supabase
        .from('educational_content')
        .select('*')
        .order('published_at', { ascending: false });
      if (queryError) throw queryError;
      setArticles((data ?? []).map(mapRow));
    } catch {
      // Fallback to built-in demo content so the page is never blank
      setArticles(FALLBACK_ARTICLES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader title="Learn" subtitle="Build your investment knowledge" />

      {selected ? (
        <Card padding="lg">
          <button onClick={() => setSelected(null)} className="text-sm text-brand-600 hover:text-brand-700 mb-4 flex items-center gap-1">
            <ArrowRight size={14} className="rotate-180" /> Back to articles
          </button>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant={difficultyColors[selected.difficulty] ?? 'neutral'}>{selected.difficulty}</Badge>
            <Badge variant="neutral">{selected.category}</Badge>
            <span className="flex items-center gap-1 text-xs text-neutral-400"><Clock size={12} /> {selected.readTimeMinutes} min read</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-neutral-900 mb-2">{selected.title}</h2>
          <p className="text-sm text-neutral-500 mb-4">{selected.summary}</p>
          <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">{selected.content}</p>
        </Card>
      ) : loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card-surface p-5">
              <div className="skeleton h-32 mb-3" />
              <div className="skeleton h-4 w-3/4 mb-2" />
              <div className="skeleton h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <Card>
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-error-50 flex items-center justify-center text-error-500 mb-4">
              <AlertCircle size={26} />
            </div>
            <p className="text-base font-medium text-neutral-900">Couldn't load articles</p>
            <p className="text-sm text-neutral-500 mt-1.5 max-w-sm">{error}</p>
            <div className="mt-5">
              <Button size="sm" variant="outline" leftIcon={<RefreshCw size={14} />} onClick={loadArticles}>Try Again</Button>
            </div>
          </div>
        </Card>
      ) : articles.length === 0 ? (
        <Card>
          <EmptyState icon={<GraduationCap size={28} />} title="No articles available yet" description="Check back soon for new educational content." />
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((a) => (
            <Card key={a.id} hover onClick={() => setSelected(a)} className="flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 mb-3">
                <BookOpen size={20} />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={difficultyColors[a.difficulty] ?? 'neutral'}>{a.difficulty}</Badge>
                <span className="flex items-center gap-1 text-2xs text-neutral-400"><Clock size={10} /> {a.readTimeMinutes} min</span>
              </div>
              <h3 className="font-semibold text-neutral-900 mb-1">{a.title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed flex-1">{a.summary}</p>
              <p className="text-2xs text-neutral-400 mt-3">{formatDate(a.publishedAt)}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
