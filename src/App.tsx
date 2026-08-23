import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DemoProvider, useDemo } from '@/hooks/useDemo';
import { AppLayout } from '@/layouts/AppLayout';
import { LandingPage } from '@/pages/LandingPage';
import { AuthPage } from '@/pages/AuthPage';
import { HomePage } from '@/pages/HomePage';
import { MarketsPage } from '@/pages/MarketsPage';
import { InvestmentDetailPage } from '@/pages/InvestmentDetailPage';
import { PortfolioPage } from '@/pages/PortfolioPage';
import { GoalsPage } from '@/pages/GoalsPage';
import { AutoInvestPage } from '@/pages/AutoInvestPage';
import { WatchlistPage } from '@/pages/WatchlistPage';
import { LearnPage } from '@/pages/LearnPage';
import { AssistantPage } from '@/pages/AssistantPage';
import { CashPage } from '@/pages/CashPage';
import { TransactionsPage } from '@/pages/TransactionsPage';
import { NotificationsPage } from '@/pages/NotificationsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SecurityPage } from '@/pages/SecurityPage';
import { HelpPage } from '@/pages/HelpPage';
import { OnboardingPage } from '@/pages/OnboardingPage';
import type { JSX } from 'react';

function RequireDemo({ children }: { children: JSX.Element }) {
  const { isDemoMode } = useDemo();
  if (!isDemoMode) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route
        path="/app"
        element={
          <RequireDemo>
            <AppLayout />
          </RequireDemo>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="markets" element={<MarketsPage />} />
        <Route path="markets/:id" element={<InvestmentDetailPage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="goals" element={<GoalsPage />} />
        <Route path="auto-invest" element={<AutoInvestPage />} />
        <Route path="watchlist" element={<WatchlistPage />} />
        <Route path="learn" element={<LearnPage />} />
        <Route path="assistant" element={<AssistantPage />} />
        <Route path="cash" element={<CashPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="security" element={<SecurityPage />} />
        <Route path="help" element={<HelpPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <DemoProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </DemoProvider>
  );
}

export default App;
