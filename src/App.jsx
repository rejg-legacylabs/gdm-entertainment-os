import React from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

import AppLayout from '@/components/layout/AppLayout';
import CommandCenter from '@/pages/CommandCenter';
import Brands from '@/pages/Brands';
import BrandWorkspace from '@/pages/BrandWorkspace';
import Campaigns from '@/pages/Campaigns';
import ContentStudio from '@/pages/ContentStudio';
import VideoStudio from '@/pages/VideoStudio';
import AICreativeStudio from '@/pages/AICreativeStudio';
import CalendarPage from '@/pages/CalendarPage';
import InboxPage from '@/pages/InboxPage';
import Analytics from '@/pages/Analytics';
import AIStrategy from '@/pages/AIStrategy';
import Assets from '@/pages/Assets';
import SettingsPage from '@/pages/SettingsPage';
import PricingStudio from '@/pages/PricingStudio';
import ProposalStudio from '@/pages/ProposalStudio';
import InvoiceCenter from '@/pages/InvoiceCenter';
import LaunchGateCenter from '@/pages/LaunchGateCenter';
import ClientDashboard from '@/pages/ClientDashboard';
import QADashboard from '@/pages/QADashboard';
import ClientApprovalCenter from '@/pages/ClientApprovalCenter';
import PublishingQueueCenter from '@/pages/PublishingQueueCenter';
import FailedPostsCenter from '@/pages/FailedPostsCenter';
import CommentOpsCenter from '@/pages/CommentOpsCenter';
import AuditDashboard from '@/pages/AuditDashboard';
import ClientOnboarding from '@/pages/ClientOnboarding';
import { initializeDemoData } from '@/lib/demoDataGenerator';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Initialize demo data on mount
  React.useEffect(() => {
    initializeDemoData();
  }, []);

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground">Loading GDM Entertainment OS...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<CommandCenter />} />
        <Route path="/brands" element={<Brands />} />
        <Route path="/brands/:brandName" element={<BrandWorkspace />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/content-studio" element={<ContentStudio />} />
        <Route path="/video-studio" element={<VideoStudio />} />
        <Route path="/ai-creative-studio" element={<AICreativeStudio />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/ai-strategy" element={<AIStrategy />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/pricing-studio" element={<PricingStudio />} />
        <Route path="/proposal-studio" element={<ProposalStudio />} />
        <Route path="/invoice-center" element={<InvoiceCenter />} />
        <Route path="/launch-gate" element={<LaunchGateCenter />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/qa-dashboard" element={<QADashboard />} />
        <Route path="/approval-center" element={<ClientApprovalCenter />} />
        <Route path="/publishing-queue" element={<PublishingQueueCenter />} />
        <Route path="/failed-posts" element={<FailedPostsCenter />} />
        <Route path="/comment-ops" element={<CommentOpsCenter />} />
        <Route path="/audit-dashboard" element={<AuditDashboard />} />
        <Route path="/onboarding/:clientId" element={<ClientOnboarding />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App