import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import OnboardingChecklistTracker from '@/components/onboarding/OnboardingChecklistTracker';

const steps = [
  { number: 1, label: 'Brand Info', id: 'brand_info' },
  { number: 2, label: 'Social Links', id: 'social_links' },
  { number: 3, label: 'Connect Accounts', id: 'connected_accounts' },
  { number: 4, label: 'Brand Assets', id: 'assets' },
  { number: 5, label: 'Goals & Audience', id: 'strategy' },
  { number: 6, label: 'Contacts', id: 'contacts' },
  { number: 7, label: 'Billing', id: 'billing' },
  { number: 8, label: 'Permissions', id: 'permissions' },
  { number: 9, label: 'Review', id: 'review' },
];

export default function ClientOnboarding() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});

  const { data: session } = useQuery({
    queryKey: ['onboardingSession', clientId],
    queryFn: async () => {
      const sessions = await base44.entities.OnboardingSession.filter({ client_id: clientId });
      return sessions[0];
    },
  });

  const { data: checklist = [] } = useQuery({
    queryKey: ['onboardingChecklist', clientId],
    queryFn: async () => {
      return await base44.entities.OnboardingChecklist.filter({ client_id: clientId });
    },
  });

  const { data: client } = useQuery({
    queryKey: ['client', clientId],
    queryFn: () => base44.entities.Client.read(clientId),
  });

  const updateSessionMutation = useMutation({
    mutationFn: (data) => base44.entities.OnboardingSession.update(session.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboardingSession'] });
    },
  });

  const completeOnboardingMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.OnboardingSession.update(session.id, {
        status: 'completed',
        completed_at: new Date().toISOString(),
        completion_percent: 100,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboardingSession'] });
      navigate('/clients');
    },
  });

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      updateSessionMutation.mutate({
        current_step: currentStep + 1,
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    completeOnboardingMutation.mutate();
  };

  if (!session || !client) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading onboarding...</p>
        </div>
      </div>
    );
  }

  const completionPercent = Math.round((currentStep / steps.length) * 100);
  const mandatoryComplete = checklist
    .filter(i => i.is_mandatory)
    .every(i => i.is_completed);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome, {client.name}</h1>
          <p className="text-muted-foreground">Let's set up your account for success</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Checklist Sidebar */}
          <div className="lg:col-span-1">
            <OnboardingChecklistTracker session={session} items={checklist} />
          </div>

          {/* Wizard Main */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-panel rounded-xl border border-border/50 p-6"
            >
              {/* Progress */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  {steps.map((step, idx) => (
                    <div key={step.id} className="flex items-center">
                      <motion.button
                        onClick={() => setCurrentStep(step.number)}
                        className={`w-10 h-10 rounded-full font-semibold text-sm transition-all ${
                          step.number <= currentStep
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-muted-foreground'
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {step.number <= currentStep - 1 ? '✓' : step.number}
                      </motion.button>
                      {idx < steps.length - 1 && (
                        <div className={`w-8 h-1 mx-1 ${step.number < currentStep ? 'bg-primary' : 'bg-secondary'}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Step */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      {steps[currentStep - 1].label}
                    </h2>
                    <p className="text-muted-foreground">
                      Step {currentStep} of {steps.length}
                    </p>
                  </div>

                  {/* Step Content */}
                  <div className="space-y-4 mb-8">
                    {currentStep === 1 && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-foreground">Brand/Workspace Name</label>
                          <input
                            type="text"
                            defaultValue={client.name}
                            className="w-full mt-2 bg-secondary/50 border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="E.g., Acme Brand Inc."
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground">Website URL</label>
                          <input
                            type="url"
                            defaultValue={client.website}
                            className="w-full mt-2 bg-secondary/50 border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="https://www.example.com"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground">Industry</label>
                          <input
                            type="text"
                            defaultValue={client.industry}
                            className="w-full mt-2 bg-secondary/50 border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="E.g., Technology, Nonprofit, Healthcare"
                          />
                        </div>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">Add your social media profiles so we can connect them next</p>
                        {['Instagram', 'Facebook', 'LinkedIn', 'TikTok', 'YouTube', 'Twitter'].map((platform) => (
                          <div key={platform}>
                            <label className="text-sm font-medium text-foreground">{platform}</label>
                            <input
                              type="url"
                              className="w-full mt-2 bg-secondary/50 border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                              placeholder={`https://${platform.toLowerCase()}.com/yourhandle`}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">Connect your social accounts so we can publish and track analytics</p>
                        <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 text-sm">
                          <p className="text-foreground">Click below to authorize each platform</p>
                        </div>
                        {['Instagram', 'Facebook', 'LinkedIn'].map((platform) => (
                          <Button key={platform} variant="outline" className="w-full justify-start">
                            Connect {platform}
                          </Button>
                        ))}
                      </div>
                    )}

                    {currentStep === 4 && (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">Upload your logo and brand assets</p>
                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                          <p className="text-muted-foreground">Drag files here or click to upload</p>
                        </div>
                      </div>
                    )}

                    {currentStep === 5 && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-foreground">Target Audience</label>
                          <textarea
                            className="w-full mt-2 bg-secondary/50 border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary h-24"
                            placeholder="Describe your ideal customer..."
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground">Goals & KPIs</label>
                          <textarea
                            className="w-full mt-2 bg-secondary/50 border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary h-24"
                            placeholder="What do you want to achieve?"
                          />
                        </div>
                      </div>
                    )}

                    {currentStep === 6 && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-foreground">Approval Contact Name</label>
                          <input type="text" className="w-full mt-2 bg-secondary/50 border border-border rounded-lg px-3 py-2 text-foreground" />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground">Approval Contact Email</label>
                          <input type="email" className="w-full mt-2 bg-secondary/50 border border-border rounded-lg px-3 py-2 text-foreground" />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground">Crisis/Escalation Contact</label>
                          <input type="text" className="w-full mt-2 bg-secondary/50 border border-border rounded-lg px-3 py-2 text-foreground" />
                        </div>
                      </div>
                    )}

                    {currentStep === 7 && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-foreground">Billing Contact Email</label>
                          <input type="email" className="w-full mt-2 bg-secondary/50 border border-border rounded-lg px-3 py-2 text-foreground" />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground">Monthly Budget</label>
                          <input type="number" className="w-full mt-2 bg-secondary/50 border border-border rounded-lg px-3 py-2 text-foreground" />
                        </div>
                      </div>
                    )}

                    {currentStep === 8 && (
                      <div className="space-y-4">
                        <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" defaultChecked />
                          <span className="text-sm text-foreground">Client approval required before posting</span>
                        </label>
                        <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" defaultChecked />
                          <span className="text-sm text-foreground">Payment required before campaign launch</span>
                        </label>
                      </div>
                    )}

                    {currentStep === 9 && (
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                          <h3 className="font-semibold text-emerald-400 mb-2">Ready to launch!</h3>
                          <p className="text-sm text-muted-foreground">All mandatory items are complete. You can now start creating campaigns.</p>
                        </div>
                        {session.ai_recommendations && (
                          <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                            <h4 className="font-semibold text-foreground mb-2">AI Recommendations</h4>
                            <p className="text-sm text-muted-foreground mb-3">{session.ai_recommendations.brand_summary}</p>
                            <p className="text-sm font-medium text-foreground mb-2">Recommended Package: {session.ai_recommendations.recommended_package}</p>
                            <p className="text-sm text-muted-foreground">First Campaigns: {session.ai_recommendations.recommended_campaigns?.join(', ')}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-between gap-4">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                {currentStep === steps.length ? (
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={handleComplete}
                    disabled={!mandatoryComplete}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Complete Setup
                  </Button>
                ) : (
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={handleNext}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}