import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles, CheckCircle2, Upload, Link2, FileText, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import CampaignBasics from './steps/CampaignBasics';
import InformationSources from './steps/InformationSources';
import AIAnalysis from './steps/AIAnalysis';
import CampaignBuild from './steps/CampaignBuild';
import PublishingControl from './steps/PublishingControl';
import SchedulingSetup from './steps/SchedulingSetup';
import ReviewAndLaunch from './steps/ReviewAndLaunch';

const steps = [
  { id: 1, title: 'Campaign Basics', icon: Sparkles, description: 'Name, objective, and duration' },
  { id: 2, title: 'Information Sources', icon: Upload, description: 'Provide content and details' },
  { id: 3, title: 'AI Analysis', icon: Zap, description: 'AI scans and recommends' },
  { id: 4, title: 'Campaign Build', icon: Sparkles, description: 'AI creates content' },
  { id: 5, title: 'Publishing Control', icon: CheckCircle2, description: 'Choose channels' },
  { id: 6, title: 'Scheduling', icon: FileText, description: 'Set posting schedule' },
  { id: 7, title: 'Review & Launch', icon: Link2, description: 'Final approval' },
];

const stepComponents = {
  1: CampaignBasics,
  2: InformationSources,
  3: AIAnalysis,
  4: CampaignBuild,
  5: PublishingControl,
  6: SchedulingSetup,
  7: ReviewAndLaunch,
};

export default function CampaignWizard({ onComplete, onCancel }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignData, setCampaignData] = useState({
    basics: {},
    sources: [],
    analysis: {},
    content: [],
    publishing: { mode: 'assisted', channels: [] },
    schedule: { duration: 30, cadence: 'balanced' },
  });

  const CurrentStepComponent = stepComponents[currentStep];

  const handleNext = (stepData) => {
    setCampaignData(prev => ({
      ...prev,
      ...stepData,
    }));
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleComplete = () => {
    onComplete(campaignData);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Premium Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-semibold text-foreground">Campaign Autopilot</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Let AI guide you through building a complete campaign in 7 steps
              </p>
            </div>
            <Button variant="ghost" onClick={onCancel}>Exit Wizard</Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Left: Step Navigation */}
          <div className="col-span-12 lg:col-span-3">
            <div className="sticky top-24 space-y-2">
              {steps.map((step) => {
                const Icon = step.icon;
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;

                return (
                  <motion.button
                    key={step.id}
                    onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                    className={cn(
                      'w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all group',
                      isActive ? 'bg-primary/10 border border-primary/30' : 
                      isCompleted ? 'bg-secondary/30 border border-border hover:bg-secondary/40' :
                      'bg-transparent border border-border/30 hover:border-border',
                    )}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                      isActive ? 'bg-primary text-primary-foreground' :
                      isCompleted ? 'bg-green-500/20 text-green-400' :
                      'bg-secondary text-muted-foreground'
                    )}>
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        'text-sm font-medium',
                        isActive ? 'text-foreground' : 'text-muted-foreground'
                      )}>
                        {step.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Right: Step Content */}
          <div className="col-span-12 lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <CurrentStepComponent
                  data={campaignData}
                  onNext={handleNext}
                  onBack={handleBack}
                  isFirstStep={currentStep === 1}
                  isLastStep={currentStep === steps.length}
                  onComplete={handleComplete}
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-8 border-t border-border">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>

              <div className="text-sm text-muted-foreground">
                Step {currentStep} of {steps.length}
              </div>

              {currentStep < steps.length ? (
                <Button onClick={() => handleNext({})} className="gap-2">
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={handleComplete} className="gap-2 bg-green-500 hover:bg-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  Launch Campaign
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}